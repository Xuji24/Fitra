"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {
  user: SupabaseUser;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
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

  // Extract display name or email initial
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  const menuItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F5F0] dark:bg-[#2A2A2E] hover:bg-[#FF5733]/10 dark:hover:bg-[#FF5733]/10 transition-colors cursor-pointer border border-black/5 dark:border-white/5"
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-[#FF5733] flex items-center justify-center text-white text-sm font-bold font-raleway">
          {initial}
        </div>
        <span className="hidden xl:block font-raleway font-semibold text-sm text-[#1A1A1A] dark:text-white max-w-24 truncate">
          {displayName}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#1A1A1A]/40 dark:text-white/40 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1C1C1E] rounded-xl border border-black/5 dark:border-white/10 shadow-xl overflow-hidden z-50">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
            <p className="font-raleway font-semibold text-sm text-[#1A1A1A] dark:text-white truncate">
              {displayName}
            </p>
            <p className="font-merriweather-sans text-xs text-[#1A1A1A]/40 dark:text-white/30 truncate mt-0.5">
              {user.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-merriweather-sans text-[#1A1A1A] dark:text-white hover:bg-[#FF5733]/5 dark:hover:bg-[#FF5733]/10 transition-colors"
              >
                <item.icon className="w-4 h-4 text-[#1A1A1A]/40 dark:text-white/40" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
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
