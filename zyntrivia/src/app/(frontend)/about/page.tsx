import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { PageHeader } from '@/components/sections/PageHeader'
import { CTABand } from '@/components/ui/CTABand'
import { FlowDiagram } from '@/components/visuals/FlowDiagram'
import { SlackMessage } from '@/components/visuals/fragments/SlackMessage'
import { RepoThumb } from '@/components/visuals/HandoverThumbnails'
import { TimezoneOverlap } from '@/components/visuals/TimezoneOverlap'
import { WeeklyDemoStrip } from '@/components/visuals/WeeklyDemoStrip'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description:
    'Zyntrivia is a software studio building web apps, internal tools, and automation for growing businesses in the US and Europe.',
  path: '/about',
})

const PRINCIPLES: Array<{ title: string; body: string; visual: ReactNode }> = [
  {
    title: 'You own everything',
    body: 'The repository is yours from the first commit. Documentation and credentials are handed over, so nothing depends on us.',
    visual: <RepoThumb />,
  },
  {
    title: 'Working software, every week',
    body: 'Progress is a demo you can click, not a status report. Feedback shapes the next week’s work.',
    visual: <WeeklyDemoStrip />,
  },
  {
    title: 'Systems that fail loudly',
    body: 'Retries, audit trails, and alerts are part of the build. When something goes wrong, someone finds out straight away.',
    visual: <SlackMessage />,
  },
  {
    title: 'The people who scope it build it',
    body: 'No account managers and no hand-offs between the conversation about the problem and the code that solves it.',
    visual: (
      <FlowDiagram
        label="One team from scope to launch"
        tiers={[
          { nodes: [{ label: 'Discovery and scope' }] },
          { nodes: [{ label: 'Build and demos' }] },
          { nodes: [{ label: 'Launch and handover', highlight: true }] },
        ]}
      />
    ),
  },
]

const TOOLS = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'PostgreSQL',
  'Redis',
  'n8n',
  'Stripe',
  'Payload CMS',
  'Vercel',
]

export default function AboutPage() {
  return (
    <main id="main">
      <PageHeader
        title="A small studio that builds software to last"
        lead="We build web apps, internal tools, and automations for growing businesses in the US and Europe."
      />

      <section aria-labelledby="mission-heading" className="page-x pb-16">
        <div className="grid gap-10 border-t border-border-subtle pt-12 lg:grid-cols-12">
          <h2 id="mission-heading" className="type-h2 text-text lg:col-span-4">
            Why we exist
          </h2>
          <div
            data-budget={80}
            className="type-body-l flex flex-col gap-4 text-text-muted lg:col-span-7 lg:col-start-6"
          >
            <p>
              Growing teams outgrow spreadsheets and chains of no-code triggers long before they can
              hire an engineering team. We fill that gap.
            </p>
            <p>
              We scope carefully, quote a fixed price, show working software every week, and hand
              over everything. Judge us on the work, not the pitch.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="principles-heading"
        className="border-y border-border-subtle bg-surface-1"
      >
        <div className="page-x section-y">
          <h2 id="principles-heading" className="type-h2 text-text">
            How we work
          </h2>
          <ul className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <li key={principle.title} className="flex flex-col gap-5">
                <div className="flex min-h-40 items-center">{principle.visual}</div>
                <div>
                  <h3 className="type-h3 text-text">{principle.title}</h3>
                  <p className="mt-2 text-text-muted">{principle.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="remote-heading" className="page-x section-y">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="remote-heading" className="type-h2 text-text">
              Remote, with real overlap
            </h2>
            <p className="type-body-l mt-4 text-text-muted">
              We work from Karachi (UTC+5). Our day covers the European working day and the US
              Eastern morning, with replies within one business day.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <TimezoneOverlap />
          </div>
        </div>
      </section>

      <section aria-labelledby="tools-heading" className="page-x pb-24">
        <div className="border-t border-border-subtle pt-12">
          <h2 id="tools-heading" className="type-h2 text-text">
            Tools we use
          </h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {TOOLS.map((tool) => (
              <li
                key={tool}
                className="flex min-h-11 items-center rounded-md border border-border-subtle bg-surface-1 px-4 text-text"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABand headline="The work is the best introduction." location="page" />
    </main>
  )
}
