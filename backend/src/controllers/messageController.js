import * as messageService from '../services/messageService.js';

// Get all conversations for current user
export const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await messageService.getUserConversationsService(req.user.id);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// Get or create conversation with another user
export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { otherUserId } = req.body;
    
    if (!otherUserId) {
      return res.status(400).json({ error: 'otherUserId is required' });
    }

    const conversation = await messageService.getOrCreateConversationService(
      req.user.id,
      otherUserId
    );
    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

// Get a specific conversation with messages
export const getConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await messageService.getConversationService(id, req.user.id);
    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

// Send a message
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const message = await messageService.sendMessageService(
      conversationId,
      req.user.id,
      content
    );
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// Mark conversation as read
export const markConversationRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const result = await messageService.markConversationReadService(
      conversationId,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};
