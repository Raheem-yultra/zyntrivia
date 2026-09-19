import { unstable_cache } from 'next/cache'

import type { CaseStudy } from '@/payload-types'

import { getPayloadClient } from './client'
import { TAGS } from './tags'

export const getCaseStudies = unstable_cache(
  async (): Promise<CaseStudy[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'case-studies',
      where: { _status: { equals: 'published' } },
      sort: 'order',
      pagination: false,
      depth: 1,
    })
    return result.docs
  },
  ['case-studies:all'],
  { tags: [TAGS.all, TAGS.caseStudies, TAGS.services] },
)

async function queryCaseStudy(slug: string, draft: boolean): Promise<CaseStudy | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ _status: { equals: 'published' } }, { slug: { equals: slug } }] },
    draft,
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function getCaseStudyBySlug(
  slug: string,
  { draft = false } = {},
): Promise<CaseStudy | null> {
  if (draft) return queryCaseStudy(slug, true)
  return unstable_cache(() => queryCaseStudy(slug, false), ['case-study', slug], {
    tags: [TAGS.all, TAGS.caseStudies, TAGS.caseStudy(slug)],
  })()
}

/** Previous/next in display order, wrapping around. */
export function adjacentCaseStudies(all: CaseStudy[], slug: string) {
  const index = all.findIndex((study) => study.slug === slug)
  if (index === -1 || all.length < 2) return { previous: null, next: null }
  return {
    previous: all[(index - 1 + all.length) % all.length] ?? null,
    next: all[(index + 1) % all.length] ?? null,
  }
}
