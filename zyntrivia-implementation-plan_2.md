# Zyntrivia — Website Implementation Plan

**Version:** 1.0
**Target audience:** US / EU small-to-mid businesses and funded startups
**Site goals:** (1) prove engineering capability, (2) generate qualified quote requests
**Companion doc:** `zyntrivia-site-copy-and-build-prompt.md` (copy deck)

---

## 0. Locked decisions

| Decision | Status |
|---|---|
| Positioning | Engineering studio — full-stack + AI automation. Not a no-code reseller. |
| Primary CTA | **Request a Quote** → `/quote`. Site-wide. No secondary CTA in hero. |
| Pricing page | **None.** No published prices anywhere. |
| Budget field | **Removed** from the quote form. |
| Founder identity | **None.** No name, no photo, no personal LinkedIn. Studio voice only. |
| Interactive demos | **Both** shipped — Live Pipeline Demo + Automation Leak Calculator. |
| Case studies | Three, written in full. Labeled as studio-built. No invented clients. |
| Geography | Karachi stated plainly, framed as time-zone coverage. |

### Two flags, then we move on

Both removals are your call and the plan below honors them — but each one removes a trust mechanism, so each needs a replacement rather than just a deletion.

**No face/name.** For an offshore studio selling to US/EU buyers, anonymity is the single most expensive choice on this list — the buyer's default fear is "lead farm." The plan compensates with *verifiable, impersonal* proof surfaces (§8): a public GitHub org with real commits, a linked Fiverr profile with real reviews, a company LinkedIn page, live demo deployments the buyer can click, and contract terms stated in writing. Those do the same job as a face, but they have to actually exist and be linked. If they don't exist yet, building them is the highest-leverage thing on this whole list.

**No budget band.** That field was the cheapest qualification in the funnel. Without it, expect more unqualified requests and more time spent scoping projects that were never going to happen. §7 replaces it with three softer signals that qualify almost as well without asking for a number.

---

## 1. Design system — "System Interface"

The brief is a terminal/HUD instrument panel: precise, monochrome, data-forward. Everything below derives from that.

### Color tokens

Color carries meaning here — it is a status system, not decoration. Three signal colors, each with exactly one job.

```css
--canvas:        #08090A;  /* near-black, cool */
--panel:         #101214;  /* raised surfaces, cards */
--panel-hi:      #16191C;  /* hover state */
--rule:          #1E2225;  /* 1px hairlines — used liberally */
--text-dim:      #5C6470;  /* metadata, mono labels */
--text-mid:      #9CA3AF;  /* body copy */
--text:          #E6E8EA;  /* headlines */

--signal:        #FFB020;  /* AMBER. CTAs, active data, focus. The brand. */
--signal-ok:     #3DDC97;  /* GREEN. Only: LIVE, OK, COMPLETE states. */
--signal-alert:  #FF5A5F;  /* RED. Only: the leak, the failure, the cost of doing nothing. */
```

**Rule:** green and red never appear as decoration. Green means a system is running. Red means money is being lost. The leak calculator is red; the pipeline demo turns green when it completes. That's the whole color story, and it's legible without reading a word.

### Typography

- **Display / headlines:** Geist Sans (or Inter Tight as fallback). Tight tracking (`-0.03em`), weight 500–600. Never 700+ — the aesthetic is engineered, not shouty.
- **Body:** Geist Sans, weight 400, `1.6` line-height, max `68ch`.
- **Utility — and this is where the personality lives:** Geist Mono / JetBrains Mono for *every* eyebrow, section label, nav item, stack tag, metric, timestamp, and form label. Uppercase, `0.08em` tracking, `12px`. The mono/grotesk split is the signature type move: prose is human, everything the *system* says is monospaced.

### Layout

- 12-column grid, `1280px` max, `24px` gutters.
- Hairline rules (`--rule`) between every section — visible structure, like a schematic.
- Border radius: `2px` maximum. Corners are sharp.
- Generous vertical rhythm: `160px` section padding on desktop, `96px` mobile.

### Signature element — the Pipeline Rail

A persistent 2px vertical rail down the left edge of the viewport (desktop only). As the visitor scrolls, it renders the page as a pipeline: each section is a stage, marked with a mono label and a status dot that ticks from `--text-dim` → `--signal` (active) → `--signal-ok` (passed).

