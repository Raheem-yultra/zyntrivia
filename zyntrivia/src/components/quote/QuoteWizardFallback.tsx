import { buttonClasses } from '@/components/ui/Button'
import { Stepper } from '@/components/ui/Stepper'
import { cn } from '@/lib/cn'
import { PROJECT_TYPES } from '@/lib/validation/quote-options'

import { PROJECT_TYPE_HINTS, ProjectTypeIcon } from './projectTypeIcons'
import { QUOTE_STEPS } from './steps'

/**
 * Server-rendered stand-in with the same layout as step 1, shown until the wizard hydrates.
 * It reserves the form's height so the page doesn't shift when the wizard mounts.
 */
export function QuoteWizardFallback() {
  return (
    <div aria-busy="true">
      <p className="sr-only" role="status">
        Loading the form
      </p>
      <div aria-hidden inert>
        <Stepper steps={QUOTE_STEPS} current={1} />
        <div className="mt-10">
          <p className="type-h3 text-text">What would you like help with?</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {PROJECT_TYPES.map((type) => (
              <div
                key={type.value}
                className="relative flex min-h-16 items-start gap-3 rounded-md border border-border-subtle bg-surface-1 p-4"
              >
                <span className="mt-0.5 shrink-0 text-text-subtle">
                  <ProjectTypeIcon type={type.value} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-semibold text-text">{type.label}</span>
                  <span className="type-small font-normal text-text-subtle">
                    {PROJECT_TYPE_HINTS[type.value]}
                  </span>
                </span>
                <span className="ml-auto size-5 shrink-0 rounded-full border border-border-input" />
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6">
            <span />
            <span className={cn(buttonClasses('primary', 'lg'), 'opacity-60')}>Continue</span>
          </div>
        </div>
      </div>
    </div>
  )
}
