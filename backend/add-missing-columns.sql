-- Ensure collections.is_public exists
ALTER TABLE IF EXISTS public.collections
	ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Fix missing columns in listings table
-- Run this in Supabase SQL Editor

-- Add the missing 'size' column
ALTER TABLE listings ADD COLUMN IF NOT EXISTS size VARCHAR(100);

-- Change magic_level from INTEGER to VARCHAR to match our code
ALTER TABLE listings ALTER COLUMN magic_level TYPE VARCHAR(50) USING magic_level::VARCHAR;

-- Add updated_at if missing
ALTER TABLE listings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Verify all columns and their types
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'listings'
ORDER BY ordinal_position;
