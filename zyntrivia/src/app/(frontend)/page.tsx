import type { Metadata } from 'next'

import { StickyMobileCta } from '@/components/layout/StickyMobileCta'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { FaqSection } from '@/components/sections/FaqSection'
import { FinalCta } from '@/components/sections/FinalCta'
import { Handover } from '@/components/sections/Handover'
import { Hero } from '@/components/sections/Hero'
import { ProcessTimeline } from '@/components/sections/ProcessTimeline'
import { ProofStrip } from '@/components/sections/ProofStrip'
import { ServicesBento } from '@/components/sections/ServicesBento'
import { getCaseStudies } from '@/lib/cms/case-studies'
import { getFaqs } from '@/lib/cms/faqs'
import { getHomepage, getSiteSettings } from '@/lib/cms/globals'
import { getServices } from '@/lib/cms/services'
import { getContributions } from '@/lib/github'
import { buildMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage()
  // The hook works on social cards; search results get a title that says what we do.
  return buildMetadata({
    title: `${SITE.name} — Software that takes the busywork off your team`,
    absoluteTitle: true,
    socialTitle: homepage.hero.headline,
    description: homepage.hero.subhead,
    path: '/',
  })
}

/**
 * A sales funnel: hook, proof, pain, how we help, how it works, what you get, objections,
 * then the ask. Portfolio and blog live on their own pages.
 */
export default async function HomePage() {
  const [homepage, settings, services, caseStudies, faqs] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
    getServices(),
    getCaseStudies(),
    getFaqs(true),
  ])
  const contributions = await getContributions(settings.social?.githubUsername)

  return (
    <>
      <main id="main">
        <Hero hero={homepage.hero} settings={settings} />
        <ProofStrip caseStudies={caseStudies} settings={settings} contributions={contributions} />
        <BeforeAfter copy={homepage.beforeAfter} />
        <ServicesBento services={services} />
        <ProcessTimeline />
        <Handover />
        <FaqSection faqs={faqs.slice(0, 6)} />
        <FinalCta headline={homepage.finalCta.headline} />
      </main>
      <StickyMobileCta />
    </>
  )
}
