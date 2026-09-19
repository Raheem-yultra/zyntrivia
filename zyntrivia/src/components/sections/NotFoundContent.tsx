import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { NotFoundMark } from '@/components/visuals/NotFoundMark'

import { RequestedPath } from './RequestedPath'

const LINKS = [
  {
    href: '/work',
    label: 'See our work',
    detail: 'Case studies with the architecture behind them',
  },
  { href: '/services', label: 'What we build', detail: 'Web apps, automation, internal tools' },
  { href: '/blog', label: 'Read the blog', detail: 'Notes on building and automating' },
]

export function NotFoundContent() {
  return (
    // Fills the viewport: unmatched URLs render without the footer (src/app/global-not-found.tsx),
    // so without a minimum height the page trails off into empty space on a desktop screen.
    <main
      id="main"
      className="page-x section-y flex min-h-[calc(100dvh-4rem)] items-center md:min-h-[calc(100dvh-72px)]"
    >
      <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <h1 className="type-h1 text-text">This page doesn’t exist</h1>
          <p className="type-body-l mt-4 max-w-xl text-text-muted">
            The link may be mistyped, or the page moved when we rebuilt the site.
          </p>
          <ul className="mt-9 flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex flex-col gap-0.5 py-4 transition-colors duration-150"
                >
                  <span className="font-semibold text-text group-hover:text-accent">
                    {link.label}
                  </span>
                  <span className="type-small font-normal text-text-subtle">{link.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <Button href="/quote" size="lg">
              Request a quote
            </Button>
          </div>
        </div>
        <div className="order-first lg:order-none lg:col-span-5 lg:col-start-8">
          <NotFoundMark>
            <RequestedPath className="max-w-full break-all" />
          </NotFoundMark>
        </div>
      </div>
    </main>
  )
}
