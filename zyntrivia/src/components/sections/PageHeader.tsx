import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  title: string
  lead?: ReactNode
  eyebrow?: ReactNode
  children?: ReactNode
  className?: string
}

/** Page headline + one line, no paragraph (docs/01-PRD.md §6). */
export function PageHeader({ title, lead, eyebrow, children, className }: Props) {
  return (
    <header className={cn('page-x pt-12 pb-10 md:pt-20 md:pb-14', className)}>
      {eyebrow && <p className="type-small mb-3 font-normal text-text-subtle">{eyebrow}</p>}
      <h1 className="type-h1 max-w-4xl text-text">{title}</h1>
      {lead && <p className="type-body-l mt-4 max-w-2xl text-text-muted">{lead}</p>}
      {children}
    </header>
  )
}
