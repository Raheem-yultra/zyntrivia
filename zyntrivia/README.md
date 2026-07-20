# Zyntrivia — Engineering Studio Website

Next.js 14 App Router · TypeScript · Tailwind · Framer Motion · MDX.
Implements `zyntrivia-implementation-plan_2.md` with the Stitch
"Neo-Minimalist Engineering" design system (near-black canvas, electric-blue
accent, Geist/Inter/Geist Mono).

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

Everything works with **zero environment variables** — every integration
degrades gracefully:

| Missing env | Behavior |
|---|---|
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Leads append to `.leads.local.json` |
| `RESEND_API_KEY` | No emails sent (lead still stored) |
| `UPSTASH_REDIS_REST_*` | In-memory rate limiting |
| `N8N_WEBHOOK_URL` | Webhook skipped |
| `NEXT_PUBLIC_CAL_LINK` | Quote form shows "we'll reply with times" |

Copy `.env.example` to `.env.local` and fill in what you have. Run
`supabase/schema.sql` in the Supabase SQL editor before enabling the DB.

## Structure

- `app/` — routes: home, `/services`, `/work(/[slug])`, `/process`, `/about`,
  `/quote`, `/privacy`, `/terms`, `api/quote`, sitemap/robots/OG image
- `components/` — `layout/` (Nav, Footer, PipelineRail), `home/` (homepage
  sections), `quote/`, `work/`, `ui/` primitives, `seo/`
- `content/work/*.mdx` — case study bodies (plan §6 copy, verbatim)
- `lib/` — site constants, zod schema, rate limiting, lead storage

## Guardrails implemented

Quote API: Zod validation, honeypot, timing check (fake-success for bots),
5/IP/hr rate limit, storage-first with fire-and-forget notifications.

## Before launch (integrity + trust checklist)

1. **`[BENCHMARK]` markers** in `content/work/*.mdx` — measure real numbers
   and replace the markers. Do not invent figures (plan §6 integrity rule).
2. **Trust links** — create the GitHub org, Fiverr profile, and company
   LinkedIn; wire the URLs in `app/about/page.tsx` (`PROOF_LINKS`) and
   `components/layout/Footer.tsx`. An unlinked claim is worse than no claim
   (plan §8) — the "Rated 5★ on Fiverr" proof-strip line in
   `components/home/ProofStrip.tsx` must stay only if the linked profile
   backs it.
3. **Live demo deployments** — deploy the three case-study systems and add
   `[ Open live demo ]` buttons to the case study pages.
4. Set `NEXT_PUBLIC_SITE_URL`, verify `hello@zyntrivia.com` exists, and
   review `/privacy` + `/terms` with counsel.
