import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { QuoteWizard } from '@/components/quote/QuoteWizard'
import { QuoteWizardFallback } from '@/components/quote/QuoteWizardFallback'
import { buildMetadata } from '@/lib/seo'
import { turnstileSiteKey } from '@/lib/turnstile'

export const metadata: Metadata = buildMetadata({
  title: 'Request a quote',
  description:
    'Tell us what’s slowing your team down. We reply within one business day, and a fixed price follows a 30-minute call.',
  path: '/quote',
})

const NEXT_STEPS = [
  { title: 'We reply', detail: 'Within one business day' },
  { title: 'A quick call', detail: '30 minutes, no pitch' },
  { title: 'A fixed price', detail: 'Within 3 business days of the call' },
]

export default function QuotePage() {
  return (
    <main id="main" className="page-x pt-10 pb-24 md:pt-16">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-8">
          <h1 className="type-h1 text-text">Request a quote</h1>
          <p className="type-body-l mt-4 max-w-xl text-text-muted">
            Three short steps. No budget questions.
          </p>
          <div className="mt-10">
            <Suspense fallback={<QuoteWizardFallback />}>
              <QuoteWizard turnstileSiteKey={turnstileSiteKey()} />
            </Suspense>
          </div>
        </div>

        <aside aria-labelledby="next-steps-heading" className="lg:col-span-4">
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-6 lg:sticky lg:top-28">
            <h2 id="next-steps-heading" className="font-display text-lg font-semibold text-text">
              What happens next
            </h2>
            <ol className="mt-5 flex flex-col">
              {NEXT_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent text-sm font-semibold text-accent">
                      {index + 1}
                    </span>
                    {index < NEXT_STEPS.length - 1 && (
                      <span aria-hidden className="my-1 w-[1.5px] flex-1 bg-border-input" />
                    )}
                  </div>
                  <div className="pb-5">
                    <p className="font-semibold text-text">{step.title}</p>
                    <p className="type-small font-normal text-text-subtle">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="type-small border-t border-border-subtle pt-4 font-normal text-text-subtle">
              Your details are used only to reply to this request. See the{' '}
              <Link href="/privacy" className="text-info underline underline-offset-4">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
