"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import type { AdminRegistration } from "@/app/(admin)/admin/actions";
import CustomSelect from "@/components/ui/custom-select";

interface Props {
  registrations: AdminRegistration[];
}

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "in-progress": "bg-[#FFB800]/10 text-[#FFB800]",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export default function AdminRegistrationsPage({ registrations }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      !search ||
      (r.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (r.race_title?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (r.user_display_name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (r.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
          Registrations ({registrations.length})
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans w-40"
          />
          <CustomSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { value: "all", label: "All Status" },
              { value: "upcoming", label: "Upcoming" },
              { value: "in-progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
            className="w-40"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Participant
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Race
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Distance
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Details
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[#1A1A1A] dark:text-white">
                      {reg.full_name || reg.user_display_name}
                    </p>
                    <p className="text-[10px] text-[#1A1A1A]/40 dark:text-white/30">
                      {reg.email || "—"}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-[#1A1A1A]/70 dark:text-white/60">
                    {reg.race_title}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[reg.status] ?? ""}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#1A1A1A]/70 dark:text-white/60">
                    {reg.logged_distance} km
                  </td>
                  <td className="px-5 py-3.5 text-[10px] text-[#1A1A1A]/50 dark:text-white/30">
                    {reg.shirt_size && <span className="mr-2">Size: {reg.shirt_size}</span>}
                    {reg.payment_method && <span>Pay: {reg.payment_method}</span>}
                  </td>
                  <td className="px-5 py-3.5 text-[#1A1A1A]/60 dark:text-white/40">
                    {new Date(reg.registered_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#1A1A1A]/40 dark:text-white/30">
                    <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
