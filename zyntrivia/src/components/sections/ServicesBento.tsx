import Link from 'next/link'

import { Tile, stretchedLink } from '@/components/ui/Tile'
import { Visual } from '@/components/visuals/fragments/registry'
import { VisualStack } from '@/components/visuals/VisualStack'
import { cn } from '@/lib/cn'
import { lowerFirst } from '@/lib/format'
import type { Service } from '@/payload-types'

import { SectionHeading } from './SectionHeading'

const LAYOUT = [
  'lg:col-span-7 lg:row-span-2',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8',
]

/** Asymmetric bento: the most in-demand service gets the large tile. */
export function ServicesBento({ services }: { services: Service[] }) {
  if (services.length === 0) return null
  const ordered = [
    ...services.filter((service) => service.featuredOnHome),
    ...services.filter((service) => !service.featuredOnHome),
  ].slice(0, 4)

  return (
    <section
      data-section="services"
      aria-labelledby="services-heading"
      className="page-x section-y"
    >
      <SectionHeading id="services-heading" title="How we can help" />
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        {ordered.map((service, index) => {
          const large = index === 0
          const wide = index === 3
          return (
            <Tile
              as="li"
              key={service.id}
              size={large ? 'lg' : 'sm'}
              interactive
              className={cn('flex flex-col gap-6', LAYOUT[index])}
            >
              <div className={cn(wide && 'lg:col-span-5')}>
                <h3 className={cn(large ? 'type-h2' : 'type-h3', 'text-text')}>{service.title}</h3>
                <p data-budget={12} className="mt-2 text-text-muted">
                  {service.outcomeLine}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className={cn(
                    'mt-4 inline-block font-semibold text-info hover:underline',
                    stretchedLink,
                  )}
                >
                  Explore {lowerFirst(service.title)}
                </Link>
              </div>
              <div className={cn('mt-auto', wide && 'lg:col-span-7 lg:mt-0')}>
                {large ? (
                  <VisualStack
                    className="max-w-md"
                    names={[
                      ...(service.capabilities ?? []).map((capability) => capability.visual),
                      service.heroVisual,
                    ]}
                  />
                ) : (
                  <Visual name={service.heroVisual} />
                )}
              </div>
            </Tile>
          )
        })}
      </ul>
    </section>
  )
}
