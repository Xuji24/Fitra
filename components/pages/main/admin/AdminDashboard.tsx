"use client";

import {
  Users,
  Trophy,
  ClipboardList,
  Mail,
  FileCheck,
  Handshake,
} from "lucide-react";
import Link from "next/link";
import type { AdminStats } from "@/app/(admin)/admin/actions";

interface Props {
  stats: AdminStats;
}

const statCards = [
  { key: "totalUsers" as const, label: "Total Users", icon: Users, href: "/admin/users", color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "totalRaces" as const, label: "Total Races", icon: Trophy, href: "/admin/races", color: "text-[#FF5733]", bg: "bg-[#FF5733]/10" },
  { key: "totalRegistrations" as const, label: "Registrations", icon: ClipboardList, href: "/admin/registrations", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { key: "totalContacts" as const, label: "Contact Messages", icon: Mail, href: "/admin/contacts", color: "text-purple-500", bg: "bg-purple-500/10" },
  { key: "pendingApplications" as const, label: "Pending Applications", icon: FileCheck, href: "/admin/applications", color: "text-[#FFB800]", bg: "bg-[#FFB800]/10" },
  { key: "totalSponsors" as const, label: "Sponsors", icon: Handshake, href: "/admin/sponsors", color: "text-pink-500", bg: "bg-pink-500/10" },
];

export default function AdminDashboard({ stats }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway mb-6">
        Platform Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map(({ key, label, icon: Icon, href, color, bg }) => (
          <Link
            key={key}
            href={href}
            className="group bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 p-5 hover:border-[#FF5733]/20 dark:hover:border-[#FF5733]/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A] dark:text-white font-raleway">
                  {stats[key]}
                </p>
                <p className="text-xs text-[#1A1A1A]/50 dark:text-white/40 font-medium">
                  {label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white font-raleway mb-4 uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.pendingApplications > 0 && (
            <Link
              href="/admin/applications"
              className="flex items-center gap-3 p-4 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/20 hover:bg-[#FFB800]/20 transition-colors"
            >
              <FileCheck className="w-5 h-5 text-[#FFB800]" />
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
                  {stats.pendingApplications} pending application{stats.pendingApplications !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-[#1A1A1A]/50 dark:text-white/40">
                  Review organizer applications
                </p>
              </div>
            </Link>
          )}
          <Link
            href="/admin/contacts"
            className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
          >
            <Mail className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
                {stats.totalContacts} contact message{stats.totalContacts !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-[#1A1A1A]/50 dark:text-white/40">
                View contact submissions
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
