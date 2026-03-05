"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { forgotPassword } from "@/app/(auth)/actions";
import LoginInput from "@/components/pages/auth/login/component/login-input";

const forgotErrors: Record<string, string> = {
  "Email rate limit exceeded": "Too many requests. Please try again later.",
  "For security purposes, you can only request this once every 60 seconds":
    "Please wait a moment before trying again.",
  "Captcha verification failed.": "Please complete the captcha verification.",
  "Please complete the captcha.": "Please complete the captcha verification.",
};

function getError(error: string): string {
  if (error.startsWith("Too many attempts")) return error;
  return forgotErrors[error] ?? "Something went wrong. Please try again.";
}

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
  const [isPending, startTransition] = useTransition();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

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

    if (!captchaToken) {
      toast.error(getError("Please complete the captcha."));
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("captchaToken", captchaToken);

      const result = await forgotPassword(formData);
      if (!result.success && result.error) {
        toast.error(getError(result.error));
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
      } else {
        toast.success("Check your email for a password reset link.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
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

      {/* hCaptcha */}
      <div className="flex justify-center animate-slide-up animation-delay-150">
        <HCaptcha
          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
          onVerify={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken(null)}
          ref={captchaRef}
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
