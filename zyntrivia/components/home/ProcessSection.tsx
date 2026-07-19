const STEPS = [
  {
    n: "01",
    title: "Blueprint Session",
    body: "We map your current chaos and define the engineering fix. Fixed scope, fixed price, ship date — in writing, within 24 hours.",
  },
  {
    n: "02",
    title: "Scoped Build",
    body: "Focused development in short sprints. You see working software weekly. No feature creep, no surprise invoices.",
  },
  {
    n: "03",
    title: "Pressure Test",
    body: "Rigorous QA under real-world data loads, failure injection, and user edge-cases before anything touches production.",
  },
  {
    n: "04",
    title: "Seamless Hand-off",
    body: "Production launch, documentation, and training. You hold the keys to the repo — and everything else.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="border-y border-outline-variant bg-surface-dim">
      <div className="section-pad section-x mx-auto max-w-container">
        <span className="eyebrow mb-stack-lg block text-outline">How It Works</span>
        <div className="grid gap-12 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative space-y-4">
              {/* Connecting rail motif between steps (desktop) */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-8 top-[7px] hidden h-px w-[calc(100%+3rem-2rem)] bg-outline-variant md:block"
                />
              )}
              <span className="relative flex items-center gap-3">
                <span className="h-[7px] w-[7px] rounded-full bg-primary" />
                <span className="bg-surface-dim pr-2 font-mono text-[13px] tracking-[0.08em] text-primary">
                  {step.n}
                </span>
              </span>
              <h4 className="font-display text-xl text-on-surface">{step.title}</h4>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
