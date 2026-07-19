const CLAIMS = [
  "Rated 5★ on Fiverr",
  "You own the code",
  "NDA on request",
  "Quotes within 24 hours",
  "Invoiced in USD / EUR",
];

export function ProofStrip() {
  return (
    <section className="border-y border-outline-variant">
      <div className="section-x mx-auto flex max-w-container flex-wrap items-center gap-x-12 gap-y-3 py-6">
        {CLAIMS.map((claim, i) => (
          <span
            key={claim}
            className="flex items-center gap-12 font-mono text-[12px] uppercase tracking-[0.08em] text-outline"
          >
            {i > 0 && <span aria-hidden className="hidden opacity-30 md:inline">|</span>}
            {claim}
          </span>
        ))}
      </div>
    </section>
  );
}
