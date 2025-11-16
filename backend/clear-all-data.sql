-- ============================================
-- CLEAR ALL DATABASE DATA
-- This script deletes all data from all tables
-- while preserving the table structures
-- ============================================
-- 
-- WARNING: This will permanently delete all data!
-- Use with caution, especially in production.
-- 
-- Order matters: Delete from child tables first
-- to avoid foreign key constraint violations
-- ============================================

-- Disable triggers temporarily for faster deletion
SET session_replication_role = replica;

-- 1. Delete all messages and conversation data
TRUNCATE TABLE public.messages CASCADE;
TRUNCATE TABLE public.conversation_participants CASCADE;
TRUNCATE TABLE public.conversations CASCADE;

-- 2. Delete all comment-related data
TRUNCATE TABLE public.comment_likes CASCADE;
TRUNCATE TABLE public.comments CASCADE;

-- 3. Delete all voting data
TRUNCATE TABLE public.votes CASCADE;

-- 4. Delete all likes data (if still exists)
TRUNCATE TABLE public.likes CASCADE;

-- 5. Delete all collection data
TRUNCATE TABLE public.collection_listings CASCADE;
TRUNCATE TABLE public.collections CASCADE;

-- 6. Delete all listings
-- This will cascade to votes, comments, likes, and collection_listings
TRUNCATE TABLE public.listings CASCADE;

-- 7. Reset listings vote counts (in case any remain)
UPDATE public.listings SET upvotes = 0, downvotes = 0 WHERE upvotes IS NOT NULL OR downvotes IS NOT NULL;

-- 8. Delete all profiles data
TRUNCATE TABLE public.profiles CASCADE;

-- 9. Delete all users (if using custom users table)
-- Note: If using auth.users (Supabase Auth), you'll need to delete via Supabase Auth Admin API
-- This only clears the custom users table if it exists
TRUNCATE TABLE public.users CASCADE;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- Reset sequences (optional - if you want IDs to start from 1 again)
-- Note: This only works for SERIAL/BIGSERIAL columns, not UUIDs
-- Uncomment if needed:
-- ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS listings_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS comments_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS collections_id_seq RESTART WITH 1;

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify all data has been cleared
-- ============================================

-- Check row counts for all tables:
SELECT 'users' as table_name, COUNT(*) as row_count FROM public.users
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'listings', COUNT(*) FROM public.listings
UNION ALL
SELECT 'collections', COUNT(*) FROM public.collections
UNION ALL
SELECT 'collection_listings', COUNT(*) FROM public.collection_listings
UNION ALL
SELECT 'comments', COUNT(*) FROM public.comments
UNION ALL
SELECT 'comment_likes', COUNT(*) FROM public.comment_likes
UNION ALL
SELECT 'votes', COUNT(*) FROM public.votes
UNION ALL
SELECT 'likes', COUNT(*) FROM public.likes
UNION ALL
SELECT 'conversations', COUNT(*) FROM public.conversations
UNION ALL
SELECT 'conversation_participants', COUNT(*) FROM public.conversation_participants
UNION ALL
SELECT 'messages', COUNT(*) FROM public.messages;

-- ============================================
-- NOTES:
-- ============================================
-- 1. This script uses TRUNCATE instead of DELETE for performance
-- 2. TRUNCATE CASCADE automatically handles foreign key relationships
-- 3. Auth users (auth.users) must be deleted separately via Supabase Dashboard
--    or using the Admin API
-- 4. Storage bucket files (images) are NOT deleted by this script
--    You'll need to clear storage buckets separately via Supabase Dashboard
-- 5. Run verification queries at the end to confirm all data is cleared
-- ============================================
