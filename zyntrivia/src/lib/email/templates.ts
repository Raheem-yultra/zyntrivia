import { PROJECT_TYPES, SOURCES, STAGES, TIMELINES, labelFor } from '../validation/quote-options'

/*
 * Transactional email templates. Rendered as strings rather than React because React's
 * server renderer isn't available inside Server Actions. Colours are inline because
 * email clients ignore CSS variables; they mirror the design tokens.
 */

export type LeadForEmail = {
  id: number | string
  projectType: string
  timeline: string
  stage: string
  name: string
  email: string
  company?: string | null
  description: string
  source?: string | null
}

export type RenderedEmail = { subject: string; html: string; text: string }

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char,
  )

const paragraphs = (value: string) =>
  escapeHtml(value)
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 12px">${block.replace(/\n/g, '<br>')}</p>`)
    .join('')

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(title)}</title>
<style>
  @media (prefers-color-scheme: dark) {
    .page { background:#0B0C0E !important; }
    .card { background:#141619 !important; border-color:#262A30 !important; }
    .text { color:#F4F5F4 !important; }
    .muted { color:#B2B7BD !important; }
    .label { color:#959AA2 !important; }
    .link { color:#7FB0FF !important; }
  }
</style>
</head>
<body class="page" style="margin:0;padding:24px 12px;background:#F4F4F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr><td class="text" style="padding:0 8px 16px;font-size:18px;font-weight:700;color:#16181C;">Zyntrivia</td></tr>
    <tr><td class="card" style="background:#FFFFFF;border:1px solid #E1E2E0;border-radius:12px;padding:28px;color:#23262B;font-size:15px;line-height:1.6;">
      ${body}
    </td></tr>
  </table>
</body>
</html>`
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return ''
  return `<tr>
    <td class="label" style="padding:6px 16px 6px 0;vertical-align:top;color:#5C626B;white-space:nowrap;">${escapeHtml(label)}</td>
    <td class="text" style="padding:6px 0;vertical-align:top;color:#23262B;">${escapeHtml(value)}</td>
  </tr>`
}

export function quoteNotificationEmail(lead: LeadForEmail, adminUrl: string): RenderedEmail {
  const type = labelFor(PROJECT_TYPES, lead.projectType)
  const subject = `New quote request from ${lead.name}${lead.company ? ` (${lead.company})` : ''}: ${type}`
  const fields: Array<[string, string | null | undefined]> = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Company', lead.company],
    ['Needs help with', type],
    ['Timeline', labelFor(TIMELINES, lead.timeline)],
    ['Stage', labelFor(STAGES, lead.stage)],
    ['Heard via', lead.source ? labelFor(SOURCES, lead.source) : null],
  ]

  const html = layout(
    subject,
    `<h1 class="text" style="margin:0 0 16px;font-size:20px;color:#16181C;">New quote request</h1>
     <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;font-size:15px;">
       ${fields.map(([label, value]) => row(label, value)).join('')}
     </table>
     <p class="label" style="margin:0 0 6px;color:#5C626B;">Project description</p>
     <div class="text" style="color:#23262B;">${paragraphs(lead.description)}</div>
     <p style="margin:24px 0 0;"><a class="link" href="${escapeHtml(adminUrl)}" style="color:#1A55C4;font-weight:600;">Open in admin</a></p>
     <p class="muted" style="margin:12px 0 0;color:#5C626B;font-size:13px;">Reply to this email to answer ${escapeHtml(lead.name)} directly.</p>`,
  )

  const text = [
    'New quote request',
    '',
    ...fields.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`),
    '',
    'Project description:',
    lead.description,
    '',
    `Open in admin: ${adminUrl}`,
  ].join('\n')

  return { subject, html, text }
}

export function quoteConfirmationEmail(lead: LeadForEmail, contactEmail: string): RenderedEmail {
  const firstName = lead.name.split(/\s+/)[0] || lead.name
  const subject = 'We’ve received your request'
  const steps = [
    'We read your request and reply within one business day.',
    'If it looks like a fit, we book a 30-minute call.',
    'Within 3 business days of that call, you get a written plan and a fixed price.',
  ]

  const html = layout(
    subject,
    `<h1 class="text" style="margin:0 0 16px;font-size:20px;color:#16181C;">Thanks, ${escapeHtml(firstName)}</h1>
     <p class="text" style="margin:0 0 16px;color:#23262B;">We’ve received your request. Here’s what happens next:</p>
     <ol class="text" style="margin:0 0 20px;padding-left:20px;color:#23262B;">
       ${steps.map((step) => `<li style="margin:0 0 8px;">${escapeHtml(step)}</li>`).join('')}
     </ol>
     <p class="muted" style="margin:0;color:#5C626B;">Want to add something? Just reply to this email, or write to <a class="link" href="mailto:${escapeHtml(contactEmail)}" style="color:#1A55C4;">${escapeHtml(contactEmail)}</a>.</p>`,
  )

  const text = [
    `Thanks, ${firstName}`,
    '',
    'We’ve received your request. Here’s what happens next:',
    '',
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    `Want to add something? Reply to this email, or write to ${contactEmail}.`,
    '',
    'Zyntrivia',
  ].join('\n')

  return { subject, html, text }
}
