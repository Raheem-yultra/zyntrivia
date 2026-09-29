import type { MetadataRoute } from 'next'

import { INDEXABLE, absoluteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: [{ userAgent: '*', disallow: '/' }] }

  return {
    rules: [
      {
        userAgent: '*',
        // The longer path wins over `/api`: social crawlers (X, LinkedIn, Slack) refuse
        // card images that robots.txt blocks, and CMS media should be findable in image search.
        allow: ['/', '/api/og', '/api/media/file/'],
        disallow: ['/admin', '/api', '/quote/thanks', '/dev'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
