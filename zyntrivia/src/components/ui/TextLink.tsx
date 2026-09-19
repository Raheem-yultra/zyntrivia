import Link from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  href: string
  children: ReactNode
  className?: string
  /** Muted text links (nav, footer) instead of the blue information style. */
  tone?: 'info' | 'muted'
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>

export function TextLink({ href, children, className, tone = 'info', ...rest }: Props) {
  const classes = cn(
    'underline-offset-4 decoration-1 hover:underline focus-visible:underline',
    tone === 'info' ? 'text-info' : 'text-text-muted hover:text-text',
    className,
  )

  if (/^(https?:|mailto:)/.test(href)) {
    const newTab = href.startsWith('http')
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
        {newTab && <span className="sr-only"> (opens in new tab)</span>}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  )
}
