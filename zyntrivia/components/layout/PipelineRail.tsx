"use client";

import { useEffect, useState } from "react";

export type RailStage = { id: string; label: string };

/**
 * The signature element: a fixed left rail rendering the page as a pipeline.
 * Each section is a stage; its dot ticks dim → blue (active) → green (passed)
 * as the visitor scrolls. Doubles as working navigation.
 * Desktop-only (2xl+) so it never overlaps the 1280px container.
 */
export function PipelineRail({ stages }: { stages: RailStage[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const sections = stages
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const onScroll = () => {
      const probe = window.innerHeight * 0.4;
      let current = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= probe) current = i;
      }
      setActiveIdx(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stages]);

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 2xl:flex"
    >
      {stages.map((stage, i) => {
        const state = i < activeIdx ? "ok" : i === activeIdx ? "active" : "pending";
        return (
          <a
            key={stage.id}
            href={`#${stage.id}`}
            className="group flex items-center gap-3"
          >
            <span
              className={`h-[7px] w-[7px] rounded-full transition-colors duration-150 ${
                state === "ok"
                  ? "bg-signal-ok"
                  : state === "active"
                    ? "bg-primary"
                    : "bg-outline-variant"
              }`}
            />
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-150 ${
                state === "active"
                  ? "text-on-surface"
                  : "text-outline-dim group-hover:text-outline"
              }`}
            >
              {stage.label}
              {state === "ok" && <span className="text-signal-ok"> [ok]</span>}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
