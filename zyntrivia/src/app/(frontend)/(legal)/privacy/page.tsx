import type { Metadata } from 'next'

import { LegalPage } from '@/components/sections/LegalPage'
import { getSiteSettings } from '@/lib/cms/globals'
import { buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy policy',
  description:
    'What Zyntrivia collects when you request a quote, how it’s used, who processes it, and your rights.',
  path: '/privacy',
})

export default async function PrivacyPage() {
  const settings = await getSiteSettings()
  const email = settings.contactEmail || SITE.email

  return (
    <LegalPage title="Privacy policy" updated="September 2026">
      <h2>What we collect</h2>
      <p>
        When you request a quote, we collect what you enter: your name, work email, company, a
        description of your project, and the options you select. We also record where your visit
        started (the landing page, referring site, and campaign tags), your country as reported by
        our host, and a one-way hash of your browser’s user agent. Your IP address is used, in
        hashed form, only to limit repeated submissions.
      </p>
      <p>
        The StockSense demo linked from our case studies runs entirely in your browser on sample
        data. It sends nothing to us.
      </p>

      <h2>Analytics</h2>
      <p>
        We use Plausible, which is cookieless and collects aggregate visit statistics without
        identifying you. We don’t run advertising trackers and we never sell data.
      </p>

      <h2>How we use it</h2>
      <p>
        To reply to your request, prepare a quote, and, if you become a client, deliver the work. We
        send you a confirmation email when you submit the form.
      </p>

      <h2>Who processes it</h2>
      <ul>
        <li>Vercel: website hosting</li>
        <li>Supabase: database and file storage</li>
        <li>Resend: email delivery</li>
        <li>Cloudflare: spam protection on the quote form (Turnstile)</li>
        <li>Plausible: cookieless analytics</li>
      </ul>

      <h2>Retention</h2>
      <p>
        Quote requests are kept while they’re relevant to a current or potential project. Requests
        that don’t go ahead are deleted within 12 months.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask what we hold about you, ask us to correct it, or ask us to delete it. We’ll
        respond within 30 days. Email <a href={`mailto:${email}`}>{email}</a>. Clients in the EU can
        request a data processing agreement.
      </p>
    </LegalPage>
  )
}
