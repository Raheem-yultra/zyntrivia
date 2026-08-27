import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page doesn't exist — here's the way back.",
};

/**
 * A 404 in the house style: the pipeline reports a failed stage rather than
 * apologising. Every route the visitor plausibly wanted is one click away, so
 * a bad link never dead-ends the funnel.
 */
const DESTINATIONS = [
  { href: "/services", label: "Services", hint: "What we build" },
  { href: "/work", label: "Work", hint: "Case studies and live demos" },
  { href: "/process", label: "Process", hint: "How we scope and ship" },
  { href: "/about", label: "About", hint: "Who you'd be working with" },
];

export default function NotFound() {
  return (
    <main className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <span className="eyebrow mb-4 block text-signal-alert">Error 404</span>
      <h1 className="mb-6 max-w-3xl font-display text-headline-md leading-[1.05] text-on-surface md:text-display-xl">
        This route doesn&apos;t exist.
      </h1>
      <p className="mb-12 max-w-xl text-lg leading-relaxed text-on-surface-variant">
        The link is broken or the page has moved. Nothing is wrong with your
        connection — the address simply isn&apos;t one of ours.
      </p>

      <div className="mb-16 max-w-3xl divide-y divide-outline-variant border-y border-outline-variant">
        {DESTINATIONS.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group flex items-center justify-between gap-6 py-6"
          >
            <span className="flex flex-col gap-1">
              <span className="font-display text-xl text-on-surface transition-colors group-hover:text-primary md:text-2xl">
                {d.label}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-outline-dim">
                {d.hint}
              </span>
            </span>
            <span
              aria-hidden
              className="font-mono text-outline transition-transform duration-150 ease-mechanical group-hover:translate-x-2"
            >
              →
            </span>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-6">
        <Button href="/">Back to home</Button>
        <Button href="/quote" variant="secondary">
          Request a quote
        </Button>
      </div>
    </main>
  );
}
