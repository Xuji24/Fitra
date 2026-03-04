"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shadcn/button";
import { Loader2 } from "lucide-react";
import { signUp, signInWithGoogle } from "@/app/(auth)/actions";
import LoginInput from "@/components/pages/auth/login/component/login-input";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return undefined;
}

function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return undefined;
}

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (isSubmitted) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (isSubmitted) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
        confirmPassword: validateConfirmPassword(value, confirmPassword),
      }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (isSubmitted) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(password, value),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );
    const newErrors: FormErrors = {
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };
    setErrors(newErrors);

    if (emailError || passwordError || confirmPasswordError) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await signUp(formData);
      if (!result.success && result.error) {
        setAuthError(result.error);
      } else if (result.success) {
        setSuccessMessage("Check your email to confirm your account.");
        if (result.redirectTo) {
          setTimeout(() => router.push(result.redirectTo!), 2000);
        }
      }
    });
  };

  const handleGoogleSignUp = () => {
    startTransition(async () => {
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        setAuthError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full">
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

      {/* Password Input */}
      <div className="animate-slide-up animation-delay-200">
        <LoginInput
          label="Password"
          type="password"
          placeholder="password"
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
        />
      </div>

      {/* Confirm Password Input */}
      <div className="animate-slide-up animation-delay-300">
        <LoginInput
          label="Confirm Password"
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={errors.confirmPassword}
        />
      </div>

      {/* Sign Up Button */}
      <div className="animate-slide-up animation-delay-300 mt-1">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-5 rounded-xl bg-[#FF5733] text-white font-raleway font-bold text-base hover:bg-[#E84E2E] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 animate-fade-in animation-delay-300">
        <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
        <span className="text-xs text-[#1A1A1A]/40 dark:text-white/30 font-merriweather-sans whitespace-nowrap">
          Or Sign Up With
        </span>
        <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
      </div>

      {/* Google Sign Up Button */}
      <div className="animate-slide-up animation-delay-400">
        <Button
          type="button"
          disabled={isPending}
          onClick={handleGoogleSignUp}
          variant="outline"
          className="w-full py-4 rounded-xl border border-black/5 dark:border-white/5 bg-[#F5F5F0] dark:bg-[#1C1C1E] hover:bg-[#EBEBEB] dark:hover:bg-[#2A2A2E] text-[#1A1A1A] dark:text-white font-raleway font-semibold text-sm gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Google
        </Button>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-[#1A1A1A]/50 dark:text-white/40 font-merriweather-sans animate-fade-in animation-delay-500">
        Already have an account?{" "}
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
