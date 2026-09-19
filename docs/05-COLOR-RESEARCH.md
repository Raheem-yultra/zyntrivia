# 05 — Color Research: Dark Blue–Purple

Research date: September 2026. Summaries are paraphrased; see sources at the end.

## 1. Findings

### Dark themes are expected, but pure black is not
- Dark mode is now a mainstream default rather than a niche preference; guides report large majorities of users enabling it at the OS level, and developer audiences skew even higher.
- Consistent guidance across 2026 dark-mode guides: avoid pure `#000` backgrounds with pure `#FFF` text (harsh halation, worse for users with astigmatism or dyslexia); use elevated dark tones and slightly softened whites; keep WCAG ratios of 4.5:1 for body text and 3:1 for large text/UI.
- Depth should come from stepped surface tones, not inverted light-mode shadows.

### What blue and purple signal
- Blue is the most common color in corporate and tech branding and is strongly associated with trust, stability and professionalism — which is exactly why it's crowded. Several B2B branding sources warn that plain blue makes a brand blend into competitors.
- Purple reads as creativity, innovation and premium quality; one B2B agency describes pairing purple with black to combine imagination with authority.
- Tech brands have moved beyond flat corporate blue; Stripe's purple-blue identity is the canonical example of the blend working.
- **Takeaway:** blue for trust, violet for distinction. Assign them jobs rather than blending them.

### The biggest risk: the "AI slop" palette
- In 2025–2026 the purple-to-blue/cyan gradient hero (plus Inter, glass cards, glow orbs, three icon cards) became the most recognizable tell of AI-generated sites. Tailwind's creator publicly apologized for `indigo-500` becoming the default every AI tool copies.
- Cursor's head of design, reviewing YC startup sites, called out ubiquitous purple gradients as a sign of template-driven design that dilutes brand identity.
- The consensus fix: purple is fine as a hue; sameness is the problem. Lock brand tokens in a design file the coding agent must follow, cap the palette, pick real fonts, and verify contrast.
- **This matters doubly for Zyntrivia:** a studio that sells AI-assisted development cannot look AI-defaulted. The palette must be visibly deliberate.

### Conversion-relevant design patterns (B2B)
- Homepages are increasingly treated as conversion funnels rather than information hubs; progressive disclosure beats cramming.
- Two CTAs above the fold: a high-commitment one (request a quote) and a low-commitment one (see work).
- Proof belongs right after the value proposition and close to the CTA; specific, numeric proof outperforms adjectives.
- Keep forms short (5 or fewer fields per step) and put a clear visual hierarchy on the single primary CTA (squint test).

### Reference sites (study the restraint, don't copy)
- **Linear** — near-black with a violet accent used sparingly; hierarchy via subtle gray steps.
- **Raycast** — deep blacks/dark blues with vivid accents; the product UI itself is the hero visual.
- **Stripe** — the reference for a purple-blue brand that feels trustworthy rather than trendy.
- **Vercel** — shows how far pure contrast and typography alone carry a dark site.
- Your saved inspiration (agentyx.ca, codoroai.com, agentumai.tech) — useful for lead-gen structure; audit them for the slop tells above before borrowing visuals.

## 2. Palette options

All three verified for WCAG contrast (ratios vs page background).

### Option A — Midnight Ink (recommended at research time; superseded)
Visibly navy canvas, violet brand, blue information.
| Role | Hex | Contrast |
|---|---|---|
| Background | `#0C1022` | — |
| Surface 1 / 2 | `#131832` / `#1B2142` | — |
| Text / muted / subtle | `#ECEEF8` / `#A9AECB` / `#8C91B5` | 16.3 / 8.6 / 6.1 |
| Accent (violet, text/icons) | `#A193FF` | 7.3 |
| Button fill (white label) | `#6A58F5` | white 4.85 |
| Info (blue) | `#74ADFF` | 8.2 |
| Signal (mint) | `#43DD9B` | 10.8 |
**Why:** violet differentiates from the sea of blue B2B sites; blue still carries "trust" in links and data; the navy base (not tinted black) makes the blue–purple identity obvious without gradients.

### Option B — Deep Navy
Blue brand, violet as rare secondary.
| Role | Hex | Contrast |
|---|---|---|
| Background | `#070B16` | — |
| Text / muted | `#EAF0FA` / `#9FAAC4` | 17.2 / 8.4 |
| Accent (blue) | `#4C8DFF` | 6.1 |
| Button fill (white label) | `#2D66E8` | white 5.0 |
| Secondary (violet) | `#A393FF` | 7.7 |
**Why/why not:** safest trust signal; closer to generic SaaS and to the v1 electric-blue direction, so less of a visible "new brand" moment.

### Option C — Ultraviolet
Purple-tinted base, bright lavender brand, cyan secondary.
| Role | Hex | Contrast |
|---|---|---|
| Background | `#0D0A1F` | — |
| Text / muted | `#F1EEFB` / `#B0A8CC` | 17.0 / 8.6 |
| Accent (lavender) | `#B39CFF` | 8.4 |
| Button fill | `#9F85FF` with dark label `#0D0A1F` | 6.7 (white label fails at 2.9) |
| Secondary (cyan) | `#5CC8FF` | 10.3 |
**Why/why not:** most memorable, but lavender + cyan on a purple base is the closest to the AI-slop gradient look. Only viable with very strict no-gradient discipline.

