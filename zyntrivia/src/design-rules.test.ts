import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

/**
 * CLAUDE.md design guardrails that can be checked statically: semantic tokens only, no default
 * Tailwind palette, no raw hex in components, no gradient text.
 */

const ROOT = path.resolve(__dirname)

// Places that can't use CSS variables: email HTML, the OG image renderer, and browser metadata.
const HEX_ALLOWED = [
  path.join('lib', 'email'),
  path.join('app', '(frontend)', 'api', 'og'),
  path.join('app', '(frontend)', 'layout.tsx'),
  path.join('lib', 'site.ts'), // THEME_COLOR, read before any stylesheet loads
]
// The dev tokens page renders default-palette classes on purpose, as a canary.
const PALETTE_ALLOWED = [path.join('app', '(frontend)', 'dev', 'tokens')]
const SKIPPED = ['payload-types.ts', 'migrations', path.join('app', '(payload)')]

// `transparent` is a defined token; `white` is not, so `text-white` is flagged like any other
// default-palette class. Labels on an accent fill use `text-on-accent`.
const PALETTE =
  /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide|accent|caret|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?\b/
const HEX = /#[0-9a-fA-F]{3,8}\b/
const GRADIENT_TEXT = /\bbg-clip-text\b|\bbg-gradient-to-|\bbg-linear-to-/

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    const relative = path.relative(ROOT, full)
    if (SKIPPED.some((skip) => relative.startsWith(skip))) return []
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.(ts|tsx|css)$/.test(name) && !name.endsWith('.test.ts') ? [full] : []
  })
}

function offenders(pattern: RegExp, allowed: string[] = []) {
  return sourceFiles(ROOT).flatMap((file) => {
    const relative = path.relative(ROOT, file)
    if (allowed.some((prefix) => relative.startsWith(prefix))) return []
    return readFileSync(file, 'utf8')
      .split('\n')
      .flatMap((line, index) =>
        pattern.test(line) ? [`${relative}:${index + 1}: ${line.trim()}`] : [],
      )
  })
}

describe('design rules', () => {
  it('uses no default Tailwind palette classes', () => {
    expect(offenders(PALETTE, PALETTE_ALLOWED)).toEqual([])
  })

  it('keeps raw hex colors out of components and pages', () => {
    const css = path.join('app', '(frontend)', 'globals.css')
    expect(offenders(HEX, [...HEX_ALLOWED, css])).toEqual([])
  })

  it('uses no gradient text or gradient utilities', () => {
    expect(offenders(GRADIENT_TEXT)).toEqual([])
  })
})
