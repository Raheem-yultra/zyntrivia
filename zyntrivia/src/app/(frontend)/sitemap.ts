import type { MetadataRoute } from 'next'

import { getCaseStudies } from '@/lib/cms/case-studies'
import { getPostIndex } from '@/lib/cms/posts'
import { getServices } from '@/lib/cms/services'
import { getTopics } from '@/lib/cms/topics'
import { absoluteUrl } from '@/lib/site'

const STATIC_PATHS = [
  '/',
  '/work',
  '/services',
  '/process',
  '/about',
  '/blog',
  '/quote',
  '/privacy',
  '/terms',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, studies, services, topics] = await Promise.all([
    getPostIndex(),
    getCaseStudies(),
    getServices(),
    getTopics(),
  ])

  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...studies
      .filter((study) => !study.seo?.noindex)
      .map((study) => ({ url: absoluteUrl(`/work/${study.slug}`), lastModified: study.updatedAt })),
    ...services
      .filter((service) => !service.seo?.noindex)
      .map((service) => ({
        url: absoluteUrl(`/services/${service.slug}`),
        lastModified: service.updatedAt,
      })),
    ...posts
      .filter((post) => !post.noindex)
      .map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updatedAt })),
    ...topics.map((topic) => ({ url: absoluteUrl(`/blog/topic/${topic.slug}`) })),
  ]
}
