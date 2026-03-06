"use client";

import { useState } from "react";
import { FileCheck, Check, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { AdminApplication } from "@/app/(admin)/admin/actions";
import { approveApplication, rejectApplication } from "@/app/(admin)/admin/actions";
import CustomSelect from "@/components/ui/custom-select";

interface Props {
  applications: AdminApplication[];
}

const statusColors: Record<string, string> = {
  pending: "bg-[#FFB800]/10 text-[#FFB800]",
  approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-red-500/10 text-red-500",
};

export default function AdminApplicationsPage({ applications: initialApps }: Props) {
  const [applications, setApplications] = useState(initialApps);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = applications.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );

  const handleApprove = async (appId: string) => {
    if (!confirm("Approve this application? The user will be promoted to organizer.")) return;
    setProcessing(appId);
    const result = await approveApplication(appId);
    if (result.success) {
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: "approved" } : a))
      );
      toast.success("Application approved. User promoted to organizer.");
    } else {
      toast.error(result.error ?? "Failed to approve.");
    }
    setProcessing(null);
  };

  const handleReject = async (appId: string) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    setProcessing(appId);
    const result = await rejectApplication(appId, rejectReason);
    if (result.success) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === appId
            ? { ...a, status: "rejected", rejection_reason: rejectReason }
            : a
        )
      );
      setRejectingId(null);
      setRejectReason("");
      toast.success("Application rejected.");
    } else {
      toast.error(result.error ?? "Failed to reject.");
    }
    setProcessing(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
          Organizer Applications ({applications.length})
        </h2>
        <CustomSelect
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          options={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
          className="w-40"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-raleway font-bold text-sm text-[#1A1A1A] dark:text-white">
                    {app.organization_name}
                  </h3>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[app.status] ?? ""}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A]/50 dark:text-white/40">
                  Applied by {app.applicant_name} &middot;{" "}
                  {new Date(app.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {app.status === "pending" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(app.id)}
                    disabled={processing === app.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectingId(rejectingId === app.id ? null : app.id)}
                    disabled={processing === app.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1A1A1A]/60 dark:text-white/40">
              <div>
                <span className="font-semibold text-[#1A1A1A]/40 dark:text-white/30">Email:</span>{" "}
                {app.contact_email}
              </div>
              {app.contact_phone && (
                <div>
                  <span className="font-semibold text-[#1A1A1A]/40 dark:text-white/30">Phone:</span>{" "}
                  {app.contact_phone}
                </div>
              )}
              {app.description && (
                <div className="col-span-full">
                  <span className="font-semibold text-[#1A1A1A]/40 dark:text-white/30">Description:</span>{" "}
                  {app.description}
                </div>
              )}
              {app.document_urls.length > 0 && (
                <div className="col-span-full">
                  <span className="font-semibold text-[#1A1A1A]/40 dark:text-white/30">Documents:</span>{" "}
                  {app.document_urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mr-3 text-[#FF5733] hover:underline"
                    >
                      Doc {i + 1}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
              {app.rejection_reason && (
                <div className="col-span-full">
                  <span className="font-semibold text-red-500/60">Rejection reason:</span>{" "}
                  <span className="text-red-500/80">{app.rejection_reason}</span>
                </div>
              )}
            </div>

            {/* Reject reason input */}
            {rejectingId === app.id && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-red-500 outline-none transition-all font-merriweather-sans"
                />
                <button
                  onClick={() => handleReject(app.id)}
                  disabled={processing === app.id}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 p-10 text-center text-[#1A1A1A]/40 dark:text-white/30">
            <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
}
