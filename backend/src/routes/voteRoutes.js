import express from 'express';
import * as voteController from '../controllers/voteController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upvote', authenticate, voteController.upvoteListing);
router.post('/downvote', authenticate, voteController.downvoteListing);
router.delete('/', authenticate, voteController.removeVote);
router.get('/:listingId/stats', voteController.getVoteStats);
router.get('/:listingId/status', authenticate, voteController.getVoteStatus);
router.get('/my-upvotes', authenticate, voteController.getUserUpvotedListings);

export default router;
