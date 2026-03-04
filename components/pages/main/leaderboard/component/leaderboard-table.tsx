import { LeaderboardEntry } from "@/utils/types/leaderboard-types";
import { Calendar, Gauge } from "lucide-react";

interface LeaderboardTableProps {
  topThree: LeaderboardEntry[];
  remaining: LeaderboardEntry[];
}

const rankBadgeColor: Record<number, string> = {
  1: "bg-linear-to-br from-[#FFB800] to-[#FF8C00] text-white",
  2: "bg-linear-to-br from-[#C0C0C0] to-[#8A8A8A] text-white",
  3: "bg-linear-to-br from-[#CD7F32] to-[#8B4513] text-white",
};

function RankBadge({ rank }: { rank: number }) {
  const style =
    rankBadgeColor[rank] ??
    "bg-gray-100 dark:bg-[#2A2A2E] text-foreground";

  return (
    <div
      className={`w-9 h-9 rounded-full ${style} flex items-center justify-center font-raleway font-bold text-sm shadow-sm`}
    >
      {rank}
    </div>
  );
}

function LeaderboardRow({ entry, maxDistance }: { entry: LeaderboardEntry; maxDistance: number }) {
  const distNum = parseFloat(entry.distance);
  const pct = maxDistance > 0 ? (distNum / maxDistance) * 100 : 0;
  const isTopThree = entry.rank <= 3;

  return (
    <div
      className={`flex items-center gap-4 px-4 sm:px-6 py-4 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-[#2A2A2E] ${
        isTopThree ? "bg-[#FF5733]/5 dark:bg-[#FF5733]/5" : ""
      }`}
    >
      {/* Rank Badge */}
      <RankBadge rank={entry.rank} />

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#1A1A1A] dark:bg-[#2A2A2E] flex items-center justify-center shrink-0">
        <span className="font-raleway font-bold text-sm text-white">
          {entry.user.charAt(0)}
        </span>
      </div>

      {/* Name & Username */}
      <div className="min-w-24 sm:min-w-32">
        <p className="font-raleway font-bold text-sm text-foreground leading-tight">
          {entry.user}
        </p>
        <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400">
          {entry.username}
        </p>
      </div>

      {/* Distance Bar */}
      <div className="flex-1 hidden sm:block">
        <div className="flex items-center justify-between mb-1">
          <span className="font-raleway font-bold text-sm text-foreground">
            {entry.distance}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-[#2A2A2E] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              isTopThree
                ? "bg-linear-to-r from-[#FF5733] to-[#FFB800]"
                : "bg-linear-to-r from-[#FF5733]/60 to-[#FF5733]/30"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Distance (mobile only) */}
      <div className="sm:hidden">
        <p className="font-raleway font-bold text-sm text-foreground">
          {entry.distance}
        </p>
      </div>

      {/* Pacing */}
      <div className="hidden md:flex items-center gap-1.5 min-w-20">
        <Gauge size={14} className="text-gray-400" />
        <span className="font-merriweather-sans text-sm text-foreground">
          {entry.pacing}/km
        </span>
      </div>

      {/* Last Run */}
      <div className="hidden lg:flex items-center gap-1.5 min-w-24">
        <Calendar size={14} className="text-gray-400" />
        <span className="font-merriweather-sans text-sm text-gray-600 dark:text-gray-400">
          {entry.lastRun}
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardTable({ topThree, remaining }: LeaderboardTableProps) {
  const allEntries = [...topThree, ...remaining];
  const maxDistance = Math.max(...allEntries.map((e) => parseFloat(e.distance)));

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center gap-4 px-4 sm:px-6 py-3 bg-gray-50 dark:bg-[#1A1A1A] border-b border-gray-100 dark:border-white/5">
        <div className="w-9" />
        <div className="w-10" />
        <div className="min-w-24 sm:min-w-32">
          <span className="font-raleway font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Runner
          </span>
        </div>
        <div className="flex-1 hidden sm:block">
          <span className="font-raleway font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Distance
          </span>
        </div>
        <div className="sm:hidden">
          <span className="font-raleway font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Dist.
          </span>
        </div>
        <div className="hidden md:block min-w-20">
          <span className="font-raleway font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Pace
          </span>
        </div>
        <div className="hidden lg:block min-w-24">
          <span className="font-raleway font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Last Run
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {allEntries.map((entry) => (
          <LeaderboardRow key={entry.rank} entry={entry} maxDistance={maxDistance} />
        ))}
      </div>
    </div>
  );
}
