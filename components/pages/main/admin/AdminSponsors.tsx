"use client";

import { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Handshake } from "lucide-react";
import { toast } from "sonner";
import type { AdminSponsor } from "@/app/(admin)/admin/actions";
import { createSponsor, updateSponsor, deleteSponsor } from "@/app/(admin)/admin/actions";

interface Props {
  sponsors: AdminSponsor[];
}

export default function AdminSponsorsPage({ sponsors: initialSponsors }: Props) {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [newOrder, setNewOrder] = useState(0);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Sponsor name is required.");
      return;
    }
    setCreating(true);
    const result = await createSponsor({
      name: newName,
      logoUrl: newLogoUrl || undefined,
      websiteUrl: newWebsiteUrl || undefined,
      displayOrder: newOrder,
    });
    if (result.success) {
      toast.success("Sponsor created.");
      setNewName("");
      setNewLogoUrl("");
      setNewWebsiteUrl("");
      setNewOrder(0);
      setShowCreate(false);
      // Reload page to get the new sponsor with its ID
      window.location.reload();
    } else {
      toast.error(result.error ?? "Failed to create.");
    }
    setCreating(false);
  };

  const handleToggle = async (sponsorId: string, currentActive: boolean) => {
    const result = await updateSponsor(sponsorId, { active: !currentActive });
    if (result.success) {
      setSponsors((prev) =>
        prev.map((s) =>
          s.id === sponsorId ? { ...s, active: !currentActive } : s
        )
      );
      toast.success(`Sponsor ${!currentActive ? "activated" : "deactivated"}.`);
    } else {
      toast.error(result.error ?? "Failed to update.");
    }
  };

  const handleDelete = async (sponsorId: string) => {
    if (!confirm("Delete this sponsor?")) return;
    const result = await deleteSponsor(sponsorId);
    if (result.success) {
      setSponsors((prev) => prev.filter((s) => s.id !== sponsorId));
      toast.success("Sponsor deleted.");
    } else {
      toast.error(result.error ?? "Failed to delete.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
          Sponsors ({sponsors.length})
        </h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Sponsor
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#FF5733]/20 p-5 mb-6">
          <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white mb-4">
            New Sponsor
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Sponsor name *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
            />
            <input
              type="text"
              placeholder="Logo URL (e.g. /sponsors/logo.png)"
              value={newLogoUrl}
              onChange={(e) => setNewLogoUrl(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
            />
            <input
              type="text"
              placeholder="Website URL"
              value={newWebsiteUrl}
              onChange={(e) => setNewWebsiteUrl(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
            />
            <input
              type="number"
              placeholder="Display order"
              value={newOrder}
              onChange={(e) => setNewOrder(Number(e.target.value))}
              className="px-4 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#1A1A1A]/60 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Sponsors List */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Order
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Logo
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/50 dark:text-white/40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {sponsors.map((sponsor) => (
                <tr key={sponsor.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-[#1A1A1A]/60 dark:text-white/40">
                    {sponsor.display_order}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[#1A1A1A] dark:text-white">
                      {sponsor.name}
                    </p>
                    {sponsor.website_url && (
                      <p className="text-[10px] text-[#1A1A1A]/40 dark:text-white/30 truncate">
                        {sponsor.website_url}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#1A1A1A]/50 dark:text-white/40 text-xs truncate max-w-32">
                    {sponsor.logo_url || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${sponsor.active ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-500"}`}>
                      {sponsor.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(sponsor.id, sponsor.active)}
                        className="cursor-pointer"
                        title={sponsor.active ? "Deactivate" : "Activate"}
                      >
                        {sponsor.active ? (
                          <ToggleRight className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-[#1A1A1A]/30 dark:text-white/30" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(sponsor.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#1A1A1A]/30 dark:text-white/30 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sponsors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[#1A1A1A]/40 dark:text-white/30">
                    <Handshake className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No sponsors yet.
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
