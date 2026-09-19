import { describe, expect, it } from 'vitest'

import { quoteConfirmationEmail, quoteNotificationEmail, type LeadForEmail } from './templates'

const lead: LeadForEmail = {
  id: 42,
  projectType: 'automation',
  timeline: 'asap',
  stage: 'replace-tool',
  name: 'Sam <script>alert(1)</script> Rivera',
  email: 'sam@example.com',
  company: 'North & Co',
  description: 'We re-type orders.\n\nTwice a day.',
  source: 'linkedin',
}

describe('quote notification email', () => {
  const email = quoteNotificationEmail(
    lead,
    'https://zyntrivia.com/admin/collections/quote-requests/42',
  )

  it('uses readable labels and links to the admin record', () => {
    expect(email.subject).toMatch(
      /^New quote request from .+ \(North & Co\): Copying data between apps$/,
    )
    expect(email.html).toContain('As soon as possible')
    expect(email.text).toContain(
      'Open in admin: https://zyntrivia.com/admin/collections/quote-requests/42',
    )
  })

  it('escapes user input in HTML', () => {
    expect(email.html).not.toContain('<script>')
    expect(email.html).toContain('&lt;script&gt;')
    expect(email.html).toContain('North &amp; Co')
  })

  it('has a plain-text fallback without template markup', () => {
    expect(email.text).toContain('We re-type orders.')
    expect(email.text).not.toMatch(/<(p|table|tr|td|a|h1)\b/i)
  })
})

describe('quote confirmation email', () => {
  it('addresses the requester and lists next steps', () => {
    const email = quoteConfirmationEmail({ ...lead, name: 'Sam Rivera' }, 'hello@zyntrivia.com')
    expect(email.html).toContain('Thanks, Sam')
    expect(email.text).toContain('1. We read your request and reply within one business day.')
    expect(email.html).toContain('mailto:hello@zyntrivia.com')
  })

  it('reads naturally for every kind of request', () => {
    for (const projectType of ['automation', 'web-app', 'not-sure']) {
      const email = quoteConfirmationEmail({ ...lead, projectType }, 'hello@zyntrivia.com')
      expect(email.text).toContain('We’ve received your request. Here’s what happens next:')
      expect(email.text).not.toMatch(/about an? /)
    }
  })
})
