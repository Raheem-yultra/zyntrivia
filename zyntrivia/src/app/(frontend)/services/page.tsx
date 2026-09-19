import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/sections/PageHeader'
import { CTABand } from '@/components/ui/CTABand'
import { stretchedLink } from '@/components/ui/Tile'
import { Visual } from '@/components/visuals/fragments/registry'
import { getServices } from '@/lib/cms/services'
import { cn } from '@/lib/cn'
import { lowerFirst } from '@/lib/format'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description:
    'Custom apps for your customers, automation, tools for your team, and AI assistants for growing businesses in the US and Europe.',
  path: '/services',
})

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <main id="main">
      <PageHeader
        title="Services"
        lead="Four kinds of software, all built to be owned and run by your team."
      />
      <ul className="page-x flex flex-col pb-24">
        {services.map((service, index) => (
          <li
            key={service.id}
            className="group relative grid items-center gap-8 border-t border-border-subtle py-12 lg:grid-cols-12 lg:gap-12"
          >
            <div className={cn('lg:col-span-5', index % 2 === 1 && 'lg:order-2 lg:col-start-8')}>
              <h2 className="type-h2 text-text">{service.title}</h2>
              <p className="type-body-l mt-3 text-text-muted">{service.outcomeLine}</p>
              <Link
                href={`/services/${service.slug}`}
                className={cn(
                  'mt-5 inline-block font-semibold text-info group-hover:underline',
                  stretchedLink,
                )}
              >
                Explore {lowerFirst(service.title)}
              </Link>
            </div>
            <div
              className={cn(
                'hero-wash flex justify-center rounded-lg border border-border-subtle bg-bg px-6 py-10 transition-colors group-hover:border-border-input lg:col-span-6',
                index % 2 === 1 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7',
              )}
            >
              <Visual name={service.heroVisual} className="w-full max-w-sm" />
            </div>
          </li>
        ))}
      </ul>
      <CTABand headline="Not sure which fits? Tell us the problem." location="services" />
    </main>
  )
}
