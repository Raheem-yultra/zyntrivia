import { createHmac, timingSafeEqual } from 'node:crypto'

import { SITE_URL } from './site'

// Signed so /api/og can't be used to render arbitrary text on our domain.
function signature(title: string): string {
  return createHmac('sha256', process.env.PAYLOAD_SECRET || 'dev-og-secret')
    .update(title)
    .digest('base64url')
    .slice(0, 16)
}

export function ogImageUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title, sig: signature(`${eyebrow ?? ''}|${title}`) })
  if (eyebrow) params.set('eyebrow', eyebrow)
  return `${SITE_URL}/api/og?${params.toString()}`
}

export function verifyOgSignature(title: string, eyebrow: string, sig: string): boolean {
  const expected = Buffer.from(signature(`${eyebrow}|${title}`))
  const actual = Buffer.from(sig)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
