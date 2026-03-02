"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import LoginInput from "@/components/pages/login/component/login-input";

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

    // TODO: Implement sign up logic
    console.log("Sign up attempt:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full">
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
          placeholder="confirm  password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={errors.confirmPassword}
        />
      </div>

      {/* Sign Up Button */}
      <div className="animate-slide-up animation-delay-300">
        <Button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#33CCB3] text-white font-raleway font-bold text-base hover:bg-[#2ab89f] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
        >
          Sign Up
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 animate-fade-in animation-delay-300">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        <span className="text-sm text-gray-500 dark:text-gray-400 font-merriweather-sans whitespace-nowrap">
          Or Sign Up With
        </span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
      </div>

      {/* Google Sign Up Button */}
      <div className="animate-slide-up animation-delay-400">
        <Button
          type="button"
          variant="outline"
          className="w-full py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a2f36] hover:bg-gray-50 dark:hover:bg-[#244049] text-[#193C43] dark:text-[#F4F3F6] font-raleway font-semibold text-sm gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
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
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-merriweather-sans animate-fade-in animation-delay-500">
        Already have an account?{" "}
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