```
│ ● PROBLEM        [OK]
│ ● PIPELINE       [OK]
│ ◉ SERVICES       [ACTIVE]   ← current scroll position
│ ○ WORK
│ ○ PROCESS
```

This is the one thing people will remember about the site, and it's true to the subject: the page itself behaves like the systems you build. It's also a working nav.

### Motion

Mechanical, fast, purposeful. Numbers count. Status ticks. Terminal text types. Cards snap into place (`150ms`, `cubic-bezier(0.2, 0, 0, 1)`).

**Banned:** floating orbs, blurred gradient blobs, glassmorphism, purple→blue AI gradients, parallax, anything that "breathes." Those are the visual language of every competitor site and they signal marketing, not engineering. `prefers-reduced-motion` disables all of it.

---

## 2. Architecture

```
zyntrivia/
├── app/
│   ├── layout.tsx                  # fonts, nav, footer, pipeline rail
│   ├── page.tsx                    # HOME
│   ├── services/page.tsx
│   ├── work/
│   │   ├── page.tsx                # index
│   │   └── [slug]/page.tsx         # MDX-driven case studies
│   ├── process/page.tsx
│   ├── about/page.tsx
│   ├── quote/page.tsx              # multi-step form
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── api/
│   │   ├── demo/enrich/route.ts    # live pipeline demo (streaming)
│   │   └── quote/route.ts          # form intake
│   ├── sitemap.ts
│   ├── robots.ts
│   └── opengraph-image.tsx
├── components/
│   ├── layout/         Nav, Footer, PipelineRail, SectionRule
│   ├── home/           Hero, ProofStrip, Problem, LiveDemo, LeakCalculator,
│   │                   ServicesGrid, WorkPreview, StackMarquee, Process,
│   │                   WhyUs, FAQ, FinalCTA
│   ├── quote/          QuoteForm, StepShell, ProgressRail, SuccessState
│   └── ui/             Button, Card, MonoLabel, Terminal, Counter, Accordion
├── content/
│   ├── work/           stocksense.mdx, resourceable.mdx, workflowai.mdx
│   └── blog/
├── lib/                db.ts, email.ts, schema.ts (zod), rate-limit.ts
└── styles/globals.css
```

**Stack:** Next.js 14 App Router · TypeScript · Tailwind · Framer Motion · MDX · Zod · Supabase (Postgres) · Resend · Upstash (rate limiting) · Cal.com embed · Plausible · Vercel.

---

## 3. Homepage build spec

Sections in order. Copy is in the companion doc — this is the behavior.

| # | Section | Implementation notes |
|---|---|---|
| 1 | **Hero** | Left: H1 + sub + single amber CTA + micro-copy. Right: `<Terminal />` — a live-typing HUD panel cycling a real pipeline (`WEBHOOK RECEIVED → PARSED → ENRICHED → ROUTED → CRM UPDATED · 1.4s`), status ticking to green. Loops. Not a video — real DOM, real timing. |
| 2 | **Proof strip** | Mono, hairline-bordered. Verifiable claims only (§8). |
| 3 | **Problem** | 3 cards. On scroll-into-view, a red `--signal-alert` hairline draws across each card's top edge, staggered 80ms. The only red on the page besides the calculator. |
| 4 | **Live Pipeline Demo** | §5.1. The hero proof. |
| 5 | **Leak Calculator** | §5.2. Sits directly after the demo — capability, then cost of not having it. |
| 6 | **Services** | 8 cards, 4×2 desktop / 1-col mobile. Hover: `--panel-hi`, amber hairline top, stack tag brightens. |
| 7 | **Work** | 3 case study cards → `/work/[slug]`. Badge: `CASE STUDY · BUILT BY ZYNTRIVIA` (mono, dim). |
| 8 | **Stack marquee** | Slow horizontal scroll, mono wordmarks not logos. Pauses on hover. |
| 9 | **Process** | 4 steps. Numbering justified — it *is* a sequence. Connected by the rail motif. |
| 10 | **Why Zyntrivia** | 5 points, 1px-ruled rows, no cards. |
| 11 | **FAQ** | Accordion. 7 items. Full copy in companion doc. |
| 12 | **Final CTA** | Full-bleed panel, single amber button, trust line beneath. |

