"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RaceEvent } from "@/utils/types/race-types";
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  Gift,
  Shirt,
} from "lucide-react";
import { Button } from "@/components/shadcn/button";
import Navbar from "@/components/navbar";
import JoinRaceModal from "./component/join-race-modal";
import ShareRacePopover from "./component/share-race-popover";

interface Props {
  race: RaceEvent;
}

export default function RaceDetailPage({ race }: Props) {
  const [joinOpen, setJoinOpen] = useState(false);
  const spotsLeft = race.maxParticipants - race.participants;
  const isFull = spotsLeft <= 0;
  const deadlineDate = new Date(race.registrationDeadline);
  const isPastDeadline = deadlineDate < new Date();
  const fillPercentage = (race.participants / race.maxParticipants) * 100;
  const canRegister = !isFull && !isPastDeadline && race.registrationOpen;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner Image */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96">
        <Image
          src={race.image}
          alt={race.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-6 left-6 bg-[#1A1A1A]/85 text-white text-sm font-raleway font-bold px-4 py-1.5 rounded-full">
          {race.category}
        </span>

        {/* Back Button */}
        <Link
          href="/race"
          className="absolute top-6 right-6 bg-white/90 dark:bg-[#1C1C1E]/90 hover:bg-white dark:hover:bg-[#2A2A2E] rounded-full p-2 shadow-md transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </Link>

        {/* Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="font-raleway font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-1 drop-shadow-lg">
            {race.title}
          </h1>
          <p className="font-merriweather-sans text-sm sm:text-base text-white/80">
            Organized by{" "}
            <span className="font-semibold text-white">{race.organizer}</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content — Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-[#F5F5F0] dark:bg-[#1C1C1E] rounded-xl p-4 border border-gray-100 dark:border-white/8">
                <CalendarDays size={20} className="text-[#FF5733] shrink-0" />
                <div>
                  <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400">
                    Date & Time
                  </p>
                  <p className="font-raleway font-bold text-sm text-foreground">
                    {race.date} — {race.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F5F5F0] dark:bg-[#1C1C1E] rounded-xl p-4 border border-gray-100 dark:border-white/8">
                <MapPin size={20} className="text-[#FF5733] shrink-0" />
                <div>
                  <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="font-raleway font-bold text-sm text-foreground">
                    {race.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F5F5F0] dark:bg-[#1C1C1E] rounded-xl p-4 border border-gray-100 dark:border-white/8">
                <Users size={20} className="text-[#FF5733] shrink-0" />
                <div>
                  <p className="font-merriweather-sans text-xs text-gray-500 dark:text-gray-400">
                    Participants
                  </p>
                  <p className="font-raleway font-bold text-sm text-foreground">
                    {race.participants} / {race.maxParticipants}
                    {spotsLeft > 0 && (
                      <span className="text-gray-500 dark:text-gray-400 font-normal text-xs ml-1">
                        ({spotsLeft} left)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F5F5F0] dark:bg-[#1C1C1E] rounded-xl p-4 border border-gray-100 dark:border-white/8">
                <Clock size={20} className="text-[#FF5733] shrink-0" />
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

            {/* About */}
            <div>
              <h2 className="font-raleway font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                <Trophy size={18} className="text-[#FF5733]" />
                About This Race
              </h2>
              <p className="font-merriweather-sans text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {race.fullDescription}
              </p>
            </div>

            {/* E-Certificate */}
            <div className="bg-gradient-to-br from-[#FFF8F5] to-[#FFF1EB] dark:from-[#1C1C1E] dark:to-[#221A16] rounded-2xl p-6 border border-[#FF5733]/10 dark:border-[#FF5733]/20">
              <h2 className="font-raleway font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Award size={18} className="text-[#FF5733]" />
                E-Certificate
              </h2>
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Certificate Preview */}
                <div className="shrink-0 w-full sm:w-56 bg-white dark:bg-[#2A2A2E] rounded-xl border border-[#FF5733]/15 dark:border-[#FF5733]/25 overflow-hidden">
                  <Image
                    src="/icons/ecert-template.svg"
                    alt="E-Certificate Template"
                    width={500}
                    height={350}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-raleway font-bold text-base text-foreground mb-1.5">
                    {race.rewards.eCertificate.title}
                  </h3>
                  <p className="font-merriweather-sans text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {race.rewards.eCertificate.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Medal */}
            <div className="bg-gradient-to-br from-[#FFFDF5] to-[#FFF8E5] dark:from-[#1C1C1E] dark:to-[#1E1C14] rounded-2xl p-6 border border-[#FFB800]/10 dark:border-[#FFB800]/20">
              <h2 className="font-raleway font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Medal size={18} className="text-[#FFB800]" />
                Finisher&apos;s Medal
              </h2>
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Medal Preview */}
                <div className="shrink-0 w-full sm:w-44 bg-white dark:bg-[#2A2A2E] rounded-xl border border-[#FFB800]/15 dark:border-[#FFB800]/25 overflow-hidden p-3">
                  <Image
                    src="/icons/medal-template.svg"
                    alt="Medal Template"
                    width={400}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-raleway font-bold text-base text-foreground mb-1.5">
                    {race.rewards.medal.name}
                  </h3>
                  <p className="font-merriweather-sans text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {race.rewards.medal.description}
                  </p>
                </div>
              </div>
            </div>

            {/* T-Shirt Design */}
            <div className="bg-gradient-to-br from-[#F5FFF5] to-[#EEFAEE] dark:from-[#1C1C1E] dark:to-[#161E16] rounded-2xl p-6 border border-emerald-500/10 dark:border-emerald-500/20">
              <h2 className="font-raleway font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Shirt size={18} className="text-emerald-500" />
                Event T-Shirt
              </h2>
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="shrink-0 w-full sm:w-44 bg-white dark:bg-[#2A2A2E] rounded-xl border border-emerald-500/15 dark:border-emerald-500/25 overflow-hidden p-3">
                  <Image
                    src="/icons/tshirt-template.svg"
                    alt="T-Shirt Template"
                    width={400}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-raleway font-bold text-base text-foreground mb-1.5">
                    Official Race T-Shirt
                  </h3>
                  <p className="font-merriweather-sans text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Premium performance tech shirt included for all registered participants. Available in sizes S to 2XL. Select your size during registration.
                  </p>
                </div>
              </div>
            </div>

            {/* Prizes */}
            {race.rewards.prizes && race.rewards.prizes.length > 0 && (
              <div>
                <h2 className="font-raleway font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                  <Gift size={18} className="text-[#FF5733]" />
                  Prizes & Inclusions
                </h2>
                <ul className="space-y-2.5">
                  {race.rewards.prizes.map((prize, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 bg-[#F5F5F0] dark:bg-[#1C1C1E] rounded-lg p-3 border border-gray-100 dark:border-white/8"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FF5733]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="font-raleway font-bold text-xs text-[#FF5733]">
                          {index + 1}
                        </span>
                      </div>
                      <p className="font-merriweather-sans text-sm text-foreground">
                        {prize}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar — Right 1/3 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              {/* Registration Card */}
              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 border border-gray-100 dark:border-white/8 shadow-sm">
                <h3 className="font-raleway font-bold text-base text-foreground mb-4">
                  Registration
                </h3>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-merriweather-sans text-gray-500 dark:text-gray-400 mb-1.5">
                    <span>{race.participants} joined</span>
                    <span>{race.maxParticipants} max</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#FF5733] transition-all duration-500"
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    />
                  </div>
                  {spotsLeft > 0 && (
                    <p className="text-xs font-merriweather-sans text-[#FF5733] mt-1.5 font-semibold">
                      {spotsLeft} spots remaining
                    </p>
                  )}
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-5">
                  <Clock size={14} className="text-[#FF5733]" />
                  <span className="font-merriweather-sans">
                    Deadline:{" "}
                    <span className="font-semibold">
                      {race.registrationDeadline}
                    </span>
                  </span>
                </div>

                {/* Join Button */}
                <Button
                  onClick={() => setJoinOpen(true)}
                  disabled={!canRegister}
                  className="w-full py-4 rounded-xl bg-[#FF5733] text-white font-raleway font-bold text-base hover:bg-[#E84E2E] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isFull
                    ? "Race is Full"
                    : isPastDeadline
                      ? "Registration Closed"
                      : !race.registrationOpen
                        ? "Registration Closed"
                        : "Join Race"}
                </Button>

                {/* Share */}
                <div className="mt-3">
                  <ShareRacePopover
                    url={typeof window !== "undefined" ? window.location.href : `/race/${race.id}`}
                    title={race.title}
                  />
                </div>
              </div>

              {/* Organizer Card */}
              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 border border-gray-100 dark:border-white/8 shadow-sm">
                <h3 className="font-raleway font-bold text-base text-foreground mb-3">
                  Organizer
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F0] dark:bg-[#2A2A2E] flex items-center justify-center overflow-hidden">
                    <Image
                      src={race.organizerLogo}
                      alt={race.organizer}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="font-raleway font-bold text-sm text-foreground">
                    {race.organizer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/8">
          <Link
            href="/race"
            className="inline-flex items-center gap-2 text-sm font-raleway font-semibold text-[#FF5733] hover:text-[#E84E2E] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to All Races
          </Link>
        </div>
      </div>

      {/* Join Race Modal */}
      <JoinRaceModal race={race} open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
