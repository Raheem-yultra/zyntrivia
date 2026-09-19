import { expect, test } from '@playwright/test'

test.describe('Access control', () => {
  for (const collection of ['quote-requests', 'users', 'rate-limit-hits']) {
    test(`anonymous API reads of ${collection} are refused`, async ({ request }) => {
      const response = await request.get(`/api/${collection}`)
      expect([401, 403]).toContain(response.status())
      const body = await response.text()
      expect(body).not.toContain('@')
    })
  }

  test('anonymous clients cannot create quote requests through the REST API', async ({
    request,
  }) => {
    const response = await request.post('/api/quote-requests', {
      data: {
        name: 'Bypass',
        email: 'bypass@e2e.example.com',
        description: 'Skipping the form checks.',
      },
    })
    expect([401, 403]).toContain(response.status())
  })

  test('draft posts are not readable anonymously through the API', async ({ request }) => {
    const response = await request.get('/api/posts?draft=true&where[_status][equals]=draft')
    const { docs } = (await response.json()) as { docs: unknown[] }
    expect(docs).toEqual([])
  })

  test('revalidation requires the signed token', async ({ request }) => {
    const response = await request.post('/api/revalidate', {
      headers: { Authorization: 'Bearer nope' },
    })
    expect(response.status()).toBe(401)
  })

  test('the jobs runner requires a signed-in user or the cron secret', async ({ request }) => {
    const response = await request.get('/api/payload-jobs/run', {
      headers: { Authorization: 'Bearer nope' },
    })
    expect([401, 403]).toContain(response.status())
  })

  test('OG images only render with a valid signature', async ({ request }) => {
    const response = await request.get('/api/og?title=Anything&sig=forged')
    expect([400, 401, 403]).toContain(response.status())
  })
})

test.describe('Security headers', () => {
  test('site pages send CSP and hardening headers', async ({ request }) => {
    const response = await request.get('/')
    const headers = response.headers()
    const csp = headers['content-security-policy'] ?? ''
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'self'")
    expect(csp).toContain("base-uri 'self'")
    expect(csp).toContain('https://challenges.cloudflare.com')
    expect(csp).not.toContain('wasm-unsafe-eval')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toBe('SAMEORIGIN')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['permissions-policy']).toContain('camera=()')
    expect(headers['x-powered-by']).toBeUndefined()
  })

  test('the StockSense demo allows WebAssembly and the admin allows its editor CDN', async ({
    request,
  }) => {
    const demo = await request.get('/projects/stocksense-demo/')
    expect(demo.headers()['content-security-policy']).toContain("'wasm-unsafe-eval'")

    const admin = await request.get('/admin/login')
    expect(admin.headers()['content-security-policy']).toContain('https://cdn.jsdelivr.net')
  })

  test('private routes are kept out of search engines', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    const text = await robots.text()
    for (const path of ['/admin', '/api', '/quote/thanks']) {
      expect(text).toContain(`Disallow: ${path}`)
    }
  })
})

test.describe('Design tokens', () => {
  test('the default Tailwind palette produces no styles', async ({ page }) => {
    await page.goto('/dev/tokens')
    const canaries = page.locator('[data-palette-canary]')
    await expect(canaries).toHaveCount(3)
    const styles = await canaries.evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node)
        const parent = node.parentElement ? getComputedStyle(node.parentElement) : null
        return {
          background: style.backgroundColor,
          inheritsColor: parent ? style.color === parent.color : false,
        }
      }),
    )
    for (const style of styles) {
      expect(style.background).toBe('rgba(0, 0, 0, 0)')
      expect(style.inheritsColor).toBe(true)
    }
    const variables = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement)
      return ['--color-indigo-500', '--color-purple-500', '--color-blue-500'].map((name) =>
        root.getPropertyValue(name).trim(),
      )
    })
    expect(variables).toEqual(['', '', ''])
  })

  test('semantic tokens resolve to the Ink & Lime palette', async ({ page }) => {
    await page.goto('/dev/tokens')
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(background).toBe('rgb(11, 12, 14)')
  })
})
