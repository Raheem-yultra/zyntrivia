import type { Metadata } from "next";
import Link from "next/link";
import { WORK } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies from the Zyntrivia studio — inventory systems, marketplaces, and AI automation, built in full and documented honestly.",
};

export default function WorkIndexPage() {
  return (
    <main className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <span className="eyebrow mb-stack-md block text-primary">Selected Work</span>
      <h1 className="mb-6 max-w-4xl font-display text-headline-md text-on-surface md:text-display-xl">
        Studio-built systems, documented honestly.
      </h1>
      <p className="mb-stack-lg max-w-2xl text-body-md text-on-surface-variant">
        Three systems built end-to-end by Zyntrivia. Every claim on these pages
        is an engineering fact about the software — something you can probe,
        benchmark, or ask us to demo — not an invented client outcome.
      </p>

      <div className="divide-y divide-outline-variant border-y border-outline-variant">
        {WORK.map((w) => (
          <Link
            key={w.slug}
            href={`/work/${w.slug}`}
            className="group grid gap-4 py-12 md:grid-cols-12 md:items-center"
          >
            <div className="md:col-span-3">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.08em] text-outline-dim">
                {w.category}
              </span>
              <span className="font-display text-3xl text-on-surface transition-colors group-hover:text-primary md:text-4xl">
                {w.name}
              </span>
            </div>
            <p className="max-w-xl text-body-md text-on-surface-variant md:col-span-6">
              {w.headline}
            </p>
            <div className="flex flex-wrap gap-2 md:col-span-2">
              {w.stack.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="border border-outline-variant px-2 py-1 font-mono text-[10px] uppercase text-outline"
                >
                  {t}
                </span>
              ))}
            </div>
            <span
              aria-hidden
              className="hidden font-mono text-outline transition-transform duration-150 ease-mechanical group-hover:translate-x-2 md:col-span-1 md:block md:text-right"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
