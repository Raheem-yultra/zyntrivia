"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * Route-level error boundary. A studio that sells "systems that fail loudly and
 * recover" should not hand visitors an unstyled stack trace: this reports the
 * failure in the site's own language, offers a real retry, and always leaves a
 * human escape hatch (email) so a broken page never costs a lead.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <span className="eyebrow mb-4 block text-signal-alert">
        Stage failed
      </span>
      <h1 className="mb-6 max-w-3xl font-display text-headline-md leading-[1.05] text-on-surface md:text-display-lg">
        Something broke on our side.
      </h1>
      <p className="mb-10 max-w-xl text-lg leading-relaxed text-on-surface-variant">
        This one is ours, not yours. The error has been logged. Retrying often
        works — the page may have failed on a transient fetch.
      </p>

      {error.digest && (
        <p className="mb-10 font-mono text-[12px] uppercase tracking-[0.08em] text-outline-dim">
          Reference: {error.digest}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 font-display text-label-sm uppercase tracking-[0.12em] text-white transition-all duration-150 ease-mechanical hover:brightness-110"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 border border-outline-variant px-8 py-4 font-display text-label-sm uppercase tracking-[0.12em] text-on-surface transition-colors hover:border-outline"
        >
          Back to home
        </Link>
      </div>

      <p className="mt-10 text-body-md text-on-surface-variant">
        Still stuck? Email{" "}
        <a
          href={`mailto:${SITE.email}`}
          className="text-primary underline underline-offset-4"
        >
          {SITE.email}
        </a>{" "}
        and we&apos;ll reply the same business day.
      </p>
    </main>
  );
}
