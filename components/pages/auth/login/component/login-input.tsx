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
    <div className="flex flex-col gap-1.5">
      <label className="font-raleway font-semibold text-xs text-[#1A1A1A]/70 dark:text-white/60 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border text-sm placeholder:text-[#1A1A1A]/25 dark:placeholder:text-white/20 transition-all font-merriweather-sans focus:outline-none focus:ring-2 focus:border-transparent
            bg-[#F5F5F0] dark:bg-[#1C1C1E] text-[#1A1A1A] dark:text-white
            ${error ? "border-red-500 focus:ring-red-400" : "border-black/5 dark:border-white/5 focus:ring-[#FF5733]/50"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 dark:text-white/30 hover:text-[#FF5733] transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
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
