import { supabase } from '../config/supabaseClient.js';

export const getUserProfileService = async (username) => {
  try {
    console.log('getUserProfileService: Looking up username:', username);
    
    // Get user from profiles table first
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    
    console.log('Profile fetch result:', { profile, error: profileError });
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw { statusCode: 500, message: 'Failed to fetch profile' };
    }
    
    if (profile) {
      // Return profile data from profiles table
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email || null,
        avatar_url: profile.avatar_url || null,
        bio: profile.bio || null,
        created_at: profile.created_at
      };
    }
    
    // If not found in profiles, try auth.users table as fallback
    console.log('Profile not in profiles table, checking auth.users with user_metadata.username');
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth users list error:', authError);
      throw { statusCode: 500, message: 'Failed to fetch users' };
    }
    
    const user = users.find(u => u.user_metadata?.username === username);
    
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }
    
    // Return data from auth.users
    return {
      id: user.id,
      username: user.user_metadata?.username || 'User',
      email: user.email || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      bio: user.user_metadata?.bio || null,
      created_at: user.created_at
    };
  } catch (error) {
    console.error('Error in getUserProfileService:', error);
    throw error;
  }
};

export const updateUserProfileService = async (userId, updateData) => {
  console.log('Updating user profile for:', userId, 'with data:', updateData);
  
  // Prepare auth update object
  const authUpdate = {
    user_metadata: {
      username: updateData.username,
      bio: updateData.bio,
      avatar_url: updateData.avatar_url
    }
  };
  
  // If email is being updated, add it to auth update (email is only in auth.users, not profiles)
  if (updateData.email) {
    authUpdate.email = updateData.email;
  }
  
  // Update user in auth.users
  const { data, error } = await supabase.auth.admin.updateUserById(userId, authUpdate);

  if (error) {
    console.error('Auth update error:', error);
    throw { statusCode: 400, message: error.message };
  }
  
  // Also update the profiles table to keep it in sync (email is NOT in profiles table)
  const profileUpdates = {};
  if (updateData.username) profileUpdates.username = updateData.username;
  if (updateData.avatar_url !== undefined) profileUpdates.avatar_url = updateData.avatar_url;
  if (updateData.bio !== undefined) profileUpdates.bio = updateData.bio;
  
  if (Object.keys(profileUpdates).length > 0) {
    console.log('Updating profiles table with:', profileUpdates);
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId)
      .select();
    
    if (profileError) {
      console.error('Profile table update error:', profileError);
      // This is critical - if profiles table fails, throw error
      throw { statusCode: 500, message: `Failed to update profile table: ${profileError.message}` };
    }
    
    console.log('Profile table updated successfully:', profileData);
  }
  
  return {
    id: data.user.id,
    email: data.user.email,
    username: data.user.user_metadata?.username,
    avatar_url: data.user.user_metadata?.avatar_url,
    bio: data.user.user_metadata?.bio
  };
};

export const getUserByIdService = async (userId) => {
  // Get user from profiles table first (source of truth)
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url, bio, created_at')
    .eq('id', userId)
    .single();
  
  // Get user from auth.users
  const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
  
  if (error) throw { statusCode: 404, message: 'User not found' };
  
  return {
    id: user.id,
    username: profile?.username || user.user_metadata?.username || 'User',
    email: user.email,
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    bio: profile?.bio || user.user_metadata?.bio || null,
    created_at: profile?.created_at || user.created_at
  };
};

export const uploadProfilePictureService = async (userId, file) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload to Supabase Storage with service role (bypasses RLS)
  const { data, error } = await supabase.storage
    .from('ImgB')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
      duplex: 'half'
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw { statusCode: 500, message: `Image upload failed: ${error.message}` };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('ImgB')
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;

  // Update user metadata with new avatar URL
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { avatar_url: publicUrl }
  });

  // Also update the profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  if (profileError) {
    console.error('Profile table update error:', profileError);
    // Don't throw error, just log it - the auth metadata is already updated
  }

  return publicUrl;
};

export const deleteUserAccountService = async (userId) => {
  try {
    console.log('Starting account deletion for user:', userId);
    
    // Step 1: Manually delete all user data in the correct order
    // to avoid foreign key constraint issues
    
    // Delete comment likes
    console.log('Deleting comment likes...');
    await supabase.from('comment_likes').delete().eq('user_id', userId);
    
    // Delete messages (as sender)
    console.log('Deleting messages...');
    await supabase.from('messages').delete().eq('sender_id', userId);
    
    // Delete conversation participants
    console.log('Deleting conversation participants...');
    await supabase.from('conversation_participants').delete().eq('user_id', userId);
    
    // Delete comments (including replies via parent_id)
    console.log('Deleting comments...');
    await supabase.from('comments').delete().eq('user_id', userId);
    
    // Delete votes
    console.log('Deleting votes...');
    await supabase.from('votes').delete().eq('user_id', userId);
    
    // Delete collection_listings for user's collections
    console.log('Deleting collection listings...');
    const { data: userCollections } = await supabase
      .from('collections')
      .select('id')
      .eq('owner_id', userId);
    
    if (userCollections && userCollections.length > 0) {
      const collectionIds = userCollections.map(c => c.id);
      await supabase.from('collection_listings').delete().in('collection_id', collectionIds);
    }
    
    // Delete collections
    console.log('Deleting collections...');
    await supabase.from('collections').delete().eq('owner_id', userId);
    
    // Delete listings (this will cascade to related votes, comments if cascade is set)
    console.log('Deleting listings...');
    await supabase.from('listings').delete().eq('owner_id', userId);
    
    // Delete profile
    console.log('Deleting profile...');
    await supabase.from('profiles').delete().eq('id', userId);
    
    // Step 2: Finally, delete the user from auth.users
    console.log('Deleting user from auth...');
    const { data, error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Auth deletion error:', {
        message: authError.message,
        status: authError.status,
        details: authError
      });
      
      // Provide more specific error message
      if (authError.message?.includes('not found')) {
        throw { statusCode: 404, message: 'User account not found' };
      } else {
        throw { statusCode: 500, message: `Failed to delete account: ${authError.message}` };
      }
    }

    console.log('Account deletion completed successfully:', data);
    return { success: true, message: 'Account deleted successfully' };
  } catch (error) {
    console.error('Delete account service error:', error);
    throw error.statusCode ? error : { statusCode: 500, message: error.message || 'Failed to delete account' };
  }
};
