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

// ============================================================
// Race Registration
// ============================================================

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_SHIRT_SIZES = ["S", "M", "L", "XL", "2XL"] as const;
const VALID_PAYMENT_METHODS = ["gcash", "card", "bank"] as const;

interface RegistrationInput {
  raceId: string;
  fullName: string;
  email: string;
  phone: string;
  shirtSize: string;
  paymentMethod: string;
}

export async function registerForRace(input: RegistrationInput): Promise<ActionResult> {
  const ip = await getClientIp();
  const { allowed, retryAfterMs } = checkRateLimit(`race-reg:${ip}`, 5);
  if (!allowed) {
    const mins = Math.ceil(retryAfterMs / 60000);
    return { success: false, error: `Too many attempts. Try again in ${mins} min.` };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "You must be logged in to register for a race." };
  }

  // Validate inputs
  if (!UUID_REGEX.test(input.raceId)) {
    return { success: false, error: "Invalid race." };
  }
  if (!input.fullName.trim()) {
    return { success: false, error: "Full name is required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    return { success: false, error: "Invalid email address." };
  }
  if (!/^[0-9+\-\s()]{7,15}$/.test(input.phone.trim())) {
    return { success: false, error: "Invalid phone number." };
  }
  if (!VALID_SHIRT_SIZES.includes(input.shirtSize as typeof VALID_SHIRT_SIZES[number])) {
    return { success: false, error: "Invalid shirt size." };
  }
  if (!VALID_PAYMENT_METHODS.includes(input.paymentMethod as typeof VALID_PAYMENT_METHODS[number])) {
    return { success: false, error: "Invalid payment method." };
  }

  // Check race exists
  const { data: race, error: raceError } = await supabase
    .from("races")
    .select("id, registration_open")
    .eq("id", input.raceId)
    .single();

  if (raceError || !race) {
    return { success: false, error: "Race not found." };
  }
  if (!race.registration_open) {
    return { success: false, error: "Registration is closed for this race." };
  }

  // Check if already registered
  const { data: existing } = await supabase
    .from("race_registrations")
    .select("id")
    .eq("user_id", user.id)
    .eq("race_id", input.raceId)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "You are already registered for this race." };
  }

  // Insert registration
  const { error: insertError } = await supabase.from("race_registrations").insert({
    user_id: user.id,
    race_id: input.raceId,
    full_name: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    shirt_size: input.shirtSize,
    payment_method: input.paymentMethod,
    status: "upcoming",
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { success: false, error: "You are already registered for this race." };
    }
    return { success: false, error: "Registration failed. Please try again." };
  }

  return { success: true };
}

export async function checkRaceRegistration(raceId: string): Promise<{ registered: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { registered: false };

  const { data } = await supabase
    .from("race_registrations")
    .select("id")
    .eq("user_id", user.id)
    .eq("race_id", raceId)
    .maybeSingle();

  return { registered: !!data };
}

/* ── Organizer Application Actions ── */

interface OrganizerApplicationInput {
  organizationName: string;
  contactEmail: string;
  contactPhone?: string;
  description?: string;
  documentUrls: string[];
}

export async function submitOrganizerApplication(
  input: OrganizerApplicationInput
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be logged in to apply." };

  const ip = await getClientIp();
  const allowed = checkRateLimit(`organizer-apply:${user.id}`, 3, 60 * 60 * 1000);
  if (!allowed)
    return { success: false, error: "Too many applications. Please try again later." };

  // Validate inputs
  const orgName = input.organizationName?.trim();
  if (!orgName || orgName.length < 2 || orgName.length > 200)
    return { success: false, error: "Please provide a valid organization name." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.contactEmail || !emailRegex.test(input.contactEmail))
    return { success: false, error: "Please provide a valid contact email." };

  if (input.documentUrls.length === 0)
    return { success: false, error: "Please upload at least one proof document." };

  if (input.documentUrls.length > 5)
    return { success: false, error: "You can upload a maximum of 5 documents." };

  // Check if user already has a pending application
  const { data: existing } = await supabase
    .from("organizer_applications")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existing)
    return { success: false, error: "You already have a pending application under review." };

  // Check if user is already an organizer
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "organizer" || profile?.role === "admin")
    return { success: false, error: "Your account already has organizer privileges." };

  const { error } = await supabase.from("organizer_applications").insert({
    user_id: user.id,
    organization_name: orgName,
    contact_email: input.contactEmail.trim(),
    contact_phone: input.contactPhone?.trim() || null,
    description: input.description?.trim() || null,
    document_urls: input.documentUrls,
  });

  if (error)
    return { success: false, error: "Unable to submit your application. Please try again." };

  return { success: true };
}

