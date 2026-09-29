export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

export const SITE = {
  name: 'Zyntrivia',
  url: SITE_URL,
  description:
    'We build custom web apps, internal tools, and AI automations for growing businesses in the US and Europe.',
  locale: 'en_US',
  // Fallbacks when SiteSettings hasn't been filled in yet. Real values live in the CMS.
  email: 'hello@zyntrivia.com',
} as const

/**
 * Only the production deployment may be indexed. Vercel preview and development deploys
 * serve the same content on other hosts, so they answer noindex and a closed robots.txt.
 * Outside Vercel (local dev, CI) this is true so the real production tags can be checked.
 */
export const INDEXABLE = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'

/**
 * Browser chrome colour, matching `--color-bg`. Raw hex because `themeColor` metadata is
 * read before any stylesheet, so a CSS variable would resolve to nothing.
 */
export const THEME_COLOR = '#0b0c0e'

export const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/process', label: 'Process' },
  { href: '/blog', label: 'Blog' },
] as const

export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
