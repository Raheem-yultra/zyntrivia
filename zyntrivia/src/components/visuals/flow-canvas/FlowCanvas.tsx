import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { EmailRow } from '../fragments/EmailRow'
import { KpiTiles } from '../fragments/KpiTiles'
import { LedgerRows } from '../fragments/LedgerRows'
import { SlackMessage } from '../fragments/SlackMessage'
import { WorkflowNode } from '../fragments/WorkflowNode'
import { FlowConnectorsLazy } from './FlowConnectorsLazy'
import { NodeCaption } from './NodeCaption'

type FlowNode = {
  id: string
  title: string
  caption: string
  /** Shown in the 3-node mobile crop. */
  mobile: boolean
  fragment: ReactNode
}

const NODES: FlowNode[] = [
  {
    id: 'email',
    title: 'An order arrives by email',
    caption: 'A customer’s order lands in your inbox as a PDF.',
    mobile: true,
    fragment: <EmailRow />,
  },
  {
    id: 'parse',
    title: 'The details get read for you',
    caption: 'Items and quantities are picked out and double-checked.',
    mobile: true,
    fragment: <WorkflowNode />,
  },
  {
    id: 'inventory',
    title: 'Stock updates itself',
    caption: 'Every change is recorded, so you can see what happened.',
    mobile: false,
    fragment: <LedgerRows rows={2} />,
  },
  {
    id: 'dashboard',
    title: 'Your numbers stay current',
    caption: 'Nobody re-types anything into a spreadsheet.',
    mobile: false,
    fragment: <KpiTiles single />,
  },
  {
    id: 'notify',
    title: 'Your team gets a heads-up',
    caption: 'A quick confirmation, or a flag if a person needs to look.',
    mobile: true,
    fragment: <SlackMessage />,
  },
]

/**
 * Hero signature visual (docs/02-DESIGN-SYSTEM.md §5). Nodes render on the server; the
 * FlowConnectors island draws connectors and plays the one-time pulse sequence.
 */
export function FlowCanvas({ className }: { className?: string }) {
  return (
    <div
      data-flow-canvas
      data-visual
      className={cn(
        'hero-wash relative rounded-xl border border-border-subtle p-5 sm:p-8',
        className,
      )}
    >
      <FlowConnectorsLazy />
      <ol
        aria-label="How an order moves through an automated workflow"
        className="relative grid gap-y-9 md:grid-cols-2 md:gap-x-12 md:gap-y-7 md:pb-12"
      >
        {NODES.map((node, index) => (
          <li
            key={node.id}
            data-flow-node
            data-state="pending"
            className={cn(
              'group relative',
              !node.mobile && 'max-md:hidden',
              index % 2 === 1 && 'md:translate-y-12',
            )}
          >
            <p className="type-small mb-2 flex items-center gap-2 text-text">
              <span
                aria-hidden
                data-flow-dot
                className="size-2 rounded-full bg-border-input transition-colors duration-200 group-data-idle:animate-flow-idle group-data-[state=done]:bg-signal"
              />
              {node.title}
            </p>
            {node.fragment}
            <NodeCaption id={`flow-caption-${node.id}`} title={node.title} caption={node.caption} />
          </li>
        ))}
      </ol>
    </div>
  )
}
