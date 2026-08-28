"use client";

import { motion, useReducedMotion } from "framer-motion";

type ProblemCard = { title: string; body: string };

/**
 * The only red on the page besides the calculator's implication: a red
 * hairline draws across each card's top edge on scroll-into-view,
 * staggered 80ms — the visual of money leaking.
 */
export function Problem({ problems }: { problems: ProblemCard[] }) {
  const reduced = useReducedMotion();

  return (
    <section id="problem" className="section-pad section-x mx-auto max-w-container">
      <div className="mb-20 max-w-4xl md:mb-28">
        <span className="eyebrow mb-stack-md block text-outline">The Problem</span>
        <h2 className="font-display text-headline-md leading-tight text-on-surface-variant md:text-headline-lg">
          Internal friction is the silent killer of scale. You&apos;re losing
          thousands every month in manual data entry and broken hand-offs.
        </h2>
      </div>
      <div className="grid gap-12 md:grid-cols-3 md:gap-16">
        {problems.map((p, i) => (
          <div key={p.title} className="relative pt-6">
            <motion.span
              aria-hidden
              className="absolute left-0 top-0 h-px w-full origin-left bg-signal-alert"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.5, delay: i * 0.08, ease: [0.2, 0, 0, 1] }
              }
            />
            <span className="mb-stack-sm block font-mono text-[12px] tracking-[0.08em] text-primary-text">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mb-stack-sm font-display text-2xl text-on-surface">
              {p.title}
            </h3>
            <p className="text-body-md text-on-surface-variant">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
