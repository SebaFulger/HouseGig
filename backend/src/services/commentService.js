import { supabase } from '../config/supabaseClient.js';

export const createCommentService = async (listingId, userId, content) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      listing_id: listingId,
      user_id: userId,
      content,
      created_at: new Date()
    }])
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  
  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', userId)
    .single();
  
  if (profile) {
    data.user = profile;
  }
  
  return data;
};

export const getListingCommentsService = async (listingId, limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw { statusCode: 400, message: error.message };
  
  // Manually fetch user profiles for each comment
  if (data && data.length > 0) {
    const commentsWithUsers = await Promise.all(data.map(async (comment) => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', comment.user_id)
          .single();
        
        if (!profileError && profile) {
          comment.user = profile;
        } else {
          comment.user = {
            id: comment.user_id,
            username: 'Anonymous',
            avatar_url: null
          };
        }
      } catch (e) {
        console.log('Failed to fetch comment user:', e);
        comment.user = {
          id: comment.user_id,
          username: 'Anonymous',
          avatar_url: null
        };
      }
      return comment;
    }));
    return commentsWithUsers;
  }
  
  return data;
};

export const deleteCommentService = async (commentId, userId) => {
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single();

  if (fetchError || !comment) {
    throw { statusCode: 404, message: 'Comment not found' };
  }

  if (comment.user_id !== userId) {
    throw { statusCode: 403, message: 'Not authorized to delete this comment' };
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw { statusCode: 400, message: error.message };
};

export const updateCommentService = async (commentId, userId, content) => {
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single();

  if (fetchError || !comment) {
    throw { statusCode: 404, message: 'Comment not found' };
  }

  if (comment.user_id !== userId) {
    throw { statusCode: 403, message: 'Not authorized to update this comment' };
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  return data;
};

export const likeCommentService = async (commentId, userId) => {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    throw { statusCode: 400, message: 'Already liked this comment' };
  }

  // Add like
  const { error } = await supabase
    .from('comment_likes')
    .insert([{ comment_id: commentId, user_id: userId }]);

  if (error) throw { statusCode: 400, message: error.message };

  // Increment likes_count
  await supabase.rpc('increment_comment_likes', { comment_id: commentId });

  return { success: true };
};

export const unlikeCommentService = async (commentId, userId) => {
  const { error } = await supabase
    .from('comment_likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', userId);

  if (error) throw { statusCode: 400, message: error.message };

  // Decrement likes_count
  await supabase.rpc('decrement_comment_likes', { comment_id: commentId });

  return { success: true };
};

export const checkCommentLikedService = async (commentId, userId) => {
  const { data, error } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single();

  return { isLiked: !!data && !error };
};

export const createReplyService = async (commentId, userId, content) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      listing_id: (await supabase.from('comments').select('listing_id').eq('id', commentId).single()).data.listing_id,
      user_id: userId,
      content,
      parent_id: commentId,
      created_at: new Date()
    }])
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  
  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', userId)
    .single();
  
  if (profile) {
    data.user = profile;
  }
  
  return data;
};

export const getCommentRepliesService = async (commentId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('parent_id', commentId)
    .order('created_at', { ascending: true });

  if (error) throw { statusCode: 400, message: error.message };
  
  // Fetch user profiles for each reply
  if (data && data.length > 0) {
    const repliesWithUsers = await Promise.all(data.map(async (reply) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', reply.user_id)
        .single();
      
      if (profile) {
        reply.user = profile;
      }
      return reply;
    }));
    return repliesWithUsers;
  }
  
  return data;
};
