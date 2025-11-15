import { supabase } from '../config/supabaseClient.js';

export const createCollectionService = async (collectionData, userId) => {
  // Build insert payload without forcing is_public to avoid failures if the column doesn't exist yet
  const payload = {
    ...collectionData,
    owner_id: userId,
    created_at: new Date()
  };

  if (Object.prototype.hasOwnProperty.call(collectionData || {}, 'is_public')) {
    payload.is_public = !!collectionData.is_public;
  }

  const { data, error } = await supabase
    .from('collections')
    .insert([payload])
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  return data;
};

export const getCollectionService = async (collectionId, viewerId = null) => {
  // Fetch base collection
  const { data: collection, error: collErr } = await supabase
    .from('collections')
    .select('*')
    .eq('id', collectionId)
    .single();

  if (collErr || !collection) throw { statusCode: 404, message: 'Collection not found' };

  // Enforce access: public collections are visible to all; private only to owner
  const isOwner = viewerId && collection.owner_id === viewerId;
  if (!collection.is_public && !isOwner) {
    throw { statusCode: 404, message: 'Collection not found' }; // hide existence
  }

  // Fetch owner profile
  const { data: owner } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', collection.owner_id)
    .single();

  // Get listing IDs in this collection
  const { data: links } = await supabase
    .from('collection_listings')
    .select('listing_id')
    .eq('collection_id', collectionId);

  const listingIds = (links || []).map(l => l.listing_id);

  let listings = [];
  if (listingIds.length > 0) {
    const { data: listingRows } = await supabase
      .from('listings')
      .select('id, title, main_image_url, price')
      .in('id', listingIds);

    listings = listingRows || [];
  }

  return {
    ...collection,
    owner: owner || null,
    listings,
    listing_count: listings.length
  };
};

export const getUserCollectionsService = async (userId) => {
  const { data: cols, error } = await supabase
    .from('collections')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw { statusCode: 400, message: error.message };

  if (!cols || cols.length === 0) return [];

  // Fetch counts and first 4 listing images for these collections
  const ids = cols.map(c => c.id);
  const { data: links } = await supabase
    .from('collection_listings')
    .select('collection_id, listing_id')
    .in('collection_id', ids);

  const counts = new Map();
  const listingIdsByCollection = new Map();
  
  (links || []).forEach(l => {
    counts.set(l.collection_id, (counts.get(l.collection_id) || 0) + 1);
    if (!listingIdsByCollection.has(l.collection_id)) {
      listingIdsByCollection.set(l.collection_id, []);
    }
    if (listingIdsByCollection.get(l.collection_id).length < 4) {
      listingIdsByCollection.get(l.collection_id).push(l.listing_id);
    }
  });

  // Fetch main_image_url for those listings
  const allListingIds = [...new Set([...listingIdsByCollection.values()].flat())];
  let imageMap = new Map();
  
  if (allListingIds.length > 0) {
    const { data: listings } = await supabase
      .from('listings')
      .select('id, main_image_url')
      .in('id', allListingIds);
    
    (listings || []).forEach(l => imageMap.set(l.id, l.main_image_url));
  }

  return cols.map(c => ({
    ...c,
    listing_count: counts.get(c.id) || 0,
    cover_images: (listingIdsByCollection.get(c.id) || []).map(lid => imageMap.get(lid)).filter(Boolean)
  }));
};

export const getUserCollectionsForListingService = async (userId, listingId) => {
  // Get the user's collections
  const { data: collections, error } = await supabase
    .from('collections')
    .select('id, name, description, created_at')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw { statusCode: 400, message: error.message };

  if (!collections || collections.length === 0) return [];

  // Get which of those collections contain the listing
  const { data: links } = await supabase
    .from('collection_listings')
    .select('collection_id')
    .eq('listing_id', listingId)
    .in('collection_id', collections.map(c => c.id));

  const hasSet = new Set((links || []).map(l => l.collection_id));

  return collections.map(c => ({
    ...c,
    has_listing: hasSet.has(c.id)
  }));
};

export const updateCollectionService = async (collectionId, userId, updateData) => {
  const { data: collection, error: fetchError } = await supabase
    .from('collections')
    .select('owner_id')
    .eq('id', collectionId)
    .single();

  if (fetchError || !collection) {
    throw { statusCode: 404, message: 'Collection not found' };
  }

  if (collection.owner_id !== userId) {
    throw { statusCode: 403, message: 'Not authorized to update this collection' };
  }

  const { data, error } = await supabase
    .from('collections')
    .update(updateData)
    .eq('id', collectionId)
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  return data;
};

export const deleteCollectionService = async (collectionId, userId) => {
  const { data: collection, error: fetchError } = await supabase
    .from('collections')
    .select('owner_id')
    .eq('id', collectionId)
    .single();

  if (fetchError || !collection) {
    throw { statusCode: 404, message: 'Collection not found' };
  }

  if (collection.owner_id !== userId) {
    throw { statusCode: 403, message: 'Not authorized to delete this collection' };
  }

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId);

  if (error) throw { statusCode: 400, message: error.message };
};

export const addListingToCollectionService = async (collectionId, listingId, userId) => {
  // Verify collection ownership
  const { data: collection, error: collError } = await supabase
    .from('collections')
    .select('owner_id')
    .eq('id', collectionId)
    .single();

  if (collError || !collection || collection.owner_id !== userId) {
    throw { statusCode: 403, message: 'Not authorized' };
  }

  // Check if already added
  const { data: existing } = await supabase
    .from('collection_listings')
    .select('id')
    .eq('collection_id', collectionId)
    .eq('listing_id', listingId)
    .single();

  if (existing) {
    throw { statusCode: 409, message: 'Listing already in collection' };
  }

  const { data, error } = await supabase
    .from('collection_listings')
    .insert([{ collection_id: collectionId, listing_id: listingId }])
    .select()
    .single();

  if (error) throw { statusCode: 400, message: error.message };
  return data;
};

export const removeListingFromCollectionService = async (collectionId, listingId, userId) => {
  const { data: collection, error: collError } = await supabase
    .from('collections')
    .select('owner_id')
    .eq('id', collectionId)
    .single();

  if (collError || !collection || collection.owner_id !== userId) {
    throw { statusCode: 403, message: 'Not authorized' };
  }

  const { error } = await supabase
    .from('collection_listings')
    .delete()
    .eq('collection_id', collectionId)
    .eq('listing_id', listingId);

  if (error) throw { statusCode: 400, message: error.message };
};
