import * as listingService from '../services/listingService.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await listingService.createListingService(req.body, req.user.id);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    console.log('Received file:', req.file);
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const imageUrl = await listingService.uploadImageService(req.file);
    res.json({ url: imageUrl });
  } catch (error) {
    next(error);
  }
}

export const getListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.getListingService(id);
    res.json(listing);
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      propertyType: req.query.propertyType,
      sortBy: req.query.sortBy || 'created_at',
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };
    const listings = await listingService.getAllListingsService(filters);
    res.json(listings);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.updateListingService(id, req.user.id, req.body);
    res.json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await listingService.deleteListingService(id, req.user.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const listings = await listingService.getUserListingsService(req.user.id, limit, offset);
    res.json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingsByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const listings = await listingService.getListingsByUsernameService(username, limit, offset);
    res.json(listings);
  } catch (error) {
    next(error);
  }
};
