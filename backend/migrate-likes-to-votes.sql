-- Migration: Replace likes system with upvote/downvote system
-- Run this in your Supabase SQL editor

-- Step 1: Drop the old likes table and related indexes
DROP INDEX IF EXISTS idx_likes_user;
DROP INDEX IF EXISTS idx_likes_listing;
DROP TABLE IF EXISTS likes CASCADE;

-- Step 2: Create new votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, listing_id)
);

-- Step 3: Add upvotes and downvotes columns to listings table
ALTER TABLE listings 
  ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- Step 4: Create indexes for performance
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_listing ON votes(listing_id);
CREATE INDEX idx_votes_type ON votes(vote_type);
CREATE INDEX idx_listings_upvotes ON listings(upvotes DESC);

-- Step 5: Enable Row Level Security (RLS)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for votes table

-- Policy: Users can view all votes
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy: Authenticated users can insert their own votes
CREATE POLICY "Authenticated users can insert votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own votes
CREATE POLICY "Users can update their own votes"
  ON votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own votes
CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 7: Create function to update vote counts on listings
CREATE OR REPLACE FUNCTION update_listing_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the listing's vote counts
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE listings SET upvotes = upvotes + 1 WHERE id = NEW.listing_id;
    ELSE
      UPDATE listings SET downvotes = downvotes + 1 WHERE id = NEW.listing_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Remove old vote count
    IF OLD.vote_type = 'upvote' THEN
      UPDATE listings SET upvotes = upvotes - 1 WHERE id = OLD.listing_id;
    ELSE
      UPDATE listings SET downvotes = downvotes - 1 WHERE id = OLD.listing_id;
    END IF;
    -- Add new vote count
    IF NEW.vote_type = 'upvote' THEN
      UPDATE listings SET upvotes = upvotes + 1 WHERE id = NEW.listing_id;
    ELSE
      UPDATE listings SET downvotes = downvotes + 1 WHERE id = NEW.listing_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE listings SET upvotes = upvotes - 1 WHERE id = OLD.listing_id;
    ELSE
      UPDATE listings SET downvotes = downvotes - 1 WHERE id = OLD.listing_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger to automatically update vote counts
DROP TRIGGER IF EXISTS votes_update_counts ON votes;
CREATE TRIGGER votes_update_counts
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_vote_counts();

-- Step 9: Create view for vote statistics (optional, for easier querying)
CREATE OR REPLACE VIEW vote_stats AS
SELECT 
  listing_id,
  COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvote_count,
  COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvote_count,
  COUNT(*) as total_votes,
  ROUND(
    (COUNT(*) FILTER (WHERE vote_type = 'upvote')::numeric / 
     NULLIF(COUNT(*), 0)::numeric) * 100, 
    2
  ) as approval_percentage
FROM votes
GROUP BY listing_id;

-- Step 10: Grant permissions
GRANT SELECT ON vote_stats TO authenticated, anon;

-- Success! The migration is complete.
-- Notes:
-- - All existing likes data will be lost (backup first if needed)
-- - Vote counts are automatically maintained via triggers
-- - RLS policies ensure users can only modify their own votes
