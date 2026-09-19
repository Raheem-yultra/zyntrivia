import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { TextLink } from '@/components/ui/TextLink'
import { analyticsAttrs } from '@/lib/analytics'
import { getSiteSettings } from '@/lib/cms/globals'
import { getLatestPosts } from '@/lib/cms/posts'
import { getServices } from '@/lib/cms/services'
import { SITE } from '@/lib/site'

import { Logo } from './Logo'

const COMPANY_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/process', label: 'Process' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="type-small text-text">{title}</h2>
      <ul className="mt-3 flex flex-col gap-1">{children}</ul>
    </div>
  )
}

export async function Footer() {
  const [services, posts, settings] = await Promise.all([
    getServices(),
    getLatestPosts(3),
    getSiteSettings(),
  ])
  const email = settings.contactEmail || SITE.email

  return (
    <footer className="border-t border-border-subtle bg-surface-1">
      <div className="page-x grid gap-12 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-4 max-w-xs text-text-muted">
            Custom software and automation for growing teams in the US and Europe.
          </p>
          <div className="mt-6">
            <Button
              href="/quote"
              variant="secondary"
              {...analyticsAttrs('cta_click', { location: 'footer', label: 'Request a quote' })}
            >
              Request a quote
            </Button>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 md:col-span-8">
          {services.length > 0 && (
            <Column title="Services">
              {services.map((service) => (
                <li key={service.id}>
                  <TextLink
                    tone="muted"
                    href={`/services/${service.slug}`}
                    className="inline-block py-1.5"
                  >
                    {service.title}
                  </TextLink>
                </li>
              ))}
            </Column>
          )}
          <Column title="Company">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <TextLink tone="muted" href={link.href} className="inline-block py-1.5">
                  {link.label}
                </TextLink>
              </li>
            ))}
          </Column>
          {posts.length > 0 && (
            <Column title="Latest writing">
              {posts.map((post) => (
                <li key={post.id}>
                  <TextLink
                    tone="muted"
                    href={`/blog/${post.slug}`}
                    className="inline-block py-1.5"
                  >
                    {post.title}
                  </TextLink>
                </li>
              ))}
            </Column>
          )}
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="page-x type-small flex flex-col gap-3 py-6 font-normal text-text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zyntrivia</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <li>
              <TextLink tone="muted" href={`mailto:${email}`} className="inline-block py-1.5">
                {email}
              </TextLink>
            </li>
            {settings.social?.githubUrl && (
              <li>
                <TextLink
                  tone="muted"
                  href={settings.social.githubUrl}
                  className="inline-block py-1.5"
                >
                  GitHub
                </TextLink>
              </li>
            )}
            {settings.social?.linkedinUrl && (
              <li>
                <TextLink
                  tone="muted"
                  href={settings.social.linkedinUrl}
                  className="inline-block py-1.5"
                >
                  LinkedIn
                </TextLink>
              </li>
            )}
            <li>
              <Link
                href="/rss.xml"
                className="inline-block py-1.5 text-text-muted hover:text-text hover:underline"
              >
                RSS
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
