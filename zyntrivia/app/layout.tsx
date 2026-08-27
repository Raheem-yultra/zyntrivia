import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zyntrivia.com";

const DESCRIPTION =
  "Engineering studio building internal tools, AI workflow automation, and full-stack applications for businesses that have outgrown their spreadsheets. Scoped in days, shipped in weeks.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zyntrivia — Full-Stack Engineering & AI Automation",
    template: "%s — Zyntrivia | Full-Stack Engineering & AI Automation",
  },
  description: DESCRIPTION,
  // Each page inherits this and overrides it via its own `alternates`.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Zyntrivia",
    url: siteUrl,
    title: "Zyntrivia — Full-Stack Engineering & AI Automation",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zyntrivia — Full-Stack Engineering & AI Automation",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#121316",
  colorScheme: "dark",
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
        {/* tabIndex -1 so the skip link actually moves focus, not just scroll */}
        <div id="main-content" tabIndex={-1} className="pt-[72px] outline-none">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
