-- ============================================================
-- Migration: Create races table
-- ============================================================

CREATE TABLE public.races (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 TEXT NOT NULL,
  organizer             TEXT,
  description           TEXT,
  full_description      TEXT,
  category              TEXT NOT NULL CHECK (category IN ('5K', '10K', 'Half Marathon', 'Marathon', 'Ultra')),
  target_distance_km    NUMERIC(6,2) NOT NULL,
  event_date            DATE,
  event_time            TIME,
  location              TEXT,
  image_url             TEXT,
  organizer_logo_url    TEXT,
  max_participants      INT,
  registration_open     BOOLEAN DEFAULT true,
  registration_deadline TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Races are viewable by everyone"
  ON public.races FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create races"
  ON public.races FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);
