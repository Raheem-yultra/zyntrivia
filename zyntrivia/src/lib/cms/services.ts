import { unstable_cache } from 'next/cache'

import type { Service } from '@/payload-types'

import { getPayloadClient } from './client'
import { TAGS } from './tags'

export const getServices = unstable_cache(
  async (): Promise<Service[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'services',
      sort: 'order',
      pagination: false,
      depth: 0,
    })
    return result.docs
  },
  ['services:all'],
  { tags: [TAGS.all, TAGS.services] },
)

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'services',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    ['service', slug],
    { tags: [TAGS.all, TAGS.services, TAGS.service(slug), TAGS.faqs, TAGS.caseStudies] },
  )()
}
