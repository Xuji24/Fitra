"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

type ActionResult = {
  success: boolean;
  error?: string;
};

async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
}

const VALID_SUBJECTS = ["general", "race-info", "partnership", "technical", "other"] as const;

/**
 * Submit a contact form to the contact_submissions table.
 * Rate limited to 3 submissions per 15 minutes per IP.
 */
export async function submitContactForm(formData: FormData): Promise<ActionResult> {
  const ip = await getClientIp();
  const { allowed, retryAfterMs } = checkRateLimit(`contact:${ip}`, 3);
  if (!allowed) {
    const mins = Math.ceil(retryAfterMs / 60000);
    return { success: false, error: `Too many submissions. Try again in ${mins} min.` };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const subject = formData.get("subject") as string;
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !subject || !message) {
    return { success: false, error: "All fields are required." };
  }

  if (!VALID_SUBJECTS.includes(subject as typeof VALID_SUBJECTS[number])) {
    return { success: false, error: "Invalid subject." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Invalid email address." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    subject,
    message,
  });

  if (error) {
    return { success: false, error: "Failed to send message. Please try again." };
  }

  return { success: true };
}
