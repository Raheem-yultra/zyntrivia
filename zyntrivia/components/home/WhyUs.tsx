const POINTS = [
  {
    title: "The person who scopes it builds it",
    body: "No account manager, no handoff, no telephone game between the person who understood the problem and the person writing the code.",
  },
  {
    title: "You own everything",
    body: "The repository, the infrastructure, the IP — assigned to you in writing from day one. No licensing fees, no hostage risk.",
  },
  {
    title: "Fixed scope, fixed price, in writing",
    body: "You'll have a number and a ship date within 24 hours of your request. Neither moves unless the scope does.",
  },
  {
    title: "Engineered, not wired together",
    body: "Retries, audit trails, idempotency, observability. Our systems fail loudly and recover — they don't break silently three months in.",
  },
  {
    title: "Time-zone coverage, not time-zone excuses",
    body: "Karachi, UTC+5 — a full working-day overlap with Europe and 4+ hours daily with US Eastern. Replies same business day.",
  },
];

export function WhyUs() {
  return (
    <section id="why" className="section-pad section-x mx-auto max-w-container">
      <span className="eyebrow mb-stack-lg block text-outline">Why Zyntrivia</span>
      <div className="divide-y divide-outline-variant border-y border-outline-variant">
        {POINTS.map((p, i) => (
          <div
            key={p.title}
            className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline"
          >
            <span className="font-mono text-[12px] text-outline-dim md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-xl text-on-surface md:col-span-4 md:text-2xl">
              {p.title}
            </h3>
            <p className="max-w-measure text-body-md text-on-surface-variant md:col-span-7">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
