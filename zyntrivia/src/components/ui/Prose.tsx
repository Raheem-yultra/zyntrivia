import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

/** Blog typography (styles in globals.css `.prose`): 70ch measure, token colors. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('prose', className)}>{children}</div>
}
