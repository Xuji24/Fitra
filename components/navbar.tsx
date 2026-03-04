"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/logo";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import ProfileDropdown from "@/components/profile-dropdown";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="w-full bg-background px-4 sm:px-6 lg:p-8 py-3 sm:py-4 flex items-center justify-between lg:justify-start gap-4 lg:gap-10 relative">
      <div className="w-40 sm:w-24 lg:w-52 lg:ml-10 shrink-0 absolute left-4 lg:left-0">
        <Logo />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-6 lg:space-x-10 flex-1 justify-end">
        <Link
          href="/"
          className="font-raleway font-bold text-sm lg:text-base text-foreground hover:text-[#FF5733] transition-colors"
        >
          Home
        </Link>
        <Link
          href="/race"
          className="font-raleway font-bold text-sm lg:text-base text-foreground hover:text-[#FF5733] transition-colors"
        >
          Race
        </Link>
        <Link
          href="/activities"
          className="font-raleway font-bold text-sm lg:text-base text-foreground hover:text-[#FF5733] transition-colors"
        >
          Activities
        </Link>
        <Link
          href="/leaderboard"
          className="font-raleway font-bold text-sm lg:text-base text-foreground hover:text-[#FF5733] transition-colors"
        >
          Leaderboard
        </Link>
        <Link
          href="/contact"
          className="font-raleway font-bold text-sm lg:text-base text-foreground hover:text-[#FF5733] transition-colors"
        >
          Contact
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Desktop Auth — Profile Dropdown or Sign In */}
        <div className="hidden lg:block shrink-0">
          {loading ? (
            <div className="w-20 h-10 rounded-full bg-[#F5F5F0] dark:bg-[#2A2A2E] animate-pulse" />
          ) : user ? (
            <ProfileDropdown user={user} />
          ) : (
            <Link
              href="/login"
              className="font-raleway font-bold text-sm sm:text-base bg-[#FF5733] text-white hover:bg-[#E84E2E] transition-colors px-6 sm:px-8 py-2 sm:py-3 rounded-full cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-foreground hover:text-[#FF5733] transition-colors ml-auto"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1A1A1A] dark:bg-[#0D0D0D] lg:hidden flex flex-col px-4 py-4 space-y-3 border-t border-[#FF5733]/20 z-50">
          <Link
            href="/"
            className="font-raleway font-bold text-sm text-white hover:text-[#FF5733] transition-colors py-2"
          >
            Home
          </Link>
          <Link
            href="/race"
            className="font-raleway font-bold text-sm text-white hover:text-[#FF5733] transition-colors py-2"
          >
            Race
          </Link>
          <Link
            href="/activities"
            className="font-raleway font-bold text-sm text-white hover:text-[#FF5733] transition-colors py-2"
          >
            Activities
          </Link>
          <Link
            href="/leaderboard"
            className="font-raleway font-bold text-sm text-white hover:text-[#FF5733] transition-colors py-2"
          >
            Leaderboard
          </Link>
          <Link
            href="/contact"
            className="font-raleway font-bold text-sm text-white hover:text-[#FF5733] transition-colors py-2"
          >
            Contact
          </Link>
          <div className="flex items-center gap-3 py-2">
            <ThemeToggle />
            <span className="font-raleway font-bold text-sm text-white">
              Theme
            </span>
          </div>
          {user ? (
            <>
              <div className="border-t border-[#FF5733]/20 pt-3 mt-1">
                <div className="flex items-center gap-3 py-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#FF5733] flex items-center justify-center text-white text-sm font-bold font-raleway">
                    {(
                      user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      user.email?.split("@")[0] ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-raleway font-semibold text-sm text-white truncate">
                      {user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email?.split("@")[0]}
                    </p>
                    <p className="font-merriweather-sans text-[11px] text-white/40 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="font-raleway font-bold text-sm text-white hover:text-[#FF5733] transition-colors py-2 block"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="font-raleway font-bold text-sm text-white hover:text-[#FF5733] transition-colors py-2 block"
                >
                  Settings
                </Link>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    setIsOpen(false);
                    window.location.href = "/login";
                  }}
                  className="font-raleway font-bold text-sm text-red-400 hover:text-red-300 transition-colors py-2 block w-full text-left cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="font-raleway font-bold text-sm text-white hover:text-[#FF5733] transition-colors py-2"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
