/**
 * The site's content before the CMS existed, kept as the fallback every
 * fetcher in queries.ts returns when Sanity isn't configured (see
 * isSanityConfigured() in ./config). This is the same "degrades gracefully"
 * pattern as lib/rate-limit.ts and lib/leads.ts — local dev with no Sanity
 * project set up renders identically to before this integration landed, and
 * scripts/seed-sanity.ts pushes this exact data into a fresh Sanity dataset
 * so the CMS starts populated instead of empty.
 *
 * This supersedes the service list previously duplicated across
 * components/home/ServicesRows.tsx, app/services/page.tsx, and the home
 * JSON-LD — all three now read from one shape here.
 */

export type FallbackService = {
  name: string;
  summary: string;
  tags: string[];
  body: string;
  variant?: "design";
  order: number;
};

export const FALLBACK_SERVICES: FallbackService[] = [
  {
    name: "Internal Tools",
    summary: "Admin panels, CRMs, and inventory systems that replace clunky spreadsheets.",
    tags: ["Admin Panels", "CRM Customization", "Inventory Systems"],
    body: "High-velocity operational interfaces designed for complex workflows. We replace clunky spreadsheets with performant, secure dashboards that your team will actually enjoy using — built with React and specialized data grids for serious throughput.",
    order: 1,
  },
  {
    name: "AI Workflow Automation",
    summary: "Multi-step automation across your stack, with retries and alerting built in.",
    tags: ["Auto-Ops", "Document Processing", "NLP Routers"],
    body: "Removing human bottlenecks from repetitive cognitive tasks. We orchestrate multi-step processes across your stack — with retries, idempotency, and alerting built in — so the automation keeps working after the demo ends.",
    order: 2,
  },
  {
    name: "AI Agents & LLM Pipelines",
    summary: "RAG-grounded agent systems with schema-validated model output.",
    tags: ["RAG Architecture", "Agentic Workflows", "Schema-Validated Output"],
    body: "Beyond simple prompts. We build agent systems that reason, execute tools, and maintain context across long-running sessions — grounded in your proprietary data through RAG, with every model output schema-validated before it touches your records.",
    order: 3,
  },
  {
    name: "Full-Stack Web Applications",
    summary: "Scalable React / Next.js frontends and high-availability backends.",
    tags: ["React / Next.js", "TypeScript", "Cloud Native"],
    body: "Robust, scalable web systems — from high-conversion frontends to high-availability backends. We prioritize security, speed, and maintainability using boring, reliable, modern frameworks.",
    order: 4,
  },
  {
    name: "SaaS MVP Builds",
    summary: "Concept to market-ready product — auth, billing, and infrastructure handled.",
    tags: ["Rapid Prototyping", "Auth & Billing", "Launch Ready"],
    body: "Concept to market-ready product in weeks, not months. We focus on the core value proposition and implement architecture that scales as your user base grows — auth, billing, and infrastructure handled, so you can focus on product-market fit.",
    order: 5,
  },
  {
    name: "API & System Integrations",
    summary: "Connecting legacy systems and third-party APIs with a reliable audit trail.",
    tags: ["Webhooks", "Legacy Bridging", "Third-Party APIs"],
    body: "We make disparate systems talk. Connecting a legacy ERP to a modern frontend, or orchestrating a network of third-party APIs — data flows securely, reliably, and with an audit trail.",
    order: 6,
  },
  {
    name: "Data & Reporting Pipelines",
    summary: "ETL pipelines that turn messy data into real-time dashboards.",
    tags: ["ETL Processes", "Analytics", "Dashboards"],
    body: "Structured data flow that unlocks insight. ETL pipelines that ingest, clean, and transform messy data into actionable intelligence — feeding real-time dashboards instead of a monthly spreadsheet ritual.",
    order: 7,
  },
  {
    name: "Digital Asset Design",
    summary: "Production-ready icon systems, 3D models, illustration, and brand graphics.",
    tags: ["Icon Systems", "3D Models", "Illustration & Brand"],
    body: "Every visual asset your product needs, built production-ready. Custom icon systems, 3D models and product renders, illustrations, and brand graphics — delivered in the exact formats your build consumes (SVG, glTF / GLB, WebP, Lottie) and optimized so they stay crisp on any screen without bloating your load time. Design that ships in the same pipeline as the code.",
    variant: "design",
    order: 8,
  },
  {
    name: "Maintenance & Retainers",
    summary: "Monitoring, security patches, and an optional extended CTO office.",
    tags: ["Monitoring", "Security Patches", "Extended CTO Office"],
    body: "Peace of mind as a service. We keep your systems updated, patched, and optimized — and we don't just fix things, we prevent them from breaking. Optional, never required: you own the code either way.",
    order: 9,
  },
];

export type FallbackFaqItem = { question: string; answer: string; order: number };

