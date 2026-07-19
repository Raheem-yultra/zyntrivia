"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const SERVICES = [
  "Internal tool or dashboard",
  "AI workflow automation",
  "AI agent / LLM pipeline",
  "Web application",
  "SaaS MVP",
  "Integration between existing tools",
  "Fix or extend an existing system",
  "Not sure yet",
];

const TIMELINES = ["As soon as possible", "Within a month", "1–3 months", "Just exploring"];
const SIZES = ["Just me", "2–10", "11–50", "51–200", "200+"];
const STATES = [
  "Nothing exists yet",
  "We have something, it needs work",
  "We're replacing a system that works but shouldn't",
];

const FREE_MAIL =
  /@(gmail|googlemail|yahoo|hotmail|outlook|live|icloud|aol|proton|protonmail|gmx|mail|yandex)\./i;

const inputCls =
  "w-full border border-outline-variant bg-surface px-5 py-4 text-[15px] text-on-surface outline-none transition-colors focus:border-primary rounded-lg";

export function QuoteForm() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<string[]>([]);
  const [problem, setProblem] = useState("");
  const [timeline, setTimeline] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [wantsCall, setWantsCall] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const startedAt = useRef(Date.now());
  const utm = useRef<Record<string, string>>({});

  useEffect(() => {
    startedAt.current = Date.now();
    const q = new URLSearchParams(window.location.search);
    q.forEach((v, k) => {
      if (k.startsWith("utm_")) utm.current[k] = v;
    });
  }, []);

  const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

  function toggleService(s: string) {
    setServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function next() {
    setError(null);
    if (step === 1 && services.length === 0) {
      setError("Pick at least one — “Not sure yet” counts.");
      return;
    }
    if (step === 2 && problem.trim().length < 10) {
      setError("A sentence or two is enough — but we need something to scope.");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0 });
  }

  async function submit() {
    setError(null);
    if (!timeline || !companySize || !currentState) {
      setError("The three context questions above are what make the quote accurate.");
      return;
    }
    if (!name.trim()) {
      setError("We need a name to reply to.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email doesn't look right.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "quote",
          services,
          problem: problem.trim(),
          timeline,
          companySize,
          currentState,
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          country: country.trim() || undefined,
          website: website.trim() || undefined,
          wantsCall,
          utm: Object.keys(utm.current).length ? utm.current : undefined,
          startedAt: startedAt.current,
          website_hp: honeypot,
        }),
      });
      if (res.status === 429) {
        setStatus("idle");
        setError("Too many requests from this connection — please try again in an hour, or email hello@zyntrivia.com.");
        return;
      }
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      window.scrollTo({ top: 0 });
    } catch {
      setStatus("idle");
      setError("Something went wrong sending this. Please try again, or email hello@zyntrivia.com.");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-16">
        <span className="mb-6 block font-mono text-[12px] uppercase tracking-[0.2em] text-signal-ok">
          Request received
        </span>
        <h1 className="mb-6 font-display text-headline-md text-on-surface md:text-display-lg">
          Got it.
        </h1>
        <p className="mb-10 max-w-xl text-lg text-on-surface-variant">
          You&apos;ll hear back from an engineer, not a salesperson, within 24
          hours.
        </p>
        <Link
          href="/process"
          className="group flex items-center gap-2 font-display text-label-sm uppercase tracking-[0.12em] text-primary"
        >
          See how we scope
          <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-2">
            →
          </span>
        </Link>
      </div>
    );
  }

  const radioGroup = (
    label: string,
    options: string[],
    value: string,
    onChange: (v: string) => void,
  ) => (
    <fieldset>
      <legend className="eyebrow mb-4 block text-outline">{label}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-lg border px-5 py-3 text-[14px] transition-all ${
              value === opt
                ? "border-primary bg-primary/10 text-on-surface"
                : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary/50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </fieldset>
  );

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-stack-lg">
        <span className="mb-2 block font-mono text-[12px] uppercase tracking-[0.12em] text-primary">
          Step {step} of 3
        </span>
        <div className="h-[2px] w-full bg-outline-variant">
          <div
            className="h-full bg-primary transition-all duration-500 ease-mechanical"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <h1 className="mb-4 font-display text-headline-md text-on-surface md:text-display-lg">
        Request a quote
      </h1>
      <p className="mb-stack-lg max-w-xl text-body-md text-on-surface-variant">
        Three short steps. You&apos;ll have a fixed scope, a fixed price, and a
        ship date within 24 hours.
      </p>

      {/* Honeypot — invisible to humans */}
      <input
        type="text"
        name="website_hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {step === 1 && (
        <section>
          <span className="eyebrow mb-stack-md block text-outline">
            What do you need?
          </span>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {SERVICES.map((s) => {
              const active = services.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  aria-pressed={active}
                  className={`flex items-center justify-between rounded-lg border p-5 text-left text-[15px] transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-on-surface"
                      : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary/50"
                  }`}
                >
                  <span>{s}</span>
                  <span
                    aria-hidden
                    className={`font-mono text-[13px] ${active ? "text-primary" : "text-outline-variant"}`}
                  >
                    {active ? "[x]" : "[ ]"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <label htmlFor="problem" className="mb-3 block font-display text-xl text-on-surface md:text-2xl">
            What is your team doing by hand right now that they shouldn&apos;t
            be?
          </label>
          <p className="mb-6 text-sm text-on-surface-variant">
            Plain English is fine. The more specific you are, the more accurate
            the quote.
          </p>
          <textarea
            id="problem"
            rows={8}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g. Every order that comes in by email gets retyped into two systems, and once a week one of them is wrong…"
            className={`${inputCls} resize-y font-body leading-relaxed`}
          />
        </section>
      )}

      {step === 3 && (
        <section className="space-y-12">
          {radioGroup("Timeline", TIMELINES, timeline, setTimeline)}
          {radioGroup("Company size", SIZES, companySize, setCompanySize)}
          {radioGroup("Where are you today?", STATES, currentState, setCurrentState)}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="q-name" className="eyebrow mb-3 block text-outline">
                Name
              </label>
              <input id="q-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="q-email" className="eyebrow mb-3 block text-outline">
                Work email
              </label>
              <input id="q-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} autoComplete="email" />
              {FREE_MAIL.test(email) && (
                <p className="mt-2 font-mono text-[12px] text-outline">
                  A work email gets you a faster, more specific quote.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="q-company" className="eyebrow mb-3 block text-outline">
                Company
              </label>
              <input id="q-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="q-country" className="eyebrow mb-3 block text-outline">
                Country
              </label>
              <input id="q-country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls} autoComplete="country-name" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="q-website" className="eyebrow mb-3 block text-outline">
                Company website <span className="text-outline-dim">(optional)</span>
              </label>
              <input id="q-website" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="flex cursor-pointer items-center gap-3 text-[15px] text-on-surface-variant">
              <input
                type="checkbox"
                checked={wantsCall}
                onChange={(e) => setWantsCall(e.target.checked)}
                className="h-4 w-4 rounded-sm border-outline-variant bg-surface accent-[#2563eb]"
              />
              I&apos;d rather talk it through on a call
            </label>
            {wantsCall &&
              (calLink ? (
                <div className="mt-6 overflow-hidden rounded-lg border border-outline-variant">
                  <iframe
                    src={calLink.startsWith("http") ? calLink : `https://cal.com/${calLink}`}
                    title="Book a call"
                    className="h-[560px] w-full bg-surface"
                  />
                </div>
              ) : (
                <p className="mt-4 font-mono text-[12px] text-outline">
                  Submit the form and we&apos;ll reply with times in your time
                  zone.
                </p>
              ))}
          </div>
        </section>
      )}

      {error && (
        <p role="alert" className="mt-8 font-mono text-[13px] text-signal-alert">
          {error}
        </p>
      )}

      {/* Footer actions */}
      <div className="mt-stack-lg flex items-center justify-between border-t border-outline-variant pt-10">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setStep((s) => Math.max(1, s - 1));
          }}
          className={`font-display text-label-sm uppercase tracking-[0.12em] text-outline transition-colors hover:text-on-surface ${step === 1 ? "invisible" : ""}`}
        >
          Back
        </button>
        {step < 3 ? (
          <Button onClick={next} className="px-10">
            Continue
          </Button>
        ) : (
          <Button onClick={() => void submit()} disabled={status === "sending"} className="px-10">
            {status === "sending" ? "Sending…" : "Request my quote"}
          </Button>
        )}
      </div>
    </div>
  );
}
