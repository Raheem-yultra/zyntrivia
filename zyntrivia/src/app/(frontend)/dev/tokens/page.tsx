import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = { title: 'Design tokens', robots: { index: false } }

// Class names are listed in full so Tailwind generates them.
const COLORS = [
  { token: 'bg', swatch: 'bg-bg', note: 'Page canvas' },
  { token: 'surface-1', swatch: 'bg-surface-1', note: 'Raised sections, cards' },
  { token: 'surface-2', swatch: 'bg-surface-2', note: 'Popovers, inputs, hover fills' },
  { token: 'border-subtle', swatch: 'bg-border-subtle', note: 'Decorative dividers only' },
  { token: 'border-input', swatch: 'bg-border-input', note: 'Form fields, interactive outlines' },
  { token: 'text', swatch: 'bg-text', note: 'Headings, body' },
  { token: 'text-muted', swatch: 'bg-text-muted', note: 'Secondary copy' },
  { token: 'text-subtle', swatch: 'bg-text-subtle', note: 'Meta, captions, placeholders' },
  { token: 'accent', swatch: 'bg-accent', note: 'Lime text, icons, active states' },
  { token: 'accent-solid', swatch: 'bg-accent-solid', note: 'Primary button fill' },
  { token: 'on-accent', swatch: 'bg-on-accent', note: 'Label on an accent fill' },
  { token: 'accent-solid-hover', swatch: 'bg-accent-solid-hover', note: 'Primary hover' },
  { token: 'info', swatch: 'bg-info', note: 'Links, data series' },
  { token: 'signal', swatch: 'bg-signal', note: 'Live, success, status' },
  { token: 'warn', swatch: 'bg-warn', note: 'Warnings' },
  { token: 'danger', swatch: 'bg-danger', note: 'Errors' },
  { token: 'focus', swatch: 'bg-focus', note: 'Focus ring' },
]

const TYPE = [
  { name: 'Display (hero)', className: 'type-display' },
  { name: 'H1', className: 'type-h1' },
  { name: 'H2', className: 'type-h2' },
  { name: 'H3', className: 'type-h3' },
  { name: 'Body L', className: 'type-body-l' },
  { name: 'Body', className: 'type-body' },
  { name: 'Small', className: 'type-small' },
]

const RADII = [
  { name: 'sm · 6px', className: 'rounded-sm' },
  { name: 'md · 10px', className: 'rounded-md' },
  { name: 'lg · 18px', className: 'rounded-lg' },
  { name: 'xl · 28px', className: 'rounded-xl' },
]

/** Dev-only reference for docs/02-DESIGN-SYSTEM.md. 404 in production. */
export default function TokensPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main id="main" className="page-x section-y flex flex-col gap-16">
      <h1 className="type-h1 text-text">Design tokens</h1>

      <section aria-labelledby="colors-heading">
        <h2 id="colors-heading" className="type-h2 text-text">
          Color
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLORS.map((color) => (
            <li
              key={color.token}
              className="overflow-hidden rounded-md border border-border-subtle bg-surface-1"
            >
              <div data-token={color.token} className={`h-20 ${color.swatch}`} />
              <div className="p-3">
                <p className="font-semibold text-text">--color-{color.token}</p>
                <p className="type-small font-normal text-text-subtle">{color.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="type-heading">
        <h2 id="type-heading" className="type-h2 text-text">
          Type
        </h2>
        <ul className="mt-6 flex flex-col gap-6">
          {TYPE.map((style) => (
            <li key={style.name} className="border-t border-border-subtle pt-4">
              <p className="type-small font-normal text-text-subtle">{style.name}</p>
              <p className={`${style.className} text-text`}>
                Software that takes the busywork off your team.
              </p>
            </li>
          ))}
          <li className="border-t border-border-subtle pt-4">
            <p className="type-small font-normal text-text-subtle">Code (blog only)</p>
            <code className="font-code text-text">
              const orders = await queue.add(&apos;sync&apos;)
            </code>
          </li>
        </ul>
      </section>

      <section aria-labelledby="radius-heading">
        <h2 id="radius-heading" className="type-h2 text-text">
          Radius
        </h2>
        <ul className="mt-6 flex flex-wrap gap-6">
          {RADII.map((radius) => (
            <li key={radius.name} className="flex flex-col items-center gap-2">
              <div
                className={`size-24 border border-border-input bg-surface-2 ${radius.className}`}
              />
              <span className="type-small font-normal text-text-subtle">{radius.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="palette-guard-heading">
        <h2 id="palette-guard-heading" className="type-h2 text-text">
          Palette guard
        </h2>
        <p className="mt-2 text-text-muted">
          These use default Tailwind colors on purpose. With the default palette removed they render
          unstyled.
        </p>
        {/* Deliberate canary: tests/e2e/security.e2e.spec.ts asserts these produce no color. */}
        <div className="mt-6 flex gap-4">
          <div
            data-palette-canary
            className="size-16 rounded-md border border-border-subtle bg-indigo-500"
          />
          <div
            data-palette-canary
            className="size-16 rounded-md border border-border-subtle bg-purple-500"
          />
          <p data-palette-canary className="text-blue-500">
            Default blue
          </p>
        </div>
      </section>
    </main>
  )
}
