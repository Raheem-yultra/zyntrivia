import { Fragment as ReactFragment } from 'react'

import { cn } from '@/lib/cn'

export type DiagramTier = {
  nodes?: Array<{ label: string; detail?: string | null; highlight?: boolean | null }> | null
}

type Props = {
  tiers: DiagramTier[] | null | undefined
  label: string
  className?: string
}

/** Tiered diagram in the Flow Canvas style; the highlighted node carries the accent. */
export function FlowDiagram({ tiers, label, className }: Props) {
  const rows = (tiers ?? []).filter((tier) => tier.nodes && tier.nodes.length > 0)
  if (rows.length === 0) return null

  const description = rows
    .map((tier) => (tier.nodes ?? []).map((node) => node.label).join(' and '))
    .join(', then ')

  return (
    <div
      role="img"
      aria-label={`${label}: ${description}`}
      data-visual
      className={cn('rounded-lg border border-border-subtle bg-bg p-5 sm:p-8', className)}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        {rows.map((tier, tierIndex) => (
          <ReactFragment key={tierIndex}>
            {tierIndex > 0 && <span aria-hidden className="h-7 w-[1.5px] bg-border-input" />}
            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              {(tier.nodes ?? []).map((node, nodeIndex) => (
                <div
                  key={`${node.label}-${nodeIndex}`}
                  className={cn(
                    'flex min-w-0 flex-1 flex-col gap-0.5 rounded-md border bg-surface-1 px-4 py-3 sm:max-w-64',
                    node.highlight ? 'border-accent' : 'border-border-subtle',
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-text">
                    {node.highlight && (
                      <span aria-hidden className="size-2 shrink-0 rounded-full bg-accent" />
                    )}
                    {node.label}
                  </span>
                  {node.detail && (
                    <span className="text-[13px] text-text-subtle">{node.detail}</span>
                  )}
                </div>
              ))}
            </div>
          </ReactFragment>
        ))}
      </div>
    </div>
  )
}
