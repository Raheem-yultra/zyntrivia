import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { BlogIndexView } from '@/components/blog/BlogIndexView'
import { getTopics } from '@/lib/cms/topics'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string; page: string }> }

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params
  const topic = (await getTopics()).find((item) => item.slug === slug)
  if (!topic) return {}
  return buildMetadata({
    title: `${topic.title} articles, page ${page}`,
    description:
      topic.description || `Articles about ${topic.title.toLowerCase()} from the Zyntrivia blog.`,
    path: `/blog/topic/${topic.slug}/page/${page}`,
    ogEyebrow: 'Blog',
  })
}

export default async function TopicPaginatedPage({ params }: Props) {
  const { slug, page: pageParam } = await params
  const page = Number(pageParam)
  if (!Number.isInteger(page) || page < 1) notFound()
  if (page === 1) redirect(`/blog/topic/${slug}`)
  return <BlogIndexView page={page} topicSlug={slug} />
}
