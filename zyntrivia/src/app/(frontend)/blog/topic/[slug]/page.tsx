import type { Metadata } from 'next'

import { BlogIndexView } from '@/components/blog/BlogIndexView'
import { getPostPage } from '@/lib/cms/posts'
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
  const { totalDocs } = await getPostPage(1, topic.slug)
  return buildMetadata({
    title: `${topic.title} articles`,
    description:
      topic.description || `Articles about ${topic.title.toLowerCase()} from the Zyntrivia blog.`,
    path: `/blog/topic/${topic.slug}`,
    ogEyebrow: 'Blog',
    // An empty topic is a thin page; keep it out of the index until it has posts.
    noindex: totalDocs === 0,
  })
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params
  return <BlogIndexView page={1} topicSlug={slug} />
}
