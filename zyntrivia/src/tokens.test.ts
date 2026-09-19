import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

/**
 * Colour tokens are contrast-checked here so a palette change can't quietly break WCAG.
 * docs/02-DESIGN-SYSTEM.md: body text >= 4.5:1, UI boundaries >= 3:1.
 */

const css = readFileSync(path.resolve(__dirname, 'app/(frontend)/globals.css'), 'utf8')

const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((match) => [
    match[1],
    match[2]!,
  ]),
) as Record<string, string>

const channel = (value: number) => {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  )
}

function ratio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (light + 0.05) / (dark + 0.05)
}

const SURFACES = ['bg', 'surface-1', 'surface-2'] as const
const INKS = [
  'text',
  'text-muted',
  'text-subtle',
  'accent',
  'info',
  'signal',
  'warn',
  'danger',
] as const

describe('colour tokens', () => {
  it('defines every role the components use', () => {
    for (const name of [
      ...SURFACES,
      ...INKS,
      'accent-solid',
      'accent-solid-hover',
      'on-accent',
      'border-input',
      'border-subtle',
      'focus',
    ]) {
      expect(tokens[name], `--color-${name} is missing`).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it.each(SURFACES.flatMap((surface) => INKS.map((ink) => [ink, surface] as const)))(
    '%s reads on %s at 4.5:1',
    (ink, surface) => {
      expect(ratio(tokens[ink]!, tokens[surface]!)).toBeGreaterThanOrEqual(4.5)
    },
  )

  it('labels on an accent fill stay readable', () => {
    expect(ratio(tokens['on-accent']!, tokens['accent-solid']!)).toBeGreaterThanOrEqual(4.5)
    expect(ratio(tokens['on-accent']!, tokens['accent-solid-hover']!)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps interactive boundaries and the focus ring at 3:1', () => {
    expect(ratio(tokens['border-input']!, tokens['surface-1']!)).toBeGreaterThanOrEqual(3)
    expect(ratio(tokens['border-input']!, tokens['surface-2']!)).toBeGreaterThanOrEqual(3)
    expect(ratio(tokens.focus!, tokens.bg!)).toBeGreaterThanOrEqual(3)
    expect(ratio(tokens.focus!, tokens['surface-1']!)).toBeGreaterThanOrEqual(3)
    expect(ratio(tokens['accent-solid']!, tokens.bg!)).toBeGreaterThanOrEqual(3)
  })
})
