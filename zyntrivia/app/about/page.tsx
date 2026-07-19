import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Zyntrivia is an engineering studio building internal tools, AI automation, and full-stack applications. Small on purpose. Judge us on the work.",
};

// TODO(trust stack): add the Fiverr profile and company LinkedIn URLs here
// once they exist — per the plan, an unlinked claim is worse than no claim.
const PROOF_LINKS = [
  { label: "GitHub", href: "https://github.com/zyntrivia", external: true },
  { label: "Live demos", href: "/work", external: false },
];

export default function AboutPage() {
  return (
    <main className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <span className="eyebrow mb-4 block text-primary">About</span>
      <h1 className="mb-stack-lg max-w-4xl font-display text-headline-md leading-[1.05] text-on-surface md:text-display-xl">
        Zyntrivia is an engineering studio.
      </h1>

      <div className="max-w-measure space-y-8 text-lg leading-relaxed text-on-surface-variant">
        <p>
          We build internal tools, AI automation, and full-stack applications
          for businesses that have outgrown their spreadsheets and their
          subscriptions.
        </p>
        <p>
          We&apos;re small on purpose. The person who scopes your project is
          the person who builds it — there&apos;s no account manager, no
          handoff, no telephone game between the person who understood the
          problem and the person writing the code.
        </p>
        <p>
          We work from Karachi (UTC+5), which puts us inside the European
          working day and across the US Eastern morning. Our code is on
          GitHub. Our systems are deployed and clickable. Judge us on those.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        {PROOF_LINKS.map((l) =>
          l.external ? (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-outline-variant px-6 py-3 font-display text-label-sm uppercase tracking-[0.12em] text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              {l.label} ↗
            </a>
          ) : (
            <Link
              key={l.label}
              href={l.href}
              className="border border-outline-variant px-6 py-3 font-display text-label-sm uppercase tracking-[0.12em] text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              {l.label}
            </Link>
          ),
        )}
      </div>

      {/* The terms that make anonymity safe to buy from */}
      <section className="mt-section-mobile max-w-3xl md:mt-32">
        <span className="eyebrow mb-stack-md block text-outline">
          How engagements work
        </span>
        <ul className="divide-y divide-outline-variant border-y border-outline-variant text-body-md text-on-surface-variant">
          {[
            "You own the code and the repository from day one.",
            "NDA on request. DPA available.",
            "Invoiced in USD or EUR via Stripe or Wise.",
            "Quotes within 24 hours. Replies same business day.",
            "Karachi, UTC+5 — full working-day overlap with Europe, 4+ hours daily overlap with US Eastern.",
          ].map((line) => (
            <li key={line} className="flex items-baseline gap-4 py-4">
              <span aria-hidden className="font-mono text-[11px] text-primary">
                —
              </span>
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-section-mobile border-t border-outline-variant pt-16 text-center md:mt-32">
        <h2 className="mb-8 font-display text-headline-md text-on-surface">
          The work is the biography.
        </h2>
        <div className="flex justify-center gap-6">
          <Button href="/work" variant="secondary" className="px-10 py-5">
            See the work
          </Button>
          <Button href="/quote" className="px-10 py-5">
            Request a Quote
          </Button>
        </div>
      </section>
    </main>
  );
}
