-- ============================================================
-- Migration: Seed sponsors + leaderboard entries for existing users
-- ============================================================

-- Seed sponsors
INSERT INTO public.sponsors (name, logo_url, display_order, active)
VALUES
  ('Aquafina', '/sponsors/aquafina.png', 1, true),
  ('Summit', '/sponsors/summit-water.png', 2, true),
  ('Asics', '/sponsors/asics.png', 3, true),
  ('Puma', '/sponsors/puma.jpg', 4, true),
  ('Nike', '/sponsors/nike.jpg', 5, true),
  ('Uniqlo', '/sponsors/uniqlo.jpg', 6, true),
  ('Coca-Cola', '/sponsors/coca-cola.png', 7, true),
  ('Pocari', '/sponsors/pocari.jpg', 8, true)
ON CONFLICT DO NOTHING;

-- Seed leaderboard entries for existing users (Fitraman + Runner)
INSERT INTO public.leaderboard_entries (user_id, rank, total_distance_km, avg_pace, last_run_date, period)
VALUES
  ('68488a4f-367b-4796-bb2e-034f78360491', 1, 470, '5:48', '2026-03-01', 'weekly'),
  ('e567b0ca-c313-4e91-86ba-5bf20f3062db', 2, 344, '6:28', '2026-02-27', 'weekly')
ON CONFLICT (user_id) DO NOTHING;
