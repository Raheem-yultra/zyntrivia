# 04 — Build Plan

Work top to bottom. One ticket per session/PR. Each ticket lists acceptance criteria (AC); the global Definition of Done in `CLAUDE.md` also applies. Before starting a ticket, re-read the doc sections it references. After finishing, tick it here.

## Phase 0 — Foundation
- [x] **P0-1 Scaffold.** Create Next.js (latest stable) + TS strict + pnpm; install Payload 3 with Postgres adapter into route groups `(frontend)` / `(payload)`; ESLint, Prettier, Vitest, Playwright. *AC:* `pnpm dev` serves `/` and `/admin`; typecheck/lint clean; `.env.example` complete (arch §9). *Status:* verified against a local Postgres; connecting to Supabase needs the real `DATABASE_URL` and CA certificate.
- [x] **P0-2 Tokens & fonts.** Implement `globals.css` theme exactly as design §2–3; remove default Tailwind palette; next/font setup. *AC:* a `/dev/tokens` page (dev-only, 404 in prod) renders every color, type style, radius; using `bg-indigo-500` fails to produce a style.
- [x] **P0-3 UI primitives.** Build components in design §7 (Button, Link, Tile, MediaFrame, Chip, Input, Textarea, Select, ChoiceTile, Accordion, Stepper, Prose, CTABand). *AC:* each has keyboard + focus + reduced-motion behavior; shown on `/dev/components`.
- [x] **P0-4 Layout shell.** Header (desktop nav + mobile sheet), footer, skip link, sticky mobile CTA (homepage only, after 50% scroll). *AC:* nav traps focus in mobile sheet; Esc closes; `cta_click` fires with correct `location`.
- [x] **P0-5 Analytics + SEO base.** `lib/analytics.ts`, Plausible script, `lib/seo.ts`, Organization/WebSite JSON-LD, `robots.ts`, security headers. *AC:* events visible in Plausible dev dashboard (or logged in dev); headers present.

## Phase 1 — CMS
- [x] **P1-1 Media + storage.** `media` collection with required alt, Supabase S3 adapter, SVG sanitization. *AC:* upload without alt is rejected; image renders via next/image. *Status:* S3 adapter is configured but untested against Supabase Storage (needs credentials). Local uploads go to `./media`.
- [x] **P1-2 Content collections.** `topics`, `posts`, `case-studies`, `services`, `faqs`, globals `SiteSettings`, `Homepage` per arch §3; drafts/versions; generate types; migration committed.
- [x] **P1-3 Blocks + renderer.** Lexical blocks (Code, Callout, ImageCaption, Video, Table, CTA, CaseStudyRef, FeatureShot) + `RichTextRenderer`. Code blocks highlighted at build (Shiki) with copy button. *AC:* a post using every block renders correctly and passes axe.
- [x] **P1-4 Revalidation + preview.** Cache tags, `afterChange` hooks, `/api/draft`, live preview for posts and case studies. *AC:* editing a published post updates the live page within seconds without redeploy; drafts only visible in draft mode.
- [x] **P1-5 Seed content.** Seed script: 3 case studies (StockSense, ResourceAble, WorkflowAI — copy from existing case study docs), 4 services, 6 FAQs, 3 topics, 2 posts. *AC:* `pnpm seed` idempotent.

## Phase 2 — Visuals
- [x] **P2-1 UI fragments.** Recreate 6–8 small fragments from real projects as React/SVG (email row, ledger row, n8n-style node, KPI tile, filter panel, Slack message, table row, chart). *AC:* themed via tokens only; each ≤ 3 KB gz.
- [x] **P2-2 Flow Canvas.** Per design §5. *AC:* sequence ≤ 4.5s, starts after hero text paints, reduced-motion static state, 3-node mobile variant, node captions reachable by keyboard; homepage LCP still text.
- [x] **P2-3 CompareSlider (before/after).** *AC:* mouse, touch, keyboard; `role="slider"` values announced.
- [ ] **P2-4 Media pipeline.** Record case-study loops, encode WebM/MP4 ≤ 1.5 MB, posters. *AC:* lazy loaded; no layout shift. *Status:* `VideoLoop` plays only in view with `preload="none"`, and case study cover frames reserve a 16:10 box. **No loops recorded yet.** StockSense uses real screenshots; ResourceAble and WorkflowAI use UI fragments.

