import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { InlineCtaView } from '@/components/blog/blocks'
import { PostCard } from '@/components/blog/PostCard'
import { ReadDepthTracker } from '@/components/blog/ReadDepthTracker'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { CmsMedia, isMediaDoc } from '@/components/media/CmsMedia'
import { DraftBanner } from '@/components/preview/DraftBanner'
import { JsonLd } from '@/components/seo/JsonLd'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { getPostBySlug, getPostIndex, getRelatedPosts, postTopics } from '@/lib/cms/posts'
import { formatDate } from '@/lib/format'
import { tableOfContents, type LexicalState } from '@/lib/richtext'
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPostIndex()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const post = await getPostBySlug(slug, { draft })
  if (!post) return {}
  return buildMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    ogEyebrow: 'Blog',
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    noindex: Boolean(post.seo?.noindex) || draft,
    canonical: post.seo?.canonical,
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const post = await getPostBySlug(slug, { draft })
  if (!post) notFound()

  const topics = postTopics(post)
  const content = post.content as LexicalState
  const toc = tableOfContents(content)
  const related = await getRelatedPosts(
    post.id,
    topics.map((topic) => topic.id),
  )

  return (
    <>
      {draft && <DraftBanner path={`/blog/${post.slug}`} />}
      <main id="main">
        <article>
          <header className="page-x pt-10 md:pt-16">
            <nav aria-label="Breadcrumb" className="type-small font-normal text-text-subtle">
              <Link href="/blog" className="inline-block py-1 hover:text-text hover:underline">
                Blog
              </Link>
              {topics[0] && (
                <>
                  <span aria-hidden className="px-2">
                    /
                  </span>
                  <Link
                    href={`/blog/topic/${topics[0].slug}`}
                    className="inline-block py-1 hover:text-text hover:underline"
                  >
                    {topics[0].title}
                  </Link>
                </>
              )}
            </nav>
            <div className="max-w-3xl">
              <h1 className="type-h1 mt-6 text-text">{post.title}</h1>
              <p className="type-body-l mt-5 text-text-muted">{post.excerpt}</p>
              <p className="type-small mt-6 flex flex-wrap gap-x-5 gap-y-1 font-normal text-text-subtle">
                <span>{post.author}</span>
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                )}
                <span>{post.readingTime ?? 1} min read</span>
              </p>
            </div>
            {isMediaDoc(post.coverImage) && (
              <MediaFrame className="mt-10">
                <CmsMedia
                  media={post.coverImage}
                  sizes="(min-width: 1200px) 1200px, 100vw"
                  priority
                />
              </MediaFrame>
            )}
          </header>

          <div className="page-x mt-12 grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
            <div id="post-body" className="min-w-0">
              <RichTextRenderer data={content} className="prose" autoInsertCta />
              <div className="mt-14 max-w-measure">
                <InlineCtaView headline="Have a similar problem?" location="blog_end" />
              </div>
            </div>
            <aside className="max-lg:hidden">
              <TableOfContents entries={toc} className="sticky top-28" />
            </aside>
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="border-t border-border-subtle">
            <div className="page-x section-y">
              <h2 id="related-heading" className="type-h2 text-text">
                Related reading
              </h2>
              <div className="mt-10 grid gap-10 md:grid-cols-3">
                {related.map((item) => (
                  <PostCard key={item.id} post={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <ReadDepthTracker slug={post.slug} targetId="post-body" />
      <JsonLd
        data={[
          articleJsonLd(post),
          breadcrumbJsonLd([
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
    </>
  )
}
