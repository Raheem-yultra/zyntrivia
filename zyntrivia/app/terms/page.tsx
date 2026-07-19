import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the Zyntrivia website and services.",
};

export default function TermsPage() {
  return (
    <main className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <span className="eyebrow mb-4 block text-outline">Legal</span>
      <h1 className="mb-4 font-display text-headline-md text-on-surface md:text-headline-lg">
        Terms of Service
      </h1>
      <p className="mb-stack-lg font-mono text-[12px] uppercase tracking-[0.08em] text-outline-dim">
        Last updated: July 2026
      </p>

      <div className="max-w-measure space-y-8 text-body-md leading-relaxed text-on-surface-variant [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-on-surface">
        <h2>This website</h2>
        <p>
          The content on this site is provided for information. The pipeline
          demo and leak calculator produce illustrative output, not
          professional advice; requesting a quote creates no obligation on
          either side.
        </p>

        <h2>Engagements</h2>
        <p>
          Client work is governed by a written agreement issued with each
          quote: fixed scope, fixed price, and a ship date. Unless that
          agreement says otherwise, all intellectual property in custom work
          is assigned to the client on payment, and the client owns the
          repository from day one.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Don&apos;t abuse the interactive demos — automated scraping,
          circumventing rate limits, or submitting URLs you don&apos;t have the
          right to point us at. We may block traffic that does.
        </p>

        <h2>Liability</h2>
        <p>
          This website is provided &quot;as is&quot; without warranty. To the
          extent permitted by law, Zyntrivia is not liable for indirect or
          consequential loss arising from use of this site. Liability under
          client agreements is defined in those agreements.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href="mailto:hello@zyntrivia.com" className="text-primary underline underline-offset-4">
            hello@zyntrivia.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
