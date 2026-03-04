/* ═══════════════════════════════════════════════
   Activities Page — Types & Mock Data
   ═══════════════════════════════════════════════ */

/* ── Types ── */

export type ActivityType = "run" | "walk" | "cycle";
export type RaceStatus = "in-progress" | "completed" | "upcoming";

/** A single logged distance entry */
export interface ActivityEntry {
  id: number;
  raceId: string; // links to JoinedRace.id
  raceName: string;
  type: ActivityType;
  distance: number; // km
  date: string; // ISO date
  notes?: string;
}

/** A race the user has joined */
export interface JoinedRace {
  id: string;
  title: string;
  category: "5K" | "10K" | "Half Marathon" | "Marathon";
  targetDistance: number; // km
  loggedDistance: number; // km accumulated
  status: RaceStatus;
  date: string; // race event date
  image: string;
}

/** Completed race archive entry */
export interface CompletedRace {
  id: string;
  title: string;
  category: "5K" | "10K" | "Half Marathon" | "Marathon";
  totalDistance: number;
  completedDate: string;
  totalEntries: number;
  image: string;
}

/** Weekly bar-chart data point */
export interface WeeklyStat {
  day: string;
  distance: number;
}

/* ── Mock Data: Joined Races ── */

export const joinedRacesData: JoinedRace[] = [
  {
    id: "race-1",
    title: "Manila Sunrise Marathon 2026",
    category: "Marathon",
    targetDistance: 42.195,
    loggedDistance: 28.4,
    status: "in-progress",
    date: "March 15, 2026",
    image: "/Running.jpg",
  },
  {
    id: "race-2",
    title: "Cebu Island 10K Challenge",
    category: "10K",
    targetDistance: 10,
    loggedDistance: 10,
    status: "completed",
    date: "March 22, 2026",
    image: "/Running.jpg",
  },
  {
    id: "race-3",
    title: "BGC Night Run 5K",
    category: "5K",
    targetDistance: 5,
    loggedDistance: 0,
    status: "upcoming",
    date: "April 5, 2026",
    image: "/Running.jpg",
  },
  {
    id: "race-4",
    title: "Subic Bay Half Marathon",
    category: "Half Marathon",
    targetDistance: 21.0975,
    loggedDistance: 14.2,
    status: "in-progress",
    date: "May 10, 2026",
    image: "/Running.jpg",
  },
];

/* ── Mock Data: Activity Log entries ── */

export const activityLogData: ActivityEntry[] = [
  {
    id: 1,
    raceId: "race-1",
    raceName: "Manila Sunrise Marathon 2026",
    type: "run",
    distance: 8.2,
    date: "2025-06-18T06:30:00",
    notes: "Morning tempo run — felt strong",
  },
  {
    id: 2,
    raceId: "race-4",
    raceName: "Subic Bay Half Marathon",
    type: "run",
    distance: 5.0,
    date: "2025-06-17T07:00:00",
    notes: "Easy recovery run",
  },
  {
    id: 3,
    raceId: "race-1",
    raceName: "Manila Sunrise Marathon 2026",
    type: "run",
    distance: 6.8,
    date: "2025-06-15T06:00:00",
    notes: "Interval session on track",
  },
  {
    id: 4,
    raceId: "race-4",
    raceName: "Subic Bay Half Marathon",
    type: "walk",
    distance: 3.5,
    date: "2025-06-13T15:00:00",
    notes: "Afternoon walk",
  },
  {
    id: 5,
    raceId: "race-1",
    raceName: "Manila Sunrise Marathon 2026",
    type: "run",
    distance: 6.2,
    date: "2025-06-12T06:00:00",
  },
  {
    id: 6,
    raceId: "race-1",
    raceName: "Manila Sunrise Marathon 2026",
    type: "cycle",
    distance: 7.2,
    date: "2025-06-11T06:30:00",
    notes: "Cross-training ride",
  },
  {
    id: 7,
    raceId: "race-4",
    raceName: "Subic Bay Half Marathon",
    type: "run",
    distance: 5.7,
    date: "2025-06-10T06:30:00",
  },
  {
    id: 8,
    raceId: "race-2",
    raceName: "Cebu Island 10K Challenge",
    type: "run",
    distance: 4.5,
    date: "2025-06-08T06:00:00",
    notes: "Final push to finish 10K!",
  },
];

/* ── Mock Data: Completed Races ── */

export const completedRacesData: CompletedRace[] = [
  {
    id: "race-2",
    title: "Cebu Island 10K Challenge",
    category: "10K",
    totalDistance: 10,
    completedDate: "June 8, 2025",
    totalEntries: 3,
    image: "/Running.jpg",
  },
];

/* ── Mock Data: Weekly chart ── */

export const weeklyData: WeeklyStat[] = [
  { day: "Mon", distance: 8.2 },
  { day: "Tue", distance: 5.0 },
  { day: "Wed", distance: 0 },
  { day: "Thu", distance: 6.8 },
  { day: "Fri", distance: 3.5 },
  { day: "Sat", distance: 0 },
  { day: "Sun", distance: 6.2 },
];

/* ── Quick Stats (derived helpers) ── */

export function getQuickStats() {
  const activeRaces = joinedRacesData.filter((r) => r.status === "in-progress");
  const completed = joinedRacesData.filter((r) => r.status === "completed");
  const totalLogged = activityLogData.reduce((s, e) => s + e.distance, 0);
  const streak = 6; // mock streak

  return {
    totalLogged: Math.round(totalLogged * 10) / 10,
    activeCount: activeRaces.length,
    completedCount: completed.length,
    streak,
  };
}
