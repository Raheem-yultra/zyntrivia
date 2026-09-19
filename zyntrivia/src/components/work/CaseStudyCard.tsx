import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { analyticsAttrs } from '@/lib/analytics'
import { populated } from '@/lib/cms/client'
import { cn } from '@/lib/cn'
import { industryLabel } from '@/lib/industries'
import type { CaseStudy } from '@/payload-types'

import { CaseStudyMedia } from './CaseStudyMedia'

type Props = {
  study: CaseStudy
  headingLevel?: 'h2' | 'h3'
  showServices?: boolean
  className?: string
  location?: 'work' | 'case_study'
  /** Load the cover eagerly when the card is likely the page's largest paint. */
  priority?: boolean
}

export function CaseStudyCard({
  study,
  headingLevel: Heading = 'h3',
  showServices = false,
  className,
  location = 'work',
  priority = false,
}: Props) {
  const services = populated(study.services)
  return (
    <article className={cn('flex flex-col', className)}>
      <Link href={`/work/${study.slug}`} tabIndex={-1} aria-hidden className="block">
        <CaseStudyMedia study={study} sizes="(min-width: 900px) 560px, 90vw" priority={priority} />
      </Link>
      <p className="type-small mt-5 font-normal text-text-subtle">
        {industryLabel(study.industry)}
      </p>
      <Heading className="type-h3 mt-1 text-text">
        <Link href={`/work/${study.slug}`} className="hover:underline">
          {study.title}
        </Link>
      </Heading>
      <p data-budget={12} className="mt-2 text-text-muted">
        {study.problemLine}
      </p>
      {study.outcomeLine && (
        <p data-budget={20} className="mt-3 flex items-start gap-2 text-text">
          <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-signal" />
          {study.outcomeLine}
        </p>
      )}
      {showServices && services.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Services">
          {services.map((service) => (
            <li
              key={service.id}
              className="type-small rounded-sm border border-border-subtle px-2 py-0.5 font-normal text-text-muted"
            >
              {service.title}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Button
          href={`/work/${study.slug}`}
          variant="secondary"
          {...analyticsAttrs('secondary_cta_click', { location, label: 'See the case study' })}
        >
          See the case study
        </Button>
        {study.demoUrl && (
          <Button
            href={study.demoUrl}
            variant="ghost"
            {...analyticsAttrs('demo_open', { slug: study.slug })}
          >
            <span aria-hidden className="size-2 rounded-full bg-signal" />
            Open live demo
          </Button>
        )}
      </div>
    </article>
  )
}
