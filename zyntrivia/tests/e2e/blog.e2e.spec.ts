import AxeBuilder from '@axe-core/playwright'
import {
  expect,
  test,
  type APIRequestContext,
  type BrowserContext,
  type Page,
} from '@playwright/test'

import { block, doc, h2, p } from '../../src/seed/lexical'
import { testPayload } from '../helpers/payload'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * Publishing goes through the REST API on the running server, like the admin does, so the
 * collection hooks revalidate the dev server's cache exactly as they would in production.
 */

const SLUG_PREFIX = 'e2e-post-'

type Created = { doc: { id: number; slug: string; title: string } }

async function logIn(context: BrowserContext | { request: APIRequestContext }): Promise<string> {
  const response = await context.request.post('/api/users/login', { data: testUser })
  expect(response.ok()).toBe(true)
  const { token } = (await response.json()) as { token: string }
  return token
}

async function topicId(): Promise<number> {
  const payload = await testPayload()
  const { docs } = await payload.find({ collection: 'topics', limit: 1, sort: 'title' })
  if (!docs[0]) throw new Error('Run `pnpm seed` first: no topics exist.')
  return docs[0].id
}

function postData(slug: string, title: string, topic: number) {
  return {
    title,
    slug,
    excerpt: 'A short post created by the end-to-end test suite.',
    topics: [topic],
    content: doc(
      p('This post exists only while the end-to-end tests run.'),
      h2('Why it exists'),
      p('It proves that publishing in the admin shows the post on the site without a redeploy.'),
    ),
  }
}

/** A one-second WebM recorded from a canvas in the browser, so the suite needs no binary fixture. */
async function recordWebm(page: Page): Promise<Buffer> {
  const base64 = await page.evaluate(async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 160
    canvas.height = 90
    const context = canvas.getContext('2d')
    const recorder = new MediaRecorder(canvas.captureStream(24), { mimeType: 'video/webm' })
    const chunks: Blob[] = []
    recorder.ondataavailable = (event) => chunks.push(event.data)
    const stopped = new Promise((resolve) => (recorder.onstop = resolve))
    recorder.start()
    const started = performance.now()
    await new Promise<void>((resolve) => {
      const draw = (now: number) => {
        if (context) {
          context.fillStyle = `hsl(${Math.round(now / 4) % 360} 60% 50%)`
          context.fillRect(0, 0, canvas.width, canvas.height)
        }
        if (now - started < 1000) requestAnimationFrame(draw)
        else resolve()
      }
      requestAnimationFrame(draw)
    })
    recorder.stop()
    await stopped
    const bytes = new Uint8Array(await new Blob(chunks, { type: 'video/webm' }).arrayBuffer())
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    return btoa(binary)
  })
  return Buffer.from(base64, 'base64')
}

