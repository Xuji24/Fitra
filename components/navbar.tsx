"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/logo";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder for auth state
  useEffect(() => {
    function checkAuth() {
      setIsLoggedIn(true);
    }
    checkAuth();

  },[])
  return (
    <nav className="w-full bg-[#F4F3F6] px-4 sm:px-6 lg:p-8 py-3 sm:py-4 flex items-center justify-between lg:justify-start gap-4 lg:gap-10 relative">
      <div className="w-40 sm:w-24 lg:w-52 lg:ml-10 shrink-0 absolute left-4 lg:left-0">
        <Logo />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-6 lg:space-x-10 flex-1 justify-end">
        <a
          href="#"
          className="font-raleway font-bold text-sm lg:text-base  hover:text-[#33CCB3] transition-colors"
        >
          Home
        </a>
        <a
          href="#"
          className="font-raleway font-bold text-sm lg:text-base  hover:text-[#33CCB3] transition-colors"
        >
          Race
        </a>
        <a
          href="#"
          className="font-raleway font-bold text-sm lg:text-base  hover:text-[#33CCB3] transition-colors"
        >
          Activities
        </a>
        <a
          href="#"
          className="font-raleway font-bold text-sm lg:text-base  hover:text-[#33CCB3] transition-colors"
        >
          FAQs
        </a>
        <a
          href="#"
          className="font-raleway font-bold text-sm lg:text-base  hover:text-[#33CCB3] transition-colors"
        >
          Contact
        </a>
        {/* Desktop Sign In Button */}
        <div className="hidden lg:block shrink-0">
            <a href="/login" className="font-raleway font-bold text-sm sm:text-base bg-[#F4F3F6] border drop-shadow-[0_3px_4px_#193C43] text-[#193C43] hover:bg-[#e7e6e9] transition-colors px-6 sm:px-8 py-2 sm:py-3 rounded-full cursor-pointer">
            Sign In
            </a>
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-white hover:text-[#33CCB3] transition-colors ml-auto"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1a2f36] lg:hidden flex flex-col px-4 py-4 space-y-3 border-t border-[#33CCB3]/20">
          <a
            href="#"
            className="font-raleway font-bold text-sm text-white hover:text-[#33CCB3] transition-colors py-2"
          >
            Home
          </a>
          <a
            href="#"
            className="font-raleway font-bold text-sm text-white hover:text-[#33CCB3] transition-colors py-2"
          >
            Race
          </a>
          <a
            href="#"
            className="font-raleway font-bold text-sm text-white hover:text-[#33CCB3] transition-colors py-2"
          >
            Activities
          </a>
          <a
            href="#"
            className="font-raleway font-bold text-sm text-white hover:text-[#33CCB3] transition-colors py-2"
          >
            Leaderboard
          </a>
          <a
            href="#"
            className="font-raleway font-bold text-sm text-white hover:text-[#33CCB3] transition-colors py-2"
          >
            Contact
          </a>
          {isLoggedIn ? (
            <a
              href="/profile"
              className="font-raleway font-bold text-sm text-white hover:text-[#33CCB3] transition-colors py-2"
            >
              Profile
            </a>
          ) : (
            <a
              href="/login"
              className="font-raleway font-bold text-sm text-white hover:text-[#33CCB3] transition-colors py-2"
            >
              Sign In
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
