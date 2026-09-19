import { describe, expect, it } from 'vitest'

import { sanitizeSvg } from './svg'

describe('sanitizeSvg', () => {
  it('keeps drawing markup', () => {
    const clean = sanitizeSvg('<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>')
    expect(clean).toContain('<rect')
    expect(clean).toContain('viewBox="0 0 10 10"')
  })

  it('removes scripts, handlers, and javascript: links', () => {
    const clean = sanitizeSvg(
      '<svg onload="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)"><text>x</text></a><foreignObject><iframe src="https://evil.test"></iframe></foreignObject></svg>',
    )
    expect(clean).not.toMatch(/onload|<script|javascript:|foreignObject|iframe/i)
  })
})