export const FALLBACK_FAQ: FallbackFaqItem[] = [
  {
    question: "How long does a typical build take?",
    answer:
      "A first automation typically ships in 2–5 weeks. Larger systems — internal tools, SaaS MVPs, marketplaces — usually land in 4–8. You'll have a fixed ship date in your quote before we start, and it doesn't move unless the scope does.",
    order: 1,
  },
  {
    question: "Do we really own the code?",
    answer:
      "Yes. The repository is yours from day one and the IP is assigned to you in writing. No licensing fees, no vendor lock-in, and nothing hosted anywhere you can't reach.",
    order: 2,
  },
  {
    question: "How does pricing work?",
    answer:
      "Fixed scope, fixed price, agreed in writing before we write a line of code. We don't publish rates because no two systems are the same size — but you'll have a number within 24 hours of your request, and it won't change unless the scope does.",
    order: 3,
  },
  {
    question: "Where are you based, and will time zones be a problem?",
    answer:
      "Karachi, UTC+5 — which puts us inside the full European working day and across the US Eastern morning, with 4+ hours of daily overlap. You'll never wait a day for a reply: same business day, in writing.",
    order: 4,
  },
  {
    question: "Can you work with our existing stack?",
    answer:
      "Yes. Most of our work extends or replaces something that already exists — spreadsheets, Zapier chains, legacy CRMs, half-built apps. We integrate with what works and replace only what doesn't.",
    order: 5,
  },
  {
    question: "Who actually does the work?",
    answer:
      "The engineer who scopes your project is the engineer who builds it. We're small on purpose — no account managers, no handoffs, no outsourcing chain behind the curtain.",
    order: 6,
  },
  {
    question: "What happens after launch?",
    answer:
      "Every build ends with a real handover: documentation, deployment access, and training. If you want us on call afterwards we offer maintenance retainers — but you're never required to keep paying us to keep your system running.",
    order: 7,
  },
];

export type FallbackHomepage = {
  hero: { eyebrow: string; headline: string; subhead: string; microcopy: string };
  problems: { title: string; body: string }[];
  whyUs: { title: string; body: string }[];
};

export const FALLBACK_HOMEPAGE: FallbackHomepage = {
  hero: {
    eyebrow: "Engineering & AI Automation",
    headline: "We build software that keeps your business running smoothly.",
    subhead:
      "Full-stack systems and AI workflows for teams who are done duct-taping. Scoped in days, shipped in weeks.",
    microcopy: "You'll hear back from an engineer, not a salesperson, within 24 hours.",
  },
  problems: [
    {
      title: "The lead that got away",
      body: "Manual follow-ups that happen two days late. Potential revenue dissolving into an unmonitored inbox.",
    },
    {
      title: "The spreadsheet nobody trusts",
      body: 'Version "FINAL_v4_copy" is full of broken formulas and hidden tabs. Your data is an opinion, not a fact.',
    },
    {
      title: "The six tools that don't talk",
      body: "Your stack is a patchwork of Zapier loops and manual copy-pasting. One update breaks the entire chain.",
    },
  ],
  whyUs: [
    {
      title: "The person who scopes it builds it",
      body: "No account manager, no handoff, no telephone game between the person who understood the problem and the person writing the code.",
    },
    {
      title: "You own everything",
      body: "The repository, the infrastructure, the IP — assigned to you in writing from day one. No licensing fees, no hostage risk.",
    },
    {
      title: "Fixed scope, fixed price, in writing",
      body: "You'll have a number and a ship date within 24 hours of your request. Neither moves unless the scope does.",
    },
    {
      title: "Engineered, not wired together",
      body: "Retries, audit trails, idempotency, observability. Our systems fail loudly and recover — they don't break silently three months in.",
    },
    {
      title: "Time-zone coverage, not time-zone excuses",
      body: "Karachi, UTC+5 — a full working-day overlap with Europe and 4+ hours daily with US Eastern. Replies same business day.",
    },
  ],
};

export type FallbackProcessStep = {
  title: string;
  shortBody: string;
  longBody: string;
  order: number;
};

export const FALLBACK_PROCESS_STEPS: FallbackProcessStep[] = [
  {
    title: "Blueprint Session",
    shortBody:
      "We map your current chaos and define the engineering fix. Fixed scope, fixed price, ship date — in writing, within 24 hours.",
    longBody:
      "It starts with your quote request. We map what your team does by hand today, find the highest-leverage fix, and reply within 24 hours with a fixed scope, a fixed price, and a ship date — in writing. If you gave us your website, we've already studied your business before we reply.",
    order: 1,
  },
  {
    title: "Scoped Build",
    shortBody:
      "Focused development in short sprints. You see working software weekly. No feature creep, no surprise invoices.",
    longBody:
      "Focused development in short sprints. You see working software weekly — deployed, clickable, not a slide deck. Scope changes are welcome, but they're explicit: a new number and a new date, agreed before we build. No feature creep, no surprise invoices.",
    order: 2,
  },
  {
    title: "Pressure Test",
    shortBody:
      "Rigorous QA under real-world data loads, failure injection, and user edge-cases before anything touches production.",
    longBody:
      "Before launch, we try to break it: real-world data volumes, failure injection, duplicate webhooks, users doing the wrong thing at the wrong time. The systems we ship fail loudly and recover — they don't break silently three months in.",
    order: 3,
  },
  {
    title: "Seamless Hand-off",
    shortBody:
      "Production launch, documentation, and training. You hold the keys to the repo — and everything else.",
    longBody:
      "Production launch, documentation, deployment access, and training for your team. The repository has been yours since day one; now everything else is too. If you want us on call afterwards, retainers exist — but they're optional.",
    order: 4,
  },
];
