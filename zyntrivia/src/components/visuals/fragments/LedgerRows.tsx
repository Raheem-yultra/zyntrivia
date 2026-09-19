import { cn } from '@/lib/cn'

import { Fragment } from './Fragment'

const ROWS = [
  { kind: 'Delivery in', batch: 'Batch 2291', qty: '+24', where: 'Branch 2', positive: true },
  { kind: 'Moved', batch: 'Batch 2240', qty: '−6', where: 'Branch 1', positive: false },
  { kind: 'Sold', batch: 'Batch 2187', qty: '−2', where: 'Branch 2', positive: false },
]

/** StockSense's stock history: every change recorded, never overwritten. */
export function LedgerRows({ className, rows = 3 }: { className?: string; rows?: 1 | 2 | 3 }) {
  return (
    <Fragment
      label="Stock history: a delivery, a move between branches, and a sale, each tied to a batch"
      className={className}
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2 text-xs">
        <span className="font-semibold text-text">Stock changes</span>
        <span className="text-text-subtle">Full history</span>
      </div>
      <ul>
        {ROWS.slice(0, rows).map((row) => (
          <li
            key={row.batch}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-border-subtle px-3 py-2 last:border-b-0"
          >
            <span className="flex min-w-0 flex-col">
              <span className="text-text">{row.kind}</span>
              <span className="flex gap-2 truncate text-[11px] text-text-subtle">
                <span>{row.batch}</span>
                <span>{row.where}</span>
              </span>
            </span>
            <span
              className={cn(
                'font-semibold tabular-nums',
                row.positive ? 'text-signal' : 'text-text-muted',
              )}
            >
              {row.qty}
            </span>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}
