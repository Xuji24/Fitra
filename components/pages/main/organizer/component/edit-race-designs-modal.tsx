"use client";

import { useState, useTransition, useRef } from "react";
import { X, Loader2, Upload, Trash2, Shirt, Medal, Award } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { updateRaceDesigns } from "@/app/(main)/actions";
import type { OrganizerRace } from "../OrganizerDashboard";
import Image from "next/image";

interface Props {
  race: OrganizerRace;
  onClose: () => void;
  onUpdated: (
    raceId: string,
    updates: {
      tshirtDesignUrl?: string | null;
      medalDesignUrl?: string | null;
      certificateDesignUrl?: string | null;
    }
  ) => void;
}

type DesignKey = "tshirt" | "medal" | "certificate";

const DESIGN_CONFIG: {
  key: DesignKey;
  label: string;
  urlField: keyof OrganizerRace;
  icon: typeof Shirt;
  storagePath: string;
}[] = [
  { key: "tshirt", label: "T-Shirt Design", urlField: "tshirtDesignUrl", icon: Shirt, storagePath: "tshirt" },
  { key: "medal", label: "Medal Design", urlField: "medalDesignUrl", icon: Medal, storagePath: "medal" },
  { key: "certificate", label: "Certificate Design", urlField: "certificateDesignUrl", icon: Award, storagePath: "certificate" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export default function EditRaceDesignsModal({ race, onClose, onUpdated }: Props) {
  const [isPending, startTransition] = useTransition();
  const [previews, setPreviews] = useState<Record<DesignKey, string | null>>({
    tshirt: race.tshirtDesignUrl,
    medal: race.medalDesignUrl,
    certificate: race.certificateDesignUrl,
  });
  const [files, setFiles] = useState<Record<DesignKey, File | null>>({
    tshirt: null,
    medal: null,
    certificate: null,
  });
  const [removals, setRemovals] = useState<Record<DesignKey, boolean>>({
    tshirt: false,
    medal: false,
    certificate: false,
  });
  const fileInputRefs = useRef<Record<DesignKey, HTMLInputElement | null>>({
    tshirt: null,
    medal: null,
    certificate: null,
  });

  const handleFileSelect = (key: DesignKey, file: File | null) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a PNG, JPEG, WebP, or SVG image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be under 5MB.");
      return;
    }

    setFiles((prev) => ({ ...prev, [key]: file }));
    setRemovals((prev) => ({ ...prev, [key]: false }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((prev) => ({ ...prev, [key]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (key: DesignKey) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
    setPreviews((prev) => ({ ...prev, [key]: null }));
    setRemovals((prev) => ({ ...prev, [key]: true }));
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key]!.value = "";
    }
  };

  const hasChanges = () => {
    return DESIGN_CONFIG.some(({ key }) => files[key] !== null || removals[key]);
  };

  const handleSave = () => {
    if (!hasChanges()) {
      toast.error("No changes to save.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in.");
        return;
      }

      const updates: Record<string, string | null> = {};

      for (const { key, storagePath, urlField } of DESIGN_CONFIG) {
        if (files[key]) {
          const file = files[key]!;
          const ext = file.name.split(".").pop() ?? "png";
          const filePath = `${user.id}/${race.id}/${storagePath}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("race-designs")
            .upload(filePath, file, { upsert: true });

          if (uploadError) {
            toast.error(`Failed to upload ${DESIGN_CONFIG.find((d) => d.key === key)?.label}.`);
            return;
          }

          const { data: urlData } = supabase.storage
            .from("race-designs")
            .getPublicUrl(filePath);

          const urlFieldMap: Record<DesignKey, string> = {
            tshirt: "tshirtDesignUrl",
            medal: "medalDesignUrl",
            certificate: "certificateDesignUrl",
          };
          updates[urlFieldMap[key]] = urlData.publicUrl;
        } else if (removals[key]) {
          // Remove the old file from storage if it existed
          const currentUrl = race[urlField] as string | null;
          if (currentUrl) {
            const pathMatch = currentUrl.split("/race-designs/")[1];
            if (pathMatch) {
              await supabase.storage.from("race-designs").remove([pathMatch]);
            }
          }

          const urlFieldMap: Record<DesignKey, string> = {
            tshirt: "tshirtDesignUrl",
            medal: "medalDesignUrl",
            certificate: "certificateDesignUrl",
          };
          updates[urlFieldMap[key]] = null;
        }
      }

      if (Object.keys(updates).length === 0) {
        toast.error("No changes to save.");
        return;
      }

      const result = await updateRaceDesigns({
        raceId: race.id,
        ...updates,
      });

      if (!result.success) {
        toast.error(result.error ?? "Failed to update designs.");
        return;
      }

      toast.success("Designs updated successfully!");
      onUpdated(race.id, updates as {
        tshirtDesignUrl?: string | null;
        medalDesignUrl?: string | null;
        certificateDesignUrl?: string | null;
      });
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-black/5 dark:border-white/5 sticky top-0 bg-white dark:bg-[#1C1C1E] z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
                Race Designs
              </h2>
              <p className="text-xs text-[#1A1A1A]/50 dark:text-white/40 font-merriweather-sans mt-0.5">
                {race.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A1A]/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Design Upload Sections */}
        <div className="p-5 space-y-5">
          {DESIGN_CONFIG.map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-2 uppercase tracking-wider font-merriweather-sans">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </label>

              {previews[key] ? (
                <div className="relative group rounded-xl overflow-hidden border border-black/5 dark:border-white/5">
                  <div className="relative w-full h-40 bg-[#F5F5F0] dark:bg-[#2A2A2E]">
                    <Image
                      src={previews[key]!}
                      alt={label}
                      fill
                      className="object-contain"
                      unoptimized={previews[key]!.startsWith("data:")}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[key]?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/90 text-[#1A1A1A] text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(key)}
                      className="p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[key]?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 hover:border-[#FF5733]/30 dark:hover:border-[#FF5733]/30 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group"
                >
                  <Upload className="w-5 h-5 text-[#1A1A1A]/30 dark:text-white/20 group-hover:text-[#FF5733]/60 transition-colors" />
                  <span className="text-xs text-[#1A1A1A]/40 dark:text-white/30 group-hover:text-[#FF5733]/60 transition-colors font-merriweather-sans">
                    Click to upload
                  </span>
                  <span className="text-[10px] text-[#1A1A1A]/25 dark:text-white/15 font-merriweather-sans">
                    PNG, JPEG, WebP, SVG — Max 5MB
                  </span>
                </button>
              )}

              <input
                ref={(el) => { fileInputRefs.current[key] = el; }}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg"
                onChange={(e) => handleFileSelect(key, e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>
          ))}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isPending || !hasChanges()}
            className="w-full py-3 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] disabled:opacity-50 text-white text-sm font-semibold font-raleway transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Designs"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
