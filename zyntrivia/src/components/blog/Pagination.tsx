import Link from 'next/link'

import { cn } from '@/lib/cn'

type Props = {
  page: number
  totalPages: number
  /** Base path, e.g. /blog or /blog/topic/automation. Page 1 is the base itself. */
  basePath: string
}

export function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}/page/${page}`
}

export function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const link = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3'

  return (
    <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center gap-2">
      {page > 1 && (
        <Link
          href={pageHref(basePath, page - 1)}
          rel="prev"
          className={cn(link, 'text-info hover:underline')}
        >
          Newer posts
        </Link>
      )}
      <ol className="flex flex-wrap gap-1">
        {pages.map((number) => (
          <li key={number}>
            <Link
              href={pageHref(basePath, number)}
              aria-current={number === page ? 'page' : undefined}
              aria-label={`Page ${number}`}
              className={cn(
                link,
                number === page
                  ? 'border border-accent text-accent'
                  : 'text-text-muted hover:bg-surface-1 hover:text-text',
              )}
            >
              {number}
            </Link>
          </li>
        ))}
      </ol>
      {page < totalPages && (
        <Link
          href={pageHref(basePath, page + 1)}
          rel="next"
          className={cn(link, 'text-info hover:underline')}
        >
          Older posts
        </Link>
      )}
    </nav>
  )
}
