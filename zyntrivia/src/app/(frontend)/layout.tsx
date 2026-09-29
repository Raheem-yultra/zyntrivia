import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { AnalyticsListener } from '@/components/analytics/AnalyticsListener'
import { PlausibleScript } from '@/components/analytics/PlausibleScript'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SkipLink } from '@/components/layout/SkipLink'
import { SplashScreen } from '@/components/layout/SplashScreen'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSiteSettings } from '@/lib/cms/globals'
import { fontVariables } from '@/lib/fonts'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import { INDEXABLE, SITE, SITE_URL, THEME_COLOR } from '@/lib/site'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Zyntrivia — Custom software and automation for growing teams',
    template: '%s — Zyntrivia',
  },
  description: SITE.description,
  applicationName: SITE.name,
  publisher: SITE.name,
  robots: INDEXABLE ? undefined : { index: false, follow: false },
  // Defaults for pages without their own (404, thanks). buildMetadata replaces them per route.
  openGraph: { type: 'website', siteName: SITE.name, locale: SITE.locale },
  twitter: { card: 'summary_large_image' },
  // Stops iOS turning "30-minute" or dates into tappable phone numbers.
  formatDetection: { telephone: false, address: false, email: false },
  appleWebApp: { title: SITE.name, statusBarStyle: 'black-translucent' },
  manifest: '/site.webmanifest',
  icons: {
    // All generated from the logo mark by scripts/generate-icons.mjs. The SVG is 0.5 KB; it
    // replaced a 490 KB file that only wrapped two PNGs. `?v=2` makes browsers drop the
    // cached v1 favicon, which they otherwise keep for days. Bump it when the icons change.
    icon: [
      { url: '/favicon.ico?v=2', sizes: '16x16 32x32 48x48' },
      { url: '/favicon.svg?v=2', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon-96x96.png?v=2', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png?v=2',
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
        <SplashScreen />
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
