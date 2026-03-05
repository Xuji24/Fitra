"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/app/(auth)/actions";
import { validatePasswordStrength } from "@/lib/validators";

const resetErrors: Record<string, string> = {
  "New password should be different from the old password.":
    "Please choose a different password.",
  "Auth session missing!": "Your session has expired. Please try again.",
  "Must be at least 8 characters": "Password must be at least 8 characters.",
  "Must include an uppercase letter": "Password must include an uppercase letter.",
  "Must include a lowercase letter": "Password must include a lowercase letter.",
  "Must include a number": "Password must include a number.",
  "Must include a symbol": "Password must include a symbol.",
};

function getError(error: string): string {
  if (error.startsWith("Too many attempts")) return error;
  return resetErrors[error] ?? "Something went wrong. Please try again.";
}
import LoginInput from "@/components/pages/auth/login/component/login-input";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

function validatePassword(password: string): string | undefined {
  return validatePasswordStrength(password);
}

function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword.trim()) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return undefined;
}

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (isSubmitted) {
      setErrors((prev) => ({
        ...prev,
        newPassword: validatePassword(value),
        confirmPassword: confirmPassword
          ? validateConfirmPassword(value, confirmPassword)
          : prev.confirmPassword,
      }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (isSubmitted) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(newPassword, value),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(
      newPassword,
      confirmPassword,
    );

    setErrors({
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
    });

    if (newPasswordError || confirmPasswordError) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("password", newPassword);

      const result = await resetPassword(formData);
      if (!result.success && result.error) {
        toast.error(getError(result.error));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* New Password Input */}
      <div className="animate-slide-up animation-delay-100">
        <LoginInput
          label="New Password"
          type="password"
          placeholder="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={errors.newPassword}
        />
      </div>

      {/* Confirm Password Input */}
      <div className="animate-slide-up animation-delay-200">
        <LoginInput
          label="Confirm Password"
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={errors.confirmPassword}
        />
      </div>
      <PasswordStrengthIndicator password={newPassword} />

      {/* Submit Button */}
      <div className="animate-slide-up animation-delay-300">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-5 rounded-xl bg-[#FF5733] text-white font-raleway font-bold text-base hover:bg-[#E84E2E] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Change Password"
          )}
        </Button>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-[#1A1A1A]/50 dark:text-white/40 font-merriweather-sans animate-fade-in animation-delay-400">
        Remember Your Password?{" "}
        <Link
          href="/login"
          className="font-raleway font-semibold text-[#FF5733] hover:text-[#FFB800] transition-colors"
        >
          Login Here.
        </Link>
      </p>
    </form>
  );
}
