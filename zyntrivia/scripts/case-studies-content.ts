import { h2, p, bullet, archDiagram } from "./pt-builder";

/**
 * Portable Text transcription of content/work/*.mdx, for scripts/seed-sanity.ts.
 * Kept as data (not generated at runtime) so the seed is reviewable and
 * reproducible — a diff against this file is a diff against what gets seeded.
 */

export const stocksenseBody = [
  h2("The problem"),
  p(
    "Multi-location businesses that hold perishable or batch-tracked stock — pharmacies, clinics, food distributors, specialty retail — almost always run on a spreadsheet per location. Nobody can see total stock across sites, nobody knows what's about to expire until it already has, and a transfer between two branches is a phone call and a hope. The cost isn't dramatic; it's a slow bleed of written-off stock and emergency reorders.",
  ),
  h2("What we built"),
  p(
    "A multi-location inventory system built around batches rather than SKUs — because for anyone tracking expiry, the batch ",
    { italic: true, text: "is" },
    " the unit that matters.",
  ),
  bullet(
    { bold: true, text: "Batch-level tracking." },
    " Every unit carries its lot number, expiry date, cost, and location. Stock isn't a number; it's a set of dated batches.",
  ),
  bullet(
    { bold: true, text: "Expiry intelligence." },
    " A rolling 90-day expiry horizon per location, with configurable alert thresholds. FEFO (first-expired-first-out) picking suggested by default.",
  ),
  bullet(
    { bold: true, text: "Cross-location visibility." },
    " One view of every branch. Transfers are a two-click flow with a full audit trail on both sides.",
  ),
  bullet(
    { bold: true, text: "Movement ledger." },
    ' Every change — receipt, sale, transfer, adjustment, write-off — is an immutable, attributed row. Current stock is derived from the ledger, never edited directly. You can always answer "how did we get to this number."',
  ),
  bullet({ bold: true, text: "Reorder logic." }, " Per-location reorder points with lead-time awareness."),
  bullet({ bold: true, text: "Role-based access." }, " Branch staff see their branch. Managers see the group."),
  h2("Architecture"),
  archDiagram([
    [{ label: "Client", sub: "React + Vite SPA · TanStack Query / Table" }],
    [
      { label: "API", sub: "Express · Drizzle · transactional writes" },
      { label: "Reads", sub: "Stock derived on read: SUM(ledger)" },
    ],
    [{ label: "Data", sub: "PostgreSQL · append-only ledger_entries", accent: true }],
  ]),
  p(
    "A React + Vite single-page client (TanStack Query and Table) talks to a thin Express API where every route does one thing: validate, call a single domain function, serialize. Postgres via Drizzle ORM. The core is an append-only ",
    { code: true, text: "ledger_entries" },
    " table with ",
    { italic: true, text: "signed" },
    " quantities — current stock for any (item, location) is simply ",
    { code: true, text: "SUM(quantity)" },
    ", computed live on every read. There is no mutable stock counter anywhere in the system, and therefore no cache that can drift out of sync with the movements that produced it.",
  ),
  h2("Engineering decisions"),
  p(
    { italic: true, text: "Why an append-only ledger instead of a mutable quantity column?" },
    " Because inventory disputes are the entire reason these systems get replaced. A mutable column can't tell you who changed what. A ledger can, forever, at effectively no cost.",
  ),
  p(
    { italic: true, text: "Why Postgres over a document store?" },
    " Batch, location, and movement are deeply relational, and expiry reporting is a set of range queries. This is exactly the shape SQL is good at.",
  ),
  p(
    { italic: true, text: "Why derive stock on read instead of storing a running total?" },
    " Because a stored total is one more thing that can silently disagree with the ledger. Computing ",
    { code: true, text: "SUM(quantity)" },
    " on read means the number can never contradict the movements behind it — and with signed quantities and the right indexes, those sums stay fast at this scale, so correctness costs nothing. If a far larger dataset ever demanded it, precomputation is a documented next step, not a starting assumption.",
  ),
  h2("What it does, measured"),
  bullet("Expiry horizon across all locations renders in ", { benchmark: "measure with seeded 50k-movement dataset" }),
  bullet("Full movement history for any batch, retrievable in one query"),
  bullet("Handles ", { benchmark: "SKU count" }, " SKUs across ", { benchmark: "location count" }, " locations in the seeded demo environment"),
];

