import Link from 'next/link'

import { cn } from '@/lib/cn'

/** Bracketed-frame mark + wordmark, drawn in token colors. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('inline-flex min-h-11 items-center gap-2.5 rounded-sm text-text', className)}
    >
      <svg aria-hidden viewBox="0 0 32 32" className="size-7 shrink-0" fill="none">
        <path
          d="M11 3H3v8M21 3h8v8M29 21v8h-8M3 21v8h8"
          className="stroke-text-subtle"
          strokeWidth="2.25"
          strokeLinecap="square"
        />
        <path
          d="M10.5 10.5h11l-11 11h11"
          className="stroke-accent"
          strokeWidth="2.75"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">Zyntrivia</span>
    </Link>
  )
}