### Option F — Ink & Lime ✅ adopted 2026-09-18
Neutral near-black canvas, lime brand, blue kept for information only.
| Role | Hex | Contrast |
|---|---|---|
| Background | `#0B0C0E` | — |
| Surface 1 / 2 | `#141619` / `#1C1F24` | — |
| Text / muted / subtle | `#F4F5F4` / `#B2B7BD` / `#959AA2` | 17.6 / 9.1 / 6.4 |
| Accent (lime, text/icons) | `#C6F24E` | 14.3 |
| Button fill (dark label `#0B0C0E`) | `#B5E63A` | label 12.5 |
| Info (blue) | `#7FB0FF` | 8.9 |
| Signal (mint) | `#4ADE9E` | 11.6 |
**Why:** the canvas carries no blue or violet cast at all, which is the clearest way to avoid the AI-default look this document warns about; the lime is unusual in B2B software services, and its very high contrast makes a single small CTA carry a whole viewport. **Watch:** lime and mint are both green, so "live/done" mint is reserved strictly for status and never used for emphasis; and a bright trend colour risks dating, so revisit it if the brand starts to feel of-its-moment.

## 3. Decision
**Adopted: Option F — Ink & Lime** (2026-09-18, studio direction after reviewing all options side by side on the real homepage; implemented in `02-DESIGN-SYSTEM.md`).

Previously adopted: Option A — Midnight Ink. Options B, C, D (Graphite & Ember), E (Teal Slate), G (Steel & Gold) and H (Warm Paper, light) were rendered on the live homepage during the same review; all passed the contrast checks and are recorded here in case the brand direction changes. Revisit only with evidence (e.g. A/B test of the primary button hue once traffic allows; test hue, not wording and hue together).

### Also rendered, not adopted
| Option | Canvas | Brand | Note |
|---|---|---|---|
| D — Graphite & Ember | `#101114` | `#FFA45C` warm orange | Same anti-default benefit as F, warmer and calmer; accent sits near the amber warning colour |
| E — Teal Slate | `#0B1416` | `#45D8C2` teal | Calm engineering-tool feel; teal and success green are neighbours |
| G — Steel & Gold | `#0E1013` | `#E9C46A` gold | Restrained and premium; gold and the amber warning colour are close |
| H — Warm Paper | `#FAF8F5` | `#A2490C` rust | Light theme; fights the dark product screenshots, so treat as a later addition |

## Sources
- Digital Silk — dark mode design guide (2026): https://www.digitalsilk.com/digital-trends/dark-mode-design-guide/
- Kyady — dark mode 2026 patterns: https://kyady.com/en/blog/dark-mode-2026-best-practices-elegant-interfaces
- Neel Networks — dark mode websites 2026: https://www.neelnetworks.com/blog/dark-mode-website-design-guide-2026/
- Evietek — color psychology in SaaS/tech: https://evietek.com/blogs/the-psychology-behind-colors/
- TrustSignals / Idea Grove — blue, trust and differentiation: https://www.trustsignals.com/blog/color-psychology-and-trust-why-the-colors-your-brand-uses-matters
- ITBee — why blue isn't always the answer: https://itbeesolution.com/the-psychology-of-color-in-saas-branding-why-blue-isnt-always-the-answer-for-trust/
- BizNameLab — tech brand palettes beyond blue: https://biznamelab.com/tech-brand-color-palette/
- 925 Studios — AI slop tells: https://www.925studios.co/blog/ai-slop-design-tells
- prg.sh — why AI builds the same purple gradient site: https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website
- StartupHub — YC design review with Ryo Lu: https://www.startuphub.ai/ai-news/ai-video/2025/design-in-the-ai-era-beyond-the-purple-gradient/
- DEV (Algogist) — AI purple problem: https://dev.to/jaainil/ai-purple-problem-make-your-ui-unmistakable-3ono
- LOW/CODE — B2B homepage best practices: https://www.lowcode.agency/blog/b2b-website-homepage-best-practices-that-convert
- Genesys Growth — B2B SaaS homepages 2026: https://genesysgrowth.com/blog/designing-b2b-saas-homepages
- Orbix Studio — B2B website design 2026: https://www.orbix.studio/blogs/b2b-website-design
- Flowtrix — B2B landing page examples: https://www.flowtrix.co/blogs/12-b2b-landing-page-design-examples-for-2026
- Colorlib — best black websites 2026 (Raycast): https://colorlib.com/wp/black-websites-examples/
- Lovable — dark mode examples (Linear): https://lovable.dev/guides/dark-mode-website-examples-guide
- CMS comparisons: https://nayankyada.com/blog/payload-cms-vs-sanity-for-nextjs-in-2026-an-honest-comparison · https://www.pkgpulse.com/guides/payload-cms-v3-vs-keystatic-vs-outstatic-headless-cms-2026
