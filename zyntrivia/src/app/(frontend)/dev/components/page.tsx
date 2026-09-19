import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { CTABand } from '@/components/ui/CTABand'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Prose } from '@/components/ui/Prose'
import { Stepper } from '@/components/ui/Stepper'
import { TextLink } from '@/components/ui/TextLink'
import { Tile } from '@/components/ui/Tile'
import { AgentTrace } from '@/components/visuals/fragments/AgentTrace'
import { EmailRow } from '@/components/visuals/fragments/EmailRow'
import { FilterPanel } from '@/components/visuals/fragments/FilterPanel'
import { KpiTiles } from '@/components/visuals/fragments/KpiTiles'
import { LedgerRows } from '@/components/visuals/fragments/LedgerRows'
import { MiniChart } from '@/components/visuals/fragments/MiniChart'
import { OrdersTable } from '@/components/visuals/fragments/OrdersTable'
import { SlackMessage } from '@/components/visuals/fragments/SlackMessage'
import { WorkflowNode } from '@/components/visuals/fragments/WorkflowNode'

import { InteractiveDemos } from './InteractiveDemos'

export const metadata: Metadata = { title: 'Components', robots: { index: false } }

function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="border-t border-border-subtle pt-8">
      <h2 className="type-h3 text-text">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

/** Dev-only component gallery (design §7). 404 in production. */
export default function ComponentsPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main id="main" className="page-x section-y flex flex-col gap-12">
      <h1 className="type-h1 text-text">Components</h1>

      <Demo title="Button">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="lg">Large primary</Button>
          <Button loading>Loading</Button>
          <Button disabled variant="secondary">
            Disabled
          </Button>
        </div>
      </Demo>

      <Demo title="Link">
        <p className="text-text-muted">
          An <TextLink href="/work">internal link</TextLink> and an{' '}
          <TextLink href="https://payloadcms.com">external link</TextLink>.
        </p>
      </Demo>

      <Demo title="Tile and MediaFrame">
        <div className="grid gap-4 md:grid-cols-3">
          <Tile size="lg" interactive className="md:col-span-2">
            <p className="type-h3 text-text">Large tile</p>
            <p className="mt-2 text-text-muted">Hover shifts the border.</p>
          </Tile>
          <Tile>
            <p className="font-semibold text-text">Small tile</p>
          </Tile>
        </div>
        <MediaFrame caption="MediaFrame caption" className="mt-4 max-w-md">
          <div className="hero-wash flex h-40 items-center justify-center p-6">
            <EmailRow className="w-full" />
          </div>
        </MediaFrame>
      </Demo>

      <InteractiveDemos />

      <Demo title="Stepper">
        <Stepper
          steps={['What you’re building', 'Timeline and stage', 'Your details']}
          current={2}
        />
      </Demo>

      <Demo title="Prose">
        <Prose>
          <h2>A heading in prose</h2>
          <p>
            Body copy at a 70 character measure with <strong>emphasis</strong>,{' '}
            <a href="#">a link</a>, and <code>inline code</code>.
          </p>
          <blockquote>A blockquote with an accent rule.</blockquote>
          <ul>
            <li>First point</li>
            <li>Second point</li>
          </ul>
        </Prose>
      </Demo>

      <Demo title="UI fragments">
        <div className="grid gap-4 md:grid-cols-3">
          <EmailRow />
          <WorkflowNode />
          <LedgerRows />
          <KpiTiles />
          <FilterPanel />
          <SlackMessage />
          <OrdersTable />
          <MiniChart />
          <AgentTrace />
        </div>
      </Demo>

      <CTABand headline="CTA band" location="page" />
    </main>
  )
}
