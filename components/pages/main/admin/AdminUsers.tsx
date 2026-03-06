"use client";

import { useState } from "react";
import { Shield, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import type { AdminUser } from "@/app/(admin)/admin/actions";
import { updateUserRole } from "@/app/(admin)/admin/actions";
import CustomSelect from "@/components/ui/custom-select";

interface Props {
  users: AdminUser[];
}

const roleBadge: Record<string, { label: string; class: string; icon: typeof User }> = {
  runner: { label: "Runner", class: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: User },
  organizer: { label: "Organizer", class: "bg-[#FFB800]/10 text-[#FFB800]", icon: Shield },
  admin: { label: "Admin", class: "bg-[#FF5733]/10 text-[#FF5733]", icon: ShieldCheck },
};

export default function AdminUsersPage({ users: initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [changingRole, setChangingRole] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      (u.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (u.username?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChangingRole(userId);
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      toast.success("Role updated successfully.");
    } else {
      toast.error(result.error ?? "Failed to update role.");
    }
    setChangingRole(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
          Users ({users.length})
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans w-48"
          />
          <CustomSelect
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            options={[
              { value: "all", label: "All Roles" },
              { value: "runner", label: "Runner" },
              { value: "organizer", label: "Organizer" },
              { value: "admin", label: "Admin" },
            ]}
            className="w-40"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  User
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Role
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Joined
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filtered.map((user) => {
                const badge = roleBadge[user.role] ?? roleBadge.runner;
                const BadgeIcon = badge.icon;
                return (
                  <tr key={user.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FF5733] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(user.full_name || user.username || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1A1A1A] dark:text-white truncate">
                            {user.full_name || user.username || "No name"}
                          </p>
                          <p className="text-[10px] text-[#1A1A1A]/40 dark:text-white/30 truncate font-mono">
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.class}`}>
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#1A1A1A]/60 dark:text-white/40">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <CustomSelect
                        value={user.role}
                        onChange={(val) => handleRoleChange(user.id, val)}
                        disabled={changingRole === user.id}
                        options={[
                          { value: "runner", label: "Runner" },
                          { value: "organizer", label: "Organizer" },
                          { value: "admin", label: "Admin" },
                        ]}
                        size="sm"
                        className="w-32"
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-[#1A1A1A]/40 dark:text-white/30">
                    No users found.
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
