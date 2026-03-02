"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import LoginInput from "./login-input";

interface FormErrors {
  email?: string;
  password?: string;
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

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (isSubmitted) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (isSubmitted) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const newErrors: FormErrors = { email: emailError, password: passwordError };
    setErrors(newErrors);

    if (emailError || passwordError) return;

    // TODO: Implement login logic
    console.log("Login attempt:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
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

      {/* Forgot Password */}
      <div className="flex justify-end animate-slide-up animation-delay-200">
        <Link
          href="/forgot-password"
          className="font-raleway font-semibold text-sm text-[#193C43] dark:text-[#33CCB3] hover:underline transition-colors"
        >
          Forgot Your Password?
        </Link>
      </div>

      {/* Login Button */}
      <div className="animate-slide-up animation-delay-300">
        <Button
          type="submit"
          className="w-full py-4 rounded-lg bg-[#33CCB3] text-white font-raleway font-bold text-base hover:bg-[#2ab89f] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
        >
          Login
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 animate-fade-in animation-delay-300">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        <span className="text-sm text-gray-500 dark:text-gray-400 font-merriweather-sans whitespace-nowrap">
          Or Login With
        </span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
      </div>

      {/* Google Login Button */}
      <div className="animate-slide-up animation-delay-400">
        <Button
          type="button"
          variant="outline"
          className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a2f36] hover:bg-gray-50 dark:hover:bg-[#244049] text-[#193C43] dark:text-[#F4F3F6] font-raleway font-semibold text-sm gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
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

      {/* Register Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-merriweather-sans animate-fade-in animation-delay-500">
        Don&apos;t Have An Account ?{" "}
        <Link
          href="/signup"
          className="font-raleway font-semibold text-[#193C43] dark:text-[#33CCB3] hover:underline transition-colors"
        >
          Register Now.
        </Link>
      </p>
    </form>
  );
}
