---
name: Neo-Minimalist Engineering
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0d0e11'
  surface-container-low: '#1b1b1f'
  surface-container: '#1f1f23'
  surface-container-high: '#292a2d'
  surface-container-highest: '#343538'
  on-surface: '#e3e2e6'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#e3e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#c5c7c8'
  on-secondary: '#2e3132'
  secondary-container: '#47494a'
  on-secondary-container: '#b7b8ba'
  tertiary: '#ffb596'
  on-tertiary: '#581e00'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e1e3e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1d'
  on-secondary-fixed-variant: '#454748'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#121316'
  on-background: '#e3e2e6'
  surface-variant: '#343538'
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.12em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  section-padding: 160px
  gutter: 32px
  margin-mobile: 24px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 64px
---

## Brand & Style

The design system is engineered for a high-end technical studio, prioritizing restraint and precision over visual noise. The personality is confident, established, and expensive—communicating authority through what is omitted rather than what is added. 

The aesthetic adheres to **Neo-Minimalism**: a philosophy of extreme whitespace, architectural alignment, and a "less but better" approach. It deliberately avoids common tech tropes like glowing orbs or glass effects in favor of structural clarity. The emotional response should be one of calm, professional assurance, positioning the product as a premium partner for complex engineering challenges.

## Colors

The palette is rooted in a deep, near-black environment to establish a high-contrast, premium foundation. 

- **Background & Surfaces:** The base is `#0B0C0E`. UI surfaces use `#131417` to create subtle depth without relying on heavy shadows.
- **Accents:** Electric Blue (`#2563EB`) is the sole driver of action. It must be used with extreme discipline, reserved only for primary calls to action or critical navigational cues.
- **Hierarchy:** Typography drives the visual hierarchy. Headlines use a crisp off-white, while body text is pushed back into a muted gray to reduce eye strain and emphasize the "quiet" nature of the design.

## Typography

Typography is the primary decorative element of this design system. We use a combination of **Geist** for its technical, precise character in headings and **Inter** for its unparalleled legibility in long-form text.

- **Headlines:** Large scale with tight tracking to create a "blocky," architectural feel. Avoid heavy weights; use Medium or Regular to maintain sophistication.
- **Labels:** Always uppercase with generous letter-spacing (12%). Use these for section identifiers and metadata.
- **Body Text:** Ample line-height (1.6) is mandatory to ensure the "spacious" feel requested. Text blocks should be kept to a comfortable measure (max 65 characters) to preserve whitespace.

## Layout & Spacing

The layout philosophy is defined by **Massive Whitespace**. We utilize a 12-column fluid grid but prioritize a strong left-alignment "axis" that runs through the entire experience.

- **Vertical Rhythm:** Section padding is intentionally aggressive (160px+) to force focus on one concept at a time.
- **Alignment:** All major content blocks should align to the left. Avoid center-aligned body text.
- **Responsive Behavior:** On mobile, margins reduce to 24px, and section padding scales down to 80px. Columns stack vertically, maintaining the strict left-aligned typography.

## Elevation & Depth

This design system rejects traditional shadows. Depth is achieved through **Tonal Layering** and **Hairline Outlines**.

- **Surfaces:** To indicate a "raised" state (like a card), change the fill from the background color to the Surface color (`#131417`).
- **Dividers:** Use hairline borders (`1px`) in `#202227` sparingly. Prefer using raw space to separate sections whenever possible.
- **Interactions:** Hover states should be subtle—usually a slight shift in background tone or a transition in text color, rather than an elevation change.

## Shapes

The shape language is controlled and modern. We use **Rounded** corners (8px to 12px) to soften the technical nature of the engineering brand, making it feel approachable yet precise.

- **Small Components:** Checkboxes and small tags use `rounded-sm` (4px).
- **Standard Components:** Buttons and Input fields use `rounded-md` (8px).
- **Containers:** Large cards or sections use `rounded-lg` (12px).

## Components

### Navigation & Footer
- **Global Nav:** A minimal top bar. Wordmark on the far left (Regular weight), Nav links in the center-right (uppercase labels), and the primary "Request a Quote" button on the far right.
- **Footer:** Use the tertiary text color (`#565C64`). Include the location and timezone string as a secondary label to emphasize global reach.

### Buttons
- **Primary:** Solid Electric Blue fill with White text. No gradients.
- **Secondary:** Transparent background with a hairline off-white border. 
- **Ghost:** No border or fill; text-only with a slight shift in opacity on hover.

### Inputs & UI Controls
- **Fields:** Surface color fill (`#131417`) with a 1px border that brightens only on focus.
- **Chips/Tags:** Small, uppercase, with a dim gray background. Used for technical categories or stack items.

### Cards
- No shadows. Use the Surface color and ample internal padding (40px+) to let the content breathe. Cards should feel like distinct architectural blocks.