---

## 4. — *(reserved)*

---

## 5. Interactive demos — both

These are the two sections your competitors cannot fake and you can actually build. They are the reason to build this site yourself rather than buy a template.

### 5.1 Live Pipeline Demo — "Watch it run"

**Placement:** Homepage, directly after Problem. Also embedded on `/services`.

**User flow:**
1. Visitor pastes a company URL into a mono-styled input. (Prefilled with a real example; a `[ try an example ]` link fills it.)
2. Presses `RUN`.
3. A terminal-style stage list renders and executes in real time, each stage ticking `PENDING → RUNNING → OK` with an elapsed-ms counter:

```
[01] FETCH SITE            OK    412ms
[02] EXTRACT CONTENT       OK    180ms
[03] IDENTIFY BUSINESS     OK    1.2s
[04] FIND AUTOMATION GAPS  OK    2.1s
[05] DRAFT OUTREACH        RUNNING...
```

4. Output: a personalized paragraph naming what the business does and the two workflows most likely worth automating for them — followed by a drafted outreach email.
5. Closing card: **"This ran in 4.1 seconds. It's the same pipeline we'd build into your business."** → `[ Request a Quote ]`

**Technical spec:**
- `POST /api/demo/enrich` — Edge runtime, streaming response.
- Fetch + strip target page (`cheerio` or a readability extractor), cap at ~4k chars.
- One Claude call, streamed, with a strict JSON-then-prose contract. Temperature low.
- **Guardrails, all mandatory:**
  - Upstash rate limit: 3 runs / IP / hour.
  - URL allowlist rules: `https` only, no private/localhost/IP ranges (SSRF protection), 5s fetch timeout, block non-HTML content types.
  - Hard token ceiling per run. Cost cap per day → below it, the widget falls back to a pre-recorded replay so the section never looks broken.
  - Cache successful runs by URL hash for 24h.
- Graceful degradation: on any failure, play a canned replay of a real prior run, labeled `REPLAY`. Never show an error to a prospect.

**Why this one matters:** it simultaneously demonstrates full-stack engineering, LLM integration, streaming UX, and speed — while *doing the thing you're selling to them* on their own company. It's a sales pitch that scopes itself.

### 5.2 Automation Leak Calculator — "What it's costing you"

**Placement:** Homepage, immediately after the pipeline demo.

**Inputs (three mono sliders, amber track):**
- People doing manual ops work: `1 – 50`
- Hours per person per week lost to manual work: `1 – 30`
- Fully-loaded hourly cost: `$20 – $150` *(default $45 — US/EU realistic; currency toggle USD/EUR)*

**Output:** a large mono figure counting up in `--signal-alert` red, plus the breakdown:

```
ANNUAL LEAK          $187,200
WEEKLY HOURS LOST    80 h
EQUIVALENT TO        1.9 full-time hires
```

**Then the turn:**
> **Most of that is recoverable.** A first automation typically ships in 2–5 weeks and pays for itself long before the year is out.
> `[ Request a Quote ]` · `[ Email me this breakdown ]`

**Technical spec:**
- Pure client-side (`useState` + `framer-motion` `animate` on the counter). No backend.
- "Email me this breakdown" opens an inline single-field email capture → `POST /api/quote` with `source: "calculator"` and the slider values attached. **This is a full lead**, and it's the lowest-friction entry point on the site — critical now that the budget field is gone from the main form, because it lets people raise their hand before they're ready to describe a project.
- Deep-linkable: encode slider state in the query string so a visitor can share their own number.

---

## 6. Case studies — full copy

Three pages. Structure identical, `content/work/*.mdx`, rendered by `app/work/[slug]/page.tsx`.

**Page template:**
```
BADGE: CASE STUDY · BUILT BY ZYNTRIVIA
H1 · one-line summary · stack tags
── The problem
── What we built
── Architecture (diagram)
── Engineering decisions (why this stack)
── What it does, measured
── Screenshots / 60s Loom
── [ Request a Quote ]
```

> **Integrity rule, applied throughout below.** Every number in these pages is a *verifiable engineering fact about the system you built* — a benchmark you can re-run, a feature you can demo — not a client business outcome you don't have. `[BENCHMARK]` marks a figure you must measure and fill in yourself. Do not replace them with invented client results. A US buyer's technical advisor will probe exactly these numbers, and a fabricated one loses the deal at the last stage, which is the most expensive place to lose it.

