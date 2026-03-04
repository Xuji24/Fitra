"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import RaceCard from "./component/race-card";
import RaceFilter from "./component/race-filter";
import RaceModal from "./component/race-modal";
import { RaceEvent, RaceCategory } from "@/utils/types/race-types";
import { racesData } from "@/data/races-data";

export default function RacePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<RaceCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRace, setSelectedRace] = useState<RaceEvent | null>(null);

  const filteredRaces = useMemo(() => {
    return racesData.filter((race) => {
      const matchesCategory =
        selectedCategory === "All" || race.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        race.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        race.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        race.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-6 sm:px-10 lg:px-16 xl:px-20 py-8 sm:py-10">
        {/* Title */}
        <h1 className="font-raleway font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-2">
          Upcoming Races
        </h1>
        <p className="font-merriweather-sans text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8">
          Browse and join races happening near you
        </p>

        {/* Filters & Search */}
        <RaceFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Race Cards */}
        {filteredRaces.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredRaces.map((race) => (
              <RaceCard
                key={race.id}
                race={race}
                onViewDetails={setSelectedRace}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-raleway font-bold text-xl text-gray-400 dark:text-gray-500 mb-2">
              No races found
            </p>
            <p className="font-merriweather-sans text-sm text-gray-400 dark:text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>

      {/* Race Detail Modal */}
      <RaceModal race={selectedRace} onClose={() => setSelectedRace(null)} />
    </div>
  );
}
