import type { Metadata } from 'next'
import { Suspense } from 'react'

import { PageHeader } from '@/components/sections/PageHeader'
import { CTABand } from '@/components/ui/CTABand'
import { CaseStudyCard } from '@/components/work/CaseStudyCard'
import { WorkBrowser, type WorkItem } from '@/components/work/WorkBrowser'
import { getCaseStudies } from '@/lib/cms/case-studies'
import { populated } from '@/lib/cms/client'
import { INDUSTRIES } from '@/lib/industries'
import { buildMetadata } from '@/lib/seo'
import type { Service } from '@/payload-types'

export const metadata: Metadata = buildMetadata({
  title: 'Work',
  description:
    'Case studies of the systems we’ve built, with the architecture and decisions behind them.',
  path: '/work',
})

export default async function WorkPage() {
  const studies = await getCaseStudies()

  const services = new Map<string, Service>()
  for (const study of studies) {
    for (const service of populated(study.services)) services.set(service.slug, service)
  }
  const usedIndustries = new Set(studies.map((study) => study.industry))

  const items: WorkItem[] = studies.map((study, index) => ({
    slug: study.slug,
    services: populated(study.services).map((service) => service.slug),
    industry: study.industry,
    // The first cover is above the fold at every width, so it's the LCP candidate.
    card: <CaseStudyCard study={study} headingLevel="h2" showServices priority={index === 0} />,
  }))

  const cards = (
    <ul className="mt-12 grid gap-x-10 gap-y-16 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.slug}>{item.card}</li>
      ))}
    </ul>
  )

  return (
    <main id="main">
      <PageHeader title="Work" lead="Systems we’ve built, with the architecture behind them." />
      <div className="page-x pb-24">
        {/* Filters read the URL on the client; the fallback shows every project. */}
        <Suspense fallback={cards}>
          <WorkBrowser
            items={items}
            services={[...services.values()]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((service) => ({ value: service.slug, label: service.title }))}
            industries={INDUSTRIES.filter((industry) => usedIndustries.has(industry.value)).map(
              ({ value, label }) => ({ value, label }),
            )}
          />
        </Suspense>
      </div>
      <CTABand headline="Have a similar problem?" location="work" />
    </main>
  )
}
