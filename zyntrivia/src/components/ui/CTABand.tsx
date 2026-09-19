import type { ReactNode } from 'react'

import { analyticsAttrs, type CtaLocation } from '@/lib/analytics'
import { cn } from '@/lib/cn'

import { Button } from './Button'

type Props = {
  headline: string
  location: CtaLocation
  /** Replaces the default button — e.g. the embedded quote step 1. */
  children?: ReactNode
  align?: 'left' | 'center'
  className?: string
  section?: string
}

export function CTABand({
  headline,
  location,
  children,
  align = 'left',
  className,
  section = 'cta',
}: Props) {
  return (
    <section
      data-section={section}
      aria-labelledby={`${section}-heading`}
      className={cn('border-t border-border-subtle', className)}
    >
      <div className={cn('page-x py-16 md:py-24', align === 'center' && 'text-center')}>
        <h2 id={`${section}-heading`} className="type-h2 text-text">
          {headline}
        </h2>
        {children ?? (
          <div className={cn('mt-8 flex', align === 'center' && 'justify-center')}>
            <Button
              href="/quote"
              size="lg"
              {...analyticsAttrs('cta_click', { location, label: 'Request a quote' })}
            >
              Request a quote
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
