import { CircleCheck } from 'lucide-react'
import type { Metadata } from 'next'

import { CaseStudyCard } from '@/components/work/CaseStudyCard'
import { getCaseStudies } from '@/lib/cms/case-studies'
import { populated } from '@/lib/cms/client'
import { SERVICE_FOR_PROJECT_TYPE, type ProjectType } from '@/lib/validation/quote-options'

export const metadata: Metadata = {
  title: 'Request received',
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ type?: string }> }

const NEXT_STEPS = [
  { title: 'We read your request', detail: 'You’ll hear back within one business day.' },
  {
    title: 'A 30-minute call',
    detail: 'If it looks like a fit, we book a time that works across time zones.',
  },
  { title: 'A written plan and a fixed price', detail: 'Within 3 business days of the call.' },
]

export default async function ThanksPage({ searchParams }: Props) {
  const { type } = await searchParams
  const serviceSlug =
    type && type in SERVICE_FOR_PROJECT_TYPE ? SERVICE_FOR_PROJECT_TYPE[type as ProjectType] : null

  const studies = await getCaseStudies()
  const matching = serviceSlug
    ? studies.filter((study) =>
        populated(study.services).some((service) => service.slug === serviceSlug),
      )
    : []
  const suggestions = [...matching, ...studies.filter((study) => !matching.includes(study))].slice(
    0,
    2,
  )

  return (
    <main id="main" className="page-x pt-12 pb-24 md:pt-20">
      <div className="max-w-2xl">
        <CircleCheck aria-hidden className="size-10 text-signal" strokeWidth={1.5} />
        <h1 className="type-h1 mt-5 text-text">Request received</h1>
        <p className="type-body-l mt-4 text-text-muted">
          Thanks for telling us about your project. A confirmation is on its way to your inbox.
        </p>
      </div>

      <section aria-labelledby="next-heading" className="mt-14 max-w-2xl">
        <h2 id="next-heading" className="type-h2 text-text">
          What happens next
        </h2>
        <ol className="mt-8 flex flex-col">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent font-semibold text-accent">
                  {index + 1}
                </span>
                {index < NEXT_STEPS.length - 1 && (
                  <span aria-hidden className="my-1 w-[1.5px] flex-1 bg-border-input" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="font-display text-lg font-semibold text-text">{step.title}</h3>
                <p className="text-text-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {suggestions.length > 0 && (
        <section
          aria-labelledby="while-you-wait-heading"
          className="mt-10 border-t border-border-subtle pt-14"
        >
          <h2 id="while-you-wait-heading" className="type-h2 text-text">
            While you wait
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-16 md:grid-cols-2">
            {suggestions.map((study) => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
