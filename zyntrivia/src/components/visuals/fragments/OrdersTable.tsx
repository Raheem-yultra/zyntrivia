import { cn } from '@/lib/cn'

import { Fragment, StatusDot } from './Fragment'

const ROWS = [
  { id: '4471', source: 'Email', status: 'Done', tone: 'signal' },
  { id: '4470', source: 'Website', status: 'In progress', tone: 'info' },
  { id: '4468', source: 'Email', status: 'Needs a look', tone: 'warn' },
] as const

export function OrdersTable({ className }: { className?: string }) {
  return (
    <Fragment
      label="Orders table: one done, one in progress, and one flagged for a person to check"
      className={className}
    >
      <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 border-b border-border-subtle px-3 py-2 text-[11px] text-text-subtle">
        <span>Order</span>
        <span>Source</span>
        <span>Status</span>
      </div>
      {ROWS.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-border-subtle px-3 py-2 last:border-b-0"
        >
          <span className="text-text tabular-nums">{row.id}</span>
          <span className="truncate">{row.source}</span>
          <span
            className={cn(
              'flex items-center gap-1.5 text-xs',
              row.tone === 'warn' ? 'text-warn' : 'text-text',
            )}
          >
            <StatusDot tone={row.tone} />
            {row.status}
          </span>
        </div>
      ))}
    </Fragment>
  )
}
