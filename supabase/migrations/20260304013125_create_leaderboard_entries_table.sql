-- ============================================================
-- Migration: Create leaderboard_entries table
-- ============================================================

CREATE TABLE public.leaderboard_entries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  rank              INT,
  total_distance_km NUMERIC(8,2) DEFAULT 0,
  avg_pace          TEXT,
  last_run_date     DATE,
  period            TEXT NOT NULL DEFAULT 'all-time' CHECK (period IN ('weekly', 'monthly', 'all-time')),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard is viewable by everyone"
  ON public.leaderboard_entries FOR SELECT
  TO public
  USING (true);
