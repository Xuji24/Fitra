"use client";

import { useState, useTransition, useRef } from "react";
import { X, Loader2, Trophy, Upload, Trash2, Shirt, Medal, Award } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { createRace } from "@/app/(main)/actions";
import type { OrganizerRace } from "../OrganizerDashboard";
import CustomSelect from "@/components/ui/custom-select";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (race: OrganizerRace) => void;
}

const CATEGORIES = ["5K", "10K", "Half Marathon", "Marathon", "Ultra"] as const;

export default function CreateRaceModal({ open, onClose, onCreated }: Props) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("5K");
  const [targetDistance, setTargetDistance] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");

  // Design upload states
  type DesignKey = "tshirt" | "medal" | "certificate";
  const [designFiles, setDesignFiles] = useState<Record<DesignKey, File | null>>({
    tshirt: null, medal: null, certificate: null,
  });
  const [designPreviews, setDesignPreviews] = useState<Record<DesignKey, string | null>>({
    tshirt: null, medal: null, certificate: null,
  });
  const designRefs = useRef<Record<DesignKey, HTMLInputElement | null>>({
    tshirt: null, medal: null, certificate: null,
  });

  const DESIGN_CONFIGS = [
    { key: "tshirt" as DesignKey, label: "T-Shirt Design", icon: Shirt },
    { key: "medal" as DesignKey, label: "Medal Design", icon: Medal },
    { key: "certificate" as DesignKey, label: "Certificate", icon: Award },
  ];

  const handleDesignSelect = (key: DesignKey, file: File | null) => {
    if (!file) return;
    const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Please upload a PNG, JPEG, WebP, or SVG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }
    setDesignFiles((prev) => ({ ...prev, [key]: file }));
    const reader = new FileReader();
    reader.onload = (e) => {
      setDesignPreviews((prev) => ({ ...prev, [key]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleDesignRemove = (key: DesignKey) => {
    setDesignFiles((prev) => ({ ...prev, [key]: null }));
    setDesignPreviews((prev) => ({ ...prev, [key]: null }));
    if (designRefs.current[key]) designRefs.current[key]!.value = "";
  };

  const resetForm = () => {
    setTitle("");
    setCategory("5K");
    setTargetDistance("");
    setEventDate("");
    setLocation("");
    setDescription("");
    setMaxParticipants("");
    setRegistrationDeadline("");
    setDesignFiles({ tshirt: null, medal: null, certificate: null });
    setDesignPreviews({ tshirt: null, medal: null, certificate: null });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a race title.");
      return;
    }
    if (!targetDistance || Number(targetDistance) <= 0) {
      toast.error("Please enter a valid target distance.");
      return;
    }
    if (!eventDate) {
      toast.error("Please select an event date.");
      return;
    }

    startTransition(async () => {
      // Upload design files if any
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in.");
        return;
      }

      let tshirtDesignUrl: string | undefined;
      let medalDesignUrl: string | undefined;
      let certificateDesignUrl: string | undefined;

      // Generate a temporary ID for the storage path (will use actual race ID after creation)
      const tempId = crypto.randomUUID();

      const uploadMap: { key: DesignKey; storagePath: string; setter: (url: string) => void }[] = [
        { key: "tshirt", storagePath: "tshirt", setter: (url) => { tshirtDesignUrl = url; } },
        { key: "medal", storagePath: "medal", setter: (url) => { medalDesignUrl = url; } },
        { key: "certificate", storagePath: "certificate", setter: (url) => { certificateDesignUrl = url; } },
      ];

      for (const { key, storagePath, setter } of uploadMap) {
        const file = designFiles[key];
        if (file) {
          const ext = file.name.split(".").pop() ?? "png";
          const filePath = `${user.id}/${tempId}/${storagePath}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("race-designs")
            .upload(filePath, file, { upsert: true });

          if (uploadError) {
            toast.error(`Failed to upload ${DESIGN_CONFIGS.find((d) => d.key === key)?.label}. Please try again.`);
            return;
          }

          const { data: urlData } = supabase.storage.from("race-designs").getPublicUrl(filePath);
          setter(urlData.publicUrl);
        }
      }

      const result = await createRace({
        title: title.trim(),
        category,
        targetDistance: Number(targetDistance),
        eventDate,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
        maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
        registrationDeadline: registrationDeadline || undefined,
        tshirtDesignUrl,
        medalDesignUrl,
        certificateDesignUrl,
      });

      if (!result.success) {
        toast.error(result.error ?? "Failed to create race. Please try again.");
        return;
      }

      toast.success("Race created successfully!");
      const newRace: OrganizerRace = {
        id: result.raceId!,
        title: title.trim(),
        category,
        targetDistance: Number(targetDistance),
        eventDate,
        imageUrl: null,
        registrationOpen: true,
        maxParticipants: maxParticipants ? Number(maxParticipants) : null,
        registrationCount: 0,
        tshirtDesignUrl: tshirtDesignUrl ?? null,
        medalDesignUrl: medalDesignUrl ?? null,
        certificateDesignUrl: certificateDesignUrl ?? null,
      };
      resetForm();
      onCreated(newRace);
    });
  };

  if (!open) return null;

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
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-[#FF5733]" />
              <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
                Create New Race
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A1A]/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
              Race Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Manila Sunrise Marathon 2026"
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
            />
          </div>

          {/* Category + Distance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                Category *
              </label>
              <CustomSelect
                value={category}
                onChange={(val) => setCategory(val)}
                options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                Distance (km) *
              </label>
              <input
                type="number"
                value={targetDistance}
                onChange={(e) => setTargetDistance(e.target.value)}
                placeholder="42.195"
                min="0.1"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
              />
            </div>
          </div>

          {/* Event Date + Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                Event Date *
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                Registration Deadline
              </label>
              <input
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
              />
            </div>
          </div>

          {/* Location + Max Participants */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Manila, Philippines"
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                Max Participants
              </label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="500"
                min="1"
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your race..."
              rows={3}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans resize-none"
            />
          </div>

          {/* Design Uploads (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 uppercase tracking-wider font-merriweather-sans">
                Race Designs
              </span>
              <span className="text-[10px] text-[#1A1A1A]/30 dark:text-white/20 font-merriweather-sans">
                Optional — you can add these later
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {DESIGN_CONFIGS.map(({ key, label, icon: Icon }) => (
                <div key={key}>
                  <label className="flex items-center gap-1 text-[10px] font-semibold text-[#1A1A1A]/50 dark:text-white/30 mb-1.5 font-merriweather-sans">
                    <Icon className="w-3 h-3" />
                    {label}
                  </label>
                  {designPreviews[key] ? (
                    <div className="relative group rounded-lg overflow-hidden border border-black/5 dark:border-white/5">
                      <div className="relative w-full h-20 bg-[#F5F5F0] dark:bg-[#2A2A2E]">
                        <Image
                          src={designPreviews[key]!}
                          alt={label}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDesignRemove(key)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => designRefs.current[key]?.click()}
                      className="w-full h-20 rounded-lg border-2 border-dashed border-[#1A1A1A]/10 dark:border-white/10 hover:border-[#FF5733]/30 transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#1A1A1A]/20 dark:text-white/15" />
                      <span className="text-[9px] text-[#1A1A1A]/30 dark:text-white/20 font-merriweather-sans">
                        Upload
                      </span>
                    </button>
                  )}
                  <input
                    ref={(el) => { designRefs.current[key] = el; }}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.svg"
                    onChange={(e) => handleDesignSelect(key, e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] disabled:opacity-50 text-white text-sm font-semibold font-raleway transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4" />
                Create Race
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
