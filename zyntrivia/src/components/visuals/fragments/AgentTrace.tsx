import { Check, Hourglass } from 'lucide-react'

import { cn } from '@/lib/cn'

import { Fragment } from './Fragment'

const STEPS = [
  { name: 'Understand the request', result: 'Refund', done: true },
  { name: 'Find the details', result: 'Order and amount', done: true },
  { name: 'Double-check', result: 'Passed', done: true },
  { name: 'Write a reply', result: 'Waiting for you', done: false },
]

export function AgentTrace({ className }: { className?: string }) {
  return (
    <Fragment
      label="AI assistant handling a refund request: three checked steps done, the reply waiting for a person to approve"
      className={className}
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2 text-xs">
        <span className="font-semibold text-text">AI assistant</span>
        <span className="text-text-subtle">You approve replies</span>
      </div>
      <ol className="flex flex-col gap-2 p-3">
        {STEPS.map((step) => (
          <li key={step.name} className="flex items-center gap-2">
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded-full',
                step.done ? 'bg-signal text-bg' : 'border border-warn text-warn',
              )}
            >
              {step.done ? (
                <Check aria-hidden className="size-3" strokeWidth={3} />
              ) : (
                <Hourglass aria-hidden className="size-2.5" strokeWidth={2.5} />
              )}
            </span>
            <span className="text-text">{step.name}</span>
            <span
              className={cn(
                'ml-auto truncate text-xs',
                step.done ? 'text-text-subtle' : 'text-warn',
              )}
            >
              {step.result}
            </span>
          </li>
        ))}
      </ol>
    </Fragment>
  )
}
