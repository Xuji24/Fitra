-- ============================================================
-- Migration: Create distance accumulation triggers
-- ============================================================

-- Trigger function: Recalculate logged_distance on race_registrations
-- and auto-transition status (upcoming → in-progress → completed)
CREATE OR REPLACE FUNCTION public.update_registration_distance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_reg_id UUID;
  v_total  NUMERIC;
  v_target NUMERIC;
BEGIN
  -- Determine which registration_id to recalculate
  IF TG_OP = 'DELETE' THEN
    v_reg_id := OLD.registration_id;
  ELSE
    v_reg_id := NEW.registration_id;
  END IF;

  -- Sum all distances for this registration
  SELECT COALESCE(SUM(distance_km), 0) INTO v_total
  FROM public.activity_entries
  WHERE registration_id = v_reg_id;

  -- Get target distance from the linked race
  SELECT r.target_distance_km INTO v_target
  FROM public.race_registrations rr
  JOIN public.races r ON r.id = rr.race_id
  WHERE rr.id = v_reg_id;

  -- Update the registration
  UPDATE public.race_registrations
  SET logged_distance = v_total,
      status = CASE
        WHEN v_total >= v_target THEN 'completed'
        WHEN v_total > 0        THEN 'in-progress'
        ELSE 'upcoming'
      END,
      completed_at = CASE
        WHEN v_total >= v_target AND completed_at IS NULL THEN now()
        WHEN v_total < v_target THEN NULL
        ELSE completed_at
      END
  WHERE id = v_reg_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers on activity_entries
CREATE TRIGGER on_activity_inserted
  AFTER INSERT ON public.activity_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_registration_distance();

CREATE TRIGGER on_activity_updated
  AFTER UPDATE ON public.activity_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_registration_distance();

CREATE TRIGGER on_activity_deleted
  AFTER DELETE ON public.activity_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_registration_distance();

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_strava_connections_updated_at
  BEFORE UPDATE ON public.strava_connections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_leaderboard_updated_at
  BEFORE UPDATE ON public.leaderboard_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
