import { unstable_cache } from 'next/cache'

import type { Topic } from '@/payload-types'

import { getPayloadClient } from './client'
import { TAGS } from './tags'

export const getTopics = unstable_cache(
  async (): Promise<Topic[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'topics',
      sort: 'title',
      pagination: false,
      depth: 0,
    })
    return result.docs
  },
  ['topics:all'],
  { tags: [TAGS.all, TAGS.topics] },
)
