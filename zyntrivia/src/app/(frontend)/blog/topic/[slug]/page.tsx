import type { Metadata } from 'next'

import { BlogIndexView } from '@/components/blog/BlogIndexView'
import { getTopics } from '@/lib/cms/topics'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const topics = await getTopics()
  return topics.map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const topic = (await getTopics()).find((item) => item.slug === slug)
  if (!topic) return {}
  return buildMetadata({
    title: `${topic.title} articles`,
    description:
      topic.description || `Articles about ${topic.title.toLowerCase()} from the Zyntrivia blog.`,
    path: `/blog/topic/${topic.slug}`,
    ogEyebrow: 'Blog',
  })
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params
  return <BlogIndexView page={1} topicSlug={slug} />
}
