-- ============================================================
-- Migration: Seed races + extend race_registrations
-- ============================================================

-- Add extra registration fields
ALTER TABLE public.race_registrations
  ADD COLUMN IF NOT EXISTS full_name       TEXT,
  ADD COLUMN IF NOT EXISTS email           TEXT,
  ADD COLUMN IF NOT EXISTS phone           TEXT,
  ADD COLUMN IF NOT EXISTS shirt_size      TEXT CHECK (shirt_size IN ('S', 'M', 'L', 'XL', '2XL')),
  ADD COLUMN IF NOT EXISTS payment_method  TEXT CHECK (payment_method IN ('gcash', 'card', 'bank'));

-- Seed 6 races (predetermined UUIDs so static data can reference them)
INSERT INTO public.races (id, title, organizer, description, full_description, category, target_distance_km, event_date, event_time, location, image_url, organizer_logo_url, max_participants, registration_open, registration_deadline)
VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Manila Sunrise Marathon 2026', 'RunPH Events',
   'Experience the beauty of Manila at sunrise as you run through historical landmarks and scenic routes.',
   'The Manila Sunrise Marathon 2026 takes runners on an unforgettable journey through the heart of Manila. Starting at Rizal Park, the route passes through Intramuros, the Manila Baywalk, and other iconic landmarks. Whether you''re a seasoned marathoner or challenging yourself for the first time, this event promises a world-class experience with full hydration stations, medical support, chip timing, and a stunning finisher''s medal. Post-race celebrations include live music, food stalls, and an awards ceremony.',
   'Marathon', 42.20, '2026-03-15', '05:00', 'Manila, Philippines', '/Running.jpg', '/fitra-logo.png',
   2000, true, '2026-03-10T23:59:59+08:00'),

  ('a1b2c3d4-0002-4000-8000-000000000002', 'Cebu Island 10K Challenge', 'Island Runners PH',
   'A scenic 10K run through Cebu''s most beautiful coastal roads and urban trails.',
   'The Cebu Island 10K Challenge is designed for runners who love coastal scenery and vibrant city culture. Starting from the Cebu IT Park, the course winds through Lahug, passes the Temple of Leah viewpoint area, and finishes at the Cebu Business Park. Expect a fast, flat course ideal for personal bests. All finishers receive a premium tech shirt, finisher''s medal, and loot bag. Top 3 in each age group receive special prizes.',
   '10K', 10.00, '2026-03-22', '06:00', 'Cebu City, Philippines', '/Running.jpg', '/fitra-logo.png',
   500, true, '2026-03-18T23:59:59+08:00'),

  ('a1b2c3d4-0003-4000-8000-000000000003', 'BGC Night Run 5K', 'Metro Run Club',
   'A fun nighttime 5K run through the vibrant streets of Bonifacio Global City.',
   'BGC Night Run 5K is a fun, community-driven event perfect for beginners and casual runners. The route loops through the well-lit streets of BGC, passing High Street, Terra 28th, and Mind Museum. The event features glow sticks, LED armbands, and a post-run party with DJs and food trucks. Families and groups are welcome! Every finisher gets a glow-in-the-dark medal and event shirt.',
   '5K', 5.00, '2026-04-05', '19:00', 'Taguig, Philippines', '/Running.jpg', '/fitra-logo.png',
   800, true, '2026-04-01T23:59:59+08:00'),

  ('a1b2c3d4-0004-4000-8000-000000000004', 'Baguio Half Marathon', 'Highland Runners',
   'Challenge yourself on the cool mountain trails of Baguio City in this half marathon.',
   'The Baguio Half Marathon is one of the most challenging yet rewarding races in the Philippines. Running at an elevation of 1,500 meters, participants experience cooler temperatures and pine-fresh air. The route passes through Camp John Hay, Burnham Park, and the scenic Kennon Road overlook. This is a true test of endurance with rolling hills and breathtaking views. Aid stations every 3km, full medical team, and chip timing included.',
   'Half Marathon', 21.10, '2026-04-12', '04:30', 'Baguio City, Philippines', '/Running.jpg', '/fitra-logo.png',
   600, false, '2026-04-05T23:59:59+08:00'),

  ('a1b2c3d4-0005-4000-8000-000000000005', 'Davao Durian Dash 5K', 'Mindanao Runners',
   'A fun and fruity 5K run celebrating Davao''s famous durian festival season.',
   'The Davao Durian Dash 5K is a unique themed run that celebrates Davao''s iconic fruit. Runners pass through People''s Park, Jack''s Ridge, and the Durian Dome. The route is flat and beginner-friendly with durian-themed aid stations offering durian candies and shakes. Every finisher receives a quirky durian-shaped medal, event shirt, and a box of fresh durians. Fun run categories for kids and families available.',
   '5K', 5.00, '2026-04-20', '05:30', 'Davao City, Philippines', '/Running.jpg', '/fitra-logo.png',
   400, true, '2026-04-15T23:59:59+08:00'),

  ('a1b2c3d4-0006-4000-8000-000000000006', 'Subic Bay 10K Classic', 'Freeport Runners Assoc.',
   'Run through the lush greenery and scenic bay views of the Subic Bay Freeport Zone.',
   'The Subic Bay 10K Classic offers one of the most scenic race routes in the Philippines. Starting at the Subic Bay Convention Center, runners pass through the jungle-lined roads, the historic Naval Magazine area, and finish with a stunning bayfront stretch. The clean air, flat terrain, and well-organized event make this a favorite among 10K enthusiasts. Includes chip timing, finisher''s medal, race kit, and post-race brunch.',
   '10K', 10.00, '2026-05-03', '05:00', 'Subic Bay, Philippines', '/Running.jpg', '/fitra-logo.png',
   700, true, '2026-04-28T23:59:59+08:00')
ON CONFLICT (id) DO NOTHING;
