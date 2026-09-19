import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Bearer token for /api/revalidate, derived from PAYLOAD_SECRET so scripts that already
 * have the Payload environment (e.g. the seed) can call it without another secret.
 */
export function revalidateToken(): string {
  return createHmac('sha256', process.env.PAYLOAD_SECRET || 'dev-revalidate')
    .update('revalidate-cms')
    .digest('hex')
}

export function isValidRevalidateToken(header: string | null): boolean {
  const provided = Buffer.from(header?.replace(/^Bearer\s+/i, '') ?? '')
  const expected = Buffer.from(revalidateToken())
  return provided.length === expected.length && timingSafeEqual(provided, expected)
}
