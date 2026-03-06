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

/** Verify the current user has admin role. Returns user id or throws. */
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");
  return { supabase, userId: user.id };
}

/** Log an admin action to the audit trail. */
async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  adminId: string,
  action: string,
  targetType: string,
  targetId?: string,
  details?: Record<string, unknown>,
) {
  await supabase.from("admin_audit_logs").insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId ?? null,
    details: details ?? {},
  });
}

// ============================================================
// Dashboard Stats
// ============================================================

export interface AdminStats {
  totalUsers: number;
  totalRaces: number;
  totalRegistrations: number;
  totalContacts: number;
  pendingApplications: number;
  totalSponsors: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const { supabase } = await requireAdmin();

  const [users, races, registrations, contacts, applications, sponsors] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("races").select("id", { count: "exact", head: true }),
    supabase.from("race_registrations").select("id", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
    supabase.from("organizer_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("sponsors").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: users.count ?? 0,
    totalRaces: races.count ?? 0,
    totalRegistrations: registrations.count ?? 0,
    totalContacts: contacts.count ?? 0,
    pendingApplications: applications.count ?? 0,
    totalSponsors: sponsors.count ?? 0,
  };
}

// ============================================================
// Users Management
// ============================================================

export interface AdminUser {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  role: string;
  created_at: string;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, country, role, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch users.");
  return data ?? [];
}

export async function updateUserRole(
  targetUserId: string,
  newRole: string
): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();

  if (!["runner", "organizer", "admin"].includes(newRole)) {
    return { success: false, error: "Invalid role." };
  }

  // Prevent admin from removing their own admin role
  if (targetUserId === userId && newRole !== "admin") {
    return { success: false, error: "You cannot remove your own admin role." };
  }

  // Fetch old role for audit log
  const { data: oldProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", targetUserId)
    .single();

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId);

  if (error) return { success: false, error: "Failed to update role." };

  await logAudit(supabase, userId, "update_user_role", "user", targetUserId, {
    old_role: oldProfile?.role,
    new_role: newRole,
  });

  return { success: true };
}

// ============================================================
// Races Management
// ============================================================

export interface AdminRace {
  id: string;
  title: string;
  organizer: string | null;
  category: string;
  target_distance_km: number;
  event_date: string | null;
  location: string | null;
  registration_open: boolean;
  max_participants: number | null;
  created_at: string;
  registration_count: number;
}

export async function getAdminRaces(): Promise<AdminRace[]> {
  const { supabase } = await requireAdmin();
  const { data: races, error } = await supabase
    .from("races")
    .select("id, title, organizer, category, target_distance_km, event_date, location, registration_open, max_participants, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch races.");

  // Get registration counts
  const raceIds = (races ?? []).map((r) => r.id);
  let regCounts: Record<string, number> = {};

  if (raceIds.length > 0) {
    const { data: regs } = await supabase
      .from("race_registrations")
      .select("race_id");

    if (regs) {
      regCounts = regs.reduce<Record<string, number>>((acc, r) => {
        acc[r.race_id] = (acc[r.race_id] || 0) + 1;
        return acc;
      }, {});
    }
  }

  return (races ?? []).map((race) => ({
    ...race,
    target_distance_km: Number(race.target_distance_km),
    registration_count: regCounts[race.id] ?? 0,
  }));
}

export async function toggleRaceRegistration(
  raceId: string,
  open: boolean
): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();
  const { error } = await supabase
    .from("races")
    .update({ registration_open: open })
    .eq("id", raceId);

  if (error) return { success: false, error: "Failed to update race." };

  await logAudit(supabase, userId, "toggle_race_registration", "race", raceId, {
    registration_open: open,
  });

  return { success: true };
}

export async function deleteRace(raceId: string): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();
  const { error } = await supabase.from("races").delete().eq("id", raceId);
  if (error) return { success: false, error: "Failed to delete race. It may have registrations." };

  await logAudit(supabase, userId, "delete_race", "race", raceId);

  return { success: true };
}

// ============================================================
// Registrations Management
// ============================================================

export interface AdminRegistration {
  id: string;
  user_id: string;
  race_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  shirt_size: string | null;
  payment_method: string | null;
  status: string;
  logged_distance: number;
  registered_at: string;
  race_title?: string;
  user_display_name?: string;
}

export async function getAdminRegistrations(): Promise<AdminRegistration[]> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("race_registrations")
    .select("id, user_id, race_id, full_name, email, phone, shirt_size, payment_method, status, logged_distance, registered_at")
    .order("registered_at", { ascending: false });

  if (error) throw new Error("Failed to fetch registrations.");

  // Enrich with race titles and user names
  const raceIds = [...new Set((data ?? []).map((r) => r.race_id))];
  const userIds = [...new Set((data ?? []).map((r) => r.user_id))];

  const [racesRes, usersRes] = await Promise.all([
    raceIds.length > 0 ? supabase.from("races").select("id, title").in("id", raceIds) : { data: [] },
    userIds.length > 0 ? supabase.from("profiles").select("id, full_name, username").in("id", userIds) : { data: [] },
  ]);

  const raceMap = new Map((racesRes.data ?? []).map((r) => [r.id, r.title]));
  const userMap = new Map((usersRes.data ?? []).map((u) => [u.id, u.full_name || u.username || "Unknown"]));

  return (data ?? []).map((reg) => ({
    ...reg,
    logged_distance: Number(reg.logged_distance),
    race_title: raceMap.get(reg.race_id) ?? "Unknown Race",
    user_display_name: userMap.get(reg.user_id) ?? "Unknown User",
  }));
}

// ============================================================
// Contact Submissions Management
// ============================================================

export interface AdminContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export async function getAdminContacts(): Promise<AdminContact[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch contacts.");
  return data ?? [];
}

