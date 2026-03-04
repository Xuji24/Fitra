/* ═══════════════════════════════════════════════
   Strava Mock Data — Simulates imported activities
   ═══════════════════════════════════════════════ */

export type StravaActivityType = "Run" | "Walk" | "Ride";

export interface StravaActivity {
  id: number;
  name: string;
  type: StravaActivityType;
  distance: number; // km
  movingTime: number; // seconds
  elapsedTime: number; // seconds
  startDate: string; // ISO date string
  averagePace: string; // e.g. "5:48/km"
  elevationGain: number; // meters
  calories: number;
  imported?: boolean; // tracks if already imported
}

/** Mock recent Strava activities */
export const stravaActivitiesData: StravaActivity[] = [
  {
    id: 101,
    name: "Morning Tempo Run",
    type: "Run",
    distance: 8.23,
    movingTime: 2868, // 47:48
    elapsedTime: 3120,
    startDate: "2026-03-04T06:15:00",
    averagePace: "5:48/km",
    elevationGain: 42,
    calories: 520,
  },
  {
    id: 102,
    name: "Easy Recovery Jog",
    type: "Run",
    distance: 4.12,
    movingTime: 1730, // 28:50
    elapsedTime: 1860,
    startDate: "2026-03-03T07:00:00",
    averagePace: "7:00/km",
    elevationGain: 18,
    calories: 265,
  },
  {
    id: 103,
    name: "Evening Walk with Dog",
    type: "Walk",
    distance: 2.8,
    movingTime: 2520, // 42:00
    elapsedTime: 2700,
    startDate: "2026-03-02T17:30:00",
    averagePace: "15:00/km",
    elevationGain: 8,
    calories: 140,
  },
  {
    id: 104,
    name: "Long Run — Marathon Prep",
    type: "Run",
    distance: 16.5,
    movingTime: 5940, // 1:39:00
    elapsedTime: 6300,
    startDate: "2026-03-01T05:30:00",
    averagePace: "6:00/km",
    elevationGain: 95,
    calories: 1050,
  },
  {
    id: 105,
    name: "Cycling Cross-Train",
    type: "Ride",
    distance: 22.4,
    movingTime: 3360, // 56:00
    elapsedTime: 3600,
    startDate: "2026-02-28T06:00:00",
    averagePace: "2:30/km",
    elevationGain: 120,
    calories: 580,
  },
  {
    id: 106,
    name: "Interval Track Session",
    type: "Run",
    distance: 6.0,
    movingTime: 1980, // 33:00
    elapsedTime: 2400,
    startDate: "2026-02-27T06:00:00",
    averagePace: "5:30/km",
    elevationGain: 12,
    calories: 410,
  },
  {
    id: 107,
    name: "Hill Repeats",
    type: "Run",
    distance: 5.5,
    movingTime: 2145, // 35:45
    elapsedTime: 2700,
    startDate: "2026-02-25T06:30:00",
    averagePace: "6:30/km",
    elevationGain: 180,
    calories: 390,
  },
  {
    id: 108,
    name: "Afternoon Power Walk",
    type: "Walk",
    distance: 3.2,
    movingTime: 2400, // 40:00
    elapsedTime: 2520,
    startDate: "2026-02-24T15:00:00",
    averagePace: "12:30/km",
    elevationGain: 15,
    calories: 165,
  },
];

/** Format seconds to "Xh Ym" or "Xm Ys" */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

/** Format ISO date to readable short form */
export function formatStravaDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
