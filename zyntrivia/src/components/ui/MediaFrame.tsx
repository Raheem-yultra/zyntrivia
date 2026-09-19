import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  children: ReactNode
  caption?: ReactNode
  className?: string
  frameClassName?: string
}

export function MediaFrame({ children, caption, className, frameClassName }: Props) {
  return (
    <figure data-visual className={className}>
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-border-subtle bg-surface-1',
          frameClassName,
        )}
      >
        {children}
      </div>
      {caption && <figcaption className="type-small mt-3 text-text-subtle">{caption}</figcaption>}
    </figure>
  )
}
