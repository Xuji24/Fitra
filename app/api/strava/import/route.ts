import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/strava/import
 *
 * Imports a Strava activity into a specific race registration.
 * Creates an activity_entry record with the Strava data.
 *
 * Body: {
 *   stravaActivityId: number,
 *   registrationId: string (UUID),
 *   distance: number (km),
 *   activityType: "run" | "walk" | "cycle",
 *   activityDate: string (ISO date),
 *   activityName: string
 * }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const {
    stravaActivityId,
    registrationId,
    distance,
    activityType,
    activityDate,
    activityName,
  } = body;

  // Validate required fields
  if (!stravaActivityId || !registrationId || !distance || !activityType || !activityDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Verify the registration belongs to this user
  const { data: registration, error: regError } = await supabase
    .from("race_registrations")
    .select("id, user_id, race_id")
    .eq("id", registrationId)
    .eq("user_id", user.id)
    .single();

  if (regError || !registration) {
    return NextResponse.json(
      { error: "Race registration not found" },
      { status: 404 }
    );
  }

  // Check if this Strava activity was already imported
  const { data: existing } = await supabase
    .from("activity_entries")
    .select("id")
    .eq("user_id", user.id)
    .eq("strava_activity_id", stravaActivityId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "This Strava activity has already been imported" },
      { status: 409 }
    );
  }

  // Insert the activity entry
  const { data: entry, error: insertError } = await supabase
    .from("activity_entries")
    .insert({
      user_id: user.id,
      registration_id: registrationId,
      activity_type: activityType,
      distance_km: distance,
      activity_date: activityDate,
      notes: `Imported from Strava: ${activityName}`,
      strava_activity_id: stravaActivityId,
      source: "strava",
    })
    .select()
    .single();

  if (insertError) {
    console.error("Failed to import Strava activity:", insertError);
    return NextResponse.json(
      { error: "Failed to import activity" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    entry,
    message: `+${distance} km logged from Strava`,
  });
}
