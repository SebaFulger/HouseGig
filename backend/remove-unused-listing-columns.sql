-- Remove unused listing columns
-- This script removes columns that are no longer used in the listing creation/edit process
-- 
-- Analysis:
-- Current Upload form uses: title, description, region, property_type, main_image_url, gallery_image_urls, tags
-- Database currently has: id, owner_id, title, world, region, property_type, rarity, magic_level, 
--                         price_text, description, main_image_url, tags, created_at, price, 
--                         gallery_image_urls, upvotes, downvotes
--
-- Columns to REMOVE (not used in upload/edit forms):
-- - world: No longer collected in frontend
-- - rarity: Not used in current listing creation
-- - magic_level: Not used in current listing creation  
-- - price_text: Duplicate/old price field
-- - price: Not collected in current form (removed from requirements)
-- - size: Not used if it exists

-- Drop unused columns from listings table
ALTER TABLE listings DROP COLUMN IF EXISTS world;
ALTER TABLE listings DROP COLUMN IF EXISTS rarity;
ALTER TABLE listings DROP COLUMN IF EXISTS magic_level;
ALTER TABLE listings DROP COLUMN IF EXISTS price_text;
ALTER TABLE listings DROP COLUMN IF EXISTS price;
ALTER TABLE listings DROP COLUMN IF EXISTS size;

-- Note: Keeping these columns as they are still used:
-- - id, owner_id: Core identification
-- - title: Required field
-- - description: Required field
-- - region: Optional field (style/region)
-- - property_type: Optional field
-- - main_image_url: Required image
-- - gallery_image_urls: Optional additional images
-- - tags: For future tagging feature
-- - created_at, updated_at: Timestamps
-- - upvotes, downvotes: Voting system
