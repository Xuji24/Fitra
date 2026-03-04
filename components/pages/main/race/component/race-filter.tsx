"use client";

import { RaceCategory } from "@/utils/types/race-types";

interface RaceFilterProps {
  selectedCategory: RaceCategory;
  onCategoryChange: (category: RaceCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const categories: RaceCategory[] = [
  "All",
  "5K",
  "10K",
  "Half Marathon",
  "Marathon",
];

export default function RaceFilter({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: RaceFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-raleway font-bold transition-all duration-200 cursor-pointer
              ${
                selectedCategory === category
                  ? "bg-[#FF5733] text-white shadow-md shadow-[#FF5733]/25"
                  : "bg-white dark:bg-[#1C1C1E] text-foreground border border-gray-200 dark:border-white/10 hover:border-[#FF5733]/40 dark:hover:border-[#FF5733]/40 hover:bg-gray-50 dark:hover:bg-[#2A2A2E]"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-72">
        <input
          type="text"
          placeholder="Search races..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-merriweather-sans text-foreground placeholder:text-gray-400 bg-white dark:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#FF5733] focus:border-transparent transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    </div>
  );
}
