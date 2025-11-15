import express from 'express';
import * as commentController from '../controllers/commentController.js';
import { authenticate, optional } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:listingId', authenticate, commentController.createComment);
router.get('/:listingId', optional, commentController.getListingComments);
router.delete('/:commentId', authenticate, commentController.deleteComment);
router.put('/:commentId', authenticate, commentController.updateComment);

// Comment likes
router.post('/:commentId/like', authenticate, commentController.likeComment);
router.delete('/:commentId/like', authenticate, commentController.unlikeComment);
router.get('/:commentId/liked', authenticate, commentController.checkCommentLiked);

// Comment replies
router.post('/:commentId/reply', authenticate, commentController.createReply);
router.get('/:commentId/replies', optional, commentController.getCommentReplies);

export default router;
