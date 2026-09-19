import Link from 'next/link'

import { PROJECT_TYPE_HINTS, ProjectTypeIcon } from '@/components/quote/projectTypeIcons'
import { analyticsAttrs } from '@/lib/analytics'
import { PROJECT_TYPES } from '@/lib/validation/quote-options'

/** Embedded step 1 of the quote form: picking a tile continues at /quote step 2. */
export function FinalCta({ headline }: { headline: string }) {
  return (
    <section
      data-section="final-cta"
      aria-labelledby="final-cta-heading"
      className="border-t border-border-subtle pt-[140px] pb-24"
    >
      <div className="page-x text-center">
        <h2 id="final-cta-heading" data-budget={8} className="type-h1 mx-auto max-w-3xl text-text">
          {headline}
        </h2>
        <p className="type-body-l mt-4 text-text-muted">Pick the one that sounds most like you.</p>
        <ul
          data-visual="interactive"
          className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3 text-left"
        >
          {PROJECT_TYPES.map((type) => (
            <li key={type.value} className="w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]">
              <Link
                href={`/quote?type=${type.value}&step=2`}
                className="group flex h-full min-h-20 items-start gap-3 rounded-md border border-border-subtle bg-surface-1 p-4 transition-colors duration-150 hover:border-accent"
                {...analyticsAttrs('cta_click', { location: 'final', label: type.label })}
              >
                <span className="mt-0.5 text-text-subtle group-hover:text-accent">
                  <ProjectTypeIcon type={type.value} />
                </span>
                <span className="flex flex-col">
                  <span className="font-semibold text-text">{type.label}</span>
                  <span className="type-small font-normal text-text-subtle">
                    {PROJECT_TYPE_HINTS[type.value]}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
