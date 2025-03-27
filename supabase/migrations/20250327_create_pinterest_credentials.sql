
-- Create a table for storing Pinterest credentials
CREATE TABLE IF NOT EXISTS public.pinterest_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add Row Level Security to protect Pinterest credentials
ALTER TABLE public.pinterest_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own Pinterest credentials
CREATE POLICY "Users can view their own Pinterest credentials"
  ON public.pinterest_credentials
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own Pinterest credentials
CREATE POLICY "Users can insert their own Pinterest credentials"
  ON public.pinterest_credentials
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own Pinterest credentials
CREATE POLICY "Users can update their own Pinterest credentials"
  ON public.pinterest_credentials
  FOR UPDATE
  USING (auth.uid() = user_id);
