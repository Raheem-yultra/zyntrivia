import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { FaqSection } from '@/components/sections/FaqSection'
import { Handover } from '@/components/sections/Handover'
import { PageHeader } from '@/components/sections/PageHeader'
import { CTABand } from '@/components/ui/CTABand'
import { RepoThumb, SupportThumb } from '@/components/visuals/HandoverThumbnails'
import { CallAgendaThumb, ScopeDocThumb } from '@/components/visuals/ProcessThumbnails'
import { WeeklyDemoStrip } from '@/components/visuals/WeeklyDemoStrip'
import { getFaqs } from '@/lib/cms/faqs'
import { cn } from '@/lib/cn'
import { PROCESS_STEPS } from '@/lib/content/process'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'How we work',
  description:
    'A 30-minute discovery call, a fixed quote within 3 business days, weekly demos, and a full handover of code, docs, and credentials.',
  path: '/process',
})

const STEP_VISUALS: ReactNode[] = [
  <CallAgendaThumb key="call" />,
  <ScopeDocThumb key="scope" />,
  <WeeklyDemoStrip key="demos" />,
  <div key="handover" className="grid gap-3 sm:grid-cols-2">
    <RepoThumb />
    <SupportThumb />
  </div>,
]

export default async function ProcessPage() {
  const faqs = await getFaqs(false)

  return (
    <main id="main">
      <PageHeader
        title="How we work"
        lead="Four steps, no surprises. You see working software every week."
      />

      <section aria-label="Steps" className="page-x pb-8">
        <ol className="flex flex-col">
          {PROCESS_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="grid gap-8 border-t border-border-subtle py-12 lg:grid-cols-12 lg:gap-12"
            >
              <div className="flex gap-5 lg:col-span-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent font-semibold text-accent">
                  {index + 1}
                </span>
                <div>
                  <h2 className="type-h2 text-text">{step.title}</h2>
                  {step.duration && <p className="type-small mt-2 text-accent">{step.duration}</p>}
                  <p className="mt-4 text-text-muted">{step.detail}</p>
                </div>
              </div>
              <div className={cn('lg:col-span-6 lg:col-start-7', index === 2 ? '' : 'max-w-md')}>
                {STEP_VISUALS[index]}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="border-t border-border-subtle">
        <Handover />
      </div>

      <div className="border-t border-border-subtle">
        <FaqSection faqs={faqs} title="Frequently asked questions" section="process-faq" />
      </div>

      <CTABand headline="Ready when you are." location="page" />
    </main>
  )
}
