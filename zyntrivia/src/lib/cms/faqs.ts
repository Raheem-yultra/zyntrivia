import { unstable_cache } from 'next/cache'

import type { Faq } from '@/payload-types'

import { getPayloadClient } from './client'
import { TAGS } from './tags'

export const getFaqs = unstable_cache(
  async (onlyHome: boolean): Promise<Faq[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'faqs',
      where: onlyHome ? { showOnHome: { equals: true } } : undefined,
      sort: 'order',
      pagination: false,
      depth: 1,
    })
    return result.docs
  },
  ['faqs'],
  { tags: [TAGS.all, TAGS.faqs] },
)
