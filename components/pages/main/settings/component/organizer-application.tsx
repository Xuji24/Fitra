"use client";

import { useState, useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  submitOrganizerApplication,
  getOrganizerApplicationStatus,
  getUserRole,
} from "@/app/(main)/actions";
import { toast } from "sonner";
import {
  Building2,
  Mail,
  Phone,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  X,
} from "lucide-react";

type AppStatus = "none" | "pending" | "approved" | "rejected";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 5;

export default function OrganizerApplication() {
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>();
  const [isPending, startTransition] = useTransition();

  // Form fields
  const [orgName, setOrgName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const [roleResult, appResult] = await Promise.all([
        getUserRole(),
        getOrganizerApplicationStatus(),
      ]);
      setRole(roleResult);
      setStatus(appResult.status);
      setRejectionReason(appResult.rejectionReason);
    }
    load();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const validFiles: File[] = [];

    for (const file of selected) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported file type. Use PDF, JPG, PNG, or WebP.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the 5 MB size limit.`);
        continue;
      }
      validFiles.push(file);
    }

    const total = files.length + validFiles.length;
    if (total > MAX_FILES) {
      toast.error(`You can upload a maximum of ${MAX_FILES} documents.`);
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!orgName.trim()) {
      toast.error("Please enter your organization name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail || !emailRegex.test(contactEmail)) {
      toast.error("Please enter a valid contact email.");
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload at least one proof document.");
      return;
    }

    startTransition(async () => {
      setUploading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to apply.");
        setUploading(false);
        return;
      }

      // Upload files to Supabase Storage
      const documentUrls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("organizer-documents")
          .upload(fileName, file);

        if (uploadError) {
          toast.error("Failed to upload documents. Please try again.");
          setUploading(false);
          return;
        }

        documentUrls.push(fileName);
      }

      setUploading(false);

      const result = await submitOrganizerApplication({
        organizationName: orgName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || undefined,
        description: description.trim() || undefined,
        documentUrls,
      });

      if (!result.success) {
        toast.error(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      toast.success("Application submitted! We'll review it shortly.");
      setStatus("pending");
    });
  };

  // Loading
  if (status === null || role === null) {
    return (
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm p-8 text-center">
        <Loader2 className="w-5 h-5 animate-spin text-[#FF5733] mx-auto" />
      </div>
    );
  }

  // Already an organizer or admin
  if (role === "organizer" || role === "admin") {
    return (
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="font-raleway font-bold text-base text-[#1A1A1A] dark:text-white">
                Organizer Status
              </h2>
              <p className="font-merriweather-sans text-xs text-emerald-500 font-medium">
                Your account has organizer privileges
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-sm text-[#1A1A1A]/60 dark:text-white/40 font-merriweather-sans">
            You can create and manage races from the{" "}
            <a href="/organizer" className="text-[#FF5733] hover:underline font-medium">
              Organizer Dashboard
            </a>.
          </p>
        </div>
      </div>
    );
  }

  // Pending application
  if (status === "pending") {
    return (
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFB800]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#FFB800]" />
            </div>
            <div>
              <h2 className="font-raleway font-bold text-base text-[#1A1A1A] dark:text-white">
                Application Under Review
              </h2>
              <p className="font-merriweather-sans text-xs text-[#FFB800] font-medium">
                We&apos;re reviewing your organizer application
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-sm text-[#1A1A1A]/60 dark:text-white/40 font-merriweather-sans">
            Your application is currently being reviewed by our team. We&apos;ll notify you once a decision has been made. This usually takes 1–3 business days.
          </p>
        </div>
      </div>
    );
  }

  // Rejected — show reason + allow reapplication
  const showRejection = status === "rejected";

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5733]/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#FF5733]" />
          </div>
          <div>
            <h2 className="font-raleway font-bold text-base text-[#1A1A1A] dark:text-white">
              Become an Organizer
            </h2>
            <p className="font-merriweather-sans text-xs text-[#1A1A1A]/40 dark:text-white/30">
              Apply to host virtual races on the platform
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
        {/* Rejection notice */}
        {showRejection && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Your previous application was not approved.
              </p>
              {rejectionReason && (
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                  Reason: {rejectionReason}
                </p>
              )}
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                You can submit a new application below.
              </p>
            </div>
          </div>
        )}

        {/* Organization Name */}
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
            Organization Name *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30 dark:text-white/20" />
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Manila Runners Club"
              maxLength={200}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
            />
          </div>
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
            Contact Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30 dark:text-white/20" />
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="org@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
            />
          </div>
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
            Contact Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30 dark:text-white/20" />
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+63 912 345 6789"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
            What races do you plan to host?
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the type of races you'd like to organize..."
            rows={3}
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans resize-none"
          />
        </div>

        {/* Document Upload */}
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
            Proof Documents * <span className="normal-case tracking-normal font-normal">(Business permit, DTI, SEC, etc.)</span>
          </label>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2 mb-3">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E]"
                >
                  <FileText className="w-4 h-4 text-[#FF5733] shrink-0" />
                  <span className="text-sm text-[#1A1A1A] dark:text-white truncate flex-1 font-merriweather-sans">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-[#1A1A1A]/40 dark:text-white/30 shrink-0">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-[#1A1A1A]/30 dark:text-white/30 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          {files.length < MAX_FILES && (
            <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 hover:border-[#FF5733]/30 dark:hover:border-[#FF5733]/30 transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-[#1A1A1A]/40 dark:text-white/30" />
              <span className="text-sm text-[#1A1A1A]/50 dark:text-white/40 font-merriweather-sans">
                Click to upload (PDF, JPG, PNG — max 5 MB each)
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isPending || uploading}
          className="w-full py-3 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] disabled:opacity-50 text-white text-sm font-semibold font-raleway transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          {isPending || uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploading ? "Uploading documents..." : "Submitting..."}
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4" />
              Submit Application
            </>
          )}
        </button>
      </div>
    </div>
  );
}
