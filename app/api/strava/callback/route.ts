import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/strava/callback?code=...&scope=...
 *
 * Called by Strava after user authorizes. Exchanges the authorization
 * code for access/refresh tokens and stores them in the strava_connections table.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // User denied access
  if (error) {
    return NextResponse.redirect(
      new URL("/activities?strava=denied", request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/activities?strava=error", request.url)
    );
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/activities?strava=error", request.url)
    );
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(
        new URL("/activities?strava=error", request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const {
      access_token,
      refresh_token,
      expires_at,
      athlete,
    } = tokenData;

    // Get the authenticated Supabase user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL("/login?redirect=/activities", request.url)
      );
    }

    // Upsert the Strava connection (insert or update if already connected)
    const { error: dbError } = await supabase
      .from("strava_connections")
      .upsert(
        {
          user_id: user.id,
          strava_athlete_id: athlete.id,
          access_token,
          refresh_token,
          expires_at: new Date(expires_at * 1000).toISOString(),
          scope: searchParams.get("scope") ?? "read,activity:read_all",
        },
        { onConflict: "user_id" }
      );

    if (dbError) {
      console.error("Failed to store Strava connection:", dbError);
      return NextResponse.redirect(
        new URL("/activities?strava=error", request.url)
      );
    }

    // Success — redirect back to activities page
    return NextResponse.redirect(
      new URL("/activities?strava=connected", request.url)
    );
  } catch (err) {
    console.error("Strava callback error:", err);
    return NextResponse.redirect(
      new URL("/activities?strava=error", request.url)
    );
  }
}
