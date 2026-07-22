export type WorkMeta = {
  slug: string;
  name: string;
  category: string;
  headline: string;
  summary: string;
  stack: string[];
  /** When set, the case study shows an "Open live demo" button linking here. */
  demoHref?: string;
};

export const WORK: WorkMeta[] = [
  {
    slug: "stocksense",
    name: "StockSense",
    category: "OPERATIONS",
    headline: "Inventory that knows what's expiring, and where.",
    summary:
      "A multi-location inventory system built around batches rather than SKUs — expiry intelligence, an append-only movement ledger, and cross-branch transfers with a full audit trail.",
    stack: ["React + Vite", "Express", "Drizzle ORM", "PostgreSQL"],
    demoHref: "/projects/stocksense-demo",
  },
  {
    slug: "resourceable",
    name: "Resourceable",
    category: "MARKETPLACE",
    headline: "A two-sided marketplace, including the boring parts nobody demos.",
    summary:
      "A multi-category service marketplace with the full provider lifecycle implemented — onboarding, verification, split payments via Stripe Connect, refunds, and two honest dashboards.",
    stack: ["Next.js 14", "Stripe Connect", "PostgreSQL", "Prisma"],
  },
  {
    slug: "workflowai",
    name: "WorkflowAI",
    category: "AI AUTOMATION",
    headline: "Automation that tells you when it fails — and retries.",
    summary:
      "A workflow automation layer that treats every job as something that can fail and must be recoverable — durable queues, idempotent steps, schema-validated LLM output, and full run traces.",
    stack: ["n8n", "Bull", "Redis", "Node.js", "LLM"],
  },
];
