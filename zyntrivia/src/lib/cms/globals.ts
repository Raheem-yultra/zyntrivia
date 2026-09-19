import { unstable_cache } from 'next/cache'

import type { Homepage, SiteSetting } from '@/payload-types'

import { getPayloadClient } from './client'
import { TAGS } from './tags'

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSetting> => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'site-settings', depth: 0 })
  },
  ['global:site-settings'],
  { tags: [TAGS.all, TAGS.siteSettings] },
)

export const getHomepage = unstable_cache(
  async (): Promise<Homepage> => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'homepage', depth: 1 })
  },
  ['global:homepage'],
  { tags: [TAGS.all, TAGS.home, TAGS.caseStudies, TAGS.posts] },
)
