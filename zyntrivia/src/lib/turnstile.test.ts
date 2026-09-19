import { afterEach, describe, expect, it, vi } from 'vitest'

import { verifyTurnstile } from './turnstile'

const respond = (body: unknown) =>
  vi.fn(
    async () =>
      new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } }),
  )

describe('verifyTurnstile', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('rejects a missing token without calling Cloudflare', async () => {
    const fetcher = respond({ success: true })
    expect(await verifyTurnstile(undefined, '203.0.113.1', fetcher)).toBe('failed')
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('rejects a token Cloudflare says is invalid', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret')
    const fetcher = respond({ success: false, 'error-codes': ['invalid-input-response'] })
    expect(await verifyTurnstile('bad-token', '203.0.113.1', fetcher)).toBe('failed')
  })

  it('passes a token Cloudflare accepts and sends the client IP', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret')
    const fetcher = respond({ success: true })
    expect(await verifyTurnstile('good-token', '203.0.113.1', fetcher)).toBe('passed')
    const body = (fetcher.mock.calls[0] as unknown as [string, RequestInit])[1]
      .body as URLSearchParams
    expect(body.get('remoteip')).toBe('203.0.113.1')
  })

  it('treats network failures as a failed check', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret')
    const fetcher = vi.fn(async () => {
      throw new Error('offline')
    })
    expect(await verifyTurnstile('token', undefined, fetcher)).toBe('failed')
  })

  it('reports when production has no secret configured', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    expect(await verifyTurnstile('token', undefined, respond({ success: true }))).toBe(
      'not-configured',
    )
  })
})
