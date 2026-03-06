import { createClient } from "@/lib/supabase/server";
import ActivitiesPage from "@/components/pages/main/activities/ActivitiesPage";
import {
  joinedRacesData,
  activityLogData,
  completedRacesData,
  weeklyData as staticWeeklyData,
  getQuickStats,
} from "@/data/activities-data";
import type {
  JoinedRace,
  ActivityEntry,
  CompletedRace,
  WeeklyStat,
} from "@/data/activities-data";

export default async function Activities() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, show static fallback data
  if (!user) {
    return (
      <ActivitiesPage
        joinedRaces={joinedRacesData}
        activityLog={activityLogData}
        completedRaces={completedRacesData}
        weeklyData={staticWeeklyData}
        quickStats={getQuickStats()}
      />
    );
  }

  // Fetch user's race registrations joined with race details
  const { data: registrations } = await supabase
    .from("race_registrations")
    .select(
      "id, status, logged_distance, registered_at, completed_at, races(id, title, category, target_distance_km, event_date, image_url)",
    )
    .eq("user_id", user.id)
    .order("registered_at", { ascending: false });

  // Fetch user's activity entries joined with registration+race for race name
  const { data: activities } = await supabase
    .from("activity_entries")
    .select(
      "id, activity_type, distance_km, activity_date, notes, registration_id, race_registrations(races(title))",
    )
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false });

  // Transform registrations into JoinedRace[]
  const dbJoinedRaces: JoinedRace[] = (registrations ?? [])
    .filter((r) => r.races)
    .map((r) => {
      const race = r.races as unknown as {
        id: string;
        title: string;
        category: string;
        target_distance_km: number;
        event_date: string | null;
        image_url: string | null;
      };
      const loggedDist = Number(r.logged_distance) || 0;
      const targetDist = Number(race.target_distance_km);

      let status: JoinedRace["status"];
      if (r.status === "completed" || loggedDist >= targetDist) {
        status = "completed";
      } else if (loggedDist > 0) {
        status = "in-progress";
      } else {
        status = "upcoming";
      }

      return {
        id: r.id,
        title: race.title,
        category: race.category as JoinedRace["category"],
        targetDistance: targetDist,
        loggedDistance: Math.round(loggedDist * 100) / 100,
        status,
        date: race.event_date
          ? new Date(race.event_date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "TBD",
        image: race.image_url || "/Running.jpg",
      };
    });

  // Transform activity entries into ActivityEntry[]
  const dbActivityLog: ActivityEntry[] = (activities ?? []).map((a, idx) => {
    const regData = a.race_registrations as unknown as {
      races: { title: string };
    } | null;
    return {
      id: idx + 1,
      raceId: a.registration_id,
      raceName: regData?.races?.title ?? "Unknown Race",
      type: a.activity_type as ActivityEntry["type"],
      distance: Number(a.distance_km),
      date: a.activity_date,
      notes: a.notes ?? undefined,
    };
  });

  // Build completed races from registrations
  const dbCompletedRaces: CompletedRace[] = dbJoinedRaces
    .filter((r) => r.status === "completed")
    .map((r) => {
      const entryCount = dbActivityLog.filter((a) => a.raceId === r.id).length;
      return {
        id: r.id,
        title: r.title,
        category: r.category,
        totalDistance: r.loggedDistance,
        completedDate: r.date,
        totalEntries: entryCount,
        image: r.image,
      };
    });

  // Build weekly data from activity entries (current week)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dbWeeklyData: WeeklyStat[] = dayNames.map((day, i) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const dateStr = dayDate.toISOString().split("T")[0];

    const dayDistance = dbActivityLog
      .filter((a) => a.date.split("T")[0] === dateStr)
      .reduce((sum, a) => sum + a.distance, 0);

    return { day, distance: Math.round(dayDistance * 10) / 10 };
  });

  // Determine which data to use (DB or static fallback)
  const hasDbData = dbJoinedRaces.length > 0 || dbActivityLog.length > 0;
  const joinedRaces = hasDbData ? dbJoinedRaces : joinedRacesData;
  const activityLog = hasDbData ? dbActivityLog : activityLogData;
  const completedRaces = hasDbData ? dbCompletedRaces : completedRacesData;
  const weeklyData = hasDbData ? dbWeeklyData : staticWeeklyData;

  // Compute quick stats
  const activeRaces = joinedRaces.filter((r) => r.status === "in-progress");
  const completed = joinedRaces.filter((r) => r.status === "completed");
  const totalLogged = activityLog.reduce((s, e) => s + e.distance, 0);
  const quickStats = {
    totalLogged: Math.round(totalLogged * 10) / 10,
    activeCount: activeRaces.length,
    completedCount: completed.length,
    streak: 0, // Streak calculation requires historical data, default to 0 for now
  };

  return (
    <ActivitiesPage
      joinedRaces={joinedRaces}
      activityLog={activityLog}
      completedRaces={completedRaces}
      weeklyData={weeklyData}
      quickStats={quickStats}
    />
  );
}
