import { describe, expect, it } from 'vitest'

import { verifyOgSignature, ogImageUrl } from './og'
import { breadcrumbJsonLd, buildMetadata } from './seo'

describe('buildMetadata', () => {
  it('sets canonical, Open Graph, and noindex', () => {
    const metadata = buildMetadata({
      title: 'Work',
      description: 'Case studies',
      path: '/work',
      noindex: true,
    })
    expect(metadata.alternates?.canonical).toMatch(/\/work$/)
    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(metadata.openGraph?.title).toBe('Work')
  })

  it('prefers an explicit canonical override', () => {
    const metadata = buildMetadata({
      title: 'Post',
      description: 'x',
      path: '/blog/post',
      canonical: 'https://example.com/original',
    })
    expect(metadata.alternates?.canonical).toBe('https://example.com/original')
  })
})

describe('breadcrumbJsonLd', () => {
  it('numbers items from 1 with absolute URLs', () => {
    const data = breadcrumbJsonLd([
      { name: 'Work', path: '/work' },
      { name: 'StockSense', path: '/work/stocksense' },
    ])
    const items = data.itemListElement as Array<{ position: number; item: string }>
    expect(items.map((item) => item.position)).toEqual([1, 2])
    expect(items[1]?.item).toMatch(/^https?:\/\/.+\/work\/stocksense$/)
  })
})

describe('OG image signatures', () => {
  it('accepts its own URLs and rejects tampered titles', () => {
    const url = new URL(ogImageUrl('How we quote', 'Blog'))
    const sig = url.searchParams.get('sig') ?? ''
    expect(verifyOgSignature('How we quote', 'Blog', sig)).toBe(true)
    expect(verifyOgSignature('Something else', 'Blog', sig)).toBe(false)
  })
})
