"use client";

import { useState } from "react";
import {
  Plus,
  Trophy,
  Users,
  Calendar,
  MapPin,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Shirt,
  Medal,
  Award,
} from "lucide-react";
import CreateRaceModal from "./component/create-race-modal";
import EditRaceDesignsModal from "./component/edit-race-designs-modal";

export interface OrganizerRace {
  id: string;
  title: string;
  category: string;
  targetDistance: number;
  eventDate: string | null;
  imageUrl: string | null;
  registrationOpen: boolean;
  maxParticipants: number | null;
  registrationCount: number;
  tshirtDesignUrl: string | null;
  medalDesignUrl: string | null;
  certificateDesignUrl: string | null;
}

interface Props {
  races: OrganizerRace[];
}

export default function OrganizerDashboard({ races: initialRaces }: Props) {
  const [races, setRaces] = useState(initialRaces);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRace, setEditingRace] = useState<OrganizerRace | null>(null);

  const totalRegistrations = races.reduce(
    (sum, r) => sum + r.registrationCount,
    0
  );

  const handleRaceCreated = (newRace: OrganizerRace) => {
    setRaces((prev) => [newRace, ...prev]);
    setCreateOpen(false);
  };

  const handleDesignsUpdated = (raceId: string, updates: { tshirtDesignUrl?: string | null; medalDesignUrl?: string | null; certificateDesignUrl?: string | null }) => {
    setRaces((prev) =>
      prev.map((r) =>
        r.id === raceId ? { ...r, ...updates } : r
      )
    );
    setEditingRace(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121212]">
      {/* Hero Header */}
      <section className="relative bg-[#1A1A1A] dark:bg-[#0D0D0D] pt-28 pb-14 md:pt-32 md:pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-[#FFB800]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFB800]/20 bg-[#FFB800]/10 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
                <span className="text-[#FFB800] text-xs font-medium tracking-wide uppercase">
                  Organizer
                </span>
              </div>
              <h1 className="font-raleway text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Race{" "}
                <span className="text-[#FFB800]">Management</span>
              </h1>
              <p className="mt-3 text-white/50 text-sm md:text-base max-w-lg">
                Create and manage your virtual races. Track registrations and monitor your events.
              </p>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white font-raleway">
                  {races.length}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
                  Races
                </p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[#FFB800] font-raleway">
                  {totalRegistrations}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
                  Registrations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Actions bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
            Your Races
          </h2>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Race
          </button>
        </div>

        {/* Race Cards */}
        {races.length === 0 ? (
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 p-12 text-center">
            <Trophy className="w-10 h-10 text-[#FFB800]/40 mx-auto mb-4" />
            <h3 className="font-raleway font-bold text-base text-[#1A1A1A] dark:text-white mb-2">
              No Races Yet
            </h3>
            <p className="text-sm text-[#1A1A1A]/50 dark:text-white/40 font-merriweather-sans mb-6 max-w-sm mx-auto">
              Create your first virtual race and start accepting registrations from runners.
            </p>
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Your First Race
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {races.map((race) => (
              <div
                key={race.id}
                className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden hover:border-[#FFB800]/20 dark:hover:border-[#FFB800]/20 transition-all"
              >
                {/* Image placeholder */}
                <div className="h-32 bg-linear-to-br from-[#FF5733]/20 to-[#FFB800]/20 dark:from-[#FF5733]/10 dark:to-[#FFB800]/10 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-[#FF5733]/40" />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-raleway font-bold text-sm text-[#1A1A1A] dark:text-white truncate">
                        {race.title}
                      </h3>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF5733]/10 text-[#FF5733]">
                        {race.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {race.registrationOpen ? (
                        <ToggleRight className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-[#1A1A1A]/30 dark:text-white/30" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#1A1A1A]/60 dark:text-white/40">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{race.targetDistance} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {race.eventDate
                          ? new Date(race.eventDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )
                          : "Date TBD"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" />
                      <span>
                        {race.registrationCount}
                        {race.maxParticipants
                          ? ` / ${race.maxParticipants}`
                          : ""}{" "}
                        registered
                      </span>
                    </div>
                  </div>

                  {/* Design status indicators */}
                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shirt className={`w-3.5 h-3.5 ${race.tshirtDesignUrl ? "text-emerald-500" : "text-[#1A1A1A]/20 dark:text-white/20"}`} />
                        <Medal className={`w-3.5 h-3.5 ${race.medalDesignUrl ? "text-emerald-500" : "text-[#1A1A1A]/20 dark:text-white/20"}`} />
                        <Award className={`w-3.5 h-3.5 ${race.certificateDesignUrl ? "text-emerald-500" : "text-[#1A1A1A]/20 dark:text-white/20"}`} />
                      </div>
                      <button
                        onClick={() => setEditingRace(race)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#FF5733] hover:text-[#E84E2E] transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                        Designs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Create Race Modal */}
      <CreateRaceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleRaceCreated}
      />

      {/* Edit Race Designs Modal */}
      {editingRace && (
        <EditRaceDesignsModal
          race={editingRace}
          onClose={() => setEditingRace(null)}
          onUpdated={handleDesignsUpdated}
        />
      )}
    </div>
  );
}
