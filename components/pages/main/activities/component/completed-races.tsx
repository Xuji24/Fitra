"use client";

import Image from "next/image";
import type { CompletedRace } from "@/data/activities-data";

const CompletedRaces = ({ races }: { races: CompletedRace[] }) => {
  if (races.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
          Completed Races
        </h2>
        <span className="text-xs text-emerald-500 font-medium">
          {races.length} finished
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {races.map((race) => (
          <div
            key={race.id}
            className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-24 w-full">
              <Image
                src={race.image}
                alt={race.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              {/* Medal icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFB800]/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#FFB800]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white/80 uppercase tracking-widest bg-emerald-600/80 px-2 py-0.5 rounded">
                {race.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-sm text-[#1A1A1A] dark:text-white truncate mb-1">
                {race.title}
              </h3>
              <p className="text-xs text-[#1A1A1A]/40 dark:text-white/30 mb-3">
                Completed {race.completedDate}
              </p>

              <div className="flex justify-between text-xs">
                <div>
                  <span className="text-[#1A1A1A]/40 dark:text-white/30">
                    Distance
                  </span>
                  <p className="font-semibold text-[#1A1A1A] dark:text-white">
                    {race.totalDistance} km
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[#1A1A1A]/40 dark:text-white/30">
                    Entries
                  </span>
                  <p className="font-semibold text-[#1A1A1A] dark:text-white">
                    {race.totalEntries}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedRaces;
