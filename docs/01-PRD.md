# 01 — Product Requirements: Zyntrivia Website v2

## 1. Goals and metrics

| Goal | Metric | Target (90 days post-launch) |
|---|---|---|
| Generate leads | Quote submissions / unique visitors | ≥ 2% |
| Funnel efficiency | Homepage → `/quote` step 1 click-through | ≥ 6% |
| Form completion | `/quote` step 1 view → submit | ≥ 35% |
| Prove competence | Case study page views per session (sessions that view ≥1) | ≥ 25% of sessions |
| Organic reach | Indexed blog posts; organic sessions to `/blog/*` | 12 posts; month-over-month growth |
| Performance | Core Web Vitals (field data) | LCP < 2.5s, INP < 200ms, CLS < 0.1 |

## 2. Audience
- **Primary — SMB operator** (US/EU, 5–200 staff): drowning in spreadsheets, manual copy-paste, disconnected tools. Wants outcomes, not a tech stack. Scans on mobile first, decides on desktop.
- **Secondary — Non-technical founder**: needs an MVP built, fears being ghosted by freelancers. Needs proof of process and communication.
- **Tertiary — Technical evaluator** (CTO/advisor the buyer forwards the link to): checks code, architecture, writing. Served by case study deep-dives, public GitHub, blog.

## 3. Information architecture

```
/                      Funnel homepage
/work                  Portfolio index (filterable)
/work/[slug]           Case study
/services              Services overview
/services/[slug]       Service detail (4 pages)
/process               How we work (+ FAQ)
/about                 Studio page (no founder identity)
/blog                  Blog index
/blog/[slug]           Post
/blog/topic/[slug]     Topic archive
/quote                 Multi-step quote request
/quote/thanks          Confirmation + what happens next
/privacy  /terms
/admin                 Payload CMS (noindex, auth)
/rss.xml  /sitemap.xml  /robots.txt
```

**Primary nav (desktop):** Work · Services · Process · Blog · [Request a quote] (solid button)
**Mobile nav:** hamburger sheet with the same items + sticky bottom "Request a quote" bar that appears after 50% scroll on the homepage only.
**Footer:** services list, company links, latest 3 posts, GitHub link, email, "Request a quote".

## 4. Global copy rules (hard limits)
- Headline ≤ 10 words. Supporting line ≤ 22 words. Section body ≤ 45 words.
- Max 2 sentences per paragraph on marketing pages.
- Outcome language first ("Stop re-typing orders into three systems"), technology second or never.
- Buttons say what happens: "Request a quote", "See the case study", "Open live demo".
- Sentence case everywhere. No exclamation marks. No "cutting-edge", "seamless", "leverage", "empower", "unlock".

## 5. Homepage — the sales funnel

Sequence follows hook → proof → pain → solution → risk reversal → objections → ask. Each section has one job, one visual, and at most one CTA.

**Plain language only.** The homepage speaks to the SMB operator, not the technical evaluator: name the problem the visitor feels, never the technology. No stack names or engineering terms (e.g. "schema", "LLM", "MVP", "repository", "API", "queue", "sync"), including inside visuals. Portfolio depth and the blog live on their own pages.

*Changed 2026-09-17 at the studio's request: removed S5 Selected work and S8 From the blog; hero rewritten as a hook.*

### S1. Hero (job: hook the visitor with their own problem)
- **Headline (≤10 words):** a question the visitor answers in their head. Current: "What's wasting your team's time?"
- **Sub (≤22 words):** name the time-wasters, then the promise. Current: "Copying data between apps, chasing updates, rebuilding the same report every week. We build software that does it for you."
- **CTAs:** primary "Request a quote" → `/quote`; secondary (ghost) "See how it works" → `#how-it-works` (keeps the visitor in the funnel).
- **Micro-proof under CTAs (verifiable only):** e.g. "Replies within one business day" + GitHub link + review rating if a real public rating exists.
- **Visual — the signature element ("Flow Canvas"):** an SVG/React diagram animating a real workflow in plain words: *an order arrives by email → the details get read for you → stock updates itself → your numbers stay current → your team gets a heads-up*. Nodes are small, crisp UI fragments styled like real product UI (taken from StockSense/WorkflowAI), connected by paths with a traveling pulse. Plays once on load (≈4s), then idles with a subtle pulse; hover/tap a node shows a one-line caption. Static final frame under reduced motion.
- Layout: left-aligned text column (5/12) + canvas (7/12) on desktop; canvas below text on mobile, cropped to 3 nodes.
- The page `<title>` stays descriptive for search ("Software that takes the busywork off your team"); the hook is used for social cards.

### S2. Proof strip (job: remove "are they real?" doubt immediately)
- A single row of verifiable artifacts: "3 case studies, from problem to launch", "Live demos you can click", "Public code on GitHub", real review rating/count (only if it exists). Links go to `/work`.
- Visual: each item is a small live thumbnail (demo screenshot, GitHub contribution mini-graph rendered from real data at build time, etc.), not an icon.

### S3. Pain: "Sound familiar?" (job: make the pain and the result concrete)
- Interactive comparison slider. Left "Before": messy spreadsheet, email thread, sticky-note chaos (illustrated as stylized UI). Right "After": one clean dashboard.
- Copy ≤ 30 words total, e.g. "Before: five tabs, two inboxes, and someone copying numbers at 6pm. After: one screen that updates itself."
- Keyboard: slider operable with arrow keys; `aria-valuenow` exposed.

