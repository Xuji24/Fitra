-- ============================================================
-- Migration: Drop legacy client_profile table and create
-- profiles table with auth trigger
-- ============================================================

-- Drop the old unused table
DROP TABLE IF EXISTS public.client_profile;

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  country     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies (originally public role, later hardened to authenticated)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger function: auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
