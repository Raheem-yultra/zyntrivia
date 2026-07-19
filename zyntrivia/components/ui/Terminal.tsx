"use client";

import { useEffect, useRef, useState } from "react";

type StageState = "pending" | "running" | "ok";

const STAGES = [
  { label: "WEBHOOK RECEIVED", ms: 112 },
  { label: "PAYLOAD PARSED", ms: 48 },
  { label: "LEAD ENRICHED", ms: 610 },
  { label: "ROUTED TO OWNER", ms: 95 },
  { label: "CRM UPDATED", ms: 540 },
] as const;

const TOTAL_LABEL = "1.4s";

/**
 * Hero HUD panel — a real DOM pipeline that runs, completes, and loops.
 * Height is fixed to prevent layout shift. Respects prefers-reduced-motion
 * by rendering the completed state statically.
 */
export function Terminal() {
  const [states, setStates] = useState<StageState[]>(() =>
    STAGES.map(() => "pending"),
  );
  const [done, setDone] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setStates(STAGES.map(() => "ok"));
      setDone(true);
      return;
    }

    let cancelled = false;
    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(() => !cancelled && fn(), delay);
      timers.current.push(t);
    };

    const runCycle = () => {
      setStates(STAGES.map(() => "pending"));
      setDone(false);
      let at = 400;
      STAGES.forEach((stage, i) => {
        schedule(() => {
          setStates((prev) => prev.map((s, j) => (j === i ? "running" : s)));
        }, at);
        at += stage.ms;
        schedule(() => {
          setStates((prev) => prev.map((s, j) => (j === i ? "ok" : s)));
        }, at);
        at += 120;
      });
      schedule(() => setDone(true), at + 100);
      schedule(runCycle, at + 4200);
    };

    runCycle();
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div
      className="w-full rounded-md border border-outline-variant bg-surface-dim font-mono text-[13px]"
      aria-label="Live pipeline demonstration"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
        <span className="text-[11px] uppercase tracking-[0.2em] text-outline">
          PIPELINE / INBOUND-LEAD
        </span>
        <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
          <span
            className={`h-[6px] w-[6px] rounded-full ${done ? "bg-signal-ok" : "bg-primary"}`}
          />
          <span className={done ? "text-signal-ok" : "text-primary"}>
            {done ? "LIVE" : "RUNNING"}
          </span>
        </span>
      </div>
      {/* Stage list — fixed height, one row per stage */}
      <div className="space-y-3 px-5 py-5">
        {STAGES.map((stage, i) => {
          const s = states[i];
          return (
            <div key={stage.label} className="flex h-5 items-center gap-3">
              <span className="text-outline-dim">
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <span
                className={
                  s === "pending"
                    ? "text-outline-dim"
                    : s === "running"
                      ? "text-on-surface"
                      : "text-on-surface-variant"
                }
              >
                {stage.label}
              </span>
              <span className="ml-auto tabular-nums">
                {s === "ok" && (
                  <span className="text-signal-ok">
                    OK <span className="text-outline-dim">{stage.ms}ms</span>
                  </span>
                )}
                {s === "running" && (
                  <span className="text-primary">
                    RUN<span className={reduced ? "" : "animate-blink"}>_</span>
                  </span>
                )}
                {s === "pending" && <span className="text-outline-dim">·</span>}
              </span>
            </div>
          );
        })}
        {/* Summary row — height reserved */}
        <div className="flex h-6 items-center justify-between border-t border-outline-variant pt-3">
          <span className="text-outline-dim">TOTAL</span>
          <span
            className={`tabular-nums transition-opacity duration-150 ${done ? "opacity-100 text-signal-ok" : "opacity-0"}`}
          >
            COMPLETE · {TOTAL_LABEL}
          </span>
        </div>
      </div>
    </div>
  );
}
