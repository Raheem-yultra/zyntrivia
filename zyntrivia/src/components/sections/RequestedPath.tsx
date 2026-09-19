'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/cn'

const MAX = 48

/**
 * The URL that missed, so the visitor can spot a typo or a truncated link.
 *
 * The path is attacker-controllable, so it is trimmed to a printable subset and capped
 * before it goes on screen — React escapes it, but a 2,000-character path or a line of
 * control characters would still wreck the layout.
 */
export function RequestedPath({ className }: { className?: string }) {
  const pathname = usePathname()
  if (!pathname) return null

  const safe = pathname.replace(/[^\x20-\x7e]/g, '')
  if (!safe) return null
  const shown = safe.length > MAX ? `${safe.slice(0, MAX - 1)}…` : safe

  return (
    <p className={cn('type-small font-normal text-text-subtle', className)}>
      <span className="sr-only">Requested address: </span>
      <span className="font-code text-text-muted">{shown}</span>
    </p>
  )
}
