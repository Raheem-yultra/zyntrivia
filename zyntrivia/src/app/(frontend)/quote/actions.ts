'use server'

import { createHash } from 'node:crypto'

import { headers } from 'next/headers'
import { after } from 'next/server'

import type { QuoteErrorKind } from '@/lib/analytics'
import { getPayloadClient } from '@/lib/cms/client'
import { getSiteSettings } from '@/lib/cms/globals'
import { sendEmail } from '@/lib/email/send'
import { quoteConfirmationEmail, quoteNotificationEmail } from '@/lib/email/templates'
import { QUOTE_LIMIT, clientIp, consumeRateLimit, hashClientKey } from '@/lib/rate-limit'
import { SITE, absoluteUrl } from '@/lib/site'
import { verifyTurnstile } from '@/lib/turnstile'
import {
  fieldErrors,
  quoteSubmissionSchema,
  stripHtml,
  type FieldErrors,
} from '@/lib/validation/quote'

export type QuoteResult =
  { ok: true } | { ok: false; kind: QuoteErrorKind; message: string; fieldErrors?: FieldErrors }

const clip = (value: string | undefined, max = 500) => (value ? value.slice(0, max) : undefined)

/** docs/03-ARCHITECTURE.md §5: verify, rate limit, validate, store, then email. */
export async function submitQuote(input: unknown): Promise<QuoteResult> {
  const parsed = quoteSubmissionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      kind: 'validation',
      message: 'Some details need another look.',
      fieldErrors: fieldErrors(parsed.error),
    }
  }
  const submission = parsed.data

  // Honeypot filled: look successful, store nothing.
  if (submission.website) return { ok: true }

  const requestHeaders = await headers()
  const ip = clientIp(requestHeaders)
  const payload = await getPayloadClient()

  const turnstile = await verifyTurnstile(
    submission.turnstileToken,
    ip === 'unknown' ? undefined : ip,
  )
  if (turnstile === 'failed') {
    return {
      ok: false,
      kind: 'turnstile',
      message: 'We couldn’t confirm you’re not a bot. Complete the check and try again.',
    }
  }
  if (turnstile === 'not-configured') {
    payload.logger.error('Quote form: TURNSTILE_SECRET_KEY is not set; spam check skipped.')
  }

  const allowed = await consumeRateLimit(payload, hashClientKey(ip), QUOTE_LIMIT)
  if (!allowed) {
    return {
      ok: false,
      kind: 'rate_limit',
      message: `You’ve sent several requests in the last hour. Please try again later, or email ${SITE.email}.`,
    }
  }

  const attribution = submission.attribution ?? {}
  const userAgent = requestHeaders.get('user-agent')

  let lead
  try {
    lead = await payload.create({
      collection: 'quote-requests',
      overrideAccess: true,
      data: {
        status: 'new',
        projectType: submission.projectType,
        timeline: submission.timeline,
        stage: submission.stage,
        name: stripHtml(submission.name),
        email: submission.email,
        company: submission.company ? stripHtml(submission.company) : undefined,
        description: stripHtml(submission.description),
        source: submission.source || undefined,
        meta: {
          utmSource: clip(attribution.utmSource, 200),
          utmMedium: clip(attribution.utmMedium, 200),
          utmCampaign: clip(attribution.utmCampaign, 200),
          landingPage: clip(attribution.landingPage),
          referrer: clip(attribution.referrer),
          country: requestHeaders.get('x-vercel-ip-country') ?? undefined,
          userAgentHash: userAgent
            ? createHash('sha256').update(userAgent).digest('hex').slice(0, 32)
            : undefined,
        },
      },
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Quote form: failed to store quote request' })
    return {
      ok: false,
      kind: 'server',
      message: 'We couldn’t send your request. Check your connection and try again.',
    }
  }

  // The lead is stored; email failures are logged and never surface to the requester.
  const stored = lead
  after(async () => {
    const settings = await getSiteSettings().catch(() => null)
    const contactEmail = settings?.contactEmail || SITE.email
    const notifyTo = process.env.QUOTE_NOTIFY_TO || contactEmail
    const results = await Promise.allSettled([
      sendEmail({
        to: notifyTo,
        replyTo: stored.email,
        ...quoteNotificationEmail(
          stored,
          absoluteUrl(`/admin/collections/quote-requests/${stored.id}`),
        ),
      }),
      sendEmail({
        to: stored.email,
        replyTo: contactEmail,
        ...quoteConfirmationEmail(stored, contactEmail),
      }),
    ])
    for (const result of results) {
      if (result.status === 'rejected') {
        payload.logger.error({
          err: result.reason,
          msg: `Quote form: email failed for lead ${stored.id}`,
        })
      }
    }
  })

  return { ok: true }
}
