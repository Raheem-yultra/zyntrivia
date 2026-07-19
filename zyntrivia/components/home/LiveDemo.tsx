"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { DEMO_STAGES, REPLAY, type DemoEvent } from "@/lib/demo";

type StageState = { status: "pending" | "running" | "ok"; ms?: number };
type Phase = "idle" | "running" | "done";

const EXAMPLE_URL = "https://hartleysupply.example.com";

const freshStages = (): StageState[] =>
  DEMO_STAGES.map(() => ({ status: "pending" }));

export function LiveDemo() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [stages, setStages] = useState<StageState[]>(freshStages);
  const [isReplay, setIsReplay] = useState(false);
  const [result, setResult] = useState<{ summary: string; email: string } | null>(null);
  const [totalMs, setTotalMs] = useState(0);
  const runId = useRef(0);

  function applyEvent(ev: DemoEvent) {
    if (ev.type === "stage") {
      setStages((prev) =>
        prev.map((s, i) =>
          i === ev.index
            ? ev.status === "ok"
              ? { status: "ok", ms: ev.ms }
              : { status: "running" }
            : s,
        ),
      );
    } else if (ev.type === "replay") {
      setIsReplay(true);
    } else if (ev.type === "result") {
      setResult({ summary: ev.summary, email: ev.email });
    } else if (ev.type === "done") {
      setTotalMs(ev.totalMs);
      setPhase("done");
    }
  }

  /** Canned replay — the widget never shows an error to a prospect. */
  function playReplay(id: number) {
    setStages(freshStages());
    setResult(null);
    setIsReplay(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStages(DEMO_STAGES.map((_, i) => ({ status: "ok", ms: REPLAY.stageMs[i] })));
      setResult({ summary: REPLAY.summary, email: REPLAY.email });
      setTotalMs(REPLAY.totalMs);
      setPhase("done");
      return;
    }
    let at = 200;
    REPLAY.stageMs.forEach((ms, i) => {
      setTimeout(() => {
        if (runId.current === id) applyEvent({ type: "stage", index: i, status: "running" });
      }, at);
      at += Math.min(ms, 1400); // compress long stages so the replay stays snappy
      setTimeout(() => {
        if (runId.current === id) applyEvent({ type: "stage", index: i, status: "ok", ms });
      }, at);
    });
    setTimeout(() => {
      if (runId.current !== id) return;
      applyEvent({ type: "result", summary: REPLAY.summary, email: REPLAY.email });
      applyEvent({ type: "done", totalMs: REPLAY.totalMs });
    }, at + 200);
  }

  async function run(targetUrl?: string) {
    const raw = (targetUrl ?? url).trim() || EXAMPLE_URL;
    const id = ++runId.current;
    setPhase("running");
    setStages(freshStages());
    setResult(null);
    setIsReplay(false);
    setTotalMs(0);

    try {
      const res = await fetch("/api/demo/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: raw }),
      });
      if (!res.ok || !res.body) throw new Error("demo unavailable");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (runId.current !== id) return;
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          applyEvent(JSON.parse(line) as DemoEvent);
        }
      }
    } catch {
      if (runId.current === id) playReplay(id);
    }
  }

  const seconds = (totalMs / 1000).toFixed(1);

  return (
    <section id="demo" className="border-y border-outline-variant bg-surface-dim">
      <div className="section-pad section-x mx-auto max-w-container">
        <span className="eyebrow mb-stack-md block text-outline">See It Run</span>
        <h2 className="mb-4 font-display text-headline-md text-on-surface md:text-headline-lg">
          We&apos;d rather show you than tell you.
        </h2>
        <p className="mb-stack-lg max-w-2xl text-body-md text-on-surface-variant">
          Paste a company URL. The pipeline reads the site, works out what the
          business does, finds the two workflows most worth automating — and
          drafts the outreach email. Live.
        </p>

        <div className="max-w-4xl">
          <form
            className="mb-8 flex flex-col gap-4 md:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (phase !== "running") void run();
            }}
          >
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={EXAMPLE_URL}
              aria-label="Company URL"
              className="flex-grow border border-outline-variant bg-surface px-6 py-4 font-mono text-[14px] text-on-surface outline-none transition-colors focus:border-primary"
            />
            <Button type="submit" disabled={phase === "running"} className="px-10">
              {phase === "running" ? "Running…" : "Run"}
            </Button>
          </form>
          <button
            type="button"
            className="mb-8 font-mono text-[12px] uppercase tracking-[0.08em] text-outline underline-offset-4 hover:text-primary hover:underline"
            onClick={() => {
              setUrl(EXAMPLE_URL);
              if (phase !== "running") void run(EXAMPLE_URL);
            }}
          >
            [ try an example ]
          </button>

          {/* Terminal output — height reserved so nothing shifts */}
          <div className="min-h-[340px] border border-outline-variant bg-surface font-mono text-[13px]">
            <div className="flex items-center justify-between border-b border-outline-variant px-6 py-3">
              <span className="text-[11px] uppercase tracking-[0.2em] text-outline">
                Output Log
              </span>
              {isReplay && (
                <span className="border border-outline-variant px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-outline">
                  Replay
                </span>
              )}
            </div>
            <div className="space-y-3 px-6 py-5">
              {phase === "idle" ? (
                <p className="text-outline-dim">
                  Waiting for input — paste a URL and press RUN.
                </p>
              ) : (
                DEMO_STAGES.map((label, i) => {
                  const s = stages[i];
                  return (
                    <div key={label} className="flex h-5 items-center gap-3">
                      <span className="text-outline-dim">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <span
                        className={
                          s.status === "pending"
                            ? "text-outline-dim"
                            : "text-on-surface-variant"
                        }
                      >
                        {label}
                      </span>
                      <span className="ml-auto tabular-nums">
                        {s.status === "ok" && (
                          <span className="text-signal-ok">
                            OK{" "}
                            <span className="text-outline-dim">
                              {s.ms && s.ms >= 1000
                                ? `${(s.ms / 1000).toFixed(1)}s`
                                : `${s.ms}ms`}
                            </span>
                          </span>
                        )}
                        {s.status === "running" && (
                          <span className="animate-pulse text-primary">RUNNING…</span>
                        )}
                        {s.status === "pending" && (
                          <span className="text-outline-dim">·</span>
                        )}
                      </span>
                    </div>
                  );
                })
              )}

              {result && (
                <div className="space-y-6 border-t border-outline-variant pt-5">
                  <div>
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-outline">
                      What this business does — and what to automate
                    </span>
                    <p className="whitespace-pre-wrap font-body text-[15px] leading-relaxed text-on-surface-variant">
                      {result.summary}
                    </p>
                  </div>
                  <div>
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-outline">
                      Drafted outreach
                    </span>
                    <pre className="overflow-x-auto whitespace-pre-wrap border-l-2 border-primary/30 pl-4 text-[13px] leading-relaxed text-on-surface-variant">
                      {result.email}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Closing card */}
          {phase === "done" && (
            <div className="mt-8 flex flex-col items-start justify-between gap-6 border border-outline-variant bg-surface p-8 md:flex-row md:items-center">
              <p className="text-lg text-on-surface">
                This ran in{" "}
                <span className="tabular-nums text-signal-ok">{seconds} seconds</span>
                . It&apos;s the same pipeline we&apos;d build into your business.
              </p>
              <Button href="/quote">Request a Quote</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
