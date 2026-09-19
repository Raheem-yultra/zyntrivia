import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  id: string
  title: string
  lead?: ReactNode
  className?: string
  as?: 'h1' | 'h2'
}

/** Headline ≤ 10 words, supporting line ≤ 22 words (docs/01-PRD.md §4). */
export function SectionHeading({ id, title, lead, className, as: Tag = 'h2' }: Props) {
  return (
    <div className={cn('max-w-2xl', className)}>
      <Tag
        id={id}
        data-budget={10}
        className={cn(Tag === 'h1' ? 'type-h1' : 'type-h2', 'text-text')}
      >
        {title}
      </Tag>
      {lead && (
        <p data-budget={22} className="type-body-l mt-4 text-text-muted">
          {lead}
        </p>
      )}
    </div>
  )
}
