import Link from 'next/link'
import type { ReactNode } from 'react'

import { CmsMedia, isMediaDoc } from '@/components/media/CmsMedia'
import { ContributionGraph } from '@/components/visuals/ContributionGraph'
import { Visual } from '@/components/visuals/fragments/registry'
import type { ContributionDay } from '@/lib/github'
import type { CaseStudy, SiteSetting } from '@/payload-types'

type ProofItem = { key: string; href: string; label: string; thumbnail: ReactNode }

function Thumb({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      data-visual
      className="relative block h-16 w-28 shrink-0 overflow-hidden rounded-sm border border-border-subtle bg-bg"
    >
      {children}
    </span>
  )
}

function ScaledFragment({ name }: { name: string | null | undefined }) {
  return (
    <span className="absolute top-1.5 left-1.5 block w-60 origin-top-left scale-[0.42]">
      <Visual name={name} />
    </span>
  )
}

function StudyThumb({ study }: { study: CaseStudy }) {
  if (isMediaDoc(study.coverMedia) && study.coverMedia.mimeType?.startsWith('image/')) {
    return (
      <CmsMedia media={study.coverMedia} sizes="112px" className="h-full object-cover object-top" />
    )
  }
  if (isMediaDoc(study.coverPoster)) {
    return (
      <CmsMedia
        media={study.coverPoster}
        sizes="112px"
        className="h-full object-cover object-top"
      />
    )
  }
  return <ScaledFragment name={study.coverVisual} />
}

type Props = {
  caseStudies: CaseStudy[]
  settings: SiteSetting
  contributions: ContributionDay[] | null
}

/** Verifiable artifacts only. Items without real data are not rendered. */
export function ProofStrip({ caseStudies, settings, contributions }: Props) {
  const items: ProofItem[] = []

  if (caseStudies[0]) {
    items.push({
      key: 'case-studies',
      href: '/work',
      label: `${caseStudies.length} ${caseStudies.length === 1 ? 'case study' : 'case studies'} from problem to launch`,
      thumbnail: <StudyThumb study={caseStudies[0]} />,
    })
  }

  const demos = caseStudies.filter((study) => study.demoUrl)
  if (demos[0]?.demoUrl) {
    items.push({
      key: 'demos',
      href: demos[0].demoUrl,
      label: demos.length === 1 ? 'A live demo you can click' : 'Live demos you can click',
      thumbnail: <StudyThumb study={demos[0]} />,
    })
  }

  const github = settings.social
  if (contributions && github?.githubUrl && github.githubUsername) {
    items.push({
      key: 'github',
      href: github.githubUrl,
      label: 'Public code on GitHub',
      thumbnail: (
        <span className="flex h-full items-center p-2">
          <ContributionGraph days={contributions} username={github.githubUsername} />
        </span>
      ),
    })
  }

  const review = settings.review
  if (review?.platform && review.rating && review.count && review.url) {
    items.push({
      key: 'review',
      href: review.url,
      label: `Rated ${review.rating} on ${review.platform} from ${review.count} reviews`,
      thumbnail: (
        <span className="flex h-full items-center justify-center font-display text-2xl font-semibold text-text">
          {review.rating}
        </span>
      ),
    })
  }

  if (items.length === 0) return null

  return (
    <section
      data-section="proof"
      aria-label="Proof of work"
      className="border-y border-border-subtle"
    >
      <ul className="page-x grid gap-x-16 gap-y-5 py-10 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
        {items.map((item) => {
          const external = item.href.startsWith('http')
          const content = (
            <>
              <Thumb>{item.thumbnail}</Thumb>
              <span className="text-text-muted group-hover:text-text">
                {item.label}
                {external && <span className="sr-only"> (opens in new tab)</span>}
              </span>
            </>
          )
          const className = 'group flex min-h-11 items-center gap-4 rounded-sm'
          return (
            <li key={item.key}>
              {external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {content}
                </a>
              ) : (
                <Link href={item.href} className={className}>
                  {content}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
