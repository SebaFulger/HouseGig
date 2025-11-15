import * as voteService from '../services/voteService.js';

export const upvoteListing = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;
    
    const vote = await voteService.upvoteListingService(listingId, userId);
    res.status(200).json({ message: 'Upvoted successfully', vote });
  } catch (error) {
    next(error);
  }
};

export const downvoteListing = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;
    
    const vote = await voteService.downvoteListingService(listingId, userId);
    res.status(200).json({ message: 'Downvoted successfully', vote });
  } catch (error) {
    next(error);
  }
};

export const removeVote = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;
    
    await voteService.removeVoteService(listingId, userId);
    res.status(200).json({ message: 'Vote removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getVoteStats = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    
    const stats = await voteService.getVoteStatsService(listingId);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export const getVoteStatus = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;
    
    const status = await voteService.getUserVoteStatus(listingId, userId);
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

export const getUserUpvotedListings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    
    const listings = await voteService.getUserUpvotedListings(userId, limit, offset);
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
