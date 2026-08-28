type WhyUsPoint = { title: string; body: string };

export function WhyUs({ points }: { points: WhyUsPoint[] }) {
  return (
    <section id="why" className="section-pad section-x mx-auto max-w-container">
      <span className="eyebrow mb-stack-lg block text-outline">Why Zyntrivia</span>
      <div className="divide-y divide-outline-variant border-y border-outline-variant">
        {points.map((p, i) => (
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
