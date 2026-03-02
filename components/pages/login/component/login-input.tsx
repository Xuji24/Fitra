"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LoginInputProps } from "@/utils/types/login-input-prompts";

export default function LoginInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
}: LoginInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1">
      <label className="font-raleway font-semibold text-sm text-[#193C43] dark:text-[#F4F3F6]">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2.5 rounded-lg border text-sm placeholder:text-gray-400 transition-all font-merriweather-sans focus:outline-none focus:ring-2 focus:border-transparent
            bg-white dark:bg-[#1a2f36] text-[#193C43] dark:text-[#F4F3F6] dark:placeholder:text-gray-500
            ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 dark:border-gray-600 focus:ring-[#33CCB3]"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#193C43] dark:hover:text-[#F4F3F6] transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-merriweather-sans animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
}
