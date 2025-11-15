-- Add parent_id column to comments table for reply support
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- Add likes_count column to comments table
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0;

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT comment_likes_pkey PRIMARY KEY (id),
  CONSTRAINT comment_likes_unique UNIQUE (comment_id, user_id)
);

-- Create indexes for comment features
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON public.comment_likes(user_id);

-- Add RLS policies for comment_likes
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comment likes" ON public.comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like comments" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own comment likes" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create functions for incrementing/decrementing likes_count
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_comment_likes(comment_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.comments
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;
