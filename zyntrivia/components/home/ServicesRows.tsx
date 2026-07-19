import Link from "next/link";

const SERVICES = [
  "Internal Tools",
  "AI Workflow Automation",
  "AI Agents & LLM Pipelines",
  "Full-Stack Web Applications",
  "SaaS MVP Builds",
  "API & System Integrations",
  "Data & Reporting Pipelines",
  "Maintenance & Retainers",
];

export function ServicesRows() {
  const left = SERVICES.slice(0, 4);
  const right = SERVICES.slice(4);

  const renderCol = (items: string[], offset: number) => (
    <div className="divide-y divide-outline-variant">
      {items.map((s, i) => (
        <Link
          key={s}
          href="/services"
          className="group flex items-center justify-between py-6"
        >
          <span className="flex items-baseline gap-4">
            <span className="font-mono text-[12px] text-outline-dim">
              {String(offset + i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-xl text-on-surface transition-colors group-hover:text-primary md:text-2xl">
              {s}
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
  );

  return (
    <section id="services" className="section-pad section-x mx-auto max-w-container">
      <span className="eyebrow mb-stack-lg block text-outline">What We Build</span>
      <div className="grid md:grid-cols-2 md:gap-x-24">
        {renderCol(left, 0)}
        {renderCol(right, 4)}
      </div>
    </section>
  );
}
