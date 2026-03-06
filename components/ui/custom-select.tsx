"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  size = "md",
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);
  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-1.5 text-xs gap-1.5"
      : "px-4 py-2.5 text-sm gap-2";
  const dropdownItemSize = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-4 py-2.5 text-sm";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`flex items-center justify-between w-full rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-[#1A1A1A] dark:text-white font-merriweather-sans outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${
          open
            ? "ring-2 ring-[#FF5733]"
            : "hover:ring-1 hover:ring-[#FF5733]/30"
        }`}
      >
        <span className={!selected && placeholder ? "text-[#1A1A1A]/30 dark:text-white/20" : ""}>
          {selected?.label ?? placeholder ?? "Select..."}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#1A1A1A]/40 dark:text-white/40 transition-transform shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[140px] rounded-xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-lg shadow-black/10 dark:shadow-black/30 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="py-1 max-h-52 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex items-center justify-between w-full ${dropdownItemSize} font-merriweather-sans transition-colors cursor-pointer ${
                  option.value === value
                    ? "text-[#FF5733] bg-[#FF5733]/5 font-semibold"
                    : "text-[#1A1A1A] dark:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#2A2A2E]"
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-3.5 h-3.5 text-[#FF5733] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
