import { cn } from '@/lib/cn'

import { Fragment } from './Fragment'

/** ResourceAble's marketplace search filters. */
export function FilterPanel({ className }: { className?: string }) {
  return (
    <Fragment
      label="Marketplace filters: service category, weekly availability, and minimum rating"
      className={className}
    >
      <div className="flex flex-col gap-3 p-3">
        <div>
          <span className="text-xs">Category</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {['Cleaning', 'Tutoring', 'Repairs'].map((category, index) => (
              <span
                key={category}
                className={cn(
                  'rounded-sm border px-2 py-0.5 text-xs',
                  index === 1 ? 'border-accent text-accent' : 'border-border-subtle',
                )}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs">Available this week</span>
          <span
            aria-hidden
            className="flex h-4 w-7 items-center rounded-full bg-accent-solid p-0.5"
          >
            <span className="ml-auto size-3 rounded-full bg-on-accent" />
          </span>
        </div>
        <div>
          <div className="flex justify-between text-xs">
            <span>Rating</span>
            <span className="text-text">4.5 and up</span>
          </div>
          <div aria-hidden className="relative mt-2 h-1 rounded-full bg-surface-2">
            <span className="absolute inset-y-0 right-0 left-[70%] rounded-full bg-info" />
            <span className="absolute top-1/2 left-[70%] size-3 -translate-1/2 rounded-full border-2 border-info bg-bg" />
          </div>
        </div>
      </div>
    </Fragment>
  )
}
