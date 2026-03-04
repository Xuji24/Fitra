"use client";

import { getQuickStats } from "@/data/activities-data";
import type { ReactNode } from "react";

interface StatCard {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: string; // accent color override
}

const ActivityStats = () => {
  const stats = getQuickStats();

  const cards: StatCard[] = [
    {
      label: "Distance Logged",
      value: `${stats.totalLogged} km`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: "Active Races",
      value: stats.activeCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: stats.completedCount,
      accent: "emerald",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Day Streak",
      value: stats.streak,
      accent: "gold",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
    },
  ];

  function accentClasses(accent?: string) {
    if (accent === "emerald") return { icon: "bg-emerald-500/10 text-emerald-500" };
    if (accent === "gold") return { icon: "bg-[#FFB800]/10 text-[#FFB800]" };
    return { icon: "bg-[#FF5733]/10 text-[#FF5733]" };
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const ac = accentClasses(card.accent);
        return (
          <div
            key={card.label}
            className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 border border-black/5 dark:border-white/5 hover:border-[#FF5733]/20 dark:hover:border-[#FF5733]/20 transition-all"
          >
            <div className={`w-9 h-9 rounded-xl ${ac.icon} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A] dark:text-white font-raleway">
              {card.value}
            </p>
            <p className="text-sm text-[#1A1A1A]/50 dark:text-white/40 mt-1">
              {card.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityStats;
