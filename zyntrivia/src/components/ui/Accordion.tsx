'use client'

import { Plus } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'

export type AccordionItem = {
  id: string
  question: string
  answer: ReactNode
}

type Props = {
  items: AccordionItem[]
  headingLevel?: 'h3' | 'h4'
  className?: string
}

export function Accordion({ items, headingLevel: Heading = 'h3', className }: Props) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const baseId = useId()

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        track('faq_open', { question_id: id })
      }
      return next
    })
  }

  return (
    <div
      data-visual="interactive"
      className={cn('divide-y divide-border-subtle border-y border-border-subtle', className)}
    >
      {items.map((item) => {
        const expanded = open.has(item.id)
        const buttonId = `${baseId}-${item.id}-button`
        const panelId = `${baseId}-${item.id}-panel`
        return (
          <div key={item.id}>
            <Heading className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-semibold text-text md:text-xl"
              >
                {item.question}
                <Plus
                  aria-hidden
                  strokeWidth={1.5}
                  className={cn(
                    'size-5 shrink-0 text-text-subtle transition-transform duration-[240ms] ease-out',
                    expanded && 'rotate-45 text-accent',
                  )}
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!expanded}
              className={cn(
                'grid transition-[grid-template-rows] duration-[240ms] ease-out',
                expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-measure pb-6 text-text-muted">{item.answer}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
