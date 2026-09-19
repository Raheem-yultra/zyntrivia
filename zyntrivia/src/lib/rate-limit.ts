import { createHmac } from 'node:crypto'

import type { Payload } from 'payload'

export const QUOTE_LIMIT = { bucket: 'quote', limit: 5, windowMs: 60 * 60 * 1000 } as const

/** The raw IP is never stored; only a keyed hash that can't be reversed without the secret. */
export function hashClientKey(value: string): string {
  return createHmac('sha256', process.env.PAYLOAD_SECRET || 'dev-rate-limit')
    .update(value)
    .digest('hex')
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip') || 'unknown'
}

type Limit = { bucket: string; limit: number; windowMs: number }

/**
 * Postgres-backed sliding window. Returns false when the key is over its limit;
 * otherwise records this attempt and returns true.
 */
export async function consumeRateLimit(
  payload: Payload,
  key: string,
  { bucket, limit, windowMs }: Limit = QUOTE_LIMIT,
  now = Date.now(),
): Promise<boolean> {
  const since = new Date(now - windowMs).toISOString()
  const { totalDocs } = await payload.count({
    collection: 'rate-limit-hits',
    where: {
      and: [
        { key: { equals: key } },
        { bucket: { equals: bucket } },
        { createdAt: { greater_than: since } },
      ],
    },
    overrideAccess: true,
  })
  if (totalDocs >= limit) return false

  await payload.create({
    collection: 'rate-limit-hits',
    data: { key, bucket },
    overrideAccess: true,
  })
  // Housekeeping: drop hits that have left every window.
  await payload.delete({
    collection: 'rate-limit-hits',
    where: { createdAt: { less_than: since } },
    overrideAccess: true,
  })
  return true
}
