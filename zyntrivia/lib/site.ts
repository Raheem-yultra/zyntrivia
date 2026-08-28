export const SITE = {
  name: "Zyntrivia",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zyntrivia.com",
  tagline: "Full-Stack Engineering & AI Automation",
  location: "Karachi (UTC+5) — overlapping EU and US Eastern",
  email: "hello@zyntrivia.com",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
] as const;
