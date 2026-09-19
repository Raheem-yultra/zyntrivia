/** Cloudflare's documented test keys: they always pass. Used only outside production. */
export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA'

export function turnstileSiteKey(): string {
  return (
    process.env.TURNSTILE_SITE_KEY ||
    (process.env.NODE_ENV === 'production' ? '' : TURNSTILE_TEST_SITE_KEY)
  )
}

export type TurnstileResult = 'passed' | 'failed' | 'not-configured'

export async function verifyTurnstile(
  token: string | undefined,
  ip: string | undefined,
  fetcher: typeof fetch = fetch,
): Promise<TurnstileResult> {
  const secret =
    process.env.TURNSTILE_SECRET_KEY ||
    (process.env.NODE_ENV === 'production' ? '' : TURNSTILE_TEST_SECRET)
  if (!secret) return 'not-configured'
  if (!token) return 'failed'

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set('remoteip', ip)
    const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8_000),
    })
    const result = (await response.json()) as { success?: boolean }
    return result.success === true ? 'passed' : 'failed'
  } catch {
    return 'failed'
  }
}
