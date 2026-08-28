import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { getProcessSteps } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How Zyntrivia scopes and ships: blueprint session, scoped build, pressure test, seamless hand-off. Fixed scope, fixed price, in writing.",
};

// Not CMS content — these are legal/contract terms, kept in code deliberately
// so a change here goes through review rather than a Studio edit.
const TERMS = [
  ["Code ownership", "You own the code and the repository from day one. IP assigned in writing."],
  ["Confidentiality", "NDA on request, before you tell us anything sensitive."],
  ["Data protection", "DPA available for EU clients."],
  ["Invoicing", "USD or EUR, via Stripe or Wise."],
  ["Response time", "Quotes within 24 hours. Replies same business day."],
];

export default async function ProcessPage() {
  const steps = await getProcessSteps();

  return (
    <main className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <span className="eyebrow mb-4 block text-primary-text">How It Works</span>
      <h1 className="mb-6 max-w-4xl font-display text-headline-md leading-[1.05] text-on-surface md:text-display-xl">
        Four steps. No mystery.
      </h1>
      <p className="mb-stack-lg max-w-2xl text-lg text-on-surface-variant">
        The process is deliberately boring: agree exactly what will be built,
        build it in the open, test it harder than production will, and hand
        over everything.
      </p>

      {/* Steps as a vertical pipeline */}
      <div className="mb-section-mobile max-w-3xl md:mb-32">
        {steps.map((s, i) => (
          <div key={s.title} className="relative flex gap-8 pb-16 last:pb-0">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[3px] top-4 h-full w-px bg-outline-variant"
              />
            )}
            <span className="relative mt-2 h-[7px] w-[7px] shrink-0 rounded-full bg-primary" />
            <div>
              <span className="mb-2 block font-mono text-[13px] tracking-[0.08em] text-primary-text">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mb-4 font-display text-2xl text-on-surface md:text-3xl">
                {s.title}
              </h2>
              <p className="max-w-measure text-body-md text-on-surface-variant">
                {s.longBody}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contract terms, stated in writing */}
      <section className="mb-section-mobile md:mb-32">
        <span className="eyebrow mb-stack-md block text-outline">
          The terms, in writing
        </span>
        <div className="max-w-3xl divide-y divide-outline-variant border-y border-outline-variant">
          {TERMS.map(([k, v]) => (
            <div key={k} className="grid gap-2 py-5 md:grid-cols-3">
              <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-outline">
                {k}
              </span>
              <span className="text-body-md text-on-surface-variant md:col-span-2">
                {v}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-outline-variant pt-16 text-center">
        <h2 className="mb-8 font-display text-headline-md text-on-surface">
          Step one takes three minutes.
        </h2>
        <div className="flex justify-center">
          <Button href="/quote" className="px-12 py-5">
            Request a Quote
          </Button>
        </div>
      </section>
    </main>
  );
}
