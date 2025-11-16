import { supabase } from '../config/supabaseClient.js';

// Get all conversations for the current user
export const getUserConversationsService = async (userId) => {
  try {
    // Get conversations where user is a participant
    const { data: participantRows, error: partError } = await supabase
      .from('conversation_participants')
      .select('conversation_id, last_read_at')
      .eq('user_id', userId);

    if (partError) {
      console.error('Error fetching participants:', partError);
      throw { statusCode: 400, message: partError.message };
    }
    
    if (!participantRows || participantRows.length === 0) return [];

    const conversationIds = participantRows.map(p => p.conversation_id);
    const lastReadMap = new Map(participantRows.map(p => [p.conversation_id, p.last_read_at]));

    // Get conversation details
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (convError) {
      console.error('Error fetching conversations:', convError);
      throw { statusCode: 400, message: convError.message };
    }

    // For each conversation, get other participants and last message
    const enrichedConversations = await Promise.all(
      (conversations || []).map(async (conv) => {
        try {
          // Get other participants (not current user)
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.id)
            .neq('user_id', userId);

          const otherUserIds = (participants || []).map(p => p.user_id);

          // Fetch profiles for other users
          let otherUsers = [];
          if (otherUserIds.length > 0) {
            const { data: profiles, error: profileError } = await supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .in('id', otherUserIds);
            
            if (profileError) {
              console.error('Error fetching profiles:', profileError);
            }
            otherUsers = profiles || [];
          }

          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Count unread messages
          const lastRead = lastReadMap.get(conv.id);
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', userId)
            .gt('created_at', lastRead || '1970-01-01');

          return {
            ...conv,
            other_users: otherUsers,
            last_message: lastMsg || null,
            unread_count: unreadCount || 0
          };
        } catch (convErr) {
          console.error('Error enriching conversation:', convErr);
          return {
            ...conv,
            other_users: [],
            last_message: null,
            unread_count: 0
          };
        }
      })
    );

    return enrichedConversations;
  } catch (error) {
    console.error('Error in getUserConversationsService:', error);
    throw error;
  }
};

// Get or create a conversation between two users
export const getOrCreateConversationService = async (userId, otherUserId) => {
  // Check if conversation already exists between these two users
  const { data: existingParticipants } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .in('user_id', [userId, otherUserId]);

  if (existingParticipants && existingParticipants.length > 0) {
    // Find conversation IDs that have both users
    const conversationCounts = {};
    existingParticipants.forEach(p => {
      conversationCounts[p.conversation_id] = (conversationCounts[p.conversation_id] || 0) + 1;
    });
    
    const sharedConvId = Object.keys(conversationCounts).find(
      convId => conversationCounts[convId] === 2
    );

    if (sharedConvId) {
      return await getConversationService(sharedConvId, userId);
    }
  }

  // Create new conversation
  const { data: newConv, error: convError } = await supabase
    .from('conversations')
    .insert([{}])
    .select()
    .single();

  if (convError) throw { statusCode: 400, message: convError.message };

  // Add both participants
  const { error: partError } = await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: newConv.id, user_id: userId },
      { conversation_id: newConv.id, user_id: otherUserId }
    ]);

  if (partError) throw { statusCode: 400, message: partError.message };

  return await getConversationService(newConv.id, userId);
};

// Get a specific conversation with messages
export const getConversationService = async (conversationId, userId) => {
  try {
    // Verify user is participant
    const { data: participant, error: partError } = await supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .maybeSingle();

    if (partError) {
      console.error('Error checking participant:', partError);
      throw { statusCode: 403, message: 'Authorization check failed' };
    }

    if (!participant) throw { statusCode: 403, message: 'Not authorized' };

    // Get conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      console.error('Error fetching conversation:', convError);
      throw { statusCode: 404, message: 'Conversation not found' };
    }

    // Get all participants
    const { data: participants } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conversationId);

    const userIds = (participants || []).map(p => p.user_id);

    // Fetch profiles
    let users = [];
    if (userIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
      
      if (profileError) {
        console.error('Error fetching profiles:', profileError);
      }
      users = profiles || [];
    }

    // Get messages
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (msgError) {
      console.error('Error fetching messages:', msgError);
      throw { statusCode: 400, message: msgError.message };
    }

    // Attach sender profiles to messages
    const messagesWithUsers = (messages || []).map(msg => {
      const sender = users.find(u => u.id === msg.sender_id);
      return { ...msg, sender };
    });

    return {
      ...conversation,
      participants: users,
      messages: messagesWithUsers
    };
  } catch (error) {
    console.error('Error in getConversationService:', error);
    throw error;
  }
};

// Send a message in a conversation
export const sendMessageService = async (conversationId, userId, content) => {
  // Verify user is participant
  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();

  if (!participant) throw { statusCode: 403, message: 'Not authorized' };

  // Create message
  const { data: message, error: msgError } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      sender_id: userId,
      content
    }])
    .select()
    .single();

  if (msgError) throw { statusCode: 400, message: msgError.message };

  // Fetch sender profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', userId)
    .single();

  return {
    ...message,
    sender: profile || null
  };
};

// Mark conversation as read
export const markConversationReadService = async (conversationId, userId) => {
  const { error } = await supabase
    .from('conversation_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);

  if (error) throw { statusCode: 400, message: error.message };
  return { success: true };
};
