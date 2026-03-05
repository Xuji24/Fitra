import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request.
 *
 * This is REQUIRED for Supabase Auth to work reliably in Next.js.
 * Without it, expired tokens are never refreshed and users get
 * randomly logged out.
 *
 * Architecture note:
 * - This middleware is a Next.js frontend concern only.
 * - It refreshes cookies for SSR and Client Components.
 * - When a Python + FastAPI backend is used, the frontend sends
 *   the access token via Authorization header — that flow is
 *   independent of this cookie-based session refresh.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not add code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very
  // hard to debug issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  // Removing this will cause expired sessions to never refresh,
  // leading to random logouts.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  const protectedPaths = ["/profile", "/settings", "/activities"];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as-is.
  // If you create a new response, copy cookies over:
  //   const myResponse = NextResponse.next({ request })
  //   myResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  //   return myResponse
  return supabaseResponse;
}
