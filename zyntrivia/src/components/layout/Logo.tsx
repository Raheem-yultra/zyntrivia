import Link from 'next/link'

import { cn } from '@/lib/cn'

import { LogoMark } from './LogoMark'

/** Bracketed-frame mark + wordmark, drawn in token colors. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('inline-flex min-h-11 items-center gap-2.5 rounded-sm text-text', className)}
    >
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight">Zyntrivia</span>
    </Link>
  )
}
