# CLAUDE.md — Zyntrivia Website (v2 Redesign)

Read this file first, every session. Detailed specs live in `/docs`. When a doc and this file disagree, this file wins; when a doc and the user's current instruction disagree, ask.

## What this project is
Marketing site for **Zyntrivia**, a software studio (full-stack web apps, SaaS MVPs, workflow/AI automation, internal tools, AI agents) selling to **US/EU SMB operators and founders**.

The site has exactly two jobs:
1. **Generate qualified quote requests** (primary conversion: `/quote` submitted).
2. **Prove competence** through verifiable work (case studies, live demos, public code, writing).

v1 problem being fixed: too many words, too few visuals, homepage tried to be everything. v2 rule: **the homepage is a funnel; everything else lives on its own page.**

## Doc map
| File | Read when |
|---|---|
| `docs/01-PRD.md` | Scope, IA, page-by-page requirements, funnel, success metrics |
| `docs/02-DESIGN-SYSTEM.md` | Any UI work. Tokens, type, layout, motion, components, anti-slop rules |
| `docs/03-ARCHITECTURE.md` | Routing, CMS (Payload), data models, quote pipeline, SEO, analytics, perf |
| `docs/04-BUILD-PLAN.md` | Picking the next task. Phased tickets with acceptance criteria |
| `docs/05-COLOR-RESEARCH.md` | Rationale behind the palette. Don't change tokens without reading it |

## Stack (verify current stable versions before installing; don't pin from memory)
- Next.js (App Router, latest stable ≥15 — required by Payload 3), React, TypeScript `strict`
- Tailwind CSS (v4, CSS-first `@theme` tokens) — tokens come from `docs/02-DESIGN-SYSTEM.md`, never Tailwind's default palette
- Motion (`motion/react`, formerly Framer Motion)
- **Payload CMS 3** mounted inside the Next app (`/admin`) — blog, case studies, services, FAQs, quote requests
- Postgres on **Supabase** (via `@payloadcms/db-postgres`); media in Supabase Storage via Payload S3 adapter
- Resend (transactional email), Cloudflare Turnstile (spam), Plausible (cookieless analytics)
- Hosted on Vercel

## Non-negotiable product rules
- **No pricing** anywhere. Primary CTA is always **"Request a quote"** → `/quote`.
- **No founder name or face.** Studio voice: "we".
- Quote form has **no budget field**.
- **Only verifiable proof.** No invented client logos, testimonials, metrics, or "trusted by 100+ companies". If real data is missing, render nothing — never a placeholder that could ship.
- Every homepage section must contain a **visual** (diagram, screenshot, video loop, interactive element). A section that is only text is a bug.
- Word budgets in `docs/01-PRD.md` are hard limits. If copy doesn't fit, cut copy.

## Design guardrails (summary — full list in design doc)
- Use semantic tokens only (`bg-surface`, `text-muted`, `accent`). No raw hex in components. No `indigo-500`, `purple-500`, `blue-500` or any default Tailwind color.
- Banned: purple→cyan/blue gradient heroes, gradient text, glowing orbs/blobs, glassmorphism, "three identical icon cards" rows, ALL-CAPS eyebrow labels above every heading, `→` appended to every link, fade-up animation on every section.
- One bold thing per page. Motion only on page-load hero sequence and in response to user action. Always honor `prefers-reduced-motion`.
- Dark-first. Contrast: body text ≥ 4.5:1, UI boundaries ≥ 3:1 (palette is pre-verified; don't tweak without re-checking).

## Code conventions
- Server Components by default; `"use client"` only for interactive/motion islands. Keep client JS off the critical path.
- Directory layout: see `docs/03-ARCHITECTURE.md §2`. Components in `src/components/{ui,sections,visuals}`.
- Data fetching for CMS content goes through `src/lib/cms/*` (Payload Local API), cached with tags; revalidated by Payload `afterChange` hooks.
- Forms: Server Actions + Zod validation, shared schema between client and server.
- Accessibility: semantic landmarks, visible focus ring (token `--focus`), keyboard-operable everything, alt text required on all CMS media (enforce in Payload field validation).
- No `any`. No unused dependencies. Prefer CSS/SVG over JS animation where equivalent.

## Commands (update if scripts change)
The app lives in `zyntrivia/`; run commands from there. Copy `.env.example` to `.env` first.
```bash
pnpm dev              # Next + Payload admin at /admin
pnpm build && pnpm start      # build needs a reachable DATABASE_URL (pages pre-render from the CMS)
pnpm lint && pnpm typecheck
pnpm format           # prettier (format:check in CI)
pnpm payload generate:types   # after any collection change
pnpm payload migrate:create   # after schema changes, commit the migration (push is off)
pnpm migrate          # apply migrations
pnpm seed             # idempotent seed content (src/seed)
pnpm run build:deploy # what Vercel runs: migrate, then build (`pnpm ci` is a pnpm built-in)
pnpm test             # vitest: unit + tests/int (int specs skip without DATABASE_URL)
pnpm test:e2e         # playwright: quote funnel, blog publish/draft, axe, copy budgets, security
                      # needs a seeded DB; PW_CHANNEL=chrome uses installed Chrome
```
Docs for editors and launch: `docs/EDITING-GUIDE.md`, `docs/CONTENT-REVIEW.md`, `docs/LAUNCH-CHECKLIST.md`.

## Definition of done (every task)
1. Typecheck + lint pass; no console errors.
2. Mobile (375px) and desktop (1440px) checked; no horizontal scroll.
3. Keyboard-only pass on anything interactive; reduced-motion pass on anything animated.
4. Lighthouse on the touched page: Performance ≥ 90 mobile, Accessibility 100, SEO 100.
5. Analytics events from `docs/03-ARCHITECTURE.md §7` fire for any CTA/form touched.
6. Copy within word budget; no placeholder proof left in.

## When unsure
Ask instead of guessing on: brand copy/claims, adding a dependency, changing tokens, anything touching the quote pipeline or email sending.
