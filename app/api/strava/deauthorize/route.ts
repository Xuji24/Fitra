import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/strava/deauthorize
 *
 * Strava Deauthorization Webhook — called by Strava when a user revokes
 * access to our application from their Strava settings.
 *
 * Complies with Strava API Agreement:
 *   - Section 2.14.5: Must delete all Data about an end-user upon revocation.
 *   - Section 5.4: Must delete Personal Data when user revokes authorization.
 *   - Section 2.14.6: Deletions must be reflected within 48 hours.
 *
 * Strava sends a POST with:
 *   {
 *     "subscription_id": number,
 *     "owner_id": number,        ← Strava athlete ID
 *     "object_type": "athlete",
 *     "object_id": number,
 *     "aspect_type": "update",
 *     "updates": { "authorized": "false" },
 *     "event_time": number
 *   }
 *
 * We also support GET for Strava's webhook subscription validation ("hub challenge").
 */

// Use service-role client for admin operations (deleting across tables)
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  }

  return createClient(url, serviceKey);
}

/**
 * GET /api/strava/deauthorize?hub.mode=subscribe&hub.challenge=...&hub.verify_token=...
 *
 * Strava subscription validation callback.
 * Returns the hub.challenge to verify our endpoint.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = searchParams.get("hub.verify_token");

  if (mode !== "subscribe" || !challenge) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Verify token matches our configured secret
  const expectedToken = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN;
  if (expectedToken && verifyToken !== expectedToken) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ "hub.challenge": challenge });
}

/**
 * POST /api/strava/deauthorize
 *
 * Handles Strava webhook events.
 * When a user deauthorizes, delete their Strava connection and
 * associated Strava-sourced activity data.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      owner_id,
      object_type,
      aspect_type,
      updates,
    } = body;

    // Only process deauthorization events
    const isDeauth =
      object_type === "athlete" &&
      aspect_type === "update" &&
      updates?.authorized === "false";

    if (!isDeauth) {
      // Acknowledge non-deauth events (Strava expects 200)
      return NextResponse.json({ status: "ignored" });
    }

    const stravaAthleteId = Number(owner_id);

    if (!stravaAthleteId) {
      return NextResponse.json({ error: "Missing owner_id" }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Find the user linked to this Strava athlete
    const { data: connection } = await supabase
      .from("strava_connections")
      .select("user_id")
      .eq("strava_athlete_id", stravaAthleteId)
      .single();

    if (!connection) {
      // No matching connection — already cleaned up or never existed
      return NextResponse.json({ status: "no_connection" });
    }

    const userId = connection.user_id;

    // 2. Delete Strava-sourced activity entries for this user
    //    (preserves manually-logged entries)
    await supabase
      .from("activity_entries")
      .delete()
      .eq("user_id", userId)
      .eq("source", "strava");

    // 3. Delete the Strava connection record
    await supabase
      .from("strava_connections")
      .delete()
      .eq("user_id", userId);

    console.log(
      `Strava deauthorization processed for athlete ${stravaAthleteId}, user ${userId}`
    );

    return NextResponse.json({ status: "deauthorized" });
  } catch (err) {
    console.error("Strava deauthorize webhook error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
