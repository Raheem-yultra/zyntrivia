# Content review before launch

CLAUDE.md says to ask before publishing brand copy or claims. Everything below was written or carried over during the v2 build and **needs a yes, an edit, or a delete from the studio before launch**. Nothing here is invented proof: there are no logos, testimonials, ratings, or metrics. But some lines are commitments that clients will hold us to.

Most items are CMS content. Change them in the admin (see `docs/EDITING-GUIDE.md`) and they update live. Items marked **code** live in the codebase and need a developer.

## 1. Commitments clients will hold us to

| # | Claim | Where it appears | Source | Decision |
|---|---|---|---|---|
| 1.1 | "Replies within one business day" | Hero micro-proof, footer, /quote, /quote/thanks, confirmation email | PRD §5 S1 example | ☐ keep ☐ change |
| 1.2 | "A written plan and a fixed price within 3 business days" of the first call | /process, homepage process, /quote, /quote/thanks, confirmation email, FAQ | PRD §5 S6 | ☐ keep ☐ change |
| 1.3 | "A 30-minute call" | Same places as 1.2 | PRD §5 S6 | ☐ keep ☐ change |
| 1.4 | "30 days of support" after launch | Homepage handover, /process, FAQ "What happens after launch?" | PRD §5 S7 | ☐ keep ☐ change |
| 1.5 | "Payment milestones are set out in your quote before any work starts" | FAQ "How are payments structured?" | PRD §5 S9 asks for a payment-milestones FAQ; the wording is ours | ☐ keep ☐ change |
| 1.6 | "A first automation usually ships in 2–5 weeks, and a larger internal tool or MVP in 4–8" | FAQ "How long does a typical build take?" | v1 site | ☐ keep ☐ change ☐ remove ranges |
| 1.7 | The client owns the software, instructions, and logins; it lives in the client's account from day one | Homepage handover, /process, FAQ | PRD §5 S6–S7 | ☐ keep ☐ change |
| 1.8 | "Requests that don't go ahead are deleted within 12 months" | /privacy | Architecture §8; now enforced by a daily job | ☐ keep ☐ change |

## 2. Studio identity

| # | Item | Where | Notes | Decision |
|---|---|---|---|---|
| 2.1 | Location "Karachi (UTC+5)" and the working-hours overlap chart (09:00–17:00 CET and ET against Karachi hours) | /about, Site settings, FAQ "How do you work with teams in the US and Europe?" | From v1. Check the hours we actually commit to. The chart is **code** (`TimezoneOverlap.tsx`). | ☐ keep ☐ change |
| 2.2 | "A small studio that builds software to last" | /about headline (**code**) | Written for v2 | ☐ keep ☐ change |
| 2.3 | About mission and principles copy | /about (**code**) | Written for v2, 80-word budget | ☐ keep ☐ change |
| 2.4 | Contact email `hello@zyntrivia.com` | Site settings, footer, emails | Confirm the inbox exists and is monitored | ☐ confirmed |
| 2.5 | LinkedIn `linkedin.com/company/zyntrivia` | Footer | Confirm the page exists | ☐ confirmed |
| 2.6 | GitHub URL and username | Site settings, currently **empty** | Hero "Public code on GitHub" link, the proof strip, and the contribution graph stay hidden until set | ☐ add ☐ leave hidden |
| 2.7 | Review platform, rating, and count | Site settings, currently **empty** | Only add a real, public profile | ☐ add ☐ leave hidden |

## 3. Homepage copy (sales funnel)

All in **Admin → Homepage** unless noted. Rewritten 2026-09-17 as a plain-language sales funnel at the studio's request: Selected work and the blog teaser were removed from the homepage.

| # | Copy | Budget | Source | Decision |
|---|---|---|---|---|
| 3.1 | Hero hook: "What's wasting your team's time?" | 10 words | Studio direction | ☐ |
| 3.2 | Subhead: "Copying data between apps, chasing updates, rebuilding the same report every week. We build software that does it for you." | 22 words | Written for the funnel | ☐ |
| 3.3 | Pain section "Sound familiar?" with the before / after lines | 30 words | PRD example | ☐ |
| 3.4 | Final CTA: "Tell us what's slowing your team down." + "Pick the one that sounds most like you." | 8 words | PRD | ☐ |
| 3.5 | Section headings: "How we can help", "How it works" (+ lead "A fixed price before any work starts, and progress you can see every week."), "It's all yours when we're done", "Questions we get asked" | 10 words | Written for the funnel (**code**) | ☐ |
| 3.6 | Flow Canvas node labels and captions (an order arrives by email → the details get read for you → stock updates itself → your numbers stay current → your team gets a heads-up) | n/a | Written from the StockSense workflow (**code**) | ☐ |
| 3.7 | Problem tiles, also quote step 1 and the lead emails: "Copying data between apps", "Spreadsheets nobody trusts", "Answering the same questions", "An app for your customers", "Something else" | n/a | Written for the funnel (**code**) | ☐ |
| 3.8 | "What you get" items: you own the software, clear instructions, checked before launch, easy for anyone to take over, 30 days of support | n/a | PRD §5, reworded (**code**) | ☐ |

