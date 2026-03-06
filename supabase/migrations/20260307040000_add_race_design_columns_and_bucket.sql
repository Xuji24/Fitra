-- ============================================================
-- Add design upload columns to races table
-- and create storage bucket for race designs
-- ============================================================

-- Add design columns to races
ALTER TABLE public.races
  ADD COLUMN IF NOT EXISTS tshirt_design_url TEXT,
  ADD COLUMN IF NOT EXISTS medal_design_url TEXT,
  ADD COLUMN IF NOT EXISTS certificate_design_url TEXT;

-- Create storage bucket for race design uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('race-designs', 'race-designs', false, 5242880)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for race-designs bucket
-- Organizers/admins can upload to their own race folder
CREATE POLICY "Organizers upload race designs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'race-designs'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('organizer', 'admin')
    )
  );

-- Organizers/admins can view their own uploads, admins can view all
CREATE POLICY "Organizers view own race designs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'race-designs'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Organizers can update their own uploads
CREATE POLICY "Organizers update own race designs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'race-designs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Organizers can delete their own uploads
CREATE POLICY "Organizers delete own race designs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'race-designs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read for race designs (runners need to see designs)
CREATE POLICY "Public read race designs"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'race-designs');