## Phase 3 — Homepage funnel
- [x] **P3-1 S1 Hero + S2 Proof strip.** Proof items from `SiteSettings`; items without real data are not rendered.
- [x] **P3-2 S3 Before/after + S4 Services bento.**
- [x] **P3-3 S5 Selected work + S6 Process + S7 Handover.** *Update 2026-09-17:* Selected work removed from the homepage at the studio’s request (PRD §5 now a sales funnel).
- [x] **P3-4 S8 Blog teaser + S9 FAQ + S10 Final CTA with embedded quote step 1.** Blog teaser hidden if < 2 posts. *Update 2026-09-17:* blog teaser removed from the homepage; final CTA tiles now name problems in plain language.
- [x] **P3-5 Homepage review.** *AC:* every section has a visual; word budgets met (write a small script that counts words per section from rendered HTML `data-section` attributes and fails over budget); Lighthouse mobile perf ≥ 90; anti-slop checklist passed; screenshot review at 375/900/1440. *Status:* `tests/e2e/copy-budget.e2e.spec.ts`; homepage Lighthouse mobile 90–92 locally.

## Phase 4 — Quote funnel
- [x] **P4-1 Wizard UI.** 3 steps per PRD §8, URL `?step`, sessionStorage persistence, prefill `type` from query. *AC:* keyboard-only completion; back button works; step events fire.
- [x] **P4-2 Server action + storage.** Turnstile, honeypot, rate limit, Zod, Payload create. *AC:* invalid token rejected; 6th request/hour from same IP rejected with friendly message; lead stored even if email fails.
- [ ] **P4-3 Emails.** React Email templates (internal + confirmation), Resend. *AC:* renders in dark and light mail clients; plain-text fallback. *Status:* templates and plain-text fallbacks are built with light and dark styles, as string templates rather than React Email (its components package is deprecated). **Not yet checked in real mail clients**; needs a Resend key.
- [x] **P4-4 Thanks page.** Next steps + 2 case studies matched to type. *AC:* noindex; `quote_submit` fires once.
- [x] **P4-5 Admin lead view.** Status workflow, list columns (created, name, type, status), filters. *AC:* non-admin API access returns 403.

## Phase 5 — Portfolio
- [x] **P5-1 `/work` index** with URL-synced filters and empty state.
- [x] **P5-2 `/work/[slug]` template** per PRD §6 with conditional blocks (demo/repo/results hidden when empty), CreativeWork JSON-LD, prev/next.

## Phase 6 — Blog
- [x] **P6-1 `/blog` index** (featured + list + topic chips + pagination).
- [x] **P6-2 `/blog/[slug]`** (Prose, TOC, reading time, inline/end CTA, related posts, Article JSON-LD).
- [x] **P6-3 Topic archives, RSS, sitemap entries, OG image template.**
- [x] **P6-4 Editor guide.** Write `docs/EDITING-GUIDE.md`: how to write/schedule/preview a post, image sizes, alt text rules, when to add CTA block. *AC:* a non-developer can publish a post following only this guide.

## Phase 7 — Remaining pages & launch
- [x] **P7-1 Services pages, Process, About, legal pages.**
- [x] **P7-2 Redirects** from v1 URLs; 404 page with links to Work, Blog, Quote.
- [ ] **P7-3 QA pass.** Playwright + axe suite green; cross-browser (Chrome, Safari iOS, Firefox); Lighthouse on every template. *Status:* Playwright + axe suite green in Chrome; Lighthouse run on every template (91–94, homepage 90–92). **Firefox and iOS Safari not yet tested.**
- [ ] **P7-4 Launch.** Vercel production env, Supabase region confirmed, Plausible goals + funnel, Search Console + sitemap submitted, uptime monitor on `/` and `/quote`. *Status:* see `docs/LAUNCH-CHECKLIST.md`.

## Post-launch (backlog)
- A/B test hero headline variants (Plausible props or Vercel flags).
- Light theme using same tokens.
- Newsletter slot on blog.
- Industry landing pages (programmatic from services × industries) once 3+ case studies per industry exist.