## 4. Services

| # | Item | Notes | Decision |
|---|---|---|---|
| 4.1 | Four services, now with plain names: **Apps for your customers**, **Automation**, **Tools for your team**, **AI assistants**. Search titles keep the familiar terms ("Custom web apps and customer portals", etc.) | From the PRD. v1's **"Digital Asset Design"** service was dropped because the PRD lists only four. | ☐ agree ☐ restore |
| 4.2 | **Automation** gets the large homepage tile | The PRD asks for the "most in-demand service"; we assumed automation | ☐ keep ☐ pick another |
| 4.3 | Outcome lines, summaries, problem sections, and "What you get" items on all four service pages (plain language) | Rewritten 2026-09-17 within the word budgets; claims unchanged | ☐ |
| 4.4 | Case study card lines shown under "Projects like this" and on `/work`: "Bookings and payments hold up even when customers close the tab or click twice" (ResourceAble), "The same order arriving twice is only ever processed once" (WorkflowAI), "You can see exactly where every stock number came from" (StockSense) | Plain rewrites of the v1 claims. The case study pages themselves are still written for technical readers. | ☐ |

## 5. Case studies

| # | Item | Notes | Decision |
|---|---|---|---|
| 5.1 | StockSense, ResourceAble, and WorkflowAI copy | Adapted from the v1 case studies (`docs/reference/v1-case-studies/`) and cut to v2 word budgets | ☐ |
| 5.2 | **Results** sections are empty | v1 had no measured results we could verify, so the Results block is hidden. Add real numbers only. | ☐ add ☐ leave hidden |
| 5.3 | Name spelling: **ResourceAble** (PRD) vs **Resourceable** (v1) | Seeded as ResourceAble | ☐ ResourceAble ☐ Resourceable |
| 5.4 | Industry and stack for each study | Taken from v1. The **Timeline** field is empty for all three; add real durations or leave it hidden. | ☐ |
| 5.5 | Media | StockSense uses real screenshots from the live demo. ResourceAble and WorkflowAI use UI fragments because no screenshots or video loops exist yet (build plan P2-4). The StockSense inventory screen couldn't be captured, so it also uses a fragment. | ☐ record loops |
| 5.6 | StockSense "Open live demo" | Links to the v1 demo at `/projects/stocksense-demo` | ☐ confirmed working |

## 6. Blog

| # | Item | Decision |
|---|---|---|
| 6.1 | "When to replace a spreadsheet with an internal tool" (featured), written for v2 as seed content | ☐ publish ☐ edit ☐ unpublish |
| 6.2 | "Why good automations fail loudly" (retitled from "...retries, idempotency, and dead-letter queues" so the footer link reads plainly; the post body is still technical), written for v2 as seed content | ☐ publish ☐ edit ☐ unpublish |
| 6.3 | Topics: Automation, Internal tools, Engineering | ☐ |

Posts no longer appear on the homepage, but the footer lists the three latest, so titles should read plainly.

## 7. FAQs

Nine FAQs are seeded and six show on the homepage: time zones, who owns what we build, NDAs, how quotes work without published pricing, payment milestones, and post-launch support. Items 1.4–1.7 above cover the commitments inside them. ☐ Reviewed all nine.

## 8. Legal

| # | Item | Notes | Decision |
|---|---|---|---|
| 8.1 | /privacy | Covers quote data, the processors (Vercel, Supabase, Resend, Cloudflare, Plausible), hashed IPs for rate limiting, retention, and rights. **Not reviewed by a lawyer.** Name the legal entity and add a postal address if required for EU clients. | ☐ |
| 8.2 | /terms | Website terms plus an "Engagements" clause: client work is governed by the agreement sent with each quote, and IP in custom work is assigned to the client on payment. Not a services agreement. **Not reviewed by a lawyer.** | ☐ |
| 8.3 | Data location | /privacy doesn't say where data is stored. Add the Supabase region once it's chosen (see `docs/LAUNCH-CHECKLIST.md`). | ☐ |

## How the site protects these rules automatically

- Word budgets are enforced when saving in the admin and again by `tests/e2e/copy-budget.e2e.spec.ts`, which also fails on exclamation marks, banned words, pricing, or a budget field.
- Proof items (GitHub, reviews, results, demos) render nothing when their data is empty.
- Author defaults to "Zyntrivia team". No field exists for a personal photo.
