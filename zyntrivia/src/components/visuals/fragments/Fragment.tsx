import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  /** Describes what the illustration shows; inner UI text is presentational. */
  label: string
  children: ReactNode
  className?: string
}

/**
 * Shell for UI fragments: one accessible image, no nested reading of fake UI text.
 *
 * `contain-inline-size` keeps the mock UI out of intrinsic width calculations. Rows inside
 * these fragments use `truncate` (white-space: nowrap), whose min-content width is the full
 * untruncated string; without containment that width floors every ancestor grid/flex track
 * and pushes the page past a 320px viewport instead of letting the text truncate.
 */
export function Fragment({ label, children, className }: Props) {
  return (
    <div
      role="img"
      aria-label={label}
      data-visual
      className={cn(
        'contain-inline-size rounded-md border border-border-subtle bg-surface-1 text-[13px] leading-snug text-text-muted select-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function StatusDot({
  tone = 'signal',
  className,
}: {
  tone?: 'signal' | 'info' | 'warn' | 'idle'
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-2 shrink-0 rounded-full',
        tone === 'signal' && 'bg-signal',
        tone === 'info' && 'bg-info',
        tone === 'warn' && 'bg-warn',
        tone === 'idle' && 'bg-border-input',
        className,
      )}
    />
  )
}

export function DemoLabel({ className }: { className?: string }) {
  return <span className={cn('text-[11px] text-text-subtle', className)}>Demo data</span>
}
