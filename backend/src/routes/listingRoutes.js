import express from 'express';
import * as listingController from '../controllers/listingController.js';
import { authenticate, optional } from '../middleware/authMiddleware.js';
import upload from '../utils/fileUpload.js';

const router = express.Router();

router.post('/', authenticate, listingController.createListing);
// upload-image route is handled in server.js before body parsers
router.get('/', optional, listingController.getAllListings);
router.get('/my-listings', authenticate, listingController.getUserListings);
router.get('/user/:username', optional, listingController.getListingsByUsername);
router.get('/:id', optional, listingController.getListing);
router.put('/:id', authenticate, listingController.updateListing);
router.delete('/:id', authenticate, listingController.deleteListing);

export default router;
