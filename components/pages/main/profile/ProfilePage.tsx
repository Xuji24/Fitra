"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      // Fetch profile from profiles table
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, username")
        .eq("id", user.id)
        .single();

      const fullName = profileData?.full_name || user.user_metadata?.full_name || "";
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setProfile({
        firstName,
        lastName,
        email: user.email || "",
        username: profileData?.username || "",
      });

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setToast(null);

    const supabase = createClient();
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();

    // Update profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username: profile.username || null,
      })
      .eq("id", user.id);

    if (profileError) {
      setToast({ type: "error", message: profileError.message });
      setSaving(false);
      return;
    }

    // Also update auth user metadata so navbar reflects changes
    await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    setToast({ type: "success", message: "Profile updated successfully" });
    setSaving(false);

    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121212] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF5733]" />
        </div>
      </div>
    );
  }

  const initial = (profile.firstName || profile.email || "U").charAt(0).toUpperCase();

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121212] pt-8 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-raleway font-bold text-2xl sm:text-3xl text-[#1A1A1A] dark:text-white">
              Profile
            </h1>
            <p className="font-merriweather-sans text-sm text-[#1A1A1A]/50 dark:text-white/40 mt-1">
              Manage your personal information
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
            {/* Avatar Header */}
            <div className="bg-linear-to-r from-[#FF5733] to-[#FFB800] p-6 sm:p-8 flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold font-raleway">
                {initial}
              </div>
              <div>
                <h2 className="font-raleway font-bold text-lg sm:text-xl text-white">
                  {profile.firstName || profile.lastName
                    ? `${profile.firstName} ${profile.lastName}`.trim()
                    : "Set your name"}
                </h2>
                <p className="font-merriweather-sans text-sm text-white/70">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8 space-y-5">
              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30 dark:text-white/20" />
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    placeholder="Enter your first name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30 dark:text-white/20" />
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    placeholder="Enter your last name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
                  />
                </div>
              </div>

              {/* Email — read-only */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30 dark:text-white/20" />
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F0]/60 dark:bg-[#2A2A2E]/60 text-sm text-[#1A1A1A]/50 dark:text-white/30 border-0 outline-none cursor-not-allowed font-merriweather-sans"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#1A1A1A]/30 dark:text-white/15 uppercase tracking-wider font-merriweather-sans">
                    Read only
                  </span>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
                />
              </div>

              {/* Toast */}
              {toast && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm ${
                    toast.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400"
                  }`}
                >
                  {toast.type === "success" ? (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <p className="font-merriweather-sans text-xs">{toast.message}</p>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] disabled:opacity-50 text-white text-sm font-semibold font-raleway transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
