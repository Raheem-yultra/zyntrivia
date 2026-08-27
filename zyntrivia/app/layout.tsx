import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zyntrivia.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zyntrivia — Full-Stack Engineering & AI Automation",
    template: "%s — Zyntrivia | Full-Stack Engineering & AI Automation",
  },
  description:
    "Engineering studio building internal tools, AI workflow automation, and full-stack applications for businesses that have outgrown their spreadsheets. Scoped in days, shipped in weeks.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable}`}
    >
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body>
        <a
          href="#main-content"
          className="absolute left-4 top-4 z-[60] -translate-y-24 bg-primary px-5 py-3 font-display text-label-sm uppercase tracking-[0.12em] text-white transition-transform duration-150 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Nav />
        <div id="main-content" className="pt-[72px]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
