-- ============================================================
-- Migration: Add role column to profiles + organizer_applications table
-- ============================================================

-- Add role to profiles (default: runner)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'runner'
  CHECK (role IN ('runner', 'organizer', 'admin'));

-- Create organizer applications table
CREATE TABLE public.organizer_applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  contact_email     TEXT NOT NULL,
  contact_phone     TEXT,
  description       TEXT,
  document_urls     TEXT[] NOT NULL DEFAULT '{}',
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason  TEXT,
  reviewed_by       UUID REFERENCES public.profiles(id),
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.organizer_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
  ON public.organizer_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can submit applications
CREATE POLICY "Users can submit applications"
  ON public.organizer_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.organizer_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins can update applications"
  ON public.organizer_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage bucket for organizer documents (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('organizer-documents', 'organizer-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can upload their own documents
CREATE POLICY "Users can upload organizer docs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'organizer-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can view their own documents
CREATE POLICY "Users can view own organizer docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'organizer-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can view all documents
CREATE POLICY "Admins can view all organizer docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'organizer-documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
