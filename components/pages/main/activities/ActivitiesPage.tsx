"use client";

import { useState } from "react";
import ActivityStats from "./component/activity-stats";
import WeeklySummary from "./component/weekly-summary";
import MyActiveRaces from "./component/my-active-races";
import LogActivityPanel from "./component/log-activity-panel";
import ActivityLog from "./component/activity-log";
import RaceProgressOverview from "./component/race-progress-overview";
import CompletedRaces from "./component/completed-races";
import type {
  JoinedRace,
  ActivityEntry,
  CompletedRace,
  WeeklyStat,
} from "@/data/activities-data";

interface QuickStats {
  totalLogged: number;
  activeCount: number;
  completedCount: number;
  streak: number;
}

interface ActivitiesPageProps {
  joinedRaces: JoinedRace[];
  activityLog: ActivityEntry[];
  completedRaces: CompletedRace[];
  weeklyData: WeeklyStat[];
  quickStats: QuickStats;
}

const ActivitiesPage = ({
  joinedRaces,
  activityLog,
  completedRaces,
  weeklyData,
  quickStats,
}: ActivitiesPageProps) => {
  const [logOpen, setLogOpen] = useState(false);
  const [selectedRaceId, setSelectedRaceId] = useState<string | undefined>();

  const inProgressRaces = joinedRaces.filter((r) => r.status === "in-progress");

  const handleLogDistance = (raceId: string) => {
    setSelectedRaceId(raceId);
    setLogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121212]">
      {/* Hero Header */}
      <section className="relative bg-[#1A1A1A] dark:bg-[#0D0D0D] pt-28 pb-14 md:pt-32 md:pb-16">
        {/* Radial glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-[#FF5733]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF5733]/20 bg-[#FF5733]/10 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5733] animate-pulse" />
                <span className="text-[#FF5733] text-xs font-medium tracking-wide uppercase">
                  Your Activity
                </span>
              </div>
              <h1 className="font-raleway text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Activity <span className="text-[#FF5733]">Dashboard</span>
              </h1>
              <p className="mt-3 text-white/50 text-sm md:text-base max-w-lg">
                Track your workouts, log distances to your virtual races, and
                watch your progress grow.
              </p>
            </div>

            {/* Quick hero stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white font-raleway">
                  {quickStats.totalLogged}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
                  km logged
                </p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white font-raleway">
                  {quickStats.activeCount}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
                  active races
                </p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[#FFB800] font-raleway">
                  {quickStats.streak}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
                  day streak
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        {/* 1. Quick Stats */}
        <ActivityStats stats={quickStats} />

        {/* 2. My Active Races (horizontal scroll) */}
        <MyActiveRaces races={joinedRaces} onLogDistance={handleLogDistance} />

        {/* 3. Weekly Summary + Race Progress side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WeeklySummary data={weeklyData} />
          </div>
          <div>
            <RaceProgressOverview
              joinedRaces={joinedRaces}
              weeklyData={weeklyData}
            />
          </div>
        </div>

        {/* 4. Activity Log */}
        <ActivityLog entries={activityLog} />

        {/* 5. Completed Races */}
        <CompletedRaces races={completedRaces} />
      </section>

      {/* Log Activity Modal */}
      <LogActivityPanel
        open={logOpen}
        preselectedRaceId={selectedRaceId}
        inProgressRaces={inProgressRaces}
        onClose={() => {
          setLogOpen(false);
          setSelectedRaceId(undefined);
        }}
      />
    </div>
  );
};

export default ActivitiesPage;
