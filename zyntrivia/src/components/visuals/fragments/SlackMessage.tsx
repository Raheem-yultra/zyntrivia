import { Bot } from 'lucide-react'

import { Fragment } from './Fragment'

export function SlackMessage({ className }: { className?: string }) {
  return (
    <Fragment
      label="Team chat message from the order assistant confirming an order was recorded"
      className={className}
    >
      <div className="flex gap-2.5 p-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-accent-solid text-on-accent">
          <Bot aria-hidden className="size-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 text-xs">
            <span className="font-semibold text-text">Order assistant</span>
            <span className="text-text-subtle">09:42</span>
          </div>
          <p className="mt-0.5 text-text">Order 4471 is in. 24 boxes set aside at Branch 2.</p>
        </div>
      </div>
    </Fragment>
  )
}
