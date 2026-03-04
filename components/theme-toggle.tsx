"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#1C1C1E] text-foreground hover:bg-gray-50 dark:hover:bg-[#2A2A2E] transition-colors cursor-pointer"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {/* Use CSS-based show/hide to avoid hydration mismatch */}
      <Sun size={18} className="hidden dark:block" />
      <Moon size={18} className="block dark:hidden" />
    </button>
  );
}
