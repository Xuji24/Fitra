"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AdminProfileDropdownProps {
  displayName: string;
  email: string;
}

export default function AdminProfileDropdown({
  displayName,
  email,
}: AdminProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/login");
    router.refresh();
  };

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
      >
        <div className="w-7 h-7 rounded-full bg-[#FF5733] flex items-center justify-center text-white text-xs font-bold font-raleway">
          {initial}
        </div>
        <span className="text-xs text-white/60 font-medium hidden sm:block">
          {displayName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/30 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1C1C1E] rounded-xl border border-black/5 dark:border-white/10 shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
            <p className="font-raleway font-semibold text-sm text-[#1A1A1A] dark:text-white truncate">
              {displayName}
            </p>
            <p className="font-merriweather-sans text-xs text-[#1A1A1A]/40 dark:text-white/30 truncate mt-0.5">
              {email}
            </p>
          </div>

          <div className="py-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-merriweather-sans text-[#1A1A1A] dark:text-white hover:bg-[#FF5733]/5 dark:hover:bg-[#FF5733]/10 transition-colors"
            >
              <User className="w-4 h-4 text-[#1A1A1A]/40 dark:text-white/40" />
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-merriweather-sans text-[#1A1A1A] dark:text-white hover:bg-[#FF5733]/5 dark:hover:bg-[#FF5733]/10 transition-colors"
            >
              <Settings className="w-4 h-4 text-[#1A1A1A]/40 dark:text-white/40" />
              Settings
            </Link>
          </div>

          <div className="border-t border-black/5 dark:border-white/5 py-1.5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-merriweather-sans text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
