import Link from 'next/link'

import { CmsMedia, isMediaDoc } from '@/components/media/CmsMedia'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { stretchedLink } from '@/components/ui/Tile'
import { postTopics } from '@/lib/cms/posts'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import { tableOfContents, type LexicalState } from '@/lib/richtext'
import type { Post } from '@/payload-types'

/**
 * Node motif echoing the Flow Canvas, used when a post has no cover image:
 * the topic, then the post's own section headings.
 */
function OutlineMotif({ topic, sections }: { topic: string; sections: string[] }) {
  const nodes = [topic, ...sections].slice(0, 4)
  return (
    <div
      aria-hidden
      data-visual
      className="hero-wash flex aspect-[2/1] min-w-0 flex-col justify-center bg-bg px-6 py-5 sm:px-10"
    >
      {nodes.map((label, index) => (
        <div
          key={`${label}-${index}`}
          className="flex min-w-0 flex-col"
          style={{ paddingLeft: `${index * 16}px` }}
        >
          {index > 0 && <span className="ml-5 h-3 w-[1.5px] bg-border-input" />}
          <span
            className={cn(
              'flex w-fit max-w-full min-w-0 items-center gap-2 rounded-md border bg-surface-1 px-3 py-1.5 text-[13px]',
              index === 0 ? 'border-accent text-accent' : 'border-border-subtle text-text-muted',
            )}
          >
            {index > 0 && <span className="size-1.5 shrink-0 rounded-full bg-signal" />}
            <span className="truncate">{label}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

type Props = {
  post: Post
  size?: 'compact' | 'large'
  headingLevel?: 'h2' | 'h3'
  showImage?: boolean
  className?: string
}

export function PostCard({
  post,
  size = 'compact',
  headingLevel: Heading = 'h3',
  showImage = true,
  className,
}: Props) {
  const topics = postTopics(post)
  const minutes = post.readingTime ?? 1
  const large = size === 'large'

  return (
    <article
      className={cn(
        'group relative flex min-w-0 flex-col',
        large && 'md:grid md:grid-cols-12 md:items-center md:gap-10',
        className,
      )}
    >
      {showImage && (
        <div className={cn(large && 'md:col-span-7')}>
          <MediaFrame>
            {isMediaDoc(post.coverImage) ? (
              <CmsMedia
                media={post.coverImage}
                sizes={
                  large ? '(min-width: 900px) 680px, 100vw' : '(min-width: 900px) 560px, 100vw'
                }
                className="aspect-[16/9] object-cover"
              />
            ) : (
              <OutlineMotif
                topic={topics[0]?.title ?? 'Notes'}
                sections={tableOfContents(post.content as LexicalState)
                  .filter((entry) => entry.level === 2)
                  .map((entry) => entry.text)}
              />
            )}
          </MediaFrame>
        </div>
      )}
      <div className={cn(showImage && 'mt-5', large && 'md:col-span-5 md:mt-0')}>
        <p className="type-small flex flex-wrap gap-x-4 font-normal text-text-subtle">
          {topics[0] && <span className="text-accent">{topics[0].title}</span>}
          <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
          <span>{minutes} min read</span>
        </p>
        <Heading className={cn(large ? 'type-h2' : 'type-h3', 'mt-2 text-text')}>
          <Link href={`/blog/${post.slug}`} className={cn('group-hover:underline', stretchedLink)}>
            {post.title}
          </Link>
        </Heading>
        <p data-budget={25} className="mt-2 text-text-muted">
          {post.excerpt}
        </p>
      </div>
    </article>
  )
}
