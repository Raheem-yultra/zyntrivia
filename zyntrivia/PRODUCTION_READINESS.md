# Production Readiness — Zyntrivia

Audit date: 2026-08-28. Scope: `zyntrivia/` (Next.js 14 App Router site, currently
mid-migration onto Sanity CMS on branch `qol-audit-service-catalog`).

## What's already verified working

- `npx tsc --noEmit` — **passes, zero errors.**
- `npm run build` — **passes.** All 18 routes compile and prerender
  (static/SSG/dynamic split looks correct; `/studio`, `/api/quote`,
  `/api/revalidate` are correctly dynamic).
- Every external integration (Supabase, Resend, Upstash, n8n, Cal.com,
  Sanity) degrades gracefully to a safe fallback when its env vars are
  unset — confirmed by reading `lib/leads.ts`, `lib/rate-limit.ts`,
  `lib/sanity/queries.ts`. This is genuinely solid engineering; don't
  disturb the pattern.
- `/api/quote`: Zod validation, honeypot (max(0) field), 4s minimum-fill
  timing check, 5/hour/IP rate limit, storage-first with fire-and-forget
  email/webhook notification. Looks production-ready as-is.
- `/api/revalidate`: Sanity webhook, checks a shared secret header before
  doing anything. Correct.
- Security headers in `next.config.mjs` (CSP, HSTS, X-Frame-Options,
  Permissions-Policy) are already thoughtful and documented inline — no
  changes needed.
- `robots.ts` / `sitemap.ts`: `/studio` and `/api/` are correctly
  disallowed from crawling; sitemap pulls case studies dynamically from
  Sanity (or its fallback) so it can't drift.
- No secrets, `.env.local`, or credentials are tracked in git —
  `.gitignore` is correct.
- Applied `npm audit fix` (non-breaking) during this audit — fixed the
  `js-yaml` advisory. Re-ran the build afterward to confirm nothing broke.
