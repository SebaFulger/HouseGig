-- Diagnose and fix comments RLS policies
-- Run this in your Supabase SQL Editor
-- Safe to run - won't recreate existing tables

-- 1. Check current table structure
SELECT 
  'Current comments table structure:' as status,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'comments'
ORDER BY ordinal_position;

-- 2. Check how many comments exist
SELECT 
  'Total comments in DB:' as status,
  COUNT(*) as count
FROM public.comments;

-- 3. Sample existing comments (with user info)
SELECT 
  'Sample comments:' as status,
  c.id,
  c.listing_id,
  c.user_id,
  c.content,
  c.created_at,
  c.parent_id,
  c.likes_count
FROM public.comments c
ORDER BY c.created_at DESC
LIMIT 5;

-- 4. Check RLS status
SELECT 
  'RLS enabled?' as status,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'comments';

-- 5. Check existing policies
SELECT 
  'Existing RLS policies:' as status,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'comments';

-- 6. Fix: Drop all existing RLS policies and recreate them properly
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.comments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.comments;

-- 7. Enable RLS if not already enabled
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 8. Create permissive policies (backend uses service role key so these are mostly for direct access)
CREATE POLICY "Anyone can view comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Verify policies were created
SELECT 
  'New policies created:' as status,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'comments';

-- 10. Final check: try to select comments (this should work)
SELECT 
  'Final test - can we read comments?' as status,
  COUNT(*) as total_readable_comments
FROM public.comments;
