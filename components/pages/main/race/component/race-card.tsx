"use client";

import Image from "next/image";
import { RaceEvent } from "@/utils/types/race-types";
import { CalendarDays, MapPin, Users, Clock } from "lucide-react";

interface RaceCardProps {
  race: RaceEvent;
  onViewDetails: (race: RaceEvent) => void;
}

function getDeadlineStatus(deadline: string): {
  label: string;
  color: string;
} {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) return { label: "Closed", color: "bg-gray-400" };
  if (daysLeft <= 3)
    return { label: "Closing Soon", color: "bg-amber-500" };
  if (daysLeft <= 7)
    return { label: `${daysLeft} days left`, color: "bg-orange-500" };
  return { label: "Open", color: "bg-orange-400" };
}

export default function RaceCard({ race, onViewDetails }: RaceCardProps) {
  const status = getDeadlineStatus(race.registrationDeadline);
  const spotsLeft = race.maxParticipants - race.participants;
  const isFull = spotsLeft <= 0;

  return (
    <div
      onClick={() => onViewDetails(race)}
      className="flex flex-col sm:flex-row bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-100 dark:border-white/8 overflow-hidden hover:shadow-md hover:shadow-[#FF5733]/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
        <Image
          src={race.image}
          alt={race.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-[#1A1A1A]/85 text-white text-xs font-raleway font-bold px-3 py-1 rounded-full">
          {race.category}
        </span>
        {/* Registration Status Badge */}
        <span
          className={`absolute top-3 right-3 ${isFull ? "bg-gray-400" : status.color} text-white text-xs font-raleway font-bold px-3 py-1 rounded-full`}
        >
          {isFull ? "Full" : status.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          {/* Title & Organizer */}
          <h3 className="font-raleway font-bold text-lg text-foreground mb-1 group-hover:text-[#FF5733] transition-colors">
            {race.title}
          </h3>
          <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400 mb-3">
            by {race.organizer}
          </p>

          {/* Description */}
          <p className="font-merriweather-sans text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {race.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 font-merriweather-sans">
          <span className="flex items-center gap-1">
            <CalendarDays size={14} className="text-[#FF5733]" />
            {race.date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-[#FF5733]" />
            {race.location}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} className="text-[#FF5733]" />
            {race.participants}/{race.maxParticipants}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-[#FF5733]" />
            Deadline: {race.registrationDeadline}
          </span>
        </div>
      </div>
    </div>
  );
}
