import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FaqSection } from '@/components/sections/FaqSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/Button'
import { CTABand } from '@/components/ui/CTABand'
import { Visual } from '@/components/visuals/fragments/registry'
import { WeeklyDemoStrip } from '@/components/visuals/WeeklyDemoStrip'
import { CaseStudyCard } from '@/components/work/CaseStudyCard'
import { analyticsAttrs } from '@/lib/analytics'
import { populated } from '@/lib/cms/client'
import { getServiceBySlug, getServices } from '@/lib/cms/services'
import { cn } from '@/lib/cn'
import { breadcrumbJsonLd, buildMetadata, faqPageJsonLd, serviceJsonLd } from '@/lib/seo'
import type { CaseStudy, Faq } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return buildMetadata({
    title: service.seo?.metaTitle || service.title,
    description: service.seo?.metaDescription || service.summary,
    path: `/services/${service.slug}`,
    ogEyebrow: 'Services',
    noindex: Boolean(service.seo?.noindex),
    canonical: service.seo?.canonical,
  })
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const caseStudies = populated<CaseStudy>(service.relatedCaseStudies).filter(
    (study) => study._status === 'published',
  )
  const faqs = populated<Faq>(service.faqs)
  const capabilities = service.capabilities ?? []

  return (
    <main id="main">
      <header className="page-x pt-10 pb-16 md:pt-16 md:pb-24">
        <nav aria-label="Breadcrumb" className="type-small font-normal text-text-subtle">
          <Link href="/services" className="inline-block py-1 hover:text-text hover:underline">
            Services
          </Link>
          <span aria-hidden className="px-2">
            /
          </span>
          <span aria-current="page">{service.title}</span>
        </nav>
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="type-h1 text-text">{service.title}</h1>
            <p className="type-body-l mt-5 text-text-muted">{service.summary}</p>
            <div className="mt-8">
              <Button
                href="/quote"
                size="lg"
                {...analyticsAttrs('cta_click', { location: 'services', label: 'Request a quote' })}
              >
                Request a quote
              </Button>
            </div>
          </div>
          <div className="hero-wash flex justify-center rounded-xl border border-border-subtle p-8 sm:p-12 lg:col-span-6">
            <Visual name={service.heroVisual} className="w-full max-w-sm" />
          </div>
        </div>
      </header>

      <section
        aria-labelledby="problem-heading"
        className="border-y border-border-subtle bg-surface-1"
      >
        <div className="page-x section-y grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="problem-heading" className="type-h2 text-text">
              {service.problem.headline}
            </h2>
            <p className="type-body-l mt-5 text-text-muted">{service.problem.body}</p>
          </div>
          {service.problem.visual && (
            <div className="flex justify-center lg:col-span-6 lg:col-start-7">
              <Visual name={service.problem.visual} className="w-full max-w-sm" />
            </div>
          )}
        </div>
      </section>

      {capabilities.length > 0 && (
        <section aria-labelledby="capabilities-heading" className="page-x section-y">
          <h2 id="capabilities-heading" className="type-h2 text-text">
            What you get
          </h2>
          <ul className="mt-12 flex flex-col gap-14">
            {capabilities.map((capability, index) => (
              <li
                key={capability.id ?? capability.title}
                className="grid items-center gap-8 lg:grid-cols-12"
              >
                <div
                  className={cn('lg:col-span-5', index % 2 === 1 && 'lg:order-2 lg:col-start-8')}
                >
                  <h3 className="type-h3 text-text">{capability.title}</h3>
                  <p className="mt-3 text-text-muted">{capability.body}</p>
                </div>
                <div
                  className={cn(
                    'hero-wash flex justify-center rounded-lg border border-border-subtle bg-bg px-6 py-10 lg:col-span-6',
                    index % 2 === 1 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7',
                  )}
                >
                  <Visual name={capability.visual} className="w-full max-w-sm" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {caseStudies.length > 0 && (
        <section aria-labelledby="related-work-heading" className="border-t border-border-subtle">
          <div className="page-x section-y">
            <h2 id="related-work-heading" className="type-h2 text-text">
              Projects like this
            </h2>
            <div className="mt-10 grid gap-x-10 gap-y-16 md:grid-cols-2">
              {caseStudies.map((study) => (
                <CaseStudyCard key={study.id} study={study} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        aria-labelledby="process-link-heading"
        className="border-t border-border-subtle bg-surface-1"
      >
        <div className="page-x grid items-center gap-8 py-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="process-link-heading" className="type-h3 text-text">
              Progress you can see every week
            </h2>
            <p className="mt-2 text-text-muted">
              A fixed price first, then something real to try every week.
            </p>
            <Button href="/process" variant="ghost" className="mt-3">
              See how we work
            </Button>
          </div>
          <WeeklyDemoStrip className="lg:col-span-7" />
        </div>
      </section>

      <FaqSection faqs={faqs} title="Common questions" section="service-faq" withJsonLd={false} />

      <CTABand headline="Have a similar problem?" location="services" />

      <JsonLd
        data={[
          serviceJsonLd(service),
          ...(faqs.length > 0 ? [faqPageJsonLd(faqs)] : []),
          breadcrumbJsonLd([
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
    </main>
  )
}
