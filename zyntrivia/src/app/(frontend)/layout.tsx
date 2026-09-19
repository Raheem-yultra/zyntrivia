import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { AnalyticsListener } from '@/components/analytics/AnalyticsListener'
import { PlausibleScript } from '@/components/analytics/PlausibleScript'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SkipLink } from '@/components/layout/SkipLink'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSiteSettings } from '@/lib/cms/globals'
import { fontVariables } from '@/lib/fonts'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import { SITE, SITE_URL, THEME_COLOR } from '@/lib/site'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Zyntrivia — Custom software and automation for growing teams',
    template: '%s — Zyntrivia',
  },
  description: SITE.description,
  applicationName: SITE.name,
  manifest: '/site.webmanifest',
  icons: {
    // No favicon.svg: that file only wraps two 1000px PNGs (490 KB), and browsers fetch it
    // at high priority on every page.
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    types: { 'application/rss+xml': '/rss.xml' },
  },
}

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: 'dark',
  // Edge-to-edge on notched phones; `page-x` and the fixed CTAs add the safe-area insets back.
  viewportFit: 'cover',
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()
  const sameAs = [settings.social?.linkedinUrl, settings.social?.githubUrl].filter(
    (url): url is string => Boolean(url),
  )

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SkipLink />
        <Header />
        {children}
        <Footer />
        <JsonLd
          data={[
            organizationJsonLd({ email: settings.contactEmail || SITE.email, sameAs }),
            websiteJsonLd(),
          ]}
        />
        <AnalyticsListener />
        <PlausibleScript />
      </body>
    </html>
  )
}
