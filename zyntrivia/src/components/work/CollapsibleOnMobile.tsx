'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

/** A <details> that starts open on desktop and collapsed on small screens. */
export function CollapsibleOnMobile({
  summary,
  children,
}: {
  summary: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (ref.current && window.matchMedia('(min-width: 900px)').matches) ref.current.open = true
  }, [])

  return (
    <details ref={ref} className="group rounded-lg border border-border-subtle bg-surface-1">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 font-display text-lg font-semibold text-text [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDown
          aria-hidden
          className="size-5 text-text-subtle transition-transform duration-200 group-open:rotate-180"
          strokeWidth={1.5}
        />
      </summary>
      <div className="border-t border-border-subtle px-5 pb-5">{children}</div>
    </details>
  )
}
