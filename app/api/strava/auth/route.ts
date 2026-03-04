import { NextResponse } from "next/server";

/**
 * GET /api/strava/auth
 *
 * Redirects the user to Strava's OAuth authorization page.
 * Strava will ask the user to grant permission, then redirect
 * back to our callback URL with an authorization code.
 */
export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Strava API credentials not configured" },
      { status: 500 }
    );
  }

  const stravaAuthUrl = new URL("https://www.strava.com/oauth/authorize");
  stravaAuthUrl.searchParams.set("client_id", clientId);
  stravaAuthUrl.searchParams.set("redirect_uri", redirectUri);
  stravaAuthUrl.searchParams.set("response_type", "code");
  stravaAuthUrl.searchParams.set("scope", "read,activity:read_all");
  stravaAuthUrl.searchParams.set("approval_prompt", "auto");

  return NextResponse.redirect(stravaAuthUrl.toString());
}
