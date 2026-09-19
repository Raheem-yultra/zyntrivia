import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/sections/PageHeader'
import { getFeaturedPost, getPostPage } from '@/lib/cms/posts'
import { getTopics } from '@/lib/cms/topics'

import { Pagination } from './Pagination'
import { PostCard } from './PostCard'
import { TopicChips } from './TopicChips'

type Props = { page: number; topicSlug?: string }

export async function BlogIndexView({ page, topicSlug }: Props) {
  const [topics, result, featured] = await Promise.all([
    getTopics(),
    getPostPage(page, topicSlug),
    topicSlug || page > 1 ? Promise.resolve(null) : getFeaturedPost(),
  ])
  const topic = topicSlug ? topics.find((item) => item.slug === topicSlug) : undefined
  if ((topicSlug && !topic) || (page > 1 && result.posts.length === 0)) notFound()

  const posts = featured ? result.posts.filter((post) => post.id !== featured.id) : result.posts
  const basePath = topic ? `/blog/topic/${topic.slug}` : '/blog'

  return (
    <main id="main">
      <PageHeader
        title={topic ? topic.title : 'Blog'}
        lead={
          topic?.description ||
          'Notes on building software, automating work, and running projects well.'
        }
        eyebrow={topic ? 'Topic' : undefined}
      >
        <div className="mt-8">
          <TopicChips topics={topics} active={topic?.slug} />
        </div>
      </PageHeader>

      <div className="page-x pb-24">
        {featured && (
          <section aria-label="Featured post" className="border-t border-border-subtle pt-10 pb-14">
            <PostCard post={featured} size="large" headingLevel="h2" />
          </section>
        )}

        {posts.length > 0 ? (
          <section
            aria-label={featured ? 'More posts' : 'Posts'}
            className="border-t border-border-subtle pt-10"
          >
            <ul className="flex flex-col divide-y divide-border-subtle">
              {posts.map((post) => (
                <li key={post.id} className="py-8 first:pt-0">
                  <PostCard post={post} headingLevel="h2" showImage={false} />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          !featured && <p className="type-body-l text-text-muted">No posts here yet.</p>
        )}

        <Pagination page={result.page} totalPages={result.totalPages} basePath={basePath} />
      </div>
    </main>
  )
}
