import { supabase } from '../config/supabaseClient.js';

export const likeListingService = async (listingId, userId) => {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('listing_id', listingId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    throw { statusCode: 409, message: 'Listing already liked' };
  }

  const { data, error } = await supabase
    .from('likes')
    .insert([{
      listing_id: listingId,
      user_id: userId,
      created_at: new Date()
    }])
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  return data;
};

export const unlikeListingService = async (listingId, userId) => {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('listing_id', listingId)
    .eq('user_id', userId);

  if (error) throw { statusCode: 400, message: error.message };
};

export const getListingLikesCount = async (listingId) => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('listing_id', listingId);

  if (error) throw { statusCode: 400, message: error.message };
  return count || 0;
};

export const checkIfUserLiked = async (listingId, userId) => {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('listing_id', listingId)
    .eq('user_id', userId)
    .single();

  return !!data;
};

export const getUserLikedListings = async (userId, limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('likes')
    .select('listing:listings!listing_id(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw { statusCode: 400, message: error.message };
  
  const listings = data?.map(like => like.listing) || [];
  
  // Add owner info, likes and comments counts for each listing
  if (listings.length > 0) {
    const listingsWithCounts = await Promise.all(listings.map(async (listing) => {
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
  
  return listings;
};
