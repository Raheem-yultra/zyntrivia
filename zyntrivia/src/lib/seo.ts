import type { Metadata } from 'next'

import type { CaseStudy, Faq, Post, Service } from '@/payload-types'

import { ogImageUrl } from './og'
import { plainText, type LexicalState } from './richtext'
import { SITE, absoluteUrl } from './site'

type MetadataInput = {
  title: string
  /** Skip the "%s — Zyntrivia" template (the title already names the studio). */
  absoluteTitle?: boolean
  /** Title for social cards and the OG image when it should differ from the search title. */
  socialTitle?: string
  description: string
  path: string
  /** Short label above the title on the generated OG image. */
  ogEyebrow?: string
  image?: string
  noindex?: boolean
  canonical?: string | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
}

/** Per-route metadata. The root layout applies the "%s — Zyntrivia" title template. */
export function buildMetadata(input: MetadataInput): Metadata {
  const url = absoluteUrl(input.path)
  const socialTitle = input.socialTitle ?? input.title
  const image = input.image ?? ogImageUrl(socialTitle, input.ogEyebrow)
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.canonical || url },
    robots: input.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: input.type ?? 'website',
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      title: socialTitle,
      description: input.description,
      images: [{ url: image, width: 1200, height: 630, alt: socialTitle }],
      ...(input.type === 'article'
        ? {
            publishedTime: input.publishedTime ?? undefined,
            modifiedTime: input.modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: input.description,
      images: [image],
    },
  }
}

type JsonLd = Record<string, unknown>

const ORGANIZATION_ID = `${SITE.url}/#organization`

export function organizationJsonLd(settings: { email: string; sameAs: string[] }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: absoluteUrl('/web-app-manifest-512x512.png'),
    email: settings.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: settings.email,
      url: absoluteUrl('/quote'),
      availableLanguage: 'English',
    },
    sameAs: settings.sameAs.length > 0 ? settings.sameAs : undefined,
  }
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': ORGANIZATION_ID },
  }
}

export function articleJsonLd(post: Post): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: post.author || `${SITE.name} team`, url: SITE.url },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
    image: ogImageUrl(post.seo?.metaTitle || post.title, 'Blog'),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  }
}

export function creativeWorkJsonLd(study: CaseStudy): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: study.title,
    abstract: study.summary,
    url: absoluteUrl(`/work/${study.slug}`),
    creator: { '@id': ORGANIZATION_ID },
    image: ogImageUrl(study.seo?.metaTitle || `${study.title} case study`, 'Case study'),
    datePublished: study.createdAt,
    dateModified: study.updatedAt,
    keywords: (study.stack ?? []).map((item) => item.name).join(', ') || undefined,
  }
}

export function serviceJsonLd(service: Service): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@id': ORGANIZATION_ID },
    areaServed: ['US', 'EU'],
  }
}

export function faqPageJsonLd(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: plainText(faq.answer as LexicalState).trim(),
      },
    })),
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
