"use client";

import { Check, X } from "lucide-react";

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const rules: Rule[] = [
  { label: "8+ characters", test: (pw) => pw.length >= 8 },
  { label: "Uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "Number", test: (pw) => /[0-9]/.test(pw) },
  { label: "Symbol", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function getStrength(password: string): number {
  return rules.filter((r) => r.test(password)).length;
}

function getStrengthLabel(score: number): string {
  if (score === 0) return "";
  if (score <= 2) return "Weak";
  if (score <= 3) return "Fair";
  if (score <= 4) return "Good";
  return "Strong";
}

function getStrengthColor(score: number): string {
  if (score <= 2) return "bg-red-500";
  if (score <= 3) return "bg-[#FFB800]";
  if (score <= 4) return "bg-emerald-400";
  return "bg-emerald-500";
}

function getLabelColor(score: number): string {
  if (score <= 2) return "text-red-500";
  if (score <= 3) return "text-[#FFB800]";
  if (score <= 4) return "text-emerald-400";
  return "text-emerald-500";
}

export default function PasswordStrengthIndicator({ password }: { password: string }) {
  const score = getStrength(password);
  const label = getStrengthLabel(score);

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-1.5">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < score ? getStrengthColor(score) : "bg-[#1A1A1A]/10 dark:bg-white/10"
              }`}
            />
          ))}
        </div>
        {label && (
          <span className={`text-[10px] font-raleway font-bold uppercase tracking-wider ${getLabelColor(score)}`}>
            {label}
          </span>
        )}
      </div>

      {/* Requirement checklist */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <div key={rule.label} className="flex items-center gap-1">
              {passed ? (
                <Check className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
              ) : (
                <X className="w-2.5 h-2.5 text-[#1A1A1A]/25 dark:text-white/20 shrink-0" />
              )}
              <span
                className={`text-[9px] font-merriweather-sans transition-colors ${
                  passed
                    ? "text-emerald-500"
                    : "text-[#1A1A1A]/30 dark:text-white/20"
                }`}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
