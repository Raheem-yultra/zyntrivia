import type { TocEntry } from '@/lib/richtext'
import { cn } from '@/lib/cn'

export function TableOfContents({
  entries,
  className,
}: {
  entries: TocEntry[]
  className?: string
}) {
  if (entries.length < 2) return null
  return (
    <nav aria-labelledby="toc-heading" className={className}>
      <h2 id="toc-heading" className="type-small text-text">
        On this page
      </h2>
      <ol className="mt-3 flex flex-col border-l border-border-subtle">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={cn(
                'block py-1.5 text-sm text-text-muted hover:text-text',
                entry.level === 3 ? 'pl-7' : 'pl-4',
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
