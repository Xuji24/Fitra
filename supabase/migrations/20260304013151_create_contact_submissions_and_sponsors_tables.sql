-- ============================================================
-- Migration: Create contact_submissions and sponsors tables
-- ============================================================

-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL CHECK (subject IN ('general', 'race-info', 'partnership', 'technical', 'other')),
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form (no auth required)
CREATE POLICY "Anyone can submit a contact form"
  ON public.contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);


-- Sponsors
CREATE TABLE public.sponsors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  logo_url      TEXT,
  website_url   TEXT,
  display_order INT DEFAULT 0,
  active        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsors are viewable by everyone"
  ON public.sponsors FOR SELECT
  TO public
  USING (true);
