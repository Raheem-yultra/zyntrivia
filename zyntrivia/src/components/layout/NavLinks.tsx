'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/cn'
import { NAV_LINKS } from '@/lib/site'

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function NavLinks({
  className,
  linkClassName,
}: {
  className?: string
  linkClassName?: string
}) {
  const pathname = usePathname()
  return (
    <ul className={className}>
      {NAV_LINKS.map((link) => {
        const active = isActivePath(pathname, link.href)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-11 items-center rounded-sm transition-colors duration-150',
                active ? 'text-text' : 'text-text-muted hover:text-text',
                linkClassName,
              )}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