export async function updateContactStatus(
  contactId: string,
  status: string
): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();

  if (!["new", "read", "replied"].includes(status)) {
    return { success: false, error: "Invalid status." };
  }

  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", contactId);

  if (error) return { success: false, error: "Failed to update status." };

  await logAudit(supabase, userId, "update_contact_status", "contact", contactId, { status });

  return { success: true };
}

export async function deleteContact(contactId: string): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();
  const { error } = await supabase.from("contact_submissions").delete().eq("id", contactId);
  if (error) return { success: false, error: "Failed to delete contact." };

  await logAudit(supabase, userId, "delete_contact", "contact", contactId);

  return { success: true };
}

// ============================================================
// Organizer Applications Management
// ============================================================

export interface AdminApplication {
  id: string;
  user_id: string;
  organization_name: string;
  contact_email: string;
  contact_phone: string | null;
  description: string | null;
  document_urls: string[];
  status: string;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  applicant_name?: string;
}

export async function getAdminApplications(): Promise<AdminApplication[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("organizer_applications")
    .select("id, user_id, organization_name, contact_email, contact_phone, description, document_urls, status, rejection_reason, reviewed_by, reviewed_at, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch applications.");

  // Enrich with user names
  const userIds = [...new Set((data ?? []).map((a) => a.user_id))];
  const { data: users } = userIds.length > 0
    ? await supabase.from("profiles").select("id, full_name, username").in("id", userIds)
    : { data: [] };

  const userMap = new Map((users ?? []).map((u) => [u.id, u.full_name || u.username || "Unknown"]));

  return (data ?? []).map((app) => ({
    ...app,
    applicant_name: userMap.get(app.user_id) ?? "Unknown",
  }));
}

export async function approveApplication(applicationId: string): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();

  // Get the application
  const { data: app, error: fetchError } = await supabase
    .from("organizer_applications")
    .select("user_id, status")
    .eq("id", applicationId)
    .single();

  if (fetchError || !app) return { success: false, error: "Application not found." };
  if (app.status !== "pending") return { success: false, error: "Application already reviewed." };

  // Update application status
  const { error: updateError } = await supabase
    .from("organizer_applications")
    .update({
      status: "approved",
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (updateError) return { success: false, error: "Failed to approve application." };

  // Promote user to organizer
  const { error: roleError } = await supabase
    .from("profiles")
    .update({ role: "organizer" })
    .eq("id", app.user_id);

  if (roleError) return { success: false, error: "Approved but failed to update user role." };

  await logAudit(supabase, userId, "approve_application", "application", applicationId, {
    user_id: app.user_id,
  });

  return { success: true };
}

export async function rejectApplication(
  applicationId: string,
  reason: string
): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();

  if (!reason.trim()) return { success: false, error: "Rejection reason is required." };

  const { data: app, error: fetchError } = await supabase
    .from("organizer_applications")
    .select("status")
    .eq("id", applicationId)
    .single();

  if (fetchError || !app) return { success: false, error: "Application not found." };
  if (app.status !== "pending") return { success: false, error: "Application already reviewed." };

  const { error } = await supabase
    .from("organizer_applications")
    .update({
      status: "rejected",
      rejection_reason: reason.trim(),
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (error) return { success: false, error: "Failed to reject application." };

  await logAudit(supabase, userId, "reject_application", "application", applicationId, {
    reason: reason.trim(),
  });

  return { success: true };
}

// ============================================================
// Sponsors Management
// ============================================================

export interface AdminSponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
}

export async function getAdminSponsors(): Promise<AdminSponsor[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("sponsors")
    .select("id, name, logo_url, website_url, display_order, active, created_at")
    .order("display_order", { ascending: true });

  if (error) throw new Error("Failed to fetch sponsors.");
  return data ?? [];
}

export async function createSponsor(input: {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  displayOrder?: number;
}): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();

  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`admin-sponsor:${ip}`, 20);
  if (!allowed) return { success: false, error: "Too many requests." };

  if (!input.name.trim()) return { success: false, error: "Sponsor name is required." };

  const { error } = await supabase.from("sponsors").insert({
    name: input.name.trim(),
    logo_url: input.logoUrl?.trim() || null,
    website_url: input.websiteUrl?.trim() || null,
    display_order: input.displayOrder ?? 0,
    active: true,
  });

  if (error) return { success: false, error: "Failed to create sponsor." };

  await logAudit(supabase, userId, "create_sponsor", "sponsor", undefined, {
    name: input.name.trim(),
  });

  return { success: true };
}

export async function updateSponsor(
  sponsorId: string,
  input: { name?: string; logoUrl?: string; websiteUrl?: string; displayOrder?: number; active?: boolean }
): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();

  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name.trim();
  if (input.logoUrl !== undefined) updateData.logo_url = input.logoUrl.trim() || null;
  if (input.websiteUrl !== undefined) updateData.website_url = input.websiteUrl.trim() || null;
  if (input.displayOrder !== undefined) updateData.display_order = input.displayOrder;
  if (input.active !== undefined) updateData.active = input.active;

  const { error } = await supabase
    .from("sponsors")
    .update(updateData)
    .eq("id", sponsorId);

  if (error) return { success: false, error: "Failed to update sponsor." };

  await logAudit(supabase, userId, "update_sponsor", "sponsor", sponsorId, input);

  return { success: true };
}

export async function deleteSponsor(sponsorId: string): Promise<ActionResult> {
  const { supabase, userId } = await requireAdmin();
  const { error } = await supabase.from("sponsors").delete().eq("id", sponsorId);
  if (error) return { success: false, error: "Failed to delete sponsor." };

  await logAudit(supabase, userId, "delete_sponsor", "sponsor", sponsorId);

  return { success: true };
}
