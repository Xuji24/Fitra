"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validatePasswordStrength } from "@/lib/validators";
import { toast } from "sonner";
import { changePassword } from "@/app/(auth)/actions";

const settingsErrors: Record<string, string> = {
  "New password should be different from the old password.":
    "Please choose a different password.",
  "Must be at least 8 characters": "Password must be at least 8 characters.",
  "Must include an uppercase letter": "Password must include an uppercase letter.",
  "Must include a lowercase letter": "Password must include a lowercase letter.",
  "Must include a number": "Password must include a number.",
  "Must include a symbol": "Password must include a symbol.",
};

function getError(error: string): string {
  if (error.startsWith("Too many attempts")) return error;
  return settingsErrors[error] ?? "Something went wrong. Please try again.";
}
import { Lock, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import Navbar from "@/components/navbar";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setLoading(false);
    }

    checkAuth();
  }, [router]);

  const handlePasswordChange = () => {
    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      toast.error(getError(passwordError));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      const result = await changePassword(formData);
      if (!result.success && result.error) {
        toast.error(getError(result.error));
      } else {
        toast.success("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
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
                    {showCurrent ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
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
                    {showNew ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
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
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <PasswordStrengthIndicator password={newPassword} />

              {/* Save Button */}
              <button
                onClick={handlePasswordChange}
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-[#FF5733] hover:bg-[#E84E2E] disabled:opacity-50 text-white text-sm font-semibold font-raleway transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isPending ? (
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
