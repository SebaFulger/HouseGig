import { supabase } from '../config/supabaseClient.js';

export const getUserProfileService = async (username) => {
  // Get user from profiles table first
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  
  if (profileError || !profile) {
    throw { statusCode: 404, message: 'User not found' };
  }
  
  // Get additional data from auth.users
  const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(profile.id);
  
  if (authError) throw { statusCode: 500, message: 'Failed to fetch user data' };
  
  return {
    id: profile.id,
    username: profile.username,
    email: user?.email || null,
    avatar_url: profile.avatar_url || user?.user_metadata?.avatar_url || null,
    bio: profile.bio || user?.user_metadata?.bio || null,
    created_at: profile.created_at
  };
};

export const updateUserProfileService = async (userId, updateData) => {
  // Update user metadata in auth.users
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: updateData
  });

  if (error) throw { statusCode: 400, message: error.message };
  
  return {
    id: data.user.id,
    username: data.user.user_metadata?.username,
    avatar_url: data.user.user_metadata?.avatar_url,
    bio: data.user.user_metadata?.bio
  };
};

export const getUserByIdService = async (userId) => {
  // Get user from auth.users
  const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
  
  if (error) throw { statusCode: 404, message: 'User not found' };
  
  return {
    id: user.id,
    username: user.user_metadata?.username || user.email.split('@')[0],
    email: user.email,
    avatar_url: user.user_metadata?.avatar_url || null,
    bio: user.user_metadata?.bio || null,
    created_at: user.created_at
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
