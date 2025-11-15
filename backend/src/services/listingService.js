import { supabase } from '../config/supabaseClient.js';

export const createListingService = async (listingData, userId) => {
  const { data, error } = await supabase
    .from('listings')
    .insert([{
      ...listingData,
      owner_id: userId,
      created_at: new Date()
    }])
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  return data;
};

export const getListingService = async (listingId) => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .single();

  if (error) throw { statusCode: 404, message: error.message || 'Listing not found' };
  
  // Fetch owner info from auth.users
  if (data.owner_id) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(data.owner_id);
      if (!userError && user) {
        data.owner = {
          id: user.id,
          username: user.user_metadata?.username || user.email.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url || null,
          bio: user.user_metadata?.bio || null
        };
      }
    } catch (e) {
      // If owner fetch fails, just continue without owner data
      console.log('Failed to fetch owner:', e);
    }
  }
  
  // Vote counts are already in the data (upvotes, downvotes columns)
  // Ensure they're set even if null
  data.upvotes = data.upvotes || 0;
  data.downvotes = data.downvotes || 0;
  
  // Fetch comments count
  const { count: commentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('listing_id', listingId);
  data.comments = commentsCount || 0;
  
  return data;
};

export const getAllListingsService = async (filters = {}) => {
  const { 
    search, 
    propertyType, 
    world, 
    sortBy = 'created_at', 
    limit = 20, 
    offset = 0,
    rarity,
    magicLevel
  } = filters;

  let query = supabase
    .from('listings')
    .select(`
      id,
      title,
      description,
      world,
      region,
      property_type,
      price,
      main_image_url,
      rarity,
      magic_level,
      owner_id,
      upvotes,
      downvotes,
      created_at
    `)
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,world.ilike.%${search}%,region.ilike.%${search}%`
    );
  }

  if (propertyType) {
    query = query.eq('property_type', propertyType);
  }

  if (world) {
    query = query.eq('world', world);
  }

  if (rarity) {
    query = query.eq('rarity', rarity);
  }

  if (magicLevel) {
    query = query.eq('magic_level', magicLevel);
  }

  // Sorting
  const sortConfig = {
    'created_at': { column: 'created_at', ascending: false },
    'newest': { column: 'created_at', ascending: false },
    'oldest': { column: 'created_at', ascending: true },
    'most_liked': { column: 'likes', ascending: false }
  };

  const sort = sortConfig[sortBy] || sortConfig['created_at'];
  query = query.order(sort.column, { ascending: sort.ascending });

  const { data, error } = await query;

  if (error) throw { statusCode: 400, message: error.message };
  
  // Fetch owner info, likes count, and comments count for each listing
  if (data && data.length > 0) {
    const listingsWithOwners = await Promise.all(data.map(async (listing) => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(listing.owner_id);
        if (!userError && user) {
          // Also check profiles table for avatar_url
          const { data: profile } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', listing.owner_id)
            .single();
          
          listing.owner = {
            id: user.id,
            username: user.user_metadata?.username || user.email.split('@')[0],
            avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null
          };
        }
      } catch (e) {
        // If owner fetch fails, continue without owner data
        console.log('Failed to fetch listing owner:', e);
      }
      
      // Ensure vote counts are set
      listing.upvotes = listing.upvotes || 0;
      listing.downvotes = listing.downvotes || 0;
      
      // Fetch comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('listing_id', listing.id);
      listing.comments = commentsCount || 0;
      
      return listing;
    }));
    return listingsWithOwners;
  }
  
  return data;
};

export const updateListingService = async (listingId, userId, updateData) => {
  // Verify ownership
  const { data: listing, error: fetchError } = await supabase
    .from('listings')
    .select('owner_id')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) {
    throw { statusCode: 404, message: 'Listing not found' };
  }

  if (listing.owner_id !== userId) {
    throw { statusCode: 403, message: 'Not authorized to update this listing' };
  }

  const { data, error } = await supabase
    .from('listings')
    .update(updateData)
    .eq('id', listingId)
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  return data;
};

export const deleteListingService = async (listingId, userId) => {
  const { data: listing, error: fetchError } = await supabase
    .from('listings')
    .select('owner_id')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) {
    throw { statusCode: 404, message: 'Listing not found' };
  }

  if (listing.owner_id !== userId) {
    throw { statusCode: 403, message: 'Not authorized to delete this listing' };
  }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId);

  if (error) throw { statusCode: 400, message: error.message };
};

export const getUserListingsService = async (userId, limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw { statusCode: 400, message: error.message };
  
  // Add owner info, likes and comments counts for each listing
  if (data && data.length > 0) {
    const listingsWithCounts = await Promise.all(data.map(async (listing) => {
      // Fetch owner info from auth.users and profiles table
      try {
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(listing.owner_id);
        if (!userError && user) {
          // Also check profiles table for avatar_url
          const { data: profile } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', listing.owner_id)
            .single();
          
          listing.owner = {
            id: user.id,
            username: user.user_metadata?.username || user.email.split('@')[0],
            avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null
          };
        }
      } catch (e) {
        // If owner fetch fails, continue without owner data
        console.log('Failed to fetch listing owner:', e);
      }
      
      // Ensure vote counts are set
      listing.upvotes = listing.upvotes || 0;
      listing.downvotes = listing.downvotes || 0;
      
      // Fetch comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('listing_id', listing.id);
      listing.comments = commentsCount || 0;
      
      return listing;
    }));
    return listingsWithCounts;
  }
  
  return data;
};

export const uploadImageService = async (file) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase
    .storage
    .from('ImgB')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
      duplex: 'half'
    });

  if (error) {
    throw { statusCode: 500, message: `Image upload failed: ${error.message}` };
  }

  const { data: { publicUrl } } = supabase
    .storage
    .from('ImgB')
    .getPublicUrl(filePath);

  return publicUrl;
}