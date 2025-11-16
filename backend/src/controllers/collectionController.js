import * as collectionService from '../services/collectionService.js';

export const createCollection = async (req, res, next) => {
  try {
    const collection = await collectionService.createCollectionService(req.body, req.user.id);
    res.status(201).json(collection);
  } catch (error) {
    next(error);
  }
};

export const getCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const viewerId = req.user?.id;
    const collection = await collectionService.getCollectionService(id, viewerId);
    res.json(collection);
  } catch (error) {
    next(error);
  }
};

export const getUserCollections = async (req, res, next) => {
  try {
    const collections = await collectionService.getUserCollectionsService(req.user.id);
    res.json(collections);
  } catch (error) {
    next(error);
  }
};

export const getPublicCollectionsByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const collections = await collectionService.getPublicCollectionsByUsernameService(username);
    res.json(collections);
  } catch (error) {
    next(error);
  }
};

export const getUserCollectionsForListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const collections = await collectionService.getUserCollectionsForListingService(req.user.id, listingId);
    res.json(collections);
  } catch (error) {
    next(error);
  }
};

export const updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const collection = await collectionService.updateCollectionService(id, req.user.id, req.body);
    res.json(collection);
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    await collectionService.deleteCollectionService(id, req.user.id);
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addListingToCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const { listingId } = req.body;
    await collectionService.addListingToCollectionService(collectionId, listingId, req.user.id);
    res.status(201).json({ message: 'Listing added to collection' });
  } catch (error) {
    next(error);
  }
};

export const removeListingFromCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const { listingId } = req.body;
    await collectionService.removeListingFromCollectionService(collectionId, listingId, req.user.id);
    res.json({ message: 'Listing removed from collection' });
  } catch (error) {
    next(error);
  }
};