- **Favicon added** — [app/icon.tsx](app/icon.tsx) and
  [app/apple-icon.tsx](app/apple-icon.tsx) (dynamic `ImageResponse`, brand
  navy/blue "Z" monogram, matching `opengraph-image.tsx`'s style). Verified
  in-browser: both render and Next lists `/icon` and `/apple-icon` as
  build routes.
- **Proof links fixed.** `github.com/zyntrivia` 404s — confirmed live via
  fetch, so it was removed rather than shipped broken (it appeared in both
  [app/about/page.tsx](app/about/page.tsx) and the global
  [components/layout/Footer.tsx](components/layout/Footer.tsx)). Replaced
  with the real, verified company LinkedIn
  (`linkedin.com/company/zyntrivia`) in both places. The "Rated 5★ on
  Fiverr" claim in [components/home/ProofStrip.tsx](components/home/ProofStrip.tsx)
  was removed too — no linked profile backs it, and an unlinked claim is
  worse than no claim (the code's own stated principle). About page copy
  that referenced the dead GitHub claim ("Our code is on GitHub") was
  reworded to stop pointing at a proof point that no longer exists.
- **Lead form and CTAs tested live in-browser**, not just read: ran the
  full `/quote` flow (all 3 steps, real field values) against the actual
  dev server. Confirmed: client-side required-field validation correctly
  blocks submission with a missing selection; successful submission shows
  the "Request received" confirmation; the lead lands correctly in
  `.leads.local.json` with every field intact; a warm second submission
  completed in 31ms (the first request's 20.9s was one-time Next.js dev
  cold-compile of the route, not a real latency issue — confirmed by the
  second request being fast). All four "Request a Quote" CTAs (Nav, Hero,
  LeakCalculator, FinalCTA) point at `/quote` correctly.

## 1. Blocking — do before going live

These are the only things standing between this codebase and launch.

- [ ] **Set production environment variables in Vercel** (project
      `zyntrivia`, already linked per `.vercel/project.json`). At minimum
      for full functionality: `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`,
      `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`,
      `LEAD_NOTIFICATION_EMAIL`, `UPSTASH_REDIS_REST_URL`,
      `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`,
      `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`,
      `SANITY_REVALIDATE_SECRET`, `NEXT_PUBLIC_CAL_LINK`,
      `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Without these the site still works
      (fallback content, `.leads.local.json` capture) but leads won't
      reliably persist and content is stuck on hardcoded fallbacks.
- [ ] **Verify the `zyntrivia.com` sending domain in Resend.** `lib/leads.ts`
      sends from `leads@zyntrivia.com` and `hello@zyntrivia.com` — if the
      domain isn't verified in Resend, both emails will silently fail.
- [ ] **Confirm `hello@zyntrivia.com` inbox actually exists and is
      monitored** — the quote form promises a 24h reply from it.
- [x] ~~Add a favicon / app icon.~~ Done — see above.
- [x] ~~Resolve the `PROOF_LINKS` TODO~~ Done — GitHub link removed
      (404), replaced with the verified LinkedIn company page in both
      About and the Footer. Fiverr claim removed. If you get a real
      GitHub org or Fiverr profile later, re-add them the same way.
- [ ] **Live demo links** ([lib/work.ts](lib/work.ts)) — only StockSense has
      `demoHref` set. Resourceable and WorkflowAI case studies have no
      "Open live demo" button. Either deploy those demos and wire the
      URLs, or accept the two case studies stay writeup-only.
- [ ] **Legal review of `/privacy` and `/terms`** with actual counsel —
      flagged in the existing README and still applicable.
- [ ] **Upgrade Next.js off 14.2.x.** `npm audit` (see below) reports the
      pinned Next 14.2 range as vulnerable to ~19 known advisories
      (several DoS/SSRF/cache-poisoning issues), fixable only via a major
      bump to Next 16. This is a **breaking change** — do it as its own
      PR with a full regression pass (all routes, the CSP config,
      `next.config.mjs` rewrites, the Sanity Studio embed), not folded
      into other work. I did not do this automatically; it needs
      deliberate testing.
- [ ] **Upgrade the Sanity toolchain** (`sanity`, `next-sanity`,
      `@sanity/vision`) — also flagged by `npm audit` (critical
      `decompress`/`adm-zip` transitive vulnerabilities via
      `@sanity/cli`). Same caveat: major version bump, test the
      `/studio` route and `scripts/seed-sanity.ts` afterward.

## 2. Should do soon (not launch-blocking)

- [ ] **No linter is configured.** `package.json` has no `lint` script and
      `eslint`/`eslint-config-next` aren't installed, even though
      `next.config.mjs` sets `eslint: { ignoreDuringBuilds: true }`
      (currently a no-op since there's nothing to ignore). Add
      `eslint-config-next` and a `lint` script so dead code and
      accessibility issues get caught before they reach `main`.
- [ ] **No automated tests.** Nothing exercises `/api/quote`'s validation,
      the rate limiter, or the Sanity fallback logic. Given how much
      correctness lives in those fallback branches, even a handful of
      unit tests for `lib/schema.ts`, `lib/rate-limit.ts`, and
      `lib/sanity/queries.ts` would catch regressions cheaply.
- [ ] **`SANITY_REVALIDATE_SECRET` comparison** in
      [app/api/revalidate/route.ts:24](app/api/revalidate/route.ts:24) uses
      `!==` instead of a constant-time comparison. Low real-world risk
      for a webhook secret, but cheap to fix with `crypto.timingSafeEqual`
      if you want to be strict.
- [ ] Run `npm audit` again after the Next/Sanity major upgrades above to
      confirm the remaining `glob` (via `@architect/*`, likely a stray
      transitive dep, worth checking why it's present at all) and any new
      advisories are cleared.

## 3. Nice-to-have / polish

- [ ] Confirm `NEXT_PUBLIC_SITE_URL` / the hardcoded `https://zyntrivia.com`
      fallback in `lib/site.ts` and `app/layout.tsx` matches the domain
      you're actually deploying to.
- [ ] Once Sanity is populated with real content, spot-check that the
      Studio's field shapes actually match what
      [lib/sanity/queries.ts](lib/sanity/queries.ts) expects (e.g.
      `order`, `variant`, `slug.current`) — nothing enforces this at
      build time since fallback content masks a mismatch until Sanity is
      actually configured.
- [ ] `npm fund` reports 295 packages soliciting funding — no action
      needed, just noting `npm audit`/`npm fund` output isn't otherwise
      actionable.

## Suggested order of operations

1. Set env vars in Vercel → verify Resend domain → confirm `hello@` inbox.
2. Add favicon, fix/remove the GitHub proof link, decide on the two
   missing live demos.
3. Get legal sign-off on `/privacy` and `/terms`.
4. Ship the current branch (`qol-audit-service-catalog`) to production
   once the above is done — the code itself is ready.
5. As a separate follow-up PR: upgrade Next.js 14 → 16 and the Sanity
   toolchain, each with its own regression pass, to close the
   `npm audit` findings.
6. As ongoing hygiene: add ESLint + a small test suite.
