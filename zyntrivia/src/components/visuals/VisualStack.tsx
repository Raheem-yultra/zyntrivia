import { Fragment as ReactFragment } from 'react'

import { cn } from '@/lib/cn'

import { Visual } from './fragments/registry'

/** Two or three UI fragments joined by connectors — a small echo of the Flow Canvas. */
export function VisualStack({
  names,
  className,
}: {
  names: Array<string | null | undefined>
  className?: string
}) {
  const unique = [...new Set(names.filter((name): name is string => Boolean(name)))].slice(0, 3)
  if (unique.length === 0) return null
  return (
    <div data-visual className={cn('flex flex-col', className)}>
      {unique.map((name, index) => (
        <ReactFragment key={name}>
          {index > 0 && <span aria-hidden className="ml-8 h-5 w-[1.5px] bg-accent/60 sm:ml-10" />}
          <div className={cn(index % 2 === 1 && 'sm:ml-12')}>
            <Visual name={name} />
          </div>
        </ReactFragment>
      ))}
    </div>
  )
}
