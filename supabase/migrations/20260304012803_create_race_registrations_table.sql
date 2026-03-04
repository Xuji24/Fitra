-- ============================================================
-- Migration: Create race_registrations table
-- ============================================================

CREATE TABLE public.race_registrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  race_id         UUID NOT NULL REFERENCES public.races(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in-progress', 'completed')),
  logged_distance NUMERIC(8,2) DEFAULT 0,
  registered_at   TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  UNIQUE (user_id, race_id)
);

ALTER TABLE public.race_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations"
  ON public.race_registrations FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can register for races"
  ON public.race_registrations FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations"
  ON public.race_registrations FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
