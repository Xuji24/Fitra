-- ============================================================
-- Migration: Harden RLS policies — change role from public to
-- authenticated on all auth-gated policies & add missing DELETE
-- ============================================================

-- ─── PROFILES ───────────────────────────────────────────────
-- SELECT stays public (anyone can view profiles)
-- Fix INSERT & UPDATE to target authenticated role

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ─── RACES ──────────────────────────────────────────────────
-- SELECT stays public (anyone can browse races)
-- Fix INSERT to target authenticated role

DROP POLICY IF EXISTS "Authenticated users can create races" ON public.races;
CREATE POLICY "Authenticated users can create races"
  ON public.races FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);


-- ─── RACE_REGISTRATIONS ─────────────────────────────────────
-- All operations require auth

DROP POLICY IF EXISTS "Users can view their own registrations" ON public.race_registrations;
CREATE POLICY "Users can view their own registrations"
  ON public.race_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can register for races" ON public.race_registrations;
CREATE POLICY "Users can register for races"
  ON public.race_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own registrations" ON public.race_registrations;
CREATE POLICY "Users can update their own registrations"
  ON public.race_registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- NEW: Allow users to cancel (delete) their own registrations
CREATE POLICY "Users can cancel their own registrations"
  ON public.race_registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ─── ACTIVITY_ENTRIES ───────────────────────────────────────

DROP POLICY IF EXISTS "Users can view their own activities" ON public.activity_entries;
CREATE POLICY "Users can view their own activities"
  ON public.activity_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can log activities" ON public.activity_entries;
CREATE POLICY "Users can log activities"
  ON public.activity_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own activities" ON public.activity_entries;
CREATE POLICY "Users can update their own activities"
  ON public.activity_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own activities" ON public.activity_entries;
CREATE POLICY "Users can delete their own activities"
  ON public.activity_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ─── STRAVA_CONNECTIONS ─────────────────────────────────────

DROP POLICY IF EXISTS "Users can view their own Strava connection" ON public.strava_connections;
CREATE POLICY "Users can view their own Strava connection"
  ON public.strava_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own Strava connection" ON public.strava_connections;
CREATE POLICY "Users can create their own Strava connection"
  ON public.strava_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own Strava connection" ON public.strava_connections;
CREATE POLICY "Users can update their own Strava connection"
  ON public.strava_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own Strava connection" ON public.strava_connections;
CREATE POLICY "Users can delete their own Strava connection"
  ON public.strava_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ─── LEADERBOARD_ENTRIES ────────────────────────────────────
-- SELECT stays public — no write policies = service_role only via triggers

-- ─── SPONSORS ───────────────────────────────────────────────
-- SELECT stays public — no write policies = admin only via service_role

-- ─── CONTACT_SUBMISSIONS ────────────────────────────────────
-- INSERT stays public (anonymous submissions) — no read policies = admin only
