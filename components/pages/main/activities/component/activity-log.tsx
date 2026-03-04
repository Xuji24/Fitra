"use client";

import { activityLogData } from "@/data/activities-data";
import type { ActivityType } from "@/data/activities-data";

const typeLabels: Record<ActivityType, { label: string; cls: string }> = {
  run: { label: "Run", cls: "bg-[#FF5733]/10 text-[#FF5733]" },
  walk: { label: "Walk", cls: "bg-emerald-500/10 text-emerald-500" },
  cycle: { label: "Cycle", cls: "bg-blue-500/10 text-blue-500" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ActivityLog = () => {
  // Compute running total per entry (cumulative)
  const entries = activityLogData.reduce<
    (typeof activityLogData[number] & { cumulative: number })[]
  >((acc, entry) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
    acc.push({ ...entry, cumulative: Math.round((prev + entry.distance) * 10) / 10 });
    return acc;
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
          Activity Log
        </h2>
        <span className="text-xs text-[#1A1A1A]/40 dark:text-white/30 uppercase tracking-wider">
          {entries.length} entries
        </span>
      </div>

      {/* Table container */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[#F5F5F0] dark:bg-[#0D0D0D] text-xs font-semibold text-[#1A1A1A]/50 dark:text-white/30 uppercase tracking-wider">
          <span className="col-span-2">Date</span>
          <span className="col-span-3">Race</span>
          <span className="col-span-1">Type</span>
          <span className="col-span-2 text-right">Distance</span>
          <span className="col-span-2 text-right">Cumulative</span>
          <span className="col-span-2">Notes</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {entries.map((entry) => {
            const t = typeLabels[entry.type];
            return (
              <div
                key={entry.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-[#F5F5F0]/50 dark:hover:bg-[#2A2A2E]/50 transition-colors"
              >
                {/* Date */}
                <div className="md:col-span-2 text-sm text-[#1A1A1A] dark:text-white">
                  <span className="md:hidden text-xs text-[#1A1A1A]/40 dark:text-white/30 mr-2">
                    Date:
                  </span>
                  {formatDate(entry.date)}
                </div>

                {/* Race name */}
                <div className="md:col-span-3 text-sm text-[#1A1A1A] dark:text-white truncate">
                  <span className="md:hidden text-xs text-[#1A1A1A]/40 dark:text-white/30 mr-2">
                    Race:
                  </span>
                  {entry.raceName}
                </div>

                {/* Type badge */}
                <div className="md:col-span-1">
                  <span
                    className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.cls}`}
                  >
                    {t.label}
                  </span>
                </div>

                {/* Distance */}
                <div className="md:col-span-2 text-sm font-semibold text-[#FF5733] md:text-right">
                  <span className="md:hidden text-xs text-[#1A1A1A]/40 dark:text-white/30 mr-2 font-normal">
                    Distance:
                  </span>
                  {entry.distance} km
                </div>

                {/* Cumulative */}
                <div className="md:col-span-2 text-sm text-[#1A1A1A]/60 dark:text-white/40 md:text-right">
                  <span className="md:hidden text-xs text-[#1A1A1A]/40 dark:text-white/30 mr-2">
                    Total:
                  </span>
                  {entry.cumulative} km
                </div>

                {/* Notes */}
                <div className="md:col-span-2 text-xs text-[#1A1A1A]/40 dark:text-white/30 truncate">
                  {entry.notes || "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
