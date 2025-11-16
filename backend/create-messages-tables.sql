-- Create messaging system tables
-- Run this in your Supabase SQL Editor

-- 1. Conversations table (stores chat threads between users)
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT conversations_pkey PRIMARY KEY (id)
);

-- 2. Conversation participants (many-to-many: users <-> conversations)
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT now(),
  last_read_at timestamp with time zone DEFAULT now(),
  CONSTRAINT conversation_participants_pkey PRIMARY KEY (id),
  CONSTRAINT conversation_participants_unique UNIQUE (conversation_id, user_id)
);

-- 3. Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at);

-- Disable RLS temporarily to avoid conflicts during setup
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view their own participant records" ON public.conversation_participants;
DROP POLICY IF EXISTS "Authenticated users can add participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Authenticated users can insert participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can update their own participant record" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;

-- Keep RLS DISABLED for these tables since backend uses service role
-- Service role bypasses RLS automatically, so keeping it disabled simplifies everything
-- The backend API authentication provides the security layer

-- Function to update conversation updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update conversation timestamp when message is sent
DROP TRIGGER IF EXISTS update_conversation_on_message ON public.messages;
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Verify tables were created
SELECT 
  'Tables created successfully:' as status,
  table_name
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name IN ('conversations', 'conversation_participants', 'messages')
ORDER BY table_name;

-- Check RLS status
SELECT 
  'RLS Status:' as info,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename IN ('conversations', 'conversation_participants', 'messages');
