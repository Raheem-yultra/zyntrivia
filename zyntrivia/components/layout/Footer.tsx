import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-dim">
      <div className="mx-auto flex max-w-container flex-col justify-between gap-8 px-margin-mobile py-stack-lg md:flex-row md:items-center md:px-gutter">
        <div className="flex flex-col gap-2">
          <div className="font-display text-xl font-medium text-on-surface">
            {SITE.name}
          </div>
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-outline-dim">
            {SITE.location}
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <a
            href="https://github.com/zyntrivia"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-label-sm uppercase tracking-[0.12em] text-outline transition-colors hover:text-primary"
          >
            GitHub
          </a>
          <Link
            href="/privacy"
            className="font-display text-label-sm uppercase tracking-[0.12em] text-outline transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="font-display text-label-sm uppercase tracking-[0.12em] text-outline transition-colors hover:text-primary"
          >
            Terms of Service
          </Link>
          <span className="font-display text-label-sm uppercase tracking-[0.12em] text-outline-dim">
            © {new Date().getFullYear()} Zyntrivia Engineering Studio
          </span>
        </div>
      </div>
    </footer>
  );
}
