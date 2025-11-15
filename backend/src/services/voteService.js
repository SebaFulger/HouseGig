import { supabase } from '../config/supabaseClient.js';

export const upvoteListingService = async (listingId, userId) => {
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('listing_id', listingId)
    .eq('user_id', userId)
    .single();

  if (existingVote) {
    // If already upvoted, do nothing
    if (existingVote.vote_type === 'upvote') {
      throw { statusCode: 409, message: 'Already upvoted' };
    }
    // If downvoted, change to upvote
    const { data, error } = await supabase
      .from('votes')
      .update({ 
        vote_type: 'upvote',
        updated_at: new Date()
      })
      .eq('id', existingVote.id)
      .select()
      .single();

    if (error) throw { statusCode: 400, message: error.message };
    return data;
  }

  // Create new upvote
  const { data, error } = await supabase
    .from('votes')
    .insert([{
      listing_id: listingId,
      user_id: userId,
      vote_type: 'upvote',
      created_at: new Date()
    }])
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  return data;
};

export const downvoteListingService = async (listingId, userId) => {
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('listing_id', listingId)
    .eq('user_id', userId)
    .single();

  if (existingVote) {
    // If already downvoted, do nothing
    if (existingVote.vote_type === 'downvote') {
      throw { statusCode: 409, message: 'Already downvoted' };
    }
    // If upvoted, change to downvote
    const { data, error } = await supabase
      .from('votes')
      .update({ 
        vote_type: 'downvote',
        updated_at: new Date()
      })
      .eq('id', existingVote.id)
      .select()
      .single();

    if (error) throw { statusCode: 400, message: error.message };
    return data;
  }

  // Create new downvote
  const { data, error } = await supabase
    .from('votes')
    .insert([{
      listing_id: listingId,
      user_id: userId,
      vote_type: 'downvote',
      created_at: new Date()
    }])
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  return data;
};

export const removeVoteService = async (listingId, userId) => {
  const { error } = await supabase
    .from('votes')
    .delete()
    .eq('listing_id', listingId)
    .eq('user_id', userId);

  if (error) throw { statusCode: 400, message: error.message };
};

export const getVoteStatsService = async (listingId) => {
  const { data, error } = await supabase
    .from('vote_stats')
    .select('*')
    .eq('listing_id', listingId)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
    throw { statusCode: 400, message: error.message };
  }

  return {
    upvotes: data?.upvote_count || 0,
    downvotes: data?.downvote_count || 0,
    totalVotes: data?.total_votes || 0,
    approvalPercentage: data?.approval_percentage || 0
  };
};

export const getUserVoteStatus = async (listingId, userId) => {
  const { data, error } = await supabase
    .from('votes')
    .select('vote_type')
    .eq('listing_id', listingId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
    throw { statusCode: 400, message: error.message };
  }

  return {
    voteType: data?.vote_type || null
  };
};

export const getUserUpvotedListings = async (userId, limit = 20, offset = 0) => {
  // Get listing IDs that user upvoted
  const { data: votes, error: votesError } = await supabase
    .from('votes')
    .select('listing_id')
    .eq('user_id', userId)
    .eq('vote_type', 'upvote')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (votesError) throw { statusCode: 400, message: votesError.message };

  if (!votes || votes.length === 0) {
    return [];
  }

  const listingIds = votes.map(v => v.listing_id);

  // Fetch the actual listings
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('*')
    .in('id', listingIds);

  if (listingsError) throw { statusCode: 400, message: listingsError.message };

  // Add owner info and vote counts for each listing
  if (listings && listings.length > 0) {
    const listingsWithDetails = await Promise.all(listings.map(async (listing) => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(listing.owner_id);
        if (!userError && user) {
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
        console.log('Failed to fetch listing owner:', e);
      }
      
      // Vote counts are already in the listing from the upvotes/downvotes columns
      // But fetch comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('listing_id', listing.id);
      listing.comments = commentsCount || 0;
      
      return listing;
    }));
    return listingsWithDetails;
  }
  
  return listings || [];
};
