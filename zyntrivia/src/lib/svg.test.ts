import { describe, expect, it } from 'vitest'

import { sanitizeSvg } from './svg'

describe('sanitizeSvg', () => {
  // jsdom loads dynamically (see svg.ts), and the first import of it in a process is
  // slow enough to need more than vitest's default 5s timeout.
  it('keeps drawing markup', async () => {
    const clean = await sanitizeSvg('<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>')
    expect(clean).toContain('<rect')
    expect(clean).toContain('viewBox="0 0 10 10"')
  }, 15_000)

  it('removes scripts, handlers, and javascript: links', async () => {
    const clean = await sanitizeSvg(
      '<svg onload="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)"><text>x</text></a><foreignObject><iframe src="https://evil.test"></iframe></foreignObject></svg>',
    )
    expect(clean).not.toMatch(/onload|<script|javascript:|foreignObject|iframe/i)
  }, 15_000)
})
