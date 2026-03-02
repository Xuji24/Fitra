"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import LoginInput from "@/components/pages/login/component/login-input";

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

    // TODO: Implement forgot password logic
    console.log("Forgot password request:", { email });
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

      {/* Submit Button */}
      <div className="animate-slide-up animation-delay-200">
        <Button
          type="submit"
          className="w-full py-4 rounded-lg bg-[#33CCB3] text-white font-raleway font-bold text-base hover:bg-[#2ab89f] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
        >
          Submit
        </Button>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-merriweather-sans animate-fade-in animation-delay-300">
        Remember Your Password?{" "}
        <Link
          href="/login"
          className="font-raleway font-semibold text-[#193C43] dark:text-[#33CCB3] hover:underline transition-colors"
        >
          Login Here.
        </Link>
      </p>
    </form>
  );
}
