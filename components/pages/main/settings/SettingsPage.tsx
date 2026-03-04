"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react";
import Navbar from "@/components/navbar";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setLoading(false);
    }

    checkAuth();
  }, [router]);

  const handlePasswordChange = async () => {
    setToast(null);

    // Validate
    if (!newPassword || !confirmPassword) {
      setToast({ type: "error", message: "Please fill in all password fields" });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ type: "error", message: "New password must be at least 6 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ type: "error", message: "New passwords do not match" });
      return;
    }

    setSaving(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setToast({ type: "error", message: error.message });
      setSaving(false);
      return;
    }

    setToast({ type: "success", message: "Password updated successfully" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121212] pt-8 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-raleway font-bold text-2xl sm:text-3xl text-[#1A1A1A] dark:text-white">
              Settings
            </h1>
            <p className="font-merriweather-sans text-sm text-[#1A1A1A]/50 dark:text-white/40 mt-1">
              Manage your account security
            </p>
          </div>

          {/* Password Card */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="p-6 sm:p-8 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5733]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#FF5733]" />
                </div>
                <div>
                  <h2 className="font-raleway font-bold text-base text-[#1A1A1A] dark:text-white">
                    Change Password
                  </h2>
                  <p className="font-merriweather-sans text-xs text-[#1A1A1A]/40 dark:text-white/30">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8 space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30 dark:text-white/20" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 dark:text-white/20 hover:text-[#1A1A1A]/60 dark:hover:text-white/40 transition-colors cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30 dark:text-white/20" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 dark:text-white/20 hover:text-[#1A1A1A]/60 dark:hover:text-white/40 transition-colors cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] text-[#1A1A1A]/30 dark:text-white/20 font-merriweather-sans">
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A]/60 dark:text-white/40 mb-1.5 uppercase tracking-wider font-merriweather-sans">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30 dark:text-white/20" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 dark:text-white/20 hover:text-[#1A1A1A]/60 dark:hover:text-white/40 transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                onClick={handlePasswordChange}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] disabled:opacity-50 text-white text-sm font-semibold font-raleway transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Update Password
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
