"use client";

import { useState } from "react";
import { ToggleLeft, ToggleRight, Trash2, MapPin, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import type { AdminRace } from "@/app/(admin)/admin/actions";
import { toggleRaceRegistration, deleteRace } from "@/app/(admin)/admin/actions";

interface Props {
  races: AdminRace[];
}

export default function AdminRacesPage({ races: initialRaces }: Props) {
  const [races, setRaces] = useState(initialRaces);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = races.filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.category?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (r.location?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const handleToggle = async (raceId: string, currentOpen: boolean) => {
    const result = await toggleRaceRegistration(raceId, !currentOpen);
    if (result.success) {
      setRaces((prev) =>
        prev.map((r) =>
          r.id === raceId ? { ...r, registration_open: !currentOpen } : r
        )
      );
      toast.success(`Registration ${!currentOpen ? "opened" : "closed"}.`);
    } else {
      toast.error(result.error ?? "Failed to update.");
    }
  };

  const handleDelete = async (raceId: string) => {
    if (!confirm("Are you sure you want to delete this race? This action cannot be undone.")) return;
    setDeleting(raceId);
    const result = await deleteRace(raceId);
    if (result.success) {
      setRaces((prev) => prev.filter((r) => r.id !== raceId));
      toast.success("Race deleted.");
    } else {
      toast.error(result.error ?? "Failed to delete.");
    }
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
          Races ({races.length})
        </h2>
        <input
          type="text"
          placeholder="Search races..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans w-48"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((race) => (
          <div
            key={race.id}
            className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 p-5 hover:border-[#FF5733]/20 dark:hover:border-[#FF5733]/20 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <h3 className="font-raleway font-bold text-sm text-[#1A1A1A] dark:text-white truncate">
                  {race.title}
                </h3>
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF5733]/10 text-[#FF5733]">
                  {race.category}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(race.id, race.registration_open)}
                  className="cursor-pointer"
                  title={race.registration_open ? "Close registration" : "Open registration"}
                >
                  {race.registration_open ? (
                    <ToggleRight className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-[#1A1A1A]/30 dark:text-white/30" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(race.id)}
                  disabled={deleting === race.id}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#1A1A1A]/30 dark:text-white/30 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete race"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-[#1A1A1A]/60 dark:text-white/40">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{race.location || "No location"} &middot; {race.target_distance_km} km</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {race.event_date
                    ? new Date(race.event_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Date TBD"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {race.registration_count}
                  {race.max_participants ? ` / ${race.max_participants}` : ""} registered
                </span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 p-10 text-center text-[#1A1A1A]/40 dark:text-white/30">
            No races found.
          </div>
        )}
      </div>
    </div>
  );
}
