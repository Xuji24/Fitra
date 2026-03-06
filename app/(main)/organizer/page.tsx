import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrganizerDashboard from "@/components/pages/main/organizer/OrganizerDashboard";

export default async function OrganizerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "organizer" && profile?.role !== "admin") {
    redirect("/settings");
  }

  // Fetch organizer's races
  const { data: races } = await supabase
    .from("races")
    .select("id, title, category, target_distance_km, event_date, image_url, registration_open, max_participants, tshirt_design_url, medal_design_url, certificate_design_url, created_at")
    .eq("organizer", user.id)
    .order("created_at", { ascending: false });

  // Fetch registration counts for organizer's races
  const raceIds = (races ?? []).map((r) => r.id);
  let registrationCounts: Record<string, number> = {};

  if (raceIds.length > 0) {
    const { data: regCounts } = await supabase
      .from("race_registrations")
      .select("race_id")
      .in("race_id", raceIds);

    if (regCounts) {
      registrationCounts = regCounts.reduce<Record<string, number>>((acc, r) => {
        acc[r.race_id] = (acc[r.race_id] || 0) + 1;
        return acc;
      }, {});
    }
  }

  const organizerRaces = (races ?? []).map((race) => ({
    id: race.id,
    title: race.title,
    category: race.category,
    targetDistance: Number(race.target_distance_km),
    eventDate: race.event_date,
    imageUrl: race.image_url,
    registrationOpen: race.registration_open,
    maxParticipants: race.max_participants,
    registrationCount: registrationCounts[race.id] ?? 0,
    tshirtDesignUrl: race.tshirt_design_url,
    medalDesignUrl: race.medal_design_url,
    certificateDesignUrl: race.certificate_design_url,
  }));

  return <OrganizerDashboard races={organizerRaces} />;
}
