import { Resend } from 'resend'

import type { RenderedEmail } from './templates'

type SendOptions = RenderedEmail & { to: string; replyTo?: string }

export type SendResult = 'sent' | 'skipped'

/** Sends through Resend. Without RESEND_API_KEY (local dev), logs and skips instead. */
export async function sendEmail({
  to,
  replyTo,
  subject,
  html,
  text,
}: SendOptions): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.info(`[email] RESEND_API_KEY not set; skipped "${subject}" to ${to}`)
    return 'skipped'
  }

  const from = process.env.EMAIL_FROM_ADDRESS || 'hello@zyntrivia.com'
  const { error } = await new Resend(apiKey).emails.send({
    from: `Zyntrivia <${from}>`,
    to,
    subject,
    html,
    text,
    replyTo,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  return 'sent'
}
