"use client";

import { useEffect } from "react";
import Image from "next/image";
import { RaceEvent } from "@/utils/types/race-types";
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  X,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";

interface RaceModalProps {
  race: RaceEvent | null;
  onClose: () => void;
}

export default function RaceModal({ race, onClose }: RaceModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (race) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [race, onClose]);

  if (!race) return null;

  const spotsLeft = race.maxParticipants - race.participants;
  const isFull = spotsLeft <= 0;
  const deadlineDate = new Date(race.registrationDeadline);
  const isPastDeadline = deadlineDate < new Date();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-[#1C1C1E]/90 hover:bg-white dark:hover:bg-[#2A2A2E] rounded-full p-1.5 shadow-md transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} className="text-foreground" />
        </button>

        {/* Banner Image */}
        <div className="relative w-full h-52 sm:h-64">
          <Image
            src={race.image}
            alt={race.title}
            fill
            className="object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent rounded-t-2xl" />
          {/* Category Badge */}
          <span className="absolute bottom-4 left-5 bg-[#1A1A1A]/85 text-white text-sm font-raleway font-bold px-4 py-1.5 rounded-full">
            {race.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7">
          {/* Title */}
          <h2 className="font-raleway font-bold text-2xl sm:text-3xl text-foreground mb-1">
            {race.title}
          </h2>
          <p className="font-merriweather-sans text-sm text-gray-500 dark:text-gray-400 mb-5">
            Organized by{" "}
            <span className="font-semibold text-foreground">
              {race.organizer}
            </span>
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2.5 bg-[#F5F5F0] dark:bg-[#2A2A2E] rounded-lg p-3">
              <CalendarDays size={18} className="text-[#FF5733] shrink-0" />
              <div>
                <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400">
                  Date & Time
                </p>
                <p className="font-raleway font-bold text-sm text-foreground">
                  {race.date} — {race.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-[#F5F5F0] dark:bg-[#2A2A2E] rounded-lg p-3">
              <MapPin size={18} className="text-[#FF5733] shrink-0" />
              <div>
                <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="font-raleway font-bold text-sm text-foreground">
                  {race.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-[#F5F5F0] dark:bg-[#2A2A2E] rounded-lg p-3">
              <Users size={18} className="text-[#FF5733] shrink-0" />
              <div>
                <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400">
                  Participants
                </p>
                <p className="font-raleway font-bold text-sm text-foreground">
                  {race.participants} / {race.maxParticipants}
                  {spotsLeft > 0 && (
                    <span className="text-gray-500 dark:text-gray-400 font-normal">
                      {" "}
                      ({spotsLeft} spots left)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-[#F5F5F0] dark:bg-[#2A2A2E] rounded-lg p-3">
              <Clock size={18} className="text-[#FF5733] shrink-0" />
              <div>
                <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400">
                  Registration Deadline
                </p>
                <p className="font-raleway font-bold text-sm text-foreground">
                  {race.registrationDeadline}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-raleway font-bold text-base text-foreground mb-2 flex items-center gap-2">
              <Trophy size={16} className="text-[#FF5733]" />
              About This Race
            </h3>
            <p className="font-merriweather-sans text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {race.fullDescription}
            </p>
          </div>

          {/* Action Button */}
          <Button
            disabled={isFull || isPastDeadline || !race.registrationOpen}
            className="w-full py-4 rounded-lg bg-[#FF5733] text-white font-raleway font-bold text-base hover:bg-[#E84E2E] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isFull
              ? "Race is Full"
              : isPastDeadline
                ? "Registration Closed"
                : "Join Race"}
          </Button>
        </div>
      </div>
    </div>
  );
}
