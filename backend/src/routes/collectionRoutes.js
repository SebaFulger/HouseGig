import express from 'express';
import * as collectionController from '../controllers/collectionController.js';
import { authenticate, optional } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, collectionController.createCollection);
router.get('/', authenticate, collectionController.getUserCollections);
// Return all of the current user's collections with a boolean indicating
// whether a given listing is in each collection
router.get('/for-listing/:listingId', authenticate, collectionController.getUserCollectionsForListing);
router.get('/user/:username', optional, collectionController.getPublicCollectionsByUsername);
// Allow public access, but include user context if provided to authorize private access for owners
router.get('/:id', optional, collectionController.getCollection);
router.put('/:id', authenticate, collectionController.updateCollection);
router.delete('/:id', authenticate, collectionController.deleteCollection);
router.post('/:collectionId/listings', authenticate, collectionController.addListingToCollection);
router.delete('/:collectionId/listings', authenticate, collectionController.removeListingFromCollection);

export default router;
