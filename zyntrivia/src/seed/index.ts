/**
 * Idempotent seed: `pnpm seed`. Upserts by slug, so re-running updates content in place
 * instead of duplicating it. Media is attached only when the asset file exists.
 */
import config from '@payload-config'
import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload, type Payload } from 'payload'

import { revalidateToken } from '../lib/revalidate-token'
import { SITE_URL } from '../lib/site'

import { CASE_STUDIES, FAQS, HOMEPAGE, POSTS, SERVICES, SITE_SETTINGS, TOPICS } from './content'

const context = { disableRevalidate: true }
const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')

type SluggedCollection = 'topics' | 'services' | 'case-studies' | 'posts'

async function upsertBySlug(
  payload: Payload,
  collection: SluggedCollection,
  slug: string,
  data: Record<string, unknown>,
): Promise<number> {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: true,
  })
  const doc = existing.docs[0]
  if (doc) {
    const updated = await payload.update({
      collection,
      id: doc.id,
      data: { ...data, slug },
      context,
      depth: 0,
    })
    return updated.id
  }
  const created = await payload.create({
    collection,
    data: { ...data, slug },
    context,
    depth: 0,
  } as Parameters<Payload['create']>[0])
  return created.id as number
}

async function upsertMedia(payload: Payload, name: string, alt: string): Promise<number | null> {
  const filePath = path.join(assetsDir, `${name}.png`)
  if (!fs.existsSync(filePath)) return null
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { like: name } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs[0]) {
    await payload.update({ collection: 'media', id: existing.docs[0].id, data: { alt }, context })
    return existing.docs[0].id
  }
  const created = await payload.create({ collection: 'media', data: { alt }, filePath, context })
  return created.id
}

async function upsertFaq(payload: Payload, faq: (typeof FAQS)[number]): Promise<number> {
  const data = {
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    showOnHome: faq.showOnHome,
    order: faq.order,
  }
  const existing = await payload.find({
    collection: 'faqs',
    where: { question: { equals: faq.question } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs[0]) {
    await payload.update({
      collection: 'faqs',
      id: existing.docs[0].id,
      data: data as never,
      context,
    })
    return existing.docs[0].id
  }
  const created = await payload.create({ collection: 'faqs', data: data as never, context })
  return created.id
}

const idsFor = (keys: string[], map: Record<string, number>) =>
  keys.map((key) => map[key]).filter((id): id is number => typeof id === 'number')

async function seed(payload: Payload) {
  const log = (message: string) => payload.logger.info(`[seed] ${message}`)

  const topicIds: Record<string, number> = {}
  for (const topic of TOPICS) {
    topicIds[topic.slug] = await upsertBySlug(payload, 'topics', topic.slug, {
      title: topic.title,
      description: topic.description,
    })
  }
  log(`${TOPICS.length} topics`)

  const faqIds: Record<string, number> = {}
  for (const faq of FAQS) faqIds[faq.key] = await upsertFaq(payload, faq)
  log(`${FAQS.length} FAQs`)

  // Services first without case studies (they reference each other), then case studies.
  const serviceIds: Record<string, number> = {}
  for (const service of SERVICES) {
    const { slug, faqs, caseStudies: _caseStudies, ...fields } = service
    serviceIds[slug] = await upsertBySlug(payload, 'services', slug, {
      ...fields,
      faqs: idsFor(faqs, faqIds),
    })
  }

  const caseStudyIds: Record<string, number> = {}
  for (const study of CASE_STUDIES) {
    const { slug, services, stack, featureShots, ...rest } = study
    const { cover, ...fields } = { cover: undefined, ...rest } as typeof rest & { cover?: string }
    const coverId = cover ? await upsertMedia(payload, cover, `${study.title} dashboard`) : null
    const shots = []
    for (const shot of featureShots) {
      const asset = 'asset' in shot ? (shot.asset as string) : undefined
      const mediaId = asset
        ? await upsertMedia(payload, asset, `${study.title}: ${shot.title}`)
        : null
      shots.push({ title: shot.title, caption: shot.caption, visual: shot.visual, media: mediaId })
    }
    caseStudyIds[slug] = await upsertBySlug(payload, 'case-studies', slug, {
      ...fields,
      coverMedia: coverId,
      featureShots: shots,
      services: idsFor(services, serviceIds),
      stack: stack.map((name) => ({ name })),
      _status: 'published',
    })
  }
  log(`${CASE_STUDIES.length} case studies`)

  for (const service of SERVICES) {
    await payload.update({
      collection: 'services',
      id: serviceIds[service.slug]!,
      data: { relatedCaseStudies: idsFor(service.caseStudies, caseStudyIds) },
      context,
    })
  }
  log(`${SERVICES.length} services`)

  for (const post of POSTS) {
    await upsertBySlug(payload, 'posts', post.slug, {
      title: post.title,
      excerpt: post.excerpt,
      topics: idsFor(post.topics, topicIds),
      featured: post.featured,
      publishedAt: post.publishedAt,
      relatedCaseStudies: idsFor(post.relatedCaseStudies, caseStudyIds),
      author: 'Zyntrivia team',
      content: post.content(caseStudyIds),
      _status: 'published',
    })
  }
  log(`${POSTS.length} posts`)

  await payload.updateGlobal({ slug: 'site-settings', data: SITE_SETTINGS as never, context })
  await payload.updateGlobal({ slug: 'homepage', data: HOMEPAGE, context })
  log('globals')

  // Seeding runs outside Next.js, so ask a running site to drop its cached CMS queries.
  try {
    const status = await postWithoutKeepAlive(`${SITE_URL}/api/revalidate`, {
      Authorization: `Bearer ${revalidateToken()}`,
    })
    log(status === 200 ? `cache cleared on ${SITE_URL}` : `cache not cleared (${status})`)
  } catch {
    log(`no running site at ${SITE_URL}; nothing to revalidate`)
  }
}

/**
 * node:http rather than fetch: `payload run` calls process.exit, and on Windows exiting while
 * fetch's pooled sockets are still open crashes Node (libuv UV_HANDLE_CLOSING assertion).
 */
function postWithoutKeepAlive(url: string, headers: Record<string, string>): Promise<number> {
  const client = url.startsWith('https:') ? https : http
  return new Promise((resolve, reject) => {
    const request = client.request(
      url,
      { method: 'POST', headers, agent: false, timeout: 5_000 },
      (response) => {
        response.resume()
        response.on('end', () => resolve(response.statusCode ?? 0))
      },
    )
    request.on('timeout', () => request.destroy(new Error('Timed out')))
    request.on('error', reject)
    request.end()
  })
}

// `payload run` exits as soon as this module finishes importing, so await at top level.
const payload = await getPayload({ config })
try {
  await seed(payload)
  console.info('Seed complete.')
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  // Close the database pool first; exiting with open sockets crashes Node on Windows.
  await payload.destroy()
}
