-- ============================================================
-- Migration: Create activity_entries table
-- ============================================================

CREATE TABLE public.activity_entries (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_id    UUID NOT NULL REFERENCES public.race_registrations(id) ON DELETE CASCADE,
  activity_type      TEXT NOT NULL CHECK (activity_type IN ('run', 'walk', 'cycle')),
  distance_km        NUMERIC(6,2) NOT NULL,
  activity_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  notes              TEXT,
  strava_activity_id BIGINT,
  source             TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'strava')),
  created_at         TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.activity_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities"
  ON public.activity_entries FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can log activities"
  ON public.activity_entries FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
  ON public.activity_entries FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
  ON public.activity_entries FOR DELETE
  TO public
  USING (auth.uid() = user_id);
