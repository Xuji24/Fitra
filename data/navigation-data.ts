export interface NavLink {
  name: string;
  href: string;
}

export const quickLinksData: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Race", href: "/race" },
  { name: "Activities", href: "/activities" },
  { name: "Leaderboard", href: "/leaderboard" },
];

export const supportLinksData: NavLink[] = [
  { name: "Contact", href: "/contact" },
  { name: "FAQ's", href: "#" }
];

export interface SocialLink {
  label: string;
  href: string;
  icon: string; // SVG path data
}

export const socialLinksData: SocialLink[] = [
  {
    label: "Instagram",
    href: "#",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "#",
    icon: "facebook",
  },
  {
    label: "TikTok",
    href: "#",
    icon: "tiktok",
  },
  {
    label: "X",
    href: "#",
    icon: "x",
  },
];
