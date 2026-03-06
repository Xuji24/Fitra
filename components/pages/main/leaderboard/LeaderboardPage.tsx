import LeaderboardTable from "./component/leaderboard-table";
import LeaderboardPodium from "./component/leaderboard-podium";
import { leaderboardData } from "@/data/leaderboard-data";
import { createClient } from "@/lib/supabase/server";
import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/utils/types/leaderboard-types";

export default async function LeaderboardPage() {
  let entries: LeaderboardEntry[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("leaderboard_entries")
      .select(
        "rank, total_distance_km, avg_pace, last_run_date, profiles(full_name, username)",
      )
      .order("rank");

    if (data && data.length > 0) {
      entries = data.map((row) => {
        const profile = row.profiles as unknown as {
          full_name: string;
          username: string;
        } | null;
        return {
          rank: row.rank ?? 0,
          user: profile?.full_name ?? "Unknown",
          username: profile?.username ? `@${profile.username}` : "@unknown",
          pacing: row.avg_pace ?? "—",
          distance: `${Math.round(Number(row.total_distance_km))}km`,
          lastRun: row.last_run_date
            ? new Date(row.last_run_date).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })
            : "—",
        };
      });
    }
  } catch {
    // DB fetch failed — fall back to static data
  }

  if (entries.length === 0) {
    entries = leaderboardData;
  }

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121212]">
      {/* Hero Header */}
      <section className="relative bg-[#1A1A1A] dark:bg-[#0D0D0D] overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FF5733]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#FFB800]/8 rounded-full blur-2xl" />
        </div>

        <div className="relative px-6 sm:px-10 lg:px-16 xl:px-20 pt-10 pb-6">
          {/* Title Row */}
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-[#FFB800]" strokeWidth={2} />
            <h1 className="font-raleway font-bold text-2xl sm:text-3xl lg:text-4xl text-white">
              Weekly Leaderboard
            </h1>
          </div>
          <p className="font-merriweather-sans text-sm sm:text-base text-gray-400 mb-8">
            Top runners this week — track your rank and outpace the competition.
          </p>

          {/* Podium Section */}
          <LeaderboardPodium topThree={topThree} />
        </div>
      </section>

      {/* Rankings Table */}
      <section className="px-6 sm:px-10 lg:px-16 xl:px-20 py-10">
        <h2 className="font-raleway font-bold text-xl sm:text-2xl text-foreground mb-6">
          Full Rankings
        </h2>
        <LeaderboardTable topThree={topThree} remaining={remaining} />
      </section>
    </div>
  );
}
