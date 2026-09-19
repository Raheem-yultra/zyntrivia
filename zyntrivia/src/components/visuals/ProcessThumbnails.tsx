import { Check, Phone } from 'lucide-react'

import { cn } from '@/lib/cn'

const frame =
  'rounded-md border border-border-subtle bg-bg p-4 text-[13px] leading-relaxed text-text-muted select-none'

export function CallAgendaThumb({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Discovery call agenda: how the work happens today, where it breaks, and what done looks like"
      className={cn(frame, className)}
    >
      <div className="flex items-center gap-2 text-text">
        <Phone aria-hidden className="size-4 text-info" strokeWidth={1.75} />
        <span className="font-semibold">Discovery call</span>
        <span className="ml-auto text-text-subtle">30 min</span>
      </div>
      <ol className="mt-3 flex flex-col gap-1.5">
        {['How the work happens today', 'Where it breaks', 'What done looks like'].map(
          (item, index) => (
            <li key={item} className="flex gap-2">
              <span className="w-3 text-accent">{index + 1}</span>
              {item}
            </li>
          ),
        )}
      </ol>
    </div>
  )
}

export function ScopeDocThumb({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Written scope with in-scope items, milestones, and a fixed quote"
      className={cn(frame, className)}
    >
      <span className="block font-display text-base font-semibold text-text">Scope and quote</span>
      <ul className="mt-3 flex flex-col gap-1.5">
        {['In scope, item by item', 'Out of scope, in writing', 'Milestones and demo dates'].map(
          (item) => (
            <li key={item} className="flex items-center gap-2">
              <Check aria-hidden className="size-3.5 shrink-0 text-signal" strokeWidth={2.5} />
              {item}
            </li>
          ),
        )}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3">
        <span>Fixed quote</span>
        <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-text">
          Agreed before work starts
        </span>
      </div>
    </div>
  )
}
