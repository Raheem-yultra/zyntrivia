import Link from 'next/link'

import { cn } from '@/lib/cn'
import type { Topic } from '@/payload-types'

const chip =
  'type-small inline-flex min-h-10 items-center rounded-sm border px-3 transition-colors duration-150'

/** Topic filters are links to static topic archives, so every filtered view is indexable. */
export function TopicChips({ topics, active }: { topics: Topic[]; active?: string }) {
  if (topics.length === 0) return null
  return (
    <nav aria-label="Topics">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/blog"
            aria-current={!active ? 'page' : undefined}
            className={cn(
              chip,
              !active
                ? 'border-accent text-accent'
                : 'border-border-subtle text-text-muted hover:border-border-input hover:text-text',
            )}
          >
            All
          </Link>
        </li>
        {topics.map((topic) => {
          const selected = topic.slug === active
          return (
            <li key={topic.id}>
              <Link
                href={`/blog/topic/${topic.slug}`}
                aria-current={selected ? 'page' : undefined}
                className={cn(
                  chip,
                  selected
                    ? 'border-accent text-accent'
                    : 'border-border-subtle text-text-muted hover:border-border-input hover:text-text',
                )}
              >
                {topic.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
