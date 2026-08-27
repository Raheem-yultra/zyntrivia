export const SITE = {
  name: "Zyntrivia",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zyntrivia.com",
  tagline: "Full-Stack Engineering & AI Automation",
  location: "Karachi (UTC+5) — overlapping EU and US Eastern",
  email: "hello@zyntrivia.com",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
] as const;

/**
 * Canonical service catalog — the single source of truth for the home service
 * list, the ServicesRows index, and the structured-data OfferCatalog. The
 * detailed copy (tags, long body, the Digital Asset Design showcase) lives on
 * /services; this list keeps names and one-line summaries in sync everywhere
 * else so a new service never has to be added in three places again.
 */
export const SERVICES = [
  { name: "Internal Tools", summary: "Admin panels, CRMs, and inventory systems that replace clunky spreadsheets." },
  { name: "AI Workflow Automation", summary: "Multi-step automation across your stack, with retries and alerting built in." },
  { name: "AI Agents & LLM Pipelines", summary: "RAG-grounded agent systems with schema-validated model output." },
  { name: "Full-Stack Web Applications", summary: "Scalable React / Next.js frontends and high-availability backends." },
  { name: "SaaS MVP Builds", summary: "Concept to market-ready product — auth, billing, and infrastructure handled." },
  { name: "API & System Integrations", summary: "Connecting legacy systems and third-party APIs with a reliable audit trail." },
  { name: "Data & Reporting Pipelines", summary: "ETL pipelines that turn messy data into real-time dashboards." },
  { name: "Digital Asset Design", summary: "Production-ready icon systems, 3D models, illustration, and brand graphics." },
  { name: "Maintenance & Retainers", summary: "Monitoring, security patches, and an optional extended CTO office." },
] as const;
