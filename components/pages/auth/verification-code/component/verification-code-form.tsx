"use client";

import { useState, useRef, useTransition, KeyboardEvent, ClipboardEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/shadcn/button";
import { Loader2 } from "lucide-react";
import { verifyOtp } from "@/app/(auth)/actions";

const CODE_LENGTH = 6;

export default function VerificationCodeForm() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState<string | undefined>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const handleChange = (index: number, value: string) => {
    // Allow only single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (isSubmitted) {
      const joined = newCode.join("");
      if (joined.length < CODE_LENGTH) {
        setError("Please enter the full 6-digit code");
      } else {
        setError(undefined);
      }
    }

    // Auto-focus next input
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;

    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const joined = code.join("");
    if (joined.length < CODE_LENGTH) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setError(undefined);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("token", joined);

      const result = await verifyOtp(formData);
      if (!result.success && result.error) {
        setAuthError(result.error);
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

      {/* No Email Warning */}
      {!email && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 animate-slide-up">
          <p className="text-sm text-yellow-600 dark:text-yellow-400 font-merriweather-sans">No email found. Please go back and sign up again.</p>
        </div>
      )}

      {/* Code Label */}
      <div className="animate-slide-up animation-delay-100">
        <label className="font-raleway font-semibold text-xs text-[#1A1A1A]/70 dark:text-white/60 uppercase tracking-wider mb-2 block">
          Code
        </label>

        {/* Code Inputs */}
        <div className="flex gap-3 justify-center">
          {Array.from({ length: CODE_LENGTH }).map((_, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-14 text-center text-lg font-semibold rounded-xl border transition-all font-merriweather-sans focus:outline-none focus:ring-2 focus:border-transparent
                bg-[#F5F5F0] dark:bg-[#1C1C1E] text-[#1A1A1A] dark:text-white
                ${error ? "border-red-500 focus:ring-red-400" : "border-black/5 dark:border-white/5 focus:ring-[#FF5733]/50"}`}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-merriweather-sans mt-1 animate-slide-up">
            {error}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="animate-slide-up animation-delay-200">
        <Button
          type="submit"
          disabled={isPending || !email}
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
