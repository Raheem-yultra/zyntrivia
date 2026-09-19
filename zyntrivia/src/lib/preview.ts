import { SITE_URL } from './site'

export type PreviewCollection = 'posts' | 'case-studies'

/** Admin preview / live preview URL. /api/draft checks the secret and the admin session. */
export function previewUrl(collection: PreviewCollection, slug: unknown): string {
  const params = new URLSearchParams({
    secret: process.env.DRAFT_SECRET ?? '',
    collection,
    slug: typeof slug === 'string' ? slug : '',
  })
  return `${SITE_URL}/api/draft?${params.toString()}`
}

export function publicPath(collection: PreviewCollection, slug: string): string {
  return collection === 'posts' ? `/blog/${slug}` : `/work/${slug}`
}
