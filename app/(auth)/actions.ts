"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/");
}

/**
 * Sign up with email + password.
 * Used by: signup-form.tsx
 *
 * Uses PKCE flow — Supabase sends a confirmation email with a link
 * that redirects to /api/auth/callback to exchange the code for a session.
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    redirectTo: `/verification-code?email=${encodeURIComponent(email)}`,
  };
}

/**
 * Send a password reset email.
 * Used by: forgot-password-form.tsx
 *
 * Supabase sends an email with a link to /api/auth/callback?type=recovery
 * which then redirects to /reset-password.
 */
export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;

  if (!email) {
    return { success: false, error: "Email is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/auth/callback?type=recovery`,
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
  const password = formData.get("password") as string;

  if (!password) {
    return { success: false, error: "Password is required." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
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
 * Verify OTP code (email confirmation).
 * Used by: verification-code-form.tsx
 */
export async function verifyOtp(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  if (!email || !token) {
    return { success: false, error: "Email and verification code are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/");
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
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/auth/callback`,
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
 * Sign out the current user.
 * Used by: navbar.tsx, profile-dropdown.tsx (already implemented there with client-side)
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
