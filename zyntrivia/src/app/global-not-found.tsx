import type { Metadata, Viewport } from 'next'

import { Header } from '@/components/layout/Header'
import { SkipLink } from '@/components/layout/SkipLink'
import { NotFoundContent } from '@/components/sections/NotFoundContent'
import { fontVariables } from '@/lib/fonts'
import { THEME_COLOR } from '@/lib/site'

import './(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Page not found — Zyntrivia',
  robots: { index: false },
}

// This page renders its own document, so it repeats the site layout's viewport settings.
export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: 'dark',
  viewportFit: 'cover',
}

// Unmatched URLs anywhere in the app. The app has two root layouts (site and Payload
// admin), so this page renders its own document instead of relying on either one.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SkipLink />
        <Header />
        <NotFoundContent />
      </body>
    </html>
  )
}
