import Navbar from "@/components/navbar";
import LeaderboardTable from "./component/leaderboard-table";
import LeaderboardPodium from "./component/leaderboard-podium";
import { leaderboardData } from "@/data/leaderboard-data";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const topThree = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121212]">
      <Navbar />

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