export const resourceableBody = [
  h2("The problem"),
  p(
    'Marketplace MVPs are easy to fake and hard to ship. The demo — a grid of listings and a checkout button — takes a weekend. The actual product is everything after: onboarding third-party providers, verifying them, splitting payments, handling refunds when the provider has already been paid, and giving both sides a dashboard that tells them the truth. That\'s where marketplace builds die, and it\'s the part most agencies quietly leave for "phase two."',
  ),
  h2("What we built"),
  p("A multi-category service marketplace with the full provider lifecycle implemented."),
  bullet(
    { bold: true, text: "Provider onboarding." },
    " Self-serve signup → profile and service catalog → verification → live. Stripe Connect onboarding embedded in the flow, so a provider can be taking payments the same day.",
  ),
  bullet(
    { bold: true, text: "Multi-category taxonomy." },
    " Categories, sub-categories, and per-category service attributes — so a new vertical is a config change, not a migration.",
  ),
  bullet(
    { bold: true, text: "Booking and payment." },
    " Customer books, pays; funds are held, split at completion, and paid out to the provider net of platform fee. Refunds and disputes handled at the Connect level.",
  ),
  bullet(
    { bold: true, text: "Two dashboards." },
    " Providers see bookings, earnings, and payouts. Admins see providers, transactions, disputes, and platform revenue.",
  ),
  bullet({ bold: true, text: "Search and filtering" }, " across category, location, availability, and price."),
  h2("Architecture"),
  archDiagram([
    [{ label: "Client", sub: "Next.js 14 App Router" }],
    [
      { label: "Booking lifecycle", sub: "Webhook-driven state machine" },
      { label: "Payments", sub: "Stripe Connect · Express accounts" },
    ],
    [{ label: "Data", sub: "PostgreSQL · Prisma", accent: true }],
  ]),
  p(
    "Next.js 14 App Router. Stripe Connect (Express accounts) for the money. Postgres/Prisma. Webhook-driven state machine for the booking lifecycle — every payment state transition is driven by a verified Stripe webhook, never by an optimistic client callback.",
  ),
  h2("Engineering decisions"),
  p(
    { italic: true, text: "Why webhook-driven state, not client callbacks?" },
    " Because a customer closing the tab after paying is a normal event, and a marketplace that loses that booking is broken. Webhooks are the only source of truth the network can't drop.",
  ),
  p(
    { italic: true, text: "Why Stripe Connect over building payouts?" },
    " Money transmission, KYC, and 1099/tax reporting are not places to be original. Connect absorbs the compliance surface entirely.",
  ),
  p(
    { italic: true, text: "Idempotency everywhere." },
    " Every payment-adjacent handler is keyed and replay-safe, because Stripe will deliver the same webhook twice and eventually does.",
  ),
  h2("What it does, measured"),
  bullet("Provider goes from signup to accepting payments in ", { benchmark: "time the flow" }),
  bullet("Booking lifecycle survives tab-close, double-submit, and duplicate webhook delivery — all three tested"),
  bullet("New service category added via config in ", { benchmark: "time it" }, ", no schema change"),
];

export const workflowaiBody = [
  h2("The problem"),
  p(
    "Most businesses' first automation is a Zap that works for three months and then silently stops. Nobody notices until a customer complains. The failure mode of cheap automation isn't that it breaks — it's that it breaks ",
    { italic: true, text: "quietly" },
    ", and by the time you find out, you've lost more than the automation ever saved. Anyone can wire up a happy path. The engineering is in what happens when the third-party API returns a 500 at 2am.",
  ),
  h2("What we built"),
  p("A workflow automation layer that treats every job as something that can fail and must be recoverable."),
  bullet(
    { bold: true, text: "Durable job queue." },
    " Bull on Redis. Every step is a job with a retry policy, exponential backoff, and a dead-letter queue for anything that exhausts its retries.",
  ),
  bullet(
    { bold: true, text: "Idempotent steps." },
    " Re-running a job never double-charges, double-sends, or double-writes.",
  ),
  bullet(
    { bold: true, text: "LLM steps as first-class citizens." },
    " Classification, extraction, and drafting steps with schema-validated output — a malformed model response is a retry, not a corrupt record downstream.",
  ),
  bullet(
    { bold: true, text: "Observability." },
    ' Every run has a trace: which steps ran, what they received, what they returned, how long each took. When someone asks "did the invoice go out," there\'s an answer, not a shrug.',
  ),
  bullet(
    { bold: true, text: "Alerting." },
    ' Failures that exhaust retries page a human with the full trace attached, not a generic "workflow error."',
  ),
  bullet(
    { bold: true, text: "Human-in-the-loop." },
    " Any step can be marked as requiring approval — the job parks, notifies, and resumes on approval.",
  ),
  h2("Architecture"),
  archDiagram([
    [{ label: "Ingress", sub: "Webhooks · signature-verified" }],
    [
      { label: "Orchestration", sub: "n8n · third-party connectors" },
      { label: "Durable workers", sub: "Node.js · Bull · LLM steps" },
    ],
    [{ label: "State", sub: "Redis queue · Postgres run traces", accent: true }],
  ]),
  p(
    "n8n for orchestration and third-party connectors, with a Node/Bull worker layer underneath for anything requiring durability, custom logic, or LLM calls. Redis for the queue. Postgres for run history and traces. Webhook ingress with signature verification.",
  ),
  h2("Engineering decisions"),
  p(
    { italic: true, text: "Why not pure n8n / pure Zapier?" },
    " Because no-code orchestrators are excellent at connecting things and weak at retry semantics, idempotency, and observability — which is precisely where automations fail in production. Use them for what they're good at; put real code underneath the parts that matter.",
  ),
  p(
    { italic: true, text: "Why a dead-letter queue?" },
    ' Because "it failed and we lost it" is unacceptable, and "it failed and it\'s sitting here waiting for you" is fine.',
  ),
  p(
    { italic: true, text: "Why schema-validate LLM output?" },
    " A model that returns prose where you expected JSON should fail loudly and retry, not write garbage into your CRM.",
  ),
  h2("What it does, measured"),
  bullet(
    "Survives third-party API outage: jobs retry with backoff and complete when the service returns — tested by killing the downstream service mid-run",
  ),
  bullet("Duplicate webhook delivery produces exactly one side effect"),
  bullet("Full trace available for every run, ", { benchmark: "retention period" }, " retention"),
];
