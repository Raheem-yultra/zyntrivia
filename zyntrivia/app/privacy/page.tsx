import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Zyntrivia collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="section-x mx-auto max-w-container pb-section-mobile pt-16 md:pb-section-desktop md:pt-24">
      <span className="eyebrow mb-4 block text-outline">Legal</span>
      <h1 className="mb-4 font-display text-headline-md text-on-surface md:text-headline-lg">
        Privacy Policy
      </h1>
      <p className="mb-stack-lg font-mono text-[12px] uppercase tracking-[0.08em] text-outline-dim">
        Last updated: July 2026
      </p>

      <div className="max-w-measure space-y-8 text-body-md leading-relaxed text-on-surface-variant [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-on-surface">
        <h2>What we collect</h2>
        <p>
          When you submit the quote form or the calculator email capture, we
          collect what you type: your name, email address, and anything you
          tell us about your company and project. If you provide your company
          website, we may fetch its public pages to prepare your quote.
        </p>
        <p>
          The live pipeline demo fetches the public URL you provide, processes
          its public content to generate the demonstration output, and caches
          the result briefly. Demo inputs are rate-limited per IP address.
        </p>
        <p>
          Our analytics are cookieless and aggregate (Plausible). We do not
          run advertising trackers and we do not sell data — anyone&apos;s, ever.
        </p>

        <h2>How we use it</h2>
        <p>
          To reply to your request, prepare your quote, and — if you become a
          client — deliver the engagement. Lead data lives in our database and
          our email tooling; it is not shared with third parties beyond the
          processors that make those functions work (hosting, database, email
          delivery).
        </p>

        <h2>Your rights</h2>
        <p>
          Ask us what we hold about you, ask us to correct it, or ask us to
          delete it — we&apos;ll do so within 30 days. Email{" "}
          <a href="mailto:hello@zyntrivia.com" className="text-primary underline underline-offset-4">
            hello@zyntrivia.com
          </a>
          . EU visitors: a DPA is available on request.
        </p>

        <h2>Retention</h2>
        <p>
          Quote requests are kept while relevant to an active or potential
          engagement, then deleted. Demo caches expire within 24 hours.
        </p>
      </div>
    </main>
  );
}
