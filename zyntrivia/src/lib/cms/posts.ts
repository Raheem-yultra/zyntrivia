import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'

import type { Post } from '@/payload-types'

import { getPayloadClient, populated } from './client'
import { TAGS } from './tags'

export const POSTS_PER_PAGE = 12

const published: Where = { _status: { equals: 'published' } }

export type PostPage = {
  posts: Post[]
  page: number
  totalPages: number
  totalDocs: number
}

export const getPostPage = unstable_cache(
  async (page: number, topicSlug?: string): Promise<PostPage> => {
    const payload = await getPayloadClient()
    const where: Where = topicSlug
      ? { and: [published, { 'topics.slug': { equals: topicSlug } }] }
      : published
    const result = await payload.find({
      collection: 'posts',
      where,
      sort: '-publishedAt',
      limit: POSTS_PER_PAGE,
      page,
      depth: 1,
    })
    return {
      posts: result.docs,
      page: result.page ?? page,
      totalPages: result.totalPages,
      totalDocs: result.totalDocs,
    }
  },
  ['posts:page'],
  { tags: [TAGS.all, TAGS.posts, TAGS.topics] },
)

export const getFeaturedPost = unstable_cache(
  async (): Promise<Post | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { and: [published, { featured: { equals: true } }] },
      sort: '-publishedAt',
      limit: 1,
      depth: 1,
    })
    return result.docs[0] ?? null
  },
  ['posts:featured'],
  { tags: [TAGS.all, TAGS.posts] },
)

export const getLatestPosts = unstable_cache(
  async (limit: number): Promise<Post[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: published,
      sort: '-publishedAt',
      limit,
      depth: 1,
    })
    return result.docs
  },
  ['posts:latest'],
  { tags: [TAGS.all, TAGS.posts] },
)

async function queryPost(slug: string, draft: boolean): Promise<Post | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: draft ? { slug: { equals: slug } } : { and: [published, { slug: { equals: slug } }] },
    draft,
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function getPostBySlug(slug: string, { draft = false } = {}): Promise<Post | null> {
  if (draft) return queryPost(slug, true)
  return unstable_cache(() => queryPost(slug, false), ['post', slug], {
    tags: [TAGS.all, TAGS.posts, TAGS.post(slug)],
  })()
}

export const getRelatedPosts = unstable_cache(
  async (postId: number, topicIds: number[]): Promise<Post[]> => {
    if (topicIds.length === 0) return []
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [published, { id: { not_equals: postId } }, { topics: { in: topicIds } }],
      },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    })
    return result.docs
  },
  ['posts:related'],
  { tags: [TAGS.all, TAGS.posts] },
)

export type PostIndexEntry = Pick<Post, 'slug' | 'updatedAt' | 'publishedAt'> & {
  noindex: boolean
}

export const getPostIndex = unstable_cache(
  async (): Promise<PostIndexEntry[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: published,
      sort: '-publishedAt',
      pagination: false,
      depth: 0,
      select: { slug: true, updatedAt: true, publishedAt: true, seo: true },
    })
    return result.docs.map((doc) => ({
      slug: doc.slug,
      updatedAt: doc.updatedAt,
      publishedAt: doc.publishedAt,
      noindex: Boolean(doc.seo?.noindex),
    }))
  },
  ['posts:index'],
  { tags: [TAGS.all, TAGS.posts] },
)

export function postTopics(post: Pick<Post, 'topics'>) {
  return populated(post.topics)
}
