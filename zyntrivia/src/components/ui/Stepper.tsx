import { Check } from 'lucide-react'

import { cn } from '@/lib/cn'

type Props = {
  steps: readonly string[]
  /** 1-based. */
  current: number
  className?: string
}

export function Stepper({ steps, current, className }: Props) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center gap-2 sm:gap-3">
        {steps.map((label, index) => {
          const step = index + 1
          const done = step < current
          const active = step === current
          return (
            <li
              key={label}
              aria-current={active ? 'step' : undefined}
              className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
                  active && 'border-accent text-accent',
                  done && 'border-signal text-signal',
                  !active && !done && 'border-border-input text-text-subtle',
                )}
              >
                {done ? <Check aria-hidden className="size-4" strokeWidth={2.5} /> : step}
              </span>
              <span
                className={cn(
                  'type-small truncate',
                  active ? 'text-text' : 'text-text-subtle',
                  !active && 'hidden sm:inline',
                )}
              >
                <span className="sr-only">
                  Step {step} of {steps.length}
                  {done ? ', completed' : ''}:{' '}
                </span>
                {label}
              </span>
              {step < steps.length && (
                <span aria-hidden className="h-px min-w-4 flex-1 bg-border-subtle" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
