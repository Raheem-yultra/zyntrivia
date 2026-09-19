import { ArrowLeft, ArrowRight, CircleCheck, Crosshair, Wrench } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TrackOnMount } from '@/components/analytics/TrackOnMount'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { CmsMedia, isMediaDoc } from '@/components/media/CmsMedia'
import { DraftBanner } from '@/components/preview/DraftBanner'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/Button'
import { CTABand } from '@/components/ui/CTABand'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { FlowDiagram } from '@/components/visuals/FlowDiagram'
import { Visual } from '@/components/visuals/fragments/registry'
import { CaseStudyMedia } from '@/components/work/CaseStudyMedia'
import { CollapsibleOnMobile } from '@/components/work/CollapsibleOnMobile'
import { analyticsAttrs } from '@/lib/analytics'
import { adjacentCaseStudies, getCaseStudies, getCaseStudyBySlug } from '@/lib/cms/case-studies'
import { populated } from '@/lib/cms/client'
import { cn } from '@/lib/cn'
import { industryLabel } from '@/lib/industries'
import type { LexicalState } from '@/lib/richtext'
import { breadcrumbJsonLd, buildMetadata, creativeWorkJsonLd } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const studies = await getCaseStudies()
  return studies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const study = await getCaseStudyBySlug(slug, { draft })
  if (!study) return {}
  return buildMetadata({
    title: study.seo?.metaTitle || `${study.title} case study`,
    description: study.seo?.metaDescription || study.summary,
    path: `/work/${study.slug}`,
    ogEyebrow: 'Case study',
    noindex: Boolean(study.seo?.noindex) || draft,
    canonical: study.seo?.canonical,
  })
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="type-h2 text-text">
      {children}
    </h2>
  )
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const study = await getCaseStudyBySlug(slug, { draft })
  if (!study) notFound()

  const all = await getCaseStudies()
  const { previous, next } = adjacentCaseStudies(all, study.slug)
  const services = populated(study.services)
  const glance = [
    { label: 'Problem', text: study.atAGlance.problem, icon: Crosshair },
    { label: 'Solution', text: study.atAGlance.solution, icon: Wrench },
    { label: 'Result', text: study.atAGlance.result, icon: CircleCheck },
  ]
  const results = study.results ?? []
  const features = study.featureShots ?? []
  const stack = study.stack ?? []
  const hasArchitecture = (study.architecture?.length ?? 0) > 0 || isMediaDoc(study.architectureSvg)

  return (
    <>
      {draft && <DraftBanner path={`/work/${study.slug}`} />}
      <main id="main">
        <article>
          <header className="page-x pt-10 pb-12 md:pt-16">
            <nav aria-label="Breadcrumb" className="type-small font-normal text-text-subtle">
              <Link href="/work" className="inline-block py-1 hover:text-text hover:underline">
                Work
              </Link>
              <span aria-hidden className="px-2">
                /
              </span>
              <span aria-current="page">{study.title}</span>
            </nav>
            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6">
                <p className="type-small font-normal text-text-subtle">
                  {industryLabel(study.industry)}
                </p>
                <h1 className="type-h1 mt-2 text-text">{study.title}</h1>
                <p className="type-body-l mt-4 text-text-muted">{study.summary}</p>
                {(study.demoUrl || study.repoUrl) && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {study.demoUrl && (
                      <Button
                        href={study.demoUrl}
                        variant="secondary"
                        {...analyticsAttrs('demo_open', { slug: study.slug })}
                      >
                        <span aria-hidden className="size-2 rounded-full bg-signal" />
                        Open live demo
                      </Button>
                    )}
                    {study.repoUrl && (
                      <Button
                        href={study.repoUrl}
                        variant="secondary"
                        {...analyticsAttrs('repo_open', { slug: study.slug })}
                      >
                        View code
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border-subtle pt-6 lg:col-span-5 lg:col-start-8">
                {services.length > 0 && (
                  <div>
                    <dt className="type-small font-normal text-text-subtle">Services</dt>
                    <dd className="mt-1 text-text">
                      {services.map((service, index) => (
                        <span key={service.id}>
                          {index > 0 && ', '}
                          <Link href={`/services/${service.slug}`} className="hover:underline">
                            {service.title}
                          </Link>
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {study.timeline && (
                  <div>
                    <dt className="type-small font-normal text-text-subtle">Timeline</dt>
                    <dd className="mt-1 text-text">{study.timeline}</dd>
                  </div>
                )}
                {stack.length > 0 && (
                  <div className="col-span-2">
                    <dt className="type-small font-normal text-text-subtle">Stack</dt>
                    <dd className="mt-1 text-text">{stack.map((item) => item.name).join(', ')}</dd>
                  </div>
                )}
              </dl>
            </div>
            <CaseStudyMedia
              study={study}
              sizes="(min-width: 1200px) 1200px, 100vw"
              priority
              className="mt-12"
            />
          </header>

          <section aria-labelledby="glance-heading" className="page-x pb-16">
            <h2 id="glance-heading" className="sr-only">
              At a glance
            </h2>
            <dl className="grid gap-px overflow-hidden rounded-lg border border-border-subtle bg-border-subtle md:grid-cols-3">
              {glance.map((fact) => (
                <div key={fact.label} className="bg-surface-1 p-6">
                  <dt className="type-small flex items-center gap-2 text-accent">
                    <fact.icon aria-hidden className="size-4" strokeWidth={1.75} />
                    {fact.label}
                  </dt>
                  <dd data-budget={20} className="mt-2 text-text">
                    {fact.text}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            aria-labelledby="problem-heading"
            className="page-x section-y border-t border-border-subtle"
          >
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionTitle id="problem-heading">The problem</SectionTitle>
                <div data-budget={120}>
                  <RichTextRenderer
                    data={study.problem as LexicalState}
                    className="type-body-l mt-5 flex flex-col gap-4 text-text-muted"
                  />
                </div>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <FlowDiagram tiers={study.problemDiagram} label="How it worked before" />
              </div>
            </div>
          </section>

          {features.length > 0 && (
            <section
              aria-labelledby="built-heading"
              className="page-x section-y border-t border-border-subtle"
            >
              <SectionTitle id="built-heading">What we built</SectionTitle>
              <ol className="mt-12 flex flex-col gap-16 md:gap-24">
                {features.map((feature, index) => (
                  <li
                    key={feature.id ?? feature.title}
                    className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
                  >
                    <div
                      className={cn(
                        'lg:col-span-4',
                        index % 2 === 1 && 'lg:order-2 lg:col-start-9',
                      )}
                    >
                      <h3 className="type-h3 text-text">{feature.title}</h3>
                      <p data-budget={40} className="mt-3 text-text-muted">
                        {feature.caption}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'lg:col-span-8',
                        index % 2 === 1 && 'lg:order-1 lg:col-start-1 lg:row-start-1',
                      )}
                    >
                      {isMediaDoc(feature.media) ? (
                        <MediaFrame>
                          <CmsMedia
                            media={feature.media}
                            sizes="(min-width: 1200px) 800px, 100vw"
                          />
                        </MediaFrame>
                      ) : (
                        <div className="hero-wash flex justify-center rounded-lg border border-border-subtle bg-bg px-6 py-12">
                          <Visual name={feature.visual} className="w-full max-w-sm" />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {hasArchitecture && (
            <section
              aria-labelledby="architecture-heading"
              className="page-x section-y border-t border-border-subtle"
            >
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <SectionTitle id="architecture-heading">Architecture</SectionTitle>
                  <div className="mt-8">
                    {isMediaDoc(study.architectureSvg) ? (
                      <MediaFrame className="bg-bg p-6">
                        <CmsMedia
                          media={study.architectureSvg}
                          sizes="(min-width: 1200px) 700px, 100vw"
                        />
                      </MediaFrame>
                    ) : (
                      <FlowDiagram tiers={study.architecture} label="System architecture" />
                    )}
                  </div>
                </div>
                {(study.architectureNotes?.length ?? 0) > 0 && (
                  <div className="lg:col-span-5 lg:pt-20">
                    <CollapsibleOnMobile summary="Engineering decisions">
                      <dl className="flex flex-col gap-6 pt-5">
                        {study.architectureNotes?.map((note) => (
                          <div key={note.id ?? note.question}>
                            <dt className="font-semibold text-text">{note.question}</dt>
                            <dd className="mt-1 text-text-muted">{note.answer}</dd>
                          </div>
                        ))}
                      </dl>
                    </CollapsibleOnMobile>
                  </div>
                )}
              </div>
            </section>
          )}

          {results.length > 0 && (
            <section
              aria-labelledby="results-heading"
              className="page-x section-y border-t border-border-subtle"
            >
              <SectionTitle id="results-heading">Results</SectionTitle>
              <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((result) => (
                  <li key={result.id ?? result.label} className="border-l-2 border-signal pl-5">
                    <p className="font-display text-4xl font-semibold text-text">{result.value}</p>
                    <p className="mt-1 text-text-muted">{result.label}</p>
                    {result.note && (
                      <p className="type-small mt-1 font-normal text-text-subtle">{result.note}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {stack.length > 0 && (
            <section
              aria-labelledby="stack-heading"
              className="page-x section-y border-t border-border-subtle"
            >
              <SectionTitle id="stack-heading">Tech stack</SectionTitle>
              <ul className="mt-8 flex flex-wrap gap-3">
                {stack.map((item) => (
                  <li
                    key={item.id ?? item.name}
                    className="flex min-h-11 items-center gap-2 rounded-md border border-border-subtle bg-surface-1 px-4 text-text"
                  >
                    {isMediaDoc(item.logo) && (
                      <span className="size-5">
                        <CmsMedia media={item.logo} sizes="20px" />
                      </span>
                    )}
                    {item.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {previous && next && previous.slug !== study.slug && (
          <nav
            aria-label="More case studies"
            className="page-x grid gap-4 border-t border-border-subtle py-10 sm:grid-cols-2"
          >
            <Link
              href={`/work/${previous.slug}`}
              className="group flex min-h-16 items-center gap-3 rounded-md p-3 hover:bg-surface-1"
            >
              <ArrowLeft aria-hidden className="size-5 text-text-subtle" strokeWidth={1.5} />
              <span>
                <span className="type-small block font-normal text-text-subtle">Previous</span>
                <span className="font-display text-lg font-semibold text-text group-hover:underline">
                  {previous.title}
                </span>
              </span>
            </Link>
            {next.slug !== previous.slug && (
              <Link
                href={`/work/${next.slug}`}
                className="group flex min-h-16 items-center justify-end gap-3 rounded-md p-3 text-right hover:bg-surface-1"
              >
                <span>
                  <span className="type-small block font-normal text-text-subtle">Next</span>
                  <span className="font-display text-lg font-semibold text-text group-hover:underline">
                    {next.title}
                  </span>
                </span>
                <ArrowRight aria-hidden className="size-5 text-text-subtle" strokeWidth={1.5} />
              </Link>
            )}
          </nav>
        )}

        <CTABand headline="Have a similar problem?" location="case_study" />
      </main>
      <TrackOnMount event="case_study_view" props={{ slug: study.slug }} />
      <JsonLd
        data={[
          creativeWorkJsonLd(study),
          breadcrumbJsonLd([
            { name: 'Work', path: '/work' },
            { name: study.title, path: `/work/${study.slug}` },
          ]),
        ]}
      />
    </>
  )
}
