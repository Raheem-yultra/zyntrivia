import type { Metadata } from "next";
import { LiveDemo } from "@/components/home/LiveDemo";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Internal tools, AI workflow automation, LLM pipelines, full-stack applications, SaaS MVPs, integrations, data pipelines, and maintenance retainers.",
};

const SERVICES = [
  {
    title: "Internal Tools",
    tags: ["Admin Panels", "CRM Customization", "Inventory Systems"],
    body: "High-velocity operational interfaces designed for complex workflows. We replace clunky spreadsheets with performant, secure dashboards that your team will actually enjoy using — built with React and specialized data grids for serious throughput.",
  },
  {
    title: "AI Workflow Automation",
    tags: ["Auto-Ops", "Document Processing", "NLP Routers"],
    body: "Removing human bottlenecks from repetitive cognitive tasks. We orchestrate multi-step processes across your stack — with retries, idempotency, and alerting built in — so the automation keeps working after the demo ends.",
  },
  {
    title: "AI Agents & LLM Pipelines",
    tags: ["RAG Architecture", "Agentic Workflows", "Schema-Validated Output"],
    body: "Beyond simple prompts. We build agent systems that reason, execute tools, and maintain context across long-running sessions — grounded in your proprietary data through RAG, with every model output schema-validated before it touches your records.",
  },
  {
    title: "Full-Stack Web Applications",
    tags: ["React / Next.js", "TypeScript", "Cloud Native"],
    body: "Robust, scalable web systems — from high-conversion frontends to high-availability backends. We prioritize security, speed, and maintainability using boring, reliable, modern frameworks.",
  },
  {
    title: "SaaS MVP Builds",
    tags: ["Rapid Prototyping", "Auth & Billing", "Launch Ready"],
    body: "Concept to market-ready product in weeks, not months. We focus on the core value proposition and implement architecture that scales as your user base grows — auth, billing, and infrastructure handled, so you can focus on product-market fit.",
  },
  {
    title: "API & System Integrations",
    tags: ["Webhooks", "Legacy Bridging", "Third-Party APIs"],
    body: "We make disparate systems talk. Connecting a legacy ERP to a modern frontend, or orchestrating a network of third-party APIs — data flows securely, reliably, and with an audit trail.",
  },
  {
    title: "Data & Reporting Pipelines",
    tags: ["ETL Processes", "Analytics", "Dashboards"],
    body: "Structured data flow that unlocks insight. ETL pipelines that ingest, clean, and transform messy data into actionable intelligence — feeding real-time dashboards instead of a monthly spreadsheet ritual.",
  },
  {
    title: "Maintenance & Retainers",
    tags: ["Monitoring", "Security Patches", "Extended CTO Office"],
    body: "Peace of mind as a service. We keep your systems updated, patched, and optimized — and we don't just fix things, we prevent them from breaking. Optional, never required: you own the code either way.",
  },
];

export default function ServicesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="section-x mx-auto max-w-container pb-stack-lg pt-16 md:pt-24">
        <div className="max-w-4xl">
          <span className="eyebrow mb-4 block text-primary">What We Build</span>
          <h1 className="mb-10 font-display text-headline-md leading-[1.05] text-on-surface md:text-display-xl">
            Engineering the systems your business actually runs on.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
            We bridge the gap between complex engineering requirements and
            elegant, high-performance software. Our approach is surgical:
            minimal bloat, maximum reliability.
          </p>
        </div>
      </section>

      {/* Numbered service rows */}
      <section className="section-x mx-auto max-w-container border-t border-outline-variant py-section-mobile md:py-section-desktop">
        <div className="grid grid-cols-1 gap-y-16 md:gap-y-24">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="group grid gap-6 border-b border-outline-variant pb-12 last:border-b-0 md:grid-cols-12 md:gap-8 md:pb-16"
            >
              <div className="font-mono text-[13px] text-outline md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-5">
                <h2 className="mb-6 font-display text-headline-md text-on-surface transition-colors duration-300 group-hover:text-primary md:text-headline-lg">
                  {s.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-surface-container px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-on-surface-variant"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-6">
                <p className="mb-8 max-w-measure text-body-md leading-relaxed text-on-surface-variant">
                  {s.body}
                </p>
                <div className="h-1 w-full overflow-hidden bg-outline-variant/20">
                  <div className="h-full w-0 bg-primary transition-all duration-700 ease-in-out group-hover:w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded pipeline demo */}
      <LiveDemo />

      {/* CTA */}
      <section className="section-x mx-auto max-w-container py-section-mobile text-center md:py-section-desktop">
        <h2 className="mb-8 font-display text-headline-md text-on-surface md:text-headline-lg">
          Ready to engineer your advantage?
        </h2>
        <div className="flex justify-center">
          <Button href="/quote" className="px-12 py-5">
            Request a Quote
          </Button>
        </div>
      </section>
    </main>
  );
}
