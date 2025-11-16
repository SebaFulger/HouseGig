-- ============================================
-- STEP 1: Add vote columns to listings table
-- Run this first
-- ============================================

ALTER TABLE listings 
  ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- ============================================
-- STEP 2: Create votes table
-- Run this after Step 1 succeeds
-- ============================================

CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, listing_id)
);

-- ============================================
-- STEP 3: Create indexes
-- Run this after Step 2 succeeds
-- ============================================

CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_listing ON votes(listing_id);
CREATE INDEX IF NOT EXISTS idx_votes_type ON votes(vote_type);
CREATE INDEX IF NOT EXISTS idx_listings_upvotes ON listings(upvotes DESC);

-- ============================================
-- STEP 4: Enable RLS and create policies
-- Run this after Step 3 succeeds
-- ============================================

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view votes" ON votes;
DROP POLICY IF EXISTS "Authenticated users can insert votes" ON votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

-- Create new policies
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert votes"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: Create trigger function
-- Run this after Step 4 succeeds
-- ============================================

CREATE OR REPLACE FUNCTION update_listing_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE listings SET upvotes = COALESCE(upvotes, 0) + 1 WHERE id = NEW.listing_id;
    ELSE
      UPDATE listings SET downvotes = COALESCE(downvotes, 0) + 1 WHERE id = NEW.listing_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE listings SET upvotes = GREATEST(COALESCE(upvotes, 0) - 1, 0) WHERE id = OLD.listing_id;
    ELSE
      UPDATE listings SET downvotes = GREATEST(COALESCE(downvotes, 0) - 1, 0) WHERE id = OLD.listing_id;
    END IF;
    IF NEW.vote_type = 'upvote' THEN
      UPDATE listings SET upvotes = COALESCE(upvotes, 0) + 1 WHERE id = NEW.listing_id;
    ELSE
      UPDATE listings SET downvotes = COALESCE(downvotes, 0) + 1 WHERE id = NEW.listing_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE listings SET upvotes = GREATEST(COALESCE(upvotes, 0) - 1, 0) WHERE id = OLD.listing_id;
    ELSE
      UPDATE listings SET downvotes = GREATEST(COALESCE(downvotes, 0) - 1, 0) WHERE id = OLD.listing_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 6: Create trigger
-- Run this after Step 5 succeeds
-- ============================================

DROP TRIGGER IF EXISTS votes_update_counts ON votes;
CREATE TRIGGER votes_update_counts
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_vote_counts();

-- ============================================
-- STEP 7: Create view for statistics (optional)
-- Run this after Step 6 succeeds
-- ============================================

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

-- ============================================
-- COMPLETE! Test the setup
-- ============================================
-- You can test by running:
-- SELECT * FROM votes LIMIT 1;
-- SELECT * FROM vote_stats LIMIT 1;
