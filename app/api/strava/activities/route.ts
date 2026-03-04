import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/strava/activities?after=YYYY-MM-DD&before=YYYY-MM-DD
 *
 * Fetches the authenticated user's Strava activities within an optional date range.
 * Complies with Strava API Agreement — only returns the authenticated user's own data,
 * respects rate limits, and does NOT cache results (Section 7).
 *
 * Query params:
 *   after  — ISO date string (inclusive). Only activities on or after this date.
 *   before — ISO date string (inclusive). Only activities on or before this date.
 *
 * If neither param is supplied, returns up to 30 most recent activities.
 * Automatically refreshes the access token if expired.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const afterParam = searchParams.get("after"); // e.g. "2025-06-01"
  const beforeParam = searchParams.get("before"); // e.g. "2025-06-30"
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get Strava connection
  const { data: connection, error: connError } = await supabase
    .from("strava_connections")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (connError || !connection) {
    return NextResponse.json(
      { error: "Strava not connected", connected: false },
      { status: 404 }
    );
  }

  // Check if token is expired and refresh if needed
  let accessToken = connection.access_token;
  const expiresAt = new Date(connection.expires_at);

  if (expiresAt <= new Date()) {
    const refreshResult = await refreshStravaToken(connection.refresh_token);

    if (!refreshResult) {
      return NextResponse.json(
        { error: "Failed to refresh Strava token" },
        { status: 401 }
      );
    }

    accessToken = refreshResult.access_token;

    // Update tokens in DB
    await supabase
      .from("strava_connections")
      .update({
        access_token: refreshResult.access_token,
        refresh_token: refreshResult.refresh_token,
        expires_at: new Date(refreshResult.expires_at * 1000).toISOString(),
      })
      .eq("user_id", user.id);
  }

  // Build the Strava API URL with optional date-range filtering
  // Strava `after`/`before` params expect epoch seconds (Unix timestamp)
  try {
    const stravaUrl = new URL("https://www.strava.com/api/v3/athlete/activities");
    stravaUrl.searchParams.set("per_page", "30");

    if (afterParam) {
      const afterDate = new Date(afterParam);
      if (!isNaN(afterDate.getTime())) {
        // Start of the day in UTC
        afterDate.setUTCHours(0, 0, 0, 0);
        stravaUrl.searchParams.set("after", String(Math.floor(afterDate.getTime() / 1000)));
      }
    }

    if (beforeParam) {
      const beforeDate = new Date(beforeParam);
      if (!isNaN(beforeDate.getTime())) {
        // End of the day in UTC so the date is inclusive
        beforeDate.setUTCHours(23, 59, 59, 999);
        stravaUrl.searchParams.set("before", String(Math.floor(beforeDate.getTime() / 1000)));
      }
    }

    const activitiesResponse = await fetch(stravaUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // No caching — comply with Strava API Agreement Section 7
      cache: "no-store",
    });

    if (!activitiesResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Strava activities" },
        { status: activitiesResponse.status }
      );
    }

    const rawActivities = await activitiesResponse.json();

    // Get already-imported Strava activity IDs for this user
    const { data: importedEntries } = await supabase
      .from("activity_entries")
      .select("strava_activity_id")
      .eq("user_id", user.id)
      .not("strava_activity_id", "is", null);

    const importedIds = new Set(
      (importedEntries ?? []).map((e: { strava_activity_id: number }) => e.strava_activity_id)
    );

    // Map to a cleaner shape for the frontend
    // Preserves original activity name unmodified (Strava API Agreement Section 2.14.19)
    const activities = rawActivities.map(
      (a: {
        id: number;
        name: string;
        type: string;
        distance: number;
        moving_time: number;
        elapsed_time: number;
        start_date_local: string;
        total_elevation_gain: number;
        kilojoules?: number;
        average_speed: number;
      }) => ({
        id: a.id,
        name: a.name,
        type: mapStravaType(a.type),
        stravaType: a.type,
        distance: +(a.distance / 1000).toFixed(2), // meters → km
        movingTime: a.moving_time,
        elapsedTime: a.elapsed_time,
        startDate: a.start_date_local,
        averagePace: formatPace(a.average_speed),
        elevationGain: a.total_elevation_gain,
        calories: a.kilojoules ? Math.round(a.kilojoules) : null,
        imported: importedIds.has(a.id),
        // Deep-link back to Strava (API Agreement Section 2.14.5 — clear links to Strava)
        stravaUrl: `https://www.strava.com/activities/${a.id}`,
      })
    );

    return NextResponse.json({ activities, connected: true });
  } catch (err) {
    console.error("Error fetching Strava activities:", err);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

/** Refresh an expired Strava access token */
async function refreshStravaToken(refreshToken: string) {
  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/** Map Strava activity type to our activity_type */
function mapStravaType(stravaType: string): "run" | "walk" | "cycle" {
  const lower = stravaType.toLowerCase();
  if (lower.includes("run")) return "run";
  if (lower.includes("walk") || lower.includes("hike")) return "walk";
  if (lower.includes("ride") || lower.includes("cycle")) return "cycle";
  return "run"; // default
}

/** Convert average speed (m/s) to pace string "X:XX/km" */
function formatPace(avgSpeedMs: number): string {
  if (avgSpeedMs <= 0) return "—";
  const paceMinPerKm = 1000 / avgSpeedMs / 60;
  const mins = Math.floor(paceMinPerKm);
  const secs = Math.round((paceMinPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}/km`;
}
