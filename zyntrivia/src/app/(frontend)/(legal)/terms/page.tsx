import type { Metadata } from 'next'

import { LegalPage } from '@/components/sections/LegalPage'
import { getSiteSettings } from '@/lib/cms/globals'
import { buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of service',
  description: 'The terms that govern use of the Zyntrivia website.',
  path: '/terms',
})

export default async function TermsPage() {
  const settings = await getSiteSettings()
  const email = settings.contactEmail || SITE.email

  return (
    <LegalPage title="Terms of service" updated="September 2026">
      <h2>This website</h2>
      <p>
        The content on this site is provided for information. The StockSense demo produces
        illustrative output on sample data. Requesting a quote creates no obligation on either side.
      </p>

      <h2>Engagements</h2>
      <p>
        Client work is governed by a written agreement issued with each quote, covering scope,
        price, and timeline. Unless that agreement says otherwise, intellectual property in custom
        work is assigned to the client on payment, and the client owns the repository from the
        start.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don’t abuse the site: no automated scraping, circumventing rate limits, or submitting forms
        without a genuine interest. We may block traffic that does.
      </p>

      <h2>Liability</h2>
      <p>
        This website is provided as is, without warranty. To the extent permitted by law, Zyntrivia
        is not liable for indirect or consequential loss arising from use of this site. Liability
        under client agreements is defined in those agreements.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </LegalPage>
  )
}
