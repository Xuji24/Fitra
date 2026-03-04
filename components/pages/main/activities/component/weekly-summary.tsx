"use client";

import { weeklyData } from "@/data/activities-data";

const WeeklySummary = () => {
  const maxDistance = Math.max(...weeklyData.map((d) => d.distance));
  const totalDistance = weeklyData.reduce((sum, d) => sum + d.distance, 0);
  const activeDays = weeklyData.filter((d) => d.distance > 0).length;

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
            Weekly Summary
          </h2>
          <p className="text-sm text-[#1A1A1A]/50 dark:text-white/40 mt-0.5">
            Jun 12 – Jun 18, 2025
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-[#FF5733]">{totalDistance.toFixed(1)} km</p>
            <p className="text-xs text-[#1A1A1A]/40 dark:text-white/30 uppercase tracking-wider">
              Total
            </p>
          </div>
          <div className="w-px bg-black/10 dark:bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-bold text-[#1A1A1A] dark:text-white">{activeDays}/7</p>
            <p className="text-xs text-[#1A1A1A]/40 dark:text-white/30 uppercase tracking-wider">
              Active
            </p>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 sm:gap-4 h-40">
        {weeklyData.map((day) => {
          const heightPercent = maxDistance > 0 ? (day.distance / maxDistance) * 100 : 0;
          const isToday = day.day === "Wed"; // simulated
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-[#1A1A1A]/60 dark:text-white/40">
                {day.distance > 0 ? `${day.distance}` : "—"}
              </span>
              <div className="w-full flex justify-center">
                <div
                  className={`w-full max-w-10 rounded-lg transition-all ${
                    day.distance > 0
                      ? "bg-[#FF5733]"
                      : "bg-black/5 dark:bg-white/5"
                  } ${isToday ? "ring-2 ring-[#FFB800] ring-offset-2 ring-offset-white dark:ring-offset-[#1C1C1E]" : ""}`}
                  style={{ height: `${Math.max(heightPercent, 6)}%` }}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  isToday
                    ? "text-[#FF5733] font-bold"
                    : "text-[#1A1A1A]/50 dark:text-white/40"
                }`}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySummary;
