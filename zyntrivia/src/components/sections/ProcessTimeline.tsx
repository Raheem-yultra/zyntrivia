import { Button } from '@/components/ui/Button'
import { WeeklyDemoStrip } from '@/components/visuals/WeeklyDemoStrip'
import { analyticsAttrs } from '@/lib/analytics'
import { PROCESS_STEPS } from '@/lib/content/process'

import { SectionHeading } from './SectionHeading'

export function ProcessTimeline({ showLink = true }: { showLink?: boolean }) {
  return (
    <section
      id="how-it-works"
      data-section="process"
      aria-labelledby="process-heading"
      className="border-y border-border-subtle bg-surface-1"
    >
      <div className="page-x section-y">
        <SectionHeading
          id="process-heading"
          title="How it works"
          lead="A fixed price before any work starts, and progress you can see every week."
        />
        <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          <span
            aria-hidden
            className="absolute top-3.5 right-0 left-0 h-[1.5px] bg-border-subtle max-md:hidden"
          >
            <span className="timeline-progress block h-full w-full bg-accent" />
          </span>
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.title} className="relative flex gap-4 md:flex-col md:gap-0">
              <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-accent bg-surface-1 text-sm font-semibold text-accent">
                {index + 1}
              </span>
              <div className="md:mt-5">
                <h3 className="type-h3 text-text">{step.title}</h3>
                <p className="mt-2 text-text-muted">{step.summary}</p>
              </div>
            </li>
          ))}
        </ol>
        <WeeklyDemoStrip className="mt-12" />
        {showLink && (
          <div className="mt-8">
            <Button
              href="/process"
              variant="ghost"
              {...analyticsAttrs('secondary_cta_click', {
                location: 'process',
                label: 'See the full process',
              })}
            >
              See the full process
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
