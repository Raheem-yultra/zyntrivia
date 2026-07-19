"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";

const DEFAULTS = { people: 4, hours: 6, rate: 45 };

type Currency = "USD" | "EUR";

export function LeakCalculator() {
  const [people, setPeople] = useState(DEFAULTS.people);
  const [hours, setHours] = useState(DEFAULTS.hours);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const touched = useRef(false);

  // Deep-link: restore slider state from the query string on mount…
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const num = (k: string, min: number, max: number, fallback: number) => {
      const v = Number(q.get(k));
      return Number.isFinite(v) && v >= min && v <= max ? v : fallback;
    };
    setPeople(num("p", 1, 50, DEFAULTS.people));
    setHours(num("h", 1, 30, DEFAULTS.hours));
    setRate(num("r", 20, 150, DEFAULTS.rate));
    if (q.get("c") === "EUR") setCurrency("EUR");
  }, []);

  // …and encode it back so a visitor can share their own number — but only
  // once they've actually touched a control, never on plain page load.
  useEffect(() => {
    if (!touched.current) return;
    const q = new URLSearchParams(window.location.search);
    q.set("p", String(people));
    q.set("h", String(hours));
    q.set("r", String(rate));
    q.set("c", currency);
    window.history.replaceState(null, "", `${window.location.pathname}?${q}#calculator`);
  }, [people, hours, rate, currency]);

  const sym = currency === "USD" ? "$" : "€";
  const annualLeak = people * hours * rate * 52;
  const weeklyHours = people * hours;
  const fte = weeklyHours / 40;

  async function sendBreakdown() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus("error");
      return;
    }
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "calculator",
          name: "Calculator lead",
          email,
          calculator: { people, hours, rate, currency, annualLeak, weeklyHours },
          startedAt: Date.now() - 30_000,
          website_hp: "",
        }),
      });
      setEmailStatus(res.ok ? "sent" : "error");
    } catch {
      setEmailStatus("error");
    }
  }

  const slider = (
    label: string,
    value: number,
    display: string,
    min: number,
    max: number,
    onChange: (n: number) => void,
  ) => (
    <div>
      <div className="mb-4 flex justify-between font-mono text-[12px] uppercase tracking-[0.08em]">
        <span className="text-on-surface-variant">{label}</span>
        <span className="tabular-nums text-primary">{display}</span>
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => {
          touched.current = true;
          onChange(Number(e.target.value));
        }}
      />
    </div>
  );

  return (
    <section id="calculator" className="section-pad section-x mx-auto max-w-container">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="eyebrow mb-stack-md block text-outline">
            The Cost of Waiting
          </span>
          <h2 className="max-w-2xl font-display text-headline-md text-on-surface md:text-headline-lg">
            What manual work is costing you.
          </h2>
        </div>
        <div
          className="flex border border-outline-variant font-mono text-[12px]"
          role="group"
          aria-label="Currency"
        >
          {(["USD", "EUR"] as Currency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                touched.current = true;
                setCurrency(c);
              }}
              className={`px-4 py-2 uppercase tracking-[0.08em] transition-colors ${
                currency === c
                  ? "bg-primary text-white"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-center gap-16 md:grid-cols-2 md:gap-24">
        <div className="space-y-12">
          {slider("People doing manual ops work", people, `${people} people`, 1, 50, setPeople)}
          {slider("Hours lost / person / week", hours, `${hours} h`, 1, 30, setHours)}
          {slider("Fully-loaded hourly cost", rate, `${sym}${rate} / hr`, 20, 150, setRate)}
        </div>

        <div className="min-w-0 text-left md:text-right">
          <div className="font-display text-[clamp(44px,7.5vw,104px)] leading-none text-primary">
            <Counter
              value={annualLeak}
              format={(n) => `${sym}${Math.round(n).toLocaleString("en-US")}`}
            />
          </div>
          <span className="mt-3 block font-mono text-[12px] uppercase tracking-[0.3em] text-on-surface-variant">
            Estimated annual leak
          </span>
          <dl className="mt-10 space-y-2 border-t border-outline-variant pt-6 font-mono text-[13px]">
            <div className="flex justify-between gap-8 md:flex-row-reverse">
              <dd className="tabular-nums text-on-surface">{weeklyHours} h</dd>
              <dt className="uppercase tracking-[0.08em] text-outline-dim">
                Weekly hours lost
              </dt>
            </div>
            <div className="flex justify-between gap-8 md:flex-row-reverse">
              <dd className="tabular-nums text-on-surface">
                {fte.toFixed(1)} full-time hires
              </dd>
              <dt className="uppercase tracking-[0.08em] text-outline-dim">
                Equivalent to
              </dt>
            </div>
          </dl>
        </div>
      </div>

      {/* The turn */}
      <div className="mt-20 border-t border-outline-variant pt-10">
        <p className="max-w-2xl text-lg text-on-surface-variant">
          <strong className="text-on-surface">Most of that is recoverable.</strong>{" "}
          A first automation typically ships in 2–5 weeks and pays for itself
          long before the year is out.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Button href="/quote">Request a Quote</Button>
          {!emailOpen && emailStatus !== "sent" && (
            <Button variant="secondary" onClick={() => setEmailOpen(true)}>
              Email me this breakdown
            </Button>
          )}
          {emailOpen && emailStatus !== "sent" && (
            <form
              className="flex flex-wrap gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                void sendBreakdown();
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailStatus === "error") setEmailStatus("idle");
                }}
                placeholder="you@company.com"
                aria-label="Your email"
                className="border border-outline-variant bg-surface px-5 py-3 font-mono text-[13px] text-on-surface outline-none transition-colors focus:border-primary"
              />
              <Button type="submit" disabled={emailStatus === "sending"}>
                {emailStatus === "sending" ? "Sending…" : "Send"}
              </Button>
              {emailStatus === "error" && (
                <span className="self-center font-mono text-[12px] text-signal-alert">
                  Check the address and try again.
                </span>
              )}
            </form>
          )}
          {emailStatus === "sent" && (
            <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-signal-ok">
              Sent — check your inbox.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
