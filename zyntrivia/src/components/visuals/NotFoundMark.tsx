import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

const CORNER = 'absolute size-10 border-text-subtle md:size-14'

/**
 * The bracketed frame from the logo (src/components/layout/Logo.tsx) blown up to hold the
 * status code — the one bold thing on the page. Built from borders rather than an SVG so
 * the numeral is real text that scales with the type ramp and stays selectable.
 */
export function NotFoundMark({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      data-visual
      className={cn(
        'hero-wash relative grid aspect-4/3 place-items-center rounded-lg border border-border-subtle bg-bg p-6',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(CORNER, 'top-5 left-5 border-t-2 border-l-2 md:top-8 md:left-8')}
      />
      <span
        aria-hidden
        className={cn(CORNER, 'top-5 right-5 border-t-2 border-r-2 md:top-8 md:right-8')}
      />
      <span
        aria-hidden
        className={cn(CORNER, 'bottom-5 left-5 border-b-2 border-l-2 md:bottom-8 md:left-8')}
      />
      <span
        aria-hidden
        className={cn(CORNER, 'right-5 bottom-5 border-r-2 border-b-2 md:right-8 md:bottom-8')}
      />
      <div className="flex flex-col items-center gap-3 text-center">
        <p
          aria-hidden
          className="font-display text-[clamp(3.5rem,16vw,7rem)] leading-none font-bold tracking-tight text-accent tabular-nums"
        >
          404
        </p>
        {children}
      </div>
    </div>
  )
}
