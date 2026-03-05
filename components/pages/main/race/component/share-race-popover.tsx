"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  url: string;
  title: string;
}

const socialPlatforms = [
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "messenger",
    label: "Messenger",
    color: "#0099FF",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=0&redirect_uri=${encodeURIComponent(url)}`,
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#E4405F",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    getUrl: () => null, // Instagram doesn't support direct URL sharing — copy link instead
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    getUrl: () => null, // TikTok doesn't support direct URL sharing — copy link instead
  },
];

export default function ShareRacePopover({ url, title }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: (typeof socialPlatforms)[0]) => {
    const shareUrl = platform.getUrl(url);
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    } else {
      // Platforms that don't support direct sharing — copy link
      handleCopyLink();
      toast.success(`Link copied! Paste it in ${platform.label}.`);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-raleway font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-[#2A2A2E] transition-colors cursor-pointer"
      >
        <Share2 size={16} />
        Share This Race
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[#1C1C1E] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 p-3 animate-scale-in z-20">
          <p className="font-merriweather-sans text-[10px] text-gray-400 uppercase tracking-wider mb-2 px-1">
            Share via
          </p>

          {/* Social Buttons Grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform)}
                className="flex flex-col items-center gap-1.5 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2A2A2E] transition-colors cursor-pointer"
                title={`Share on ${platform.label}`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.icon}
                </div>
                <span className="text-[10px] font-merriweather-sans text-gray-500 dark:text-gray-400">
                  {platform.label}
                </span>
              </button>
            ))}
          </div>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm font-merriweather-sans text-foreground hover:bg-gray-200 dark:hover:bg-[#3A3A3E] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy Link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