async function removeTestPosts(request: APIRequestContext, token: string) {
  const query = new URLSearchParams({
    'where[slug][like]': SLUG_PREFIX,
    limit: '50',
    depth: '0',
    draft: 'true',
  })
  const response = await request.get(`/api/posts?${query.toString()}`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const { docs } = (await response.json()) as { docs: { id: number }[] }
  for (const post of docs) {
    await request.delete(`/api/posts/${post.id}`, { headers: { Authorization: `JWT ${token}` } })
  }
}

test.describe('Blog publishing', () => {
  let token: string
  let topic: number

  test.beforeAll(async ({ playwright }) => {
    await seedTestUser()
    const request = await playwright.request.newContext({ baseURL: 'http://localhost:3000' })
    token = await logIn({ request })
    await removeTestPosts(request, token)
    await request.dispose()
    topic = await topicId()
  })

  test.afterAll(async ({ playwright }) => {
    const request = await playwright.request.newContext({ baseURL: 'http://localhost:3000' })
    await removeTestPosts(request, token)
    await request.dispose()
    await cleanupTestUser()
  })

  test('media uploads without alt text are rejected', async ({ request }) => {
    // A 1×1 transparent PNG.
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64',
    )
    for (const alt of [undefined, '   ']) {
      const response = await request.post('/api/media', {
        headers: { Authorization: `JWT ${token}` },
        multipart: {
          file: { name: 'e2e-no-alt.png', mimeType: 'image/png', buffer: png },
          _payload: JSON.stringify(alt === undefined ? {} : { alt }),
        },
      })
      expect(response.status(), await response.text()).toBe(400)
    }
    const payload = await testPayload()
    const { totalDocs } = await payload.count({
      collection: 'media',
      where: { filename: { like: 'e2e-no-alt' } },
    })
    expect(totalDocs).toBe(0)
  })

  test('a published post appears on the blog, in RSS, and updates when edited', async ({
    page,
    request,
  }) => {
    const slug = `${SLUG_PREFIX}${Date.now()}`
    const title = `End-to-end publish check ${Date.now()}`
    const auth = { Authorization: `JWT ${token}` }

    const created = await request.post('/api/posts', {
      headers: auth,
      data: { ...postData(slug, title, topic), _status: 'published' },
    })
    expect(created.status()).toBe(201)
    const { doc: post } = (await created.json()) as Created

    await page.goto('/blog')
    await expect(page.getByRole('main').getByRole('link', { name: title })).toBeVisible()

    await page.goto(`/blog/${slug}`)
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
    // The quote CTA is inserted automatically when the author doesn't add one.
    await expect(page.getByRole('link', { name: 'Request a quote' }).first()).toBeVisible()

    const rss = await request.get('/rss.xml')
    expect(await rss.text()).toContain(`/blog/${slug}`)

    const updatedTitle = `${title} (edited)`
    const updated = await request.patch(`/api/posts/${post.id}`, {
      headers: auth,
      data: { title: updatedTitle, _status: 'published' },
    })
    expect(updated.ok()).toBe(true)

    await page.goto(`/blog/${slug}`)
    await expect(page.getByRole('heading', { level: 1, name: updatedTitle })).toBeVisible()
  })

  test('a post using every block renders each one and passes axe', async ({ page, request }) => {
    const auth = { Authorization: `JWT ${token}` }
    const payload = await testPayload()
    const { docs: images } = await payload.find({
      collection: 'media',
      where: { mimeType: { contains: 'image' } },
      limit: 1,
    })
    const { docs: studies } = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: 'stocksense' } },
      limit: 1,
    })
    const image = images[0]
    const study = studies[0]
    if (!image || !study)
      throw new Error('Run `pnpm seed` first: seeded media and case studies are missing.')

    await page.goto('/blog')
    const upload = await request.post('/api/media', {
      headers: auth,
      multipart: {
        file: { name: 'e2e-loop.webm', mimeType: 'video/webm', buffer: await recordWebm(page) },
        _payload: JSON.stringify({ alt: 'A colour cycle used by the end-to-end tests' }),
      },
    })
    expect(upload.status(), await upload.text()).toBe(201)
    const { doc: video } = (await upload.json()) as { doc: { id: number } }

    try {
      const slug = `${SLUG_PREFIX}blocks-${Date.now()}`
      const created = await request.post('/api/posts', {
        headers: auth,
        data: {
          ...postData(slug, `Every block ${Date.now()}`, topic),
          _status: 'published',
          content: doc(
            p('This post renders every content block once.'),
            h2('Code and callouts'),
            block('code', {
              language: 'ts',
              filename: 'queue.ts',
              code: "await queue.add('sync', { orderId })",
            }),
            block('callout', {
              tone: 'warning',
              title: 'Watch out',
              body: 'Retries need idempotent jobs.',
            }),
            h2('Media'),
            block('imageCaption', {
              image: image.id,
              caption: 'A seeded screenshot',
              width: 'content',
            }),
            block('video', { video: video.id, poster: image.id, caption: 'A recorded loop' }),
            block('featureShot', { media: image.id, caption: 'A feature screenshot caption' }),
            h2('Structured content'),
            block('table', {
              caption: 'Queue options',
              rows: 'Option | Default\nattempts | 3\nbackoff | exponential',
            }),
            block('comparison', {
              leftTitle: 'Before',
              rightTitle: 'After',
              leftItems: 'Copying orders by hand\nMissed reorders',
              rightItems: 'Orders sync on arrival\nAlerts before stock runs out',
            }),
            block('cta', { headline: 'Have a similar problem?' }),
            block('caseStudyRef', { caseStudy: study.id }),
            p('That is every block.'),
          ),
        },
      })
      expect(created.status(), await created.text()).toBe(201)

      await page.goto(`/blog/${slug}`)
      const body = page.locator('#post-body')
      await expect(body.getByRole('region', { name: 'Code: queue.ts' })).toContainText('queue.add')
      await expect(body.getByRole('button', { name: /copy/i })).toBeVisible()
      await expect(body.getByRole('complementary', { name: 'Watch out' })).toBeVisible()
      await expect(body.getByText('A seeded screenshot')).toBeVisible()
      await expect(body.locator('video source[type="video/webm"]')).toHaveCount(1)
      await expect(body.getByText('A feature screenshot caption')).toBeVisible()
      await expect(body.getByRole('table')).toContainText('exponential')
      await expect(body.getByText('Alerts before stock runs out')).toBeVisible()
      await expect(body.getByRole('complementary', { name: 'Request a quote' })).toHaveCount(2)
      await expect(body.getByRole('link', { name: study.title })).toBeVisible()

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      const violations = results.violations.map((violation) => ({
        id: violation.id,
        targets: violation.nodes.map((node) => node.target.join(' ')),
      }))
      expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    } finally {
      await removeTestPosts(request, token)
      await request.delete(`/api/media/${video.id}`, { headers: auth })
    }
  })

  test('drafts are hidden publicly and visible to a signed-in admin through the preview route', async ({
    browser,
    request,
  }) => {
    const slug = `${SLUG_PREFIX}draft-${Date.now()}`
    const title = `End-to-end draft check ${Date.now()}`
    const created = await request.post('/api/posts?draft=true', {
      headers: { Authorization: `JWT ${token}` },
      data: { ...postData(slug, title, topic), _status: 'draft' },
    })
    expect(created.status()).toBe(201)

    // The post page streams (the layout and the page both await the CMS), so Next sends the
    // headers before notFound() runs and the status stays 200. What matters is that none of
    // the draft is served and that the response is marked noindex, which Next adds for a
    // streamed not-found. See Next's loading.js "Status Codes" notes.
    const anonymous = await request.get(`/blog/${slug}`)
    const anonymousBody = await anonymous.text()
    expect(anonymousBody).not.toContain(title)
    expect(anonymousBody).toContain('This page doesn')
    expect(anonymousBody).toContain('name="robots" content="noindex"')

    const secret = process.env.DRAFT_SECRET
    expect(secret, 'DRAFT_SECRET must be set for preview tests').toBeTruthy()
    const previewPath = `/api/draft?${new URLSearchParams({ secret: secret ?? '', collection: 'posts', slug })}`

    const wrongSecret = await request.get(`/api/draft?secret=nope&collection=posts&slug=${slug}`, {
      maxRedirects: 0,
    })
    expect(wrongSecret.status()).toBe(401)
    const signedOut = await request.get(previewPath, { maxRedirects: 0 })
    expect(signedOut.status()).toBe(403)

    const context = await browser.newContext()
    await logIn(context)
    const page = await context.newPage()
    await page.goto(previewPath)
    await expect(page).toHaveURL(new RegExp(`/blog/${slug}$`))
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: 'Draft preview' })).toBeVisible()

    await page.getByRole('link', { name: 'Exit preview' }).click()
    await expect(page.getByRole('heading', { level: 1, name: title })).toHaveCount(0)
    await context.close()
  })
})