### S4. How we can help (job: route by need)
- 4 services, **not** identical cards. Asymmetric bento: one large tile (most in-demand service) + three smaller. Plain names:
  1. Apps for your customers
  2. Automation
  3. Tools for your team
  4. AI assistants
- Each tile: outcome line (≤12 words), a mini visual that is a fragment of real UI, link "Explore [service]". Search-friendly service names go in each service's SEO title.

### S5. How it works (job: reduce fear of the unknown)
- Real sequence, so numbered steps are appropriate: 1 A 30-minute call → 2 A fixed price (within 3 business days) → 3 Progress every week → 4 Launch, and it's yours.
- Visual: horizontal timeline with a mock "weekly demo" calendar strip. Durations shown as ranges only if accurate. Anchor `#how-it-works`.

### S6. It's all yours when we're done (job: risk reversal)
- Checklist of what the client gets, in plain words: you own the software, clear instructions, checked before launch, easy for anyone to take over, 30 days of support. Each item has a tiny thumbnail.

### S7. FAQ (job: handle objections)
- 5–6 items from CMS (`faqs` collection, `showOnHome: true`): time zones & communication, who owns what we build, NDAs, how quotes work without published pricing, payment milestones, post-launch support.
- Accordion; FAQPage JSON-LD.

### S8. Final CTA (job: convert)
- Headline ≤ 8 words ("Tell us what's slowing your team down.") + embedded **step 1 of the quote form** as problem tiles ("Copying data between apps", "Spreadsheets nobody trusts", "Answering the same questions", "An app for your customers", "Something else"). Selecting a tile routes to `/quote?type=…` at step 2.

## 6. Portfolio

### `/work` index
- Header: headline + one line, no paragraph.
- Filter chips by service (multi-select, URL-synced `?service=automation`) and industry.
- Grid of case study cards: cover media, title, industry, services tags, one-line outcome.
- Empty filter state: "No projects match these filters." + "Clear filters".

### `/work/[slug]` case study template (content in Payload `case-studies`)
1. **Hero:** title, one-line summary, meta (industry, services, timeline, stack icons), cover video/screenshot, "Open live demo" / "View code" buttons when URLs exist.
2. **At a glance:** 3 facts — problem, solution, result (each ≤ 20 words).
3. **The problem:** ≤ 120 words + one visual (current-state diagram).
4. **What we built:** feature highlights as alternating screenshot + ≤ 40-word captions (block-based, editor-controlled).
5. **Architecture:** diagram (uploaded SVG or Mermaid rendered at build) + short notes. For technical evaluators; collapsible on mobile.
6. **Results:** only real metrics; block hidden if empty.
7. **Tech stack:** logos.
8. **Next/previous case study** + final CTA band "Have a similar problem? Request a quote."

## 7. Blog

### Requirements
- Editable in the browser via Payload `/admin`: create, edit, schedule, publish, unpublish, preview drafts on the real site (Next draft mode + Payload live preview).
- Rich text (Lexical) with custom blocks: code (syntax-highlighted, copy button), callout, image with caption, embedded video, table, comparison, CTA block (renders "Request a quote" band), and case-study reference card.
- Topics (taxonomy), optional series, author = "Zyntrivia team" by default.
- Auto-generated: reading time, table of contents (h2/h3), OG image (`next/og` with title on brand template), RSS, sitemap entry, Article JSON-LD.
- SEO fields per post: meta title, meta description, canonical override, noindex toggle.
- Media: alt text required; images auto-optimized via `next/image`.

### `/blog` index
- Featured post (large) + chronological list with topic filter chips. Pagination (12/page), not infinite scroll.
- Each item: title, excerpt (≤ 25 words), topic, date, reading time.

### `/blog/[slug]`
- Measure ≤ 70ch body, sticky TOC on desktop (≥1200px), progress indicator optional.
- Inline CTA block after ~60% of content (editor places it; default auto-inserted if absent) + end-of-post CTA.
- Related posts (same topic, 3).

### Content plan (first 12 posts — SEO intent)
Mix of problem-aware searches from SMB operators and credibility posts for evaluators, e.g.: "When to replace spreadsheets with an internal tool", "n8n vs Zapier for growing teams", "What an MVP should cost you in time, not just money", "How we structure a fixed-scope software quote", plus technical write-ups from each case study.

## 8. Quote request `/quote`
- 3 steps, progress indicator, back/forward retains state (URL `?step=` + sessionStorage).
  1. **What are you building?** tiles: Web app / MVP · Automation · Internal tool/dashboard · AI agent/chatbot · Not sure yet.
  2. **Timeline & stage:** start timeline (ASAP / 1–3 months / exploring), current stage (idea / existing tool to replace / existing product to extend).
  3. **Details:** name, work email, company (optional), project description (textarea, min 30 chars), how did you hear about us (optional select). **No budget field.**
- Turnstile + honeypot; server rate limit 5/hour per IP.
- On submit: store in Payload `quote-requests`, email notification to studio, confirmation email to requester, redirect `/quote/thanks`.
- `/quote/thanks`: what happens next (reply within 1 business day, discovery call, quote) + 2 relevant case studies based on selected type.

## 9. Other pages (brief)
- `/services/[slug]`: problem, what we build (visual examples), relevant case studies, process link, FAQ subset, CTA.
- `/process`: expanded S6 + S7 + full FAQ.
- `/about`: studio mission in ≤ 80 words, principles (with visuals), how we work remotely with US/EU clients, tools we use. No personal identity.

## 10. Out of scope (v2)
Pricing page, client portal, multilingual, light theme (tokens must support it later), newsletter (design a slot, ship later), live chat.