---

### 6.1 StockSense

**Badge:** `CASE STUDY · BUILT BY ZYNTRIVIA` · `OPERATIONS`
**H1:** Inventory that knows what's expiring, and where.
**Stack tags:** `Next.js` · `PostgreSQL` · `Prisma` · `TypeScript`

**The problem**
Multi-location businesses that hold perishable or batch-tracked stock — pharmacies, clinics, food distributors, specialty retail — almost always run on a spreadsheet per location. Nobody can see total stock across sites, nobody knows what's about to expire until it already has, and a transfer between two branches is a phone call and a hope. The cost isn't dramatic; it's a slow bleed of written-off stock and emergency reorders.

**What we built**
A multi-location inventory system built around batches rather than SKUs — because for anyone tracking expiry, the batch *is* the unit that matters.

- **Batch-level tracking.** Every unit carries its lot number, expiry date, cost, and location. Stock isn't a number; it's a set of dated batches.
- **Expiry intelligence.** A rolling 90-day expiry horizon per location, with configurable alert thresholds. FEFO (first-expired-first-out) picking suggested by default.
- **Cross-location visibility.** One view of every branch. Transfers are a two-click flow with a full audit trail on both sides.
- **Movement ledger.** Every change — receipt, sale, transfer, adjustment, write-off — is an immutable, attributed row. Current stock is derived from the ledger, never edited directly. You can always answer "how did we get to this number."
- **Reorder logic.** Per-location reorder points with lead-time awareness.
- **Role-based access.** Branch staff see their branch. Managers see the group.

**Architecture**
Next.js App Router with server components for the read-heavy views; server actions for mutations. Postgres via Prisma. The core is an append-only `StockMovement` table with a materialized current-stock view refreshed on write — so the fast path stays fast without giving up the audit trail.

**Engineering decisions**
- *Why an append-only ledger instead of a mutable quantity column?* Because inventory disputes are the entire reason these systems get replaced. A mutable column can't tell you who changed what. A ledger can, forever, at effectively no cost.
- *Why Postgres over a document store?* Batch, location, and movement are deeply relational, and expiry reporting is a set of range queries. This is exactly the shape SQL is good at.
- *Why a materialized view?* Deriving current stock from the ledger on every page load is correct but slow at scale. Materializing it keeps the correctness and buys back the latency.

**What it does, measured**
- Expiry horizon across all locations renders in `[BENCHMARK: measure with seeded 50k-movement dataset]`
- Full movement history for any batch, retrievable in one query
- Handles `[BENCHMARK]` SKUs across `[BENCHMARK]` locations in the seeded demo environment

**Adaptable for:** pharmacy and clinic supply, food and beverage distribution, cosmetics, chemicals, any regulated stock with a shelf life.

---

### 6.2 Resourceable

**Badge:** `CASE STUDY · BUILT BY ZYNTRIVIA` · `MARKETPLACE`
**H1:** A two-sided marketplace, including the boring parts nobody demos.
**Stack tags:** `Next.js 14` · `Stripe Connect` · `PostgreSQL` · `Prisma`

**The problem**
Marketplace MVPs are easy to fake and hard to ship. The demo — a grid of listings and a checkout button — takes a weekend. The actual product is everything after: onboarding third-party providers, verifying them, splitting payments, handling refunds when the provider has already been paid, and giving both sides a dashboard that tells them the truth. That's where marketplace builds die, and it's the part most agencies quietly leave for "phase two."

**What we built**
A multi-category service marketplace with the full provider lifecycle implemented.

- **Provider onboarding.** Self-serve signup → profile and service catalog → verification → live. Stripe Connect onboarding embedded in the flow, so a provider can be taking payments the same day.
- **Multi-category taxonomy.** Categories, sub-categories, and per-category service attributes — so a new vertical is a config change, not a migration.
- **Booking and payment.** Customer books, pays; funds are held, split at completion, and paid out to the provider net of platform fee. Refunds and disputes handled at the Connect level.
- **Two dashboards.** Providers see bookings, earnings, and payouts. Admins see providers, transactions, disputes, and platform revenue.
- **Search and filtering** across category, location, availability, and price.

