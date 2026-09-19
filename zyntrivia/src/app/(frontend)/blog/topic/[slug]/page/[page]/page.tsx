import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { BlogIndexView } from '@/components/blog/BlogIndexView'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string; page: string }> }

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params
  return buildMetadata({
    title: `Blog topic, page ${page}`,
    description: 'Notes on building software, automating work, and running projects well.',
    path: `/blog/topic/${slug}/page/${page}`,
  })
}

export default async function TopicPaginatedPage({ params }: Props) {
  const { slug, page: pageParam } = await params
  const page = Number(pageParam)
  if (!Number.isInteger(page) || page < 1) notFound()
  if (page === 1) redirect(`/blog/topic/${slug}`)
  return <BlogIndexView page={page} topicSlug={slug} />
}
