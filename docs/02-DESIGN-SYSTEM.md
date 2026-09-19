# 02 — Design System: "Ink & Lime"

## 1. Direction in one paragraph
Near-black ink canvas with a lime voice and a blue working hand. The site should feel like a well-built product, not a marketing template: real UI fragments instead of illustrations, one signature moving diagram, generous space, restrained color. Lime is the brand (CTAs, focus, the single highlighted path in a diagram); blue is for information (links, data, charts); mint appears only to mean "live / done". The canvas is a neutral near-black, deliberately free of the blue-violet cast every AI-built site shares, so the lime does all the talking.

**The one bold thing:** the Flow Canvas diagram in the homepage hero, echoed as smaller diagrams across the site. Everything else stays quiet.

## 2. Color tokens
All pairs below are verified against WCAG 2.2 (ratios measured vs `--bg` / `--surface-2`). Do not add colors; do not edit values without re-running contrast checks.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--bg` | `#0B0C0E` | Page canvas | — |
| `--surface-1` | `#141619` | Raised sections, cards that need separation | — |
| `--surface-2` | `#1C1F24` | Popovers, inputs, hover fills | — |
| `--border-subtle` | `#262A30` | Decorative dividers only | decorative |
| `--border-input` | `#727984` | Form fields, interactive outlines | 4.1 / 3.8 ✅ (≥3) |
| `--text` | `#F4F5F4` | Headings, body | 17.6 / 14.0 ✅ |
| `--text-muted` | `#B2B7BD` | Secondary copy | 9.1 / 7.3 ✅ |
| `--text-subtle` | `#959AA2` | Meta, captions, placeholders | 6.4 / 5.8 ✅ |
| `--accent` | `#C6F24E` | Lime text, icons, active states, diagram highlight | 14.3 / 11.4 ✅ |
| `--accent-solid` | `#B5E63A` | Primary button fill (dark label) | label 12.5 ✅; vs bg 12.7 ✅ |
| `--accent-solid-hover` | `#A3D42B` | Primary button hover/pressed | label 10.4 ✅ |
| `--on-accent` | `#0B0C0E` | Label on any accent fill | ✅ |
| `--info` | `#7FB0FF` | Links, data series, charts | 8.9 / 7.1 ✅ |
| `--signal` | `#4ADE9E` | "Live demo", success, status dots | 11.6 / 9.2 ✅ |
| `--warn` | `#FFD166` | Warnings | 12.5 ✅ |
| `--danger` | `#FF7A86` | Errors | 8.0 ✅ |
| `--focus` | `#C6F24E` | 2px focus ring, 2px offset | ✅ |

Ratios are re-checked on every test run by `src/tokens.test.ts`.

### Tailwind v4 theme (`src/app/globals.css`)
```css
@import "tailwindcss";

@theme {
  --color-*: initial; /* remove Tailwind's default palette entirely */

  --color-bg: #0B0C0E;
  --color-surface-1: #141619;
  --color-surface-2: #1C1F24;
  --color-border-subtle: #262A30;
  --color-border-input: #727984;
  --color-text: #F4F5F4;
  --color-text-muted: #B2B7BD;
  --color-text-subtle: #959AA2;
  --color-accent: #C6F24E;
  --color-accent-solid: #B5E63A;
  --color-accent-solid-hover: #A3D42B;
  --color-on-accent: #0B0C0E;
  --color-info: #7FB0FF;
  --color-signal: #4ADE9E;
  --color-warn: #FFD166;
  --color-danger: #FF7A86;
  --color-transparent: transparent;

  --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Public Sans", ui-sans-serif, system-ui, sans-serif;
  --font-code: "JetBrains Mono", ui-monospace, monospace;

  --radius-sm: 6px;   /* inputs, chips */
  --radius-md: 10px;  /* buttons, small tiles */
  --radius-lg: 18px;  /* media frames, bento tiles */
  --radius-xl: 28px;  /* hero canvas frame only */

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

html { background: var(--color-bg); color: var(--color-text); color-scheme: dark; }
```
Structure tokens so a light theme can be added later by redefining the same variables under `[data-theme="light"]`.

### Color usage rules
- Lime coverage ≤ ~5% of any viewport. One solid lime button per viewport. The accent is bright, so a little goes further than a violet or blue would.
- Gradients: **one** permitted — a very low-opacity radial wash of `--accent` (≤ 10% alpha) behind the hero canvas, fading to `--bg`. No linear multi-hue gradients, no gradient text, no gradient borders.
- Depth comes from surface steps (`bg` → `surface-1` → `surface-2`), not drop shadows. If a shadow is needed (popovers), use `0 12px 32px rgb(4 6 16 / 0.6)`.
- Don't rely on color alone: status also uses icon/label.

## 3. Typography
- **Display:** Bricolage Grotesque (variable; use optical size + width axes). Headings only.
- **Body/UI:** Public Sans (400, 500, 600).
- **Code:** JetBrains Mono — code blocks and inline code in blog posts **only**. Not for labels, stats, or decorative "tech" text.
- Load via `next/font/google` with `display: "swap"`, subset latin, preload display + body regular only.

| Style | Font | Size (mobile → desktop, `clamp`) | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Display XL (hero) | Display | 40 → 72px | 700 | 1.02 | -0.02em |
| H1 | Display | 34 → 56px | 700 | 1.05 | -0.015em |
| H2 | Display | 28 → 40px | 650 | 1.1 | -0.01em |
| H3 | Display | 21 → 26px | 600 | 1.2 | 0 |
| Body L | Body | 18 → 20px | 400 | 1.55 | 0 |
| Body | Body | 16 → 17px | 400 | 1.6 | 0 |
| Small | Body | 14px | 500 | 1.45 | 0.005em |
| Blog prose | Body | 18px | 400 | 1.7 | 0 (max 70ch) |

