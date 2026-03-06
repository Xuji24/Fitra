"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { validatePasswordStrength } from "@/lib/validators";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Shared auth result type for all auth actions.
 * Server Actions cannot return Error objects, so we use a plain object.
 */
export type AuthResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

/**
 * Sign in with email + password.
 * Used by: login-form.tsx
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const ip = await getClientIp();
  const { allowed, retryAfterMs } = checkRateLimit(`signIn:${ip}`, 5);
  if (!allowed) {
    const mins = Math.ceil(retryAfterMs / 60000);
    return {
      success: false,
      error: `Too many attempts. Try again in ${mins} min.`,
    };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const captchaToken = formData.get("captchaToken") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Check if admin → redirect to admin panel
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user!.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  redirect("/");
}

/**
 * Sign up with email + password (magic link confirmation).
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const ip = await getClientIp();
  const { allowed, retryAfterMs } = checkRateLimit(`signUp:${ip}`, 3);
  if (!allowed) {
    const mins = Math.ceil(retryAfterMs / 60000);
    return {
      success: false,
      error: `Too many attempts. Try again in ${mins} min.`,
    };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const captchaToken = formData.get("captchaToken") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      captchaToken,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Passive handling: don't reveal if email already exists
  if (data.user?.identities?.length === 0) {
    return { success: true };
  }

  return { success: true };
}

/**
 * Send a password reset email.
 * Used by: forgot-password-form.tsx
 *
 * Supabase sends an email with a link to /api/auth/callback?type=recovery
 * which then redirects to /reset-password.
 */
export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const ip = await getClientIp();
  const { allowed, retryAfterMs } = checkRateLimit(`forgotPw:${ip}`, 3);
  if (!allowed) {
    const mins = Math.ceil(retryAfterMs / 60000);
    return {
      success: false,
      error: `Too many attempts. Try again in ${mins} min.`,
    };
  }

  const email = formData.get("email") as string;
  const captchaToken = formData.get("captchaToken") as string;

  if (!email) {
    return { success: false, error: "Email is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?type=recovery`,
    captchaToken,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Reset password (set new password).
 * Used by: reset-password-form.tsx
 *
 * The user arrives at /reset-password after clicking the email link.
 * At this point they already have a valid session from exchangeCodeForSession.
 */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const ip = await getClientIp();
  const { allowed, retryAfterMs } = checkRateLimit(`resetPw:${ip}`, 5);
  if (!allowed) {
    const mins = Math.ceil(retryAfterMs / 60000);
    return {
      success: false,
      error: `Too many attempts. Try again in ${mins} min.`,
    };
  }

  const password = formData.get("password") as string;

  if (!password) {
    return { success: false, error: "Password is required." };
  }

  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/login");
}

/**
 * Sign in with Google OAuth.
 * Used by: login-form.tsx + signup-form.tsx
 *
 * Note: This is a special case — OAuth requires a browser redirect,
 * so we return the URL for the client to navigate to.
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data?.url) {
    redirect(data.url);
  }

  return { success: false, error: "Failed to initiate Google sign-in." };
}

/**
 * Change password from Settings page.
 * Verifies the current password first, then updates to the new one.
 */
export async function changePassword(formData: FormData): Promise<AuthResult> {
  const ip = await getClientIp();
  const { allowed, retryAfterMs } = checkRateLimit(`changePw:${ip}`, 5);
  if (!allowed) {
    const mins = Math.ceil(retryAfterMs / 60000);
    return {
      success: false,
      error: `Too many attempts. Try again in ${mins} min.`,
    };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    return { success: false, error: "All password fields are required." };
  }

  const passwordError = validatePasswordStrength(newPassword);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  const supabase = await createClient();

  // Get current user's email to verify current password
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return { success: false, error: "Session expired. Please sign in again." };
  }

  // Verify current password by attempting sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { success: false, error: "Current password is incorrect." };
  }

  // Update to new password
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Sign out the current user.
 * Used by: navbar.tsx, profile-dropdown.tsx (already implemented there with client-side)
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
