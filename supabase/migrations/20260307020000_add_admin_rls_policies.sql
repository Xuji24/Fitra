-- ============================================================
-- Migration: Add admin-level RLS policies across all tables
-- and promote assistant.fitra@gmail.com to admin
-- ============================================================

-- ─── PROFILES ───────────────────────────────────────────────
-- Admins can update any profile (e.g. change roles)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── RACES ──────────────────────────────────────────────────
-- Admins can update any race
CREATE POLICY "Admins can update any race"
  ON public.races FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete any race
CREATE POLICY "Admins can delete any race"
  ON public.races FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── RACE_REGISTRATIONS ─────────────────────────────────────
-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
  ON public.race_registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update any registration
CREATE POLICY "Admins can update any registration"
  ON public.race_registrations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete any registration
CREATE POLICY "Admins can delete any registration"
  ON public.race_registrations FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── ACTIVITY_ENTRIES ───────────────────────────────────────
-- Admins can view all activities
CREATE POLICY "Admins can view all activities"
  ON public.activity_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── CONTACT_SUBMISSIONS ────────────────────────────────────
-- Admins can read all contact submissions
CREATE POLICY "Admins can view all contact submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update contact submissions (change status)
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete contact submissions
CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── SPONSORS ───────────────────────────────────────────────
-- Admins can create sponsors
CREATE POLICY "Admins can create sponsors"
  ON public.sponsors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update sponsors
CREATE POLICY "Admins can update sponsors"
  ON public.sponsors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete sponsors
CREATE POLICY "Admins can delete sponsors"
  ON public.sponsors FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── LEADERBOARD_ENTRIES ────────────────────────────────────
-- Admins can insert leaderboard entries
CREATE POLICY "Admins can insert leaderboard entries"
  ON public.leaderboard_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update leaderboard entries
CREATE POLICY "Admins can update leaderboard entries"
  ON public.leaderboard_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete leaderboard entries
CREATE POLICY "Admins can delete leaderboard entries"
  ON public.leaderboard_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── PROMOTE ADMIN USER ────────────────────────────────────
-- Set assistant.fitra@gmail.com as admin
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'assistant.fitra@gmail.com' LIMIT 1
);