**Architecture**
Next.js 14 App Router. Stripe Connect (Express accounts) for the money. Postgres/Prisma. Webhook-driven state machine for the booking lifecycle — every payment state transition is driven by a verified Stripe webhook, never by an optimistic client callback.

**Engineering decisions**
- *Why webhook-driven state, not client callbacks?* Because a customer closing the tab after paying is a normal event, and a marketplace that loses that booking is broken. Webhooks are the only source of truth the network can't drop.
- *Why Stripe Connect over building payouts?* Money transmission, KYC, and 1099/tax reporting are not places to be original. Connect absorbs the compliance surface entirely.
- *Idempotency everywhere.* Every payment-adjacent handler is keyed and replay-safe, because Stripe will deliver the same webhook twice and eventually does.

**What it does, measured**
- Provider goes from signup to accepting payments in `[BENCHMARK: time the flow]`
- Booking lifecycle survives tab-close, double-submit, and duplicate webhook delivery — all three tested
- New service category added via config in `[BENCHMARK]`, no schema change

**Adaptable for:** home services, professional services, rentals, freelance and creator marketplaces, B2B supplier networks.

---

### 6.3 WorkflowAI

**Badge:** `CASE STUDY · BUILT BY ZYNTRIVIA` · `AI AUTOMATION`
**H1:** Automation that tells you when it fails — and retries.
**Stack tags:** `n8n` · `Bull` · `Redis` · `Node.js` · `LLM`

**The problem**
Most businesses' first automation is a Zap that works for three months and then silently stops. Nobody notices until a customer complains. The failure mode of cheap automation isn't that it breaks — it's that it breaks *quietly*, and by the time you find out, you've lost more than the automation ever saved. Anyone can wire up a happy path. The engineering is in what happens when the third-party API returns a 500 at 2am.

**What we built**
A workflow automation layer that treats every job as something that can fail and must be recoverable.

- **Durable job queue.** Bull on Redis. Every step is a job with a retry policy, exponential backoff, and a dead-letter queue for anything that exhausts its retries.
- **Idempotent steps.** Re-running a job never double-charges, double-sends, or double-writes.
- **LLM steps as first-class citizens.** Classification, extraction, and drafting steps with schema-validated output — a malformed model response is a retry, not a corrupt record downstream.
- **Observability.** Every run has a trace: which steps ran, what they received, what they returned, how long each took. When someone asks "did the invoice go out," there's an answer, not a shrug.
- **Alerting.** Failures that exhaust retries page a human with the full trace attached, not a generic "workflow error."
- **Human-in-the-loop.** Any step can be marked as requiring approval — the job parks, notifies, and resumes on approval.

**Architecture**
n8n for orchestration and third-party connectors, with a Node/Bull worker layer underneath for anything requiring durability, custom logic, or LLM calls. Redis for the queue. Postgres for run history and traces. Webhook ingress with signature verification.

**Engineering decisions**
- *Why not pure n8n / pure Zapier?* Because no-code orchestrators are excellent at connecting things and weak at retry semantics, idempotency, and observability — which is precisely where automations fail in production. Use them for what they're good at; put real code underneath the parts that matter.
- *Why a dead-letter queue?* Because "it failed and we lost it" is unacceptable, and "it failed and it's sitting here waiting for you" is fine.
- *Why schema-validate LLM output?* A model that returns prose where you expected JSON should fail loudly and retry, not write garbage into your CRM.

**What it does, measured**
- Survives third-party API outage: jobs retry with backoff and complete when the service returns — tested by killing the downstream service mid-run
- Duplicate webhook delivery produces exactly one side effect
- Full trace available for every run, `[BENCHMARK]` retention

**Adaptable for:** lead routing, document and invoice processing, client onboarding, reporting pipelines, CRM synchronization, any workflow currently held together by a person remembering to check.

---

## 7. The `/quote` flow — revised, no budget field

**Header:**
> ### Request a quote
> Three short steps. You'll have a fixed scope, a fixed price, and a ship date within 24 hours.

### Step 1 — What do you need?
Multi-select cards, mono labels:
`Internal tool or dashboard` · `AI workflow automation` · `AI agent / LLM pipeline` · `Web application` · `SaaS MVP` · `Integration between existing tools` · `Fix or extend an existing system` · `Not sure yet`