Rules: sentence case; no ALL-CAPS labels; no eyebrow text above every heading (only where it adds information, e.g. case-study industry); don't color or italicize a single word in a headline; headings left-aligned (center only for the S10 final CTA).

## 4. Layout
- 12-column grid, max content width 1200px, gutters 24px (mobile 16px side padding, 20px column gap).
- Section vertical rhythm: 96px desktop / 64px mobile. Vary it — tighter for proof strip (40px), looser before final CTA (140px).
- Left-aligned composition by default; asymmetry preferred (5/7, 4/8 splits).
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 140.
- Breakpoints: 375 (base), 640, 900, 1200, 1440.

## 5. Visual language ("show, don't tell")
Every visual must be one of:
1. **Real UI fragments** — cropped, re-styled components from our actual projects (StockSense ledger row, WorkflowAI node, ResourceAble filter panel), rebuilt as lightweight React/SVG so they stay crisp and themable.
2. **Flow diagrams** — nodes + connectors in the Flow Canvas style (below).
3. **Product video loops** — screen recordings, ≤ 8s, muted, `playsInline`, poster frame, WebM + MP4, lazy.
4. **Data** — small real charts (from demo data, labeled as demo) using `--info` series and `--accent` highlight.

Banned: stock photos, 3D blobs, abstract gradient art, isometric illustration packs, emoji as icons, generic icon-per-card rows.

### Flow Canvas spec
- Nodes: `surface-1` fill, 1px `border-subtle`, radius-md, 12–14px Public Sans label + a tiny UI fragment inside (e.g. an email subject line, a table row, a counter).
- Connectors: 1.5px strokes in `--border-input`; the active path animates to `--accent` with a 6px traveling pulse (`--accent` at 100%, 24px tail fading out).
- Status dot: `--signal` when a node completes.
- Implementation: inline SVG + `motion/react` `pathLength`; one timeline, total ≤ 4.5s, starts after LCP (don't block hero text render).
- Reduced motion: render final state, no pulse.
- Mobile: 3 nodes vertical.

## 6. Motion
- Allowed: (a) the hero load sequence, (b) responses to user action (hover, open, expand, submit, slider drag), (c) scroll-linked progress only for the process timeline.
- Not allowed: fade-up on every section, parallax, hover scale on every card, cursor followers, marquee logo tickers.
- Durations: micro 120–180ms, UI 220–320ms, hero sequence ≤ 4.5s. Easing `--ease-out` for enter, `--ease-in-out` for movement.
- `@media (prefers-reduced-motion: reduce)` → disable non-essential motion, keep state changes instant.

## 7. Components (build in `src/components/ui`)

| Component | Spec |
|---|---|
| `Button` | variants: `primary` (accent-solid bg, `on-accent` label, radius-md, 44px min height), `secondary` (transparent, 1px border-input, text), `ghost` (text-muted → text on hover, underline offset 4px). Sizes md/lg. Loading state with spinner + `aria-busy`. No arrow icons by default. |
| `Link` | `--info`, underline on hover/focus; external links get `rel="noopener"` + visually-hidden "(opens in new tab)". |
| `Tile` | For bento/services. Sizes sm/lg; `surface-1`; radius-lg; no shadow; hover = border shifts to `border-input`. |
| `MediaFrame` | radius-lg frame for screenshots/videos; 1px border-subtle; optional caption in Small/text-subtle. |
| `Chip` | filter chip, radius-sm, `aria-pressed`. Selected: accent text + accent 1px border. |
| `Input`, `Textarea`, `Select` | surface-2, border-input, radius-sm, 48px height, label always visible above (no placeholder-as-label), error text in `--danger` with icon, `aria-describedby`. |
| `ChoiceTile` | Quote step 1; radio semantics (`role="radio"` in a `radiogroup`), selected = accent border + check icon. |
| `Accordion` | FAQ; button with `aria-expanded`, height animation 240ms. |
| `CompareSlider` | Before/after; `role="slider"`, arrow keys ±5%, Home/End. |
| `Stepper` | Quote progress; `aria-current="step"`. |
| `Prose` | Blog typography: 70ch, h2 margin-top 56px, code block surface-1 with copy button, blockquote with 2px accent left rule. |
| `CTABand` | Reusable final CTA; headline + primary button (+ optional embedded quote step 1). |

Radius hierarchy is intentional: small elements small radius, large media large radius. Don't apply one radius everywhere.

## 8. Iconography
Lucide icons, 1.5px stroke, 20px default, `currentColor`. Icons support labels; they never stand alone as decoration in cards.

## 9. Anti-slop checklist (run before marking any UI task done)
- [ ] No default Tailwind colors; no raw hex in components.
- [ ] No purple→blue/cyan gradient, gradient text, orb, glow blob, or glass panel.
- [ ] Not a row of three identical icon cards.
- [ ] No ALL-CAPS eyebrows, no mid-dot meta strings as decoration, no `→` on every link.
- [ ] Section has a real visual (UI fragment, diagram, video, or data).
- [ ] Only one solid lime button in the viewport.
- [ ] Motion only where §6 allows; reduced-motion verified.
- [ ] Copy within word budget, sentence case, no banned words.
- [ ] Squint test: primary CTA is the most visible element within 2 seconds.
