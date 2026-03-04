-- ============================================================
-- Migration: Create strava_connections table
-- ============================================================

CREATE TABLE public.strava_connections (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  strava_athlete_id  BIGINT NOT NULL,
  access_token       TEXT NOT NULL,
  refresh_token      TEXT NOT NULL,
  expires_at         BIGINT NOT NULL,
  scope              TEXT,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.strava_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own Strava connection"
  ON public.strava_connections FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Strava connection"
  ON public.strava_connections FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Strava connection"
  ON public.strava_connections FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Strava connection"
  ON public.strava_connections FOR DELETE
  TO public
  USING (auth.uid() = user_id);
