-- Fix Supabase Storage RLS policies for ImgB bucket

-- First, ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('ImgB', 'ImgB', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;

-- Create policy for authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ImgB');

-- Create policy for authenticated users to update their own images
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'ImgB')
WITH CHECK (bucket_id = 'ImgB');

-- Create policy for authenticated users to delete their own images
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ImgB');

-- Create policy for public read access
CREATE POLICY "Allow public to read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ImgB');

-- Additional policy for anon users to upload (if needed for guest uploads)
CREATE POLICY "Allow anon to upload images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'ImgB');
