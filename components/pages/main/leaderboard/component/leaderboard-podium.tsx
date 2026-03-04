"use client";

import { LeaderboardEntry } from "@/utils/types/leaderboard-types";
import { Crown, Medal } from "lucide-react";

interface LeaderboardPodiumProps {
  topThree: LeaderboardEntry[];
}

const rankConfig = [
  {
    gradient: "from-[#FFB800] to-[#FF8C00]",
    bg: "bg-[#FFB800]",
    text: "text-[#FFB800]",
    border: "border-[#FFB800]",
    barHeight: "h-36 sm:h-44",
    label: "1st",
  },
  {
    gradient: "from-[#C0C0C0] to-[#8A8A8A]",
    bg: "bg-[#C0C0C0]",
    text: "text-[#C0C0C0]",
    border: "border-[#C0C0C0]",
    barHeight: "h-24 sm:h-32",
    label: "2nd",
  },
  {
    gradient: "from-[#CD7F32] to-[#8B4513]",
    bg: "bg-[#CD7F32]",
    text: "text-[#CD7F32]",
    border: "border-[#CD7F32]",
    barHeight: "h-20 sm:h-26",
    label: "3rd",
  },
];

function PodiumColumn({
  entry,
  config,
  isChampion,
}: {
  entry: LeaderboardEntry;
  config: (typeof rankConfig)[0];
  isChampion: boolean;
}) {
  return (
    <div className={`flex flex-col items-center ${isChampion ? "order-2" : entry.rank === 2 ? "order-1" : "order-3"}`}>
      {/* Crown or Medal Icon */}
      <div className="mb-2">
        {isChampion ? (
          <Crown size={28} className="text-[#FFB800]" strokeWidth={2} fill="#FFB800" />
        ) : (
          <Medal size={22} className={config.text} strokeWidth={1.5} />
        )}
      </div>

      {/* Avatar Circle */}
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 ${config.border} bg-[#2A2A2E] flex items-center justify-center mb-3`}
      >
        <span className="font-raleway font-bold text-xl sm:text-2xl text-white">
          {entry.user.charAt(0)}
        </span>
        {/* Rank Badge */}
        <div
          className={`absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-linear-to-br ${config.gradient} flex items-center justify-center shadow-md`}
        >
          <span className="font-raleway font-bold text-xs text-white">{entry.rank}</span>
        </div>
      </div>

      {/* Name & Username */}
      <p className={`font-raleway font-bold text-sm sm:text-base text-white ${isChampion ? "text-base sm:text-lg" : ""}`}>
        {entry.user}
      </p>
      <p className="font-merriweather-sans text-xs text-gray-400 mb-3">
        {entry.username}
      </p>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="text-center">
          <p className={`font-raleway font-bold text-sm sm:text-base ${config.text}`}>
            {entry.distance}
          </p>
          <p className="font-merriweather-sans text-[10px] text-gray-500 uppercase tracking-wide">
            Distance
          </p>
        </div>
        <div className="text-center">
          <p className="font-raleway font-bold text-sm sm:text-base text-white">
            {entry.pacing}
          </p>
          <p className="font-merriweather-sans text-[10px] text-gray-500 uppercase tracking-wide">
            Pace/km
          </p>
        </div>
      </div>

      {/* Podium Bar */}
      <div
        className={`w-24 sm:w-30 ${config.barHeight} bg-linear-to-t ${config.gradient} rounded-t-xl flex items-start justify-center pt-3 shadow-lg`}
      >
        <span className="font-raleway font-bold text-2xl sm:text-3xl text-white/90">
          {config.label}
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardPodium({ topThree }: LeaderboardPodiumProps) {
  if (topThree.length < 3) return null;

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6 pb-0">
      {/* Rank 2 (left) */}
      <PodiumColumn entry={topThree[1]} config={rankConfig[1]} isChampion={false} />

      {/* Rank 1 (center, tallest) */}
      <PodiumColumn entry={topThree[0]} config={rankConfig[0]} isChampion={true} />

      {/* Rank 3 (right) */}
      <PodiumColumn entry={topThree[2]} config={rankConfig[2]} isChampion={false} />
    </div>
  );
}
