import { z } from 'zod'

import { PROJECT_TYPES, SOURCES, STAGES, TIMELINES, values } from './quote-options'

// Our CSP has no 'unsafe-eval'. Without this, Zod probes `new Function` for its JIT parser and
// the browser reports a CSP violation. These schemas are tiny, so the interpreter is plenty.
z.config({ jitless: true })

/** Shared by the quote wizard (per step) and the server action (whole submission). */

export const step1Schema = z.object({
  projectType: z.enum(values(PROJECT_TYPES), { error: 'Choose what you’re building.' }),
})

export const step2Schema = z.object({
  timeline: z.enum(values(TIMELINES), { error: 'Choose when you’d like to start.' }),
  stage: z.enum(values(STAGES), { error: 'Choose where things stand today.' }),
})

export const DESCRIPTION_MIN = 30
export const DESCRIPTION_MAX = 5000

export const step3Schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your name.')
    .max(120, 'Keep your name under 120 characters.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, 'That email address is too long.')
    .pipe(z.email({ error: 'Enter a valid email address.' })),
  company: z.string().trim().max(160, 'Keep the company name under 160 characters.').optional(),
  description: z
    .string()
    .trim()
    .min(DESCRIPTION_MIN, `Tell us a little more (at least ${DESCRIPTION_MIN} characters).`)
    .max(DESCRIPTION_MAX, `Keep it under ${DESCRIPTION_MAX} characters.`),
  source: z.union([z.enum(values(SOURCES)), z.literal('')]).optional(),
})

const attributionSchema = z
  .object({
    utmSource: z.string().max(200),
    utmMedium: z.string().max(200),
    utmCampaign: z.string().max(200),
    landingPage: z.string().max(500),
    referrer: z.string().max(500),
  })
  .partial()

export const quoteSubmissionSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  attribution: attributionSchema.optional(),
  turnstileToken: z.string().max(4096).optional(),
  /** Honeypot: hidden from people, filled in by naive bots. */
  website: z.string().max(500).optional(),
})

export type QuoteDraft = {
  projectType: string
  timeline: string
  stage: string
  name: string
  email: string
  company: string
  description: string
  source: string
}

export type QuoteSubmission = z.infer<typeof quoteSubmissionSchema>

export type FieldErrors = Partial<Record<keyof QuoteDraft, string>>

/** First message per field, for inline errors. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const flattened = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>
  const result: FieldErrors = {}
  for (const [field, messages] of Object.entries(flattened)) {
    if (messages?.[0]) result[field as keyof QuoteDraft] = messages[0]
  }
  return result
}

/** Plain text only: strips anything that looks like markup from free-text fields. */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim()
}
