export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

export const SITE = {
  name: 'Zyntrivia',
  url: SITE_URL,
  description:
    'We build custom web apps, internal tools, and AI automations for growing businesses in the US and Europe.',
  // Fallbacks when SiteSettings hasn't been filled in yet. Real values live in the CMS.
  email: 'hello@zyntrivia.com',
} as const

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