### Step 2 — What's the problem?
Single textarea, one prompt:
> **What is your team doing by hand right now that they shouldn't be?**
> Plain English is fine. The more specific you are, the more accurate the quote.

### Step 3 — Context and contact
This step carries the qualification load now that budget is gone. Three cheap signals, none of which asks for a number:

- **Timeline:** `As soon as possible` · `Within a month` · `1–3 months` · `Just exploring`
- **Company size:** `Just me` · `2–10` · `11–50` · `51–200` · `200+`
- **Where are you today?** `Nothing exists yet` · `We have something, it needs work` · `We're replacing a system that works but shouldn't` — *(this one is the sleeper: it tells you whether there's a real budget behind the request better than asking would)*
- Name · **Work email** (reject free-mail domains softly: *"A work email gets you a faster, more specific quote"* — a nudge, not a block) · Company · Country
- Optional: company website *(if provided, run it through the enrichment pipeline before you reply — you'll walk into the response already knowing their business)*
- Checkbox: *I'd rather talk it through on a call* → reveals Cal.com embed, time zone auto-detected

**Why these three replace the budget band:** timeline + company size + "where are you today" together predict deal quality about as well as a stated budget, and they don't make anyone flinch. The tradeoff is that you'll qualify on the reply instead of on the form — so build the reply template now, and include a range in it. That's where the price conversation happens instead.

### Confirmation
> **Got it.**
> You'll hear back from an engineer, not a salesperson, within 24 hours.
> `[ See how we scope → /process ]`

### Backend
`POST /api/quote` → Zod validation → rate-limit (Upstash, 5/IP/hour) → honeypot + timing check for bots → Supabase insert → Resend (auto-reply to lead + notification to you) → n8n webhook.

**Build the intake as an n8n workflow.** Enrich the submitted domain, classify the request, draft a first-pass reply, park it for your approval. It's a lead engine *and* your fourth case study — the site's own funnel, running on the product you sell.

---

## 8. Trust stack — no founder identity

With no name and no face, credibility has to come from artifacts a skeptical buyer can independently verify. Everything below must **exist and be linked** — an unlinked claim is worse than no claim.

| Surface | What it proves | Action needed |
|---|---|---|
| **Public GitHub org** (`github.com/zyntrivia`) | Real engineers, real commits, real code quality | Create the org. Push the case study repos (or clean subsets). Pin them. This is the strongest possible substitute for a face. |
| **Live demo deployments** | The case studies are real software, not screenshots | Deploy StockSense / Resourceable / WorkflowAI to public URLs with seeded demo data and a `[ Open live demo ]` button on each case study page |
| **Fiverr profile + reviews** | Third-party-verified delivery history | Link it. Real reviews from real buyers outrank any testimonial you could write. |
| **Company LinkedIn page** | The studio is a real entity | Create, post the case studies |
| **Contract terms, published** | You're not a hostage risk | On `/about` and `/process`: you own the code and repository; NDA on request; DPA available; invoiced in USD/EUR via Stripe/Wise |
| **Location, stated** | Not hiding anything | "Karachi, UTC+5 — full working-day overlap with Europe, 4+ hours daily overlap with US Eastern" |
| **Response-time commitment** | You're reachable | "Quotes within 24 hours. Replies same business day." Then honor it — it's the easiest promise on the site to break. |
| **Copy quality** | Engineering rigor | US-English, zero typos. Buyers read sloppy copy as sloppy code. |

**`/about` without a founder** — write it as a studio, in the first-person plural, and make the *work* the biography:

> **Zyntrivia is an engineering studio.**
> We build internal tools, AI automation, and full-stack applications for businesses that have outgrown their spreadsheets and their subscriptions.
> We're small on purpose. The person who scopes your project is the person who builds it — there's no account manager, no handoff, no telephone game between the person who understood the problem and the person writing the code.
> We work from Karachi (UTC+5), which puts us inside the European working day and across the US Eastern morning. Our code is on GitHub. Our systems are deployed and clickable. Judge us on those.
> `[ GitHub ]` `[ Live demos ]` `[ Reviews ]`

Note what that does: "small on purpose" and "the person who scopes it builds it" give the buyer the *benefit* of dealing with a named individual — direct access to the engineer — without putting a name on the page.

---

## 9. Data model

```prisma
model Lead {
  id            String   @id @default(cuid())
  source        String   // "quote" | "calculator" | "contact"
  services      String[] // step 1 multi-select
  problem       String?  @db.Text
  timeline      String?
  companySize   String?
  currentState  String?  // nothing | needs-work | replacing
  name          String
  email         String
  company       String?
  country       String?
  website       String?
  calculator    Json?    // slider values when source = "calculator"
  utm           Json?
  ipCountry     String?
  status        String   @default("new") // new | quoted | won | lost
  createdAt     DateTime @default(now())
  @@index([createdAt, status])
}
```

---

## 10. SEO & metadata

- Per-page `metadata` exports. Title pattern: `{Page} — Zyntrivia | Full-Stack Engineering & AI Automation`
- JSON-LD: `Organization`, `ProfessionalService`, `FAQPage` (homepage FAQ), `Article` (case studies + blog)
- `app/opengraph-image.tsx` — dynamic OG images in the terminal aesthetic
- `sitemap.ts`, `robots.ts`
- Target queries: *ai automation agency*, *n8n development agency*, *custom internal tools development*, *hire full stack developer for internal tools*, *saas mvp development agency*, *workflow automation consultant*
- **Phase 2 long tail:** `/services/[slug]` and `/industries/[slug]`. Do not build these until the core site converts — thin pages on a site with no traffic are wasted work.

---

## 11. Quality floor

- Responsive from 375px. Mobile-first.
- Keyboard navigable. Visible amber focus rings. WCAG AA contrast throughout (verify `--text-mid` on `--panel` — it's the one that will fail).
- `prefers-reduced-motion` kills every animation including the terminal and counters.
- Lighthouse 95+ on all four scores. LCP < 2.0s.
- No layout shift from the counters or the terminal — reserve their height.
- The demo widgets **never show an error state to a prospect.** Both degrade to a canned replay.
- Test the quote form on a phone, on cellular, in one hand. That's how half of your leads will arrive.

---

## 12. Build order

| Phase | Work | Est. |
|---|---|---|
| **1** | Design system: tokens, fonts, `Button`/`Card`/`MonoLabel`/`Terminal` primitives. Build the hero to final quality and propagate the language from it. | 1–2 days |
| **2** | Layout shell: nav, footer, Pipeline Rail, section rules. | 1 day |
| **3** | Homepage — all static sections (problem, services, work preview, stack, process, why, FAQ, CTA). | 2–3 days |
| **4** | `/quote` flow + API + Zod + rate limiting + Resend + Supabase + n8n webhook. **Ship this before the demos** — it's the thing that makes money. | 2 days |
| **5** | Three case study pages (MDX) + architecture diagrams + Looms. | 2–3 days |
| **6** | Leak Calculator (client-only, fast win, immediate lead capture). | 1 day |
| **7** | Live Pipeline Demo (streaming API, guardrails, SSRF protection, cost caps, replay fallback). | 2–3 days |
| **8** | `/services`, `/process`, `/about`, `/privacy`, `/terms`. | 1–2 days |
| **9** | Trust infrastructure: GitHub org, live demo deployments, LinkedIn page, links wired in. | 1 day |
| **10** | SEO, OG images, schema, analytics, Lighthouse pass, mobile QA. | 1 day |
| **11** | *Later:* blog + SEO long tail. | ongoing |

**Total to launch: roughly 3 weeks of focused work.**

Ship phases 1–5 as v1 if you need to be live sooner — the demos are the differentiator, but the quote form is the business.

---

## 13. Environment

```bash
DATABASE_URL=              # Supabase Postgres
ANTHROPIC_API_KEY=         # live pipeline demo
RESEND_API_KEY=
LEAD_NOTIFICATION_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
N8N_WEBHOOK_URL=
NEXT_PUBLIC_CAL_LINK=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
DEMO_DAILY_COST_CAP_USD=   # pipeline demo falls back to replay above this
```

```bash
npm i next react react-dom typescript tailwindcss framer-motion \
  @prisma/client zod resend @upstash/ratelimit @upstash/redis \
  next-mdx-remote gray-matter cheerio @anthropic-ai/sdk
```
