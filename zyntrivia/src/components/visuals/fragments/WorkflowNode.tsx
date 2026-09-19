import { Sparkles } from 'lucide-react'

import { Fragment, StatusDot } from './Fragment'

/** WorkflowAI node: one automated step, checked and finished on the first try. */
export function WorkflowNode({
  className,
  title = 'Read the order email',
  detail = 'Items and quantities found',
}: {
  className?: string
  title?: string
  detail?: string
}) {
  return (
    <Fragment label={`Automated step "${title}" finished on the first try`} className={className}>
      <div className="relative flex items-center gap-3 p-3">
        <span
          aria-hidden
          className="absolute top-1/2 -left-1 size-2 -translate-y-1/2 rounded-full border border-border-input bg-bg"
        />
        <span
          aria-hidden
          className="absolute top-1/2 -right-1 size-2 -translate-y-1/2 rounded-full border border-border-input bg-bg"
        />
        <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-accent">
          <Sparkles aria-hidden className="size-4" strokeWidth={1.75} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold text-text">{title}</span>
          <span className="truncate text-[11px] text-text-subtle">{detail}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 border-t border-border-subtle px-3 py-1.5 text-[11px]">
        <StatusDot />
        <span>Done</span>
        <span className="ml-auto text-text-subtle">Double-checked</span>
      </div>
    </Fragment>
  )
}
