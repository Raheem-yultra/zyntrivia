import Link from "next/link";
import { WORK } from "@/lib/work";

export function WorkPreview() {
  return (
    <section id="work" className="section-pad section-x mx-auto max-w-container">
      <span className="eyebrow mb-stack-lg block text-outline">Selected Work</span>
      <div className="space-y-24 md:space-y-32">
        {WORK.map((w) => (
          <article key={w.slug} className="max-w-4xl">
            <span className="mb-4 block font-mono text-[11px] uppercase tracking-[0.08em] text-outline-dim">
              Case Study · Built by Zyntrivia · {w.category}
            </span>
            <h3 className="mb-stack-md font-display text-4xl leading-none text-on-surface md:text-[64px]">
              {w.name}
            </h3>
            <p className="mb-stack-md max-w-2xl text-lg text-on-surface-variant md:text-xl">
              {w.headline}
            </p>
            <div className="mb-stack-md flex flex-wrap gap-2">
              {w.stack.map((t) => (
                <span
                  key={t}
                  className="border border-outline-variant bg-surface-container px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-outline"
                >
                  {t}
                </span>
              ))}
            </div>
            <Link
              href={`/work/${w.slug}`}
              className="group flex items-center gap-2 font-display text-label-sm uppercase tracking-[0.12em] text-primary"
            >
              View Case Study
              <span
                aria-hidden
                className="transition-transform duration-150 ease-mechanical group-hover:translate-x-2"
              >
                →
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
