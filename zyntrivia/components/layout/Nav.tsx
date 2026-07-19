"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-margin-mobile md:px-gutter">
        <Link
          href="/"
          className="font-display text-xl font-medium tracking-tight text-on-surface"
        >
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display text-label-sm uppercase tracking-[0.12em] transition-colors duration-150 ${
                  active
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/quote"
            className="bg-primary px-6 py-3 font-display text-label-sm uppercase tracking-[0.12em] text-white transition-all duration-150 hover:brightness-110"
          >
            Request a Quote
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-on-surface md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden className="font-mono text-sm">
            {open ? "[x]" : "[=]"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="border-t border-outline-variant bg-background md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col px-margin-mobile py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-outline-variant py-4 font-display text-label-sm uppercase tracking-[0.12em] text-on-surface-variant"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className="mt-4 bg-primary px-6 py-4 text-center font-display text-label-sm uppercase tracking-[0.12em] text-white"
            >
              Request a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
