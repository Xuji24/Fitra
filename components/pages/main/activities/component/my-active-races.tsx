"use client";

import Image from "next/image";
import { joinedRacesData } from "@/data/activities-data";
import type { JoinedRace } from "@/data/activities-data";

const statusStyles: Record<JoinedRace["status"], { label: string; cls: string }> =
  {
    "in-progress": {
      label: "In Progress",
      cls: "bg-[#FF5733]/10 text-[#FF5733]",
    },
    completed: {
      label: "Completed",
      cls: "bg-emerald-500/10 text-emerald-500",
    },
    upcoming: {
      label: "Upcoming",
      cls: "bg-[#FFB800]/10 text-[#FFB800]",
    },
  };

interface Props {
  onLogDistance?: (raceId: string) => void;
}

const MyActiveRaces = ({ onLogDistance }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
          My Races
        </h2>
        <span className="text-xs text-[#1A1A1A]/40 dark:text-white/30 uppercase tracking-wider">
          {joinedRacesData.length} joined
        </span>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
        {joinedRacesData.map((race) => {
          const progress = Math.min(
            (race.loggedDistance / race.targetDistance) * 100,
            100
          );
          const style = statusStyles[race.status];

          return (
            <div
              key={race.id}
              className="min-w-70 sm:min-w-80 snap-start bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 hover:border-[#FF5733]/20 dark:hover:border-[#FF5733]/20 transition-all overflow-hidden shrink-0"
            >
              {/* Race image */}
              <div className="relative h-28 w-full">
                <Image
                  src={race.image}
                  alt={race.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                {/* Status badge */}
                <span
                  className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.cls}`}
                >
                  {style.label}
                </span>
                {/* Category */}
                <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white/80 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded">
                  {race.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#1A1A1A] dark:text-white truncate mb-1">
                  {race.title}
                </h3>
                <p className="text-xs text-[#1A1A1A]/40 dark:text-white/30 mb-3">
                  {race.date}
                </p>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#FF5733]">
                      {race.loggedDistance} km
                    </span>
                    <span className="text-[#1A1A1A]/40 dark:text-white/30">
                      {race.targetDistance} km
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        race.status === "completed"
                          ? "bg-emerald-500"
                          : "bg-[#FF5733]"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#1A1A1A]/30 dark:text-white/20 mt-1 text-right">
                    {Math.round(progress)}% complete
                  </p>
                </div>

                {/* Log Distance button */}
                {race.status === "in-progress" && (
                  <button
                    onClick={() => onLogDistance?.(race.id)}
                    className="w-full py-2 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    + Log Distance
                  </button>
                )}
                {race.status === "upcoming" && (
                  <div className="w-full py-2 rounded-xl bg-[#FFB800]/10 text-[#FFB800] text-xs font-semibold text-center">
                    Starts {race.date}
                  </div>
                )}
                {race.status === "completed" && (
                  <div className="w-full py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold text-center">
                    Race Completed!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyActiveRaces;
