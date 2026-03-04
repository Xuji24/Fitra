"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import { Loader2 } from "lucide-react";
import { forgotPassword } from "@/app/(auth)/actions";
import LoginInput from "@/components/pages/auth/login/component/login-input";

interface FormErrors {
  email?: string;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return undefined;
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (isSubmitted) {
      setErrors({ email: validateEmail(value) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const emailError = validateEmail(email);
    setErrors({ email: emailError });

    if (emailError) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);

      const result = await forgotPassword(formData);
      if (!result.success && result.error) {
        setAuthError(result.error);
        setSuccessMessage(null);
      } else {
        setAuthError(null);
        setSuccessMessage("Check your email for a password reset link.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* Auth Error */}
      {authError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-slide-up">
          <p className="text-sm text-red-500 font-merriweather-sans">{authError}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 animate-slide-up">
          <p className="text-sm text-green-600 dark:text-green-400 font-merriweather-sans">{successMessage}</p>
        </div>
      )}

      {/* Email Input */}
      <div className="animate-slide-up animation-delay-100">
        <LoginInput
          label="Email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
        />
      </div>

      {/* Submit Button */}
      <div className="animate-slide-up animation-delay-200">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-5 rounded-xl bg-[#FF5733] text-white font-raleway font-bold text-base hover:bg-[#E84E2E] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}
        </Button>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-[#1A1A1A]/50 dark:text-white/40 font-merriweather-sans animate-fade-in animation-delay-300">
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
