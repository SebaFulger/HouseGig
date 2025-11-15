import express from 'express';
import * as messageController from '../controllers/messageController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All message routes require authentication
router.get('/', authenticate, messageController.getUserConversations);
router.post('/conversation', authenticate, messageController.getOrCreateConversation);
router.get('/conversation/:id', authenticate, messageController.getConversation);
router.post('/conversation/:conversationId/messages', authenticate, messageController.sendMessage);
router.post('/conversation/:conversationId/read', authenticate, messageController.markConversationRead);

export default router;
