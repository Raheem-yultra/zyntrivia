import { describe, expect, it } from 'vitest'

import { clientIp, hashClientKey } from './rate-limit'

describe('clientIp', () => {
  it('uses the first x-forwarded-for address', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '203.0.113.9, 10.0.0.1' }))).toBe(
      '203.0.113.9',
    )
  })

  it('falls back to x-real-ip, then unknown', () => {
    expect(clientIp(new Headers({ 'x-real-ip': '198.51.100.4' }))).toBe('198.51.100.4')
    expect(clientIp(new Headers())).toBe('unknown')
  })
})

describe('hashClientKey', () => {
  it('is stable and never contains the raw IP', () => {
    const hash = hashClientKey('203.0.113.9')
    expect(hash).toBe(hashClientKey('203.0.113.9'))
    expect(hash).not.toContain('203.0.113.9')
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })
})