export async function getOrganizerApplicationStatus(): Promise<{
  status: "none" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "none" };

  const { data } = await supabase
    .from("organizer_applications")
    .select("status, rejection_reason")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return { status: "none" };

  return {
    status: data.status as "pending" | "approved" | "rejected",
    rejectionReason: data.rejection_reason ?? undefined,
  };
}

export async function getUserRole(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "runner";

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role ?? "runner";
}

/* ── Create Race (Organizer Only) ── */

interface CreateRaceInput {
  title: string;
  category: string;
  targetDistance: number;
  eventDate: string;
  location?: string;
  description?: string;
  maxParticipants?: number;
  registrationDeadline?: string;
  tshirtDesignUrl?: string;
  medalDesignUrl?: string;
  certificateDesignUrl?: string;
}

type CreateRaceResult = ActionResult & { raceId?: string };

export async function createRace(
  input: CreateRaceInput
): Promise<CreateRaceResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { success: false, error: "You must be logged in to create a race." };

  // Verify organizer role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "organizer" && profile?.role !== "admin")
    return { success: false, error: "You do not have permission to create races." };

  const ip = await getClientIp();
  const allowed = checkRateLimit(`create-race:${user.id}`, 10, 60 * 60 * 1000);
  if (!allowed)
    return { success: false, error: "Too many requests. Please try again later." };

  // Validate inputs
  const title = input.title?.trim();
  if (!title || title.length < 3 || title.length > 200)
    return { success: false, error: "Please provide a valid race title (3–200 characters)." };

  const validCategories = ["5K", "10K", "Half Marathon", "Marathon", "Ultra"];
  if (!validCategories.includes(input.category))
    return { success: false, error: "Please select a valid category." };

  if (!input.targetDistance || input.targetDistance <= 0 || input.targetDistance > 1000)
    return { success: false, error: "Please provide a valid distance (0.1–1000 km)." };

  if (!input.eventDate)
    return { success: false, error: "Please provide an event date." };

  const insertData: Record<string, unknown> = {
    title,
    organizer: user.id,
    category: input.category,
    target_distance_km: input.targetDistance,
    event_date: input.eventDate,
    registration_open: true,
  };

  if (input.location) insertData.location = input.location;
  if (input.description) insertData.description = input.description;
  if (input.maxParticipants && input.maxParticipants > 0)
    insertData.max_participants = input.maxParticipants;
  if (input.registrationDeadline)
    insertData.registration_deadline = input.registrationDeadline;
  if (input.tshirtDesignUrl)
    insertData.tshirt_design_url = input.tshirtDesignUrl;
  if (input.medalDesignUrl)
    insertData.medal_design_url = input.medalDesignUrl;
  if (input.certificateDesignUrl)
    insertData.certificate_design_url = input.certificateDesignUrl;

  const { data, error } = await supabase
    .from("races")
    .insert(insertData)
    .select("id")
    .single();

  if (error)
    return { success: false, error: "Unable to create race. Please try again." };

  return { success: true, raceId: data.id };
}

/* ── Update Race Designs (Organizer Only) ── */

interface UpdateRaceDesignsInput {
  raceId: string;
  tshirtDesignUrl?: string | null;
  medalDesignUrl?: string | null;
  certificateDesignUrl?: string | null;
}

export async function updateRaceDesigns(
  input: UpdateRaceDesignsInput
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { success: false, error: "You must be logged in." };

  // Verify organizer role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "organizer" && profile?.role !== "admin")
    return { success: false, error: "You do not have permission to update races." };

  // Verify the race belongs to this organizer
  const { data: race } = await supabase
    .from("races")
    .select("organizer")
    .eq("id", input.raceId)
    .single();

  if (!race)
    return { success: false, error: "Race not found." };

  if (race.organizer !== user.id && profile?.role !== "admin")
    return { success: false, error: "You can only update your own races." };

  const updateData: Record<string, unknown> = {};
  if (input.tshirtDesignUrl !== undefined)
    updateData.tshirt_design_url = input.tshirtDesignUrl;
  if (input.medalDesignUrl !== undefined)
    updateData.medal_design_url = input.medalDesignUrl;
  if (input.certificateDesignUrl !== undefined)
    updateData.certificate_design_url = input.certificateDesignUrl;

  if (Object.keys(updateData).length === 0)
    return { success: false, error: "No changes to save." };

  const { error } = await supabase
    .from("races")
    .update(updateData)
    .eq("id", input.raceId);

  if (error)
    return { success: false, error: "Unable to update designs. Please try again." };

  return { success: true };
}
