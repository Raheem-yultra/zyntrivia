import { expect, test } from '@playwright/test'

import { captureAnalytics } from '../helpers/analytics'
import { waitForHomepage } from '../helpers/ready'

// Sales funnel order: hook, proof, pain, help, how it works, what you get, objections, ask.
const HOME_SECTIONS = [
  'hero',
  'proof',
  'before-after',
  'services',
  'process',
  'handover',
  'faq',
  'final-cta',
]

test.describe('Homepage', () => {
  test('renders every funnel section in order', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const sections = await page
      .locator('main [data-section]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-section')))
    expect(sections).toEqual(HOME_SECTIONS)
  })

  test('primary CTA fires cta_click with its location', async ({ page }) => {
    const analytics = await captureAnalytics(page)
    await page.goto('/')
    await waitForHomepage(page)
    await page
      .locator('[data-section="hero"]')
      .getByRole('link', { name: 'Request a quote' })
      .click()
    await expect(page).toHaveURL(/\/quote/)
    await expect.poll(() => analytics.has('cta_click', { location: 'hero' })).toBe(true)
  })

  test('the secondary hero CTA jumps to how it works', async ({ page }) => {
    await page.goto('/')
    await waitForHomepage(page)
    await page
      .locator('[data-section="hero"]')
      .getByRole('link', { name: 'See how it works' })
      .click()
    await expect(page).toHaveURL(/#how-it-works$/)
    await expect(page.getByRole('heading', { level: 2, name: 'How it works' })).toBeInViewport()
  })

  test('before/after slider responds to the keyboard', async ({ page }) => {
    await page.goto('/')
    await waitForHomepage(page)
    const slider = page.getByRole('slider', { name: 'Compare before and after' })
    await slider.focus()
    await expect(slider).toHaveAttribute('aria-valuenow', '50')
    await page.keyboard.press('ArrowRight')
    await expect(slider).toHaveAttribute('aria-valuenow', '55')
    await page.keyboard.press('Home')
    await expect(slider).toHaveAttribute('aria-valuenow', '0')
    await page.keyboard.press('End')
    await expect(slider).toHaveAttribute('aria-valuenow', '100')
  })

  test('FAQ accordion expands and reports faq_open', async ({ page }) => {
    const analytics = await captureAnalytics(page)
    await page.goto('/')
    await waitForHomepage(page)
    const question = page.locator('[data-section="faq"]').getByRole('button').first()
    await question.click()
    await expect(question).toHaveAttribute('aria-expanded', 'true')
    await expect.poll(() => analytics.has('faq_open')).toBe(true)
  })

  test('reduced motion shows the Flow Canvas final state with no pulse', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    const nodes = page.locator('[data-flow-node]:visible')
    await expect(nodes.first()).toHaveAttribute('data-state', 'done')
    const states = await nodes.evaluateAll((items) =>
      items.map((item) => item.getAttribute('data-state')),
    )
    expect(states.every((state) => state === 'done')).toBe(true)
    await expect(page.locator('.animate-flow-pulse')).toHaveCount(0)
    await page
      .locator('[data-section="hero"]')
      .screenshot({ path: test.info().outputPath('hero-reduced-motion.png') })
    await context.close()
  })
})

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('menu traps focus, closes on Escape, and restores focus', async ({ page }) => {
    await page.goto('/')
    await waitForHomepage(page)
    const openButton = page.getByRole('button', { name: 'Open menu' })
    await openButton.click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog).toBeVisible()

    // A native modal <dialog> makes the page behind it inert. Tabbing past the last item may
    // briefly move focus to the browser's own UI (activeElement is <body>), which is expected;
    // what must never happen is focus landing on the page behind the menu.
    let visitedInside = 0
    for (let index = 0; index < 16; index++) {
      await page.keyboard.press('Tab')
      const where = await page.evaluate(() => {
        const active = document.activeElement
        if (!active || active === document.body) return 'browser'
        return active.closest('dialog[open]') ? 'dialog' : 'behind'
      })
      expect(where).not.toBe('behind')
      if (where === 'dialog') visitedInside++
    }
    expect(visitedInside).toBeGreaterThan(8)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(openButton).toBeFocused()
  })

  test('sticky CTA appears after half the homepage has scrolled', async ({ page }) => {
    await page.goto('/')
    await waitForHomepage(page)
    const bar = page.locator('[data-sticky-cta]')
    await expect(bar).toHaveAttribute('inert', '')
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6))
    await expect(bar).not.toHaveAttribute('inert', '')
  })

  test('sticky CTA is homepage only', async ({ page }) => {
    await page.goto('/work')
    await expect(page.locator('[data-sticky-cta]')).toHaveCount(0)
  })
})

test.describe('Pages', () => {
  for (const path of [
    '/work',
    '/work/stocksense',
    '/services',
    '/services/automation',
    '/process',
    '/about',
    '/blog',
    '/privacy',
    '/terms',
  ]) {
    test(`${path} renders with a single h1 and no horizontal scroll`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }

  test('work filters sync to the URL and show an empty state', async ({ page }) => {
    await page.goto('/work')
    await page.getByRole('button', { name: 'Marketplaces' }).click()
    await expect(page).toHaveURL(/industry=marketplaces/)
    await expect(page.getByRole('heading', { level: 2, name: 'ResourceAble' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'StockSense' })).toHaveCount(0)

    await page.getByRole('button', { name: 'AI assistants' }).click()
    await expect(page.getByText('No projects match these filters.')).toBeVisible()
    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page).toHaveURL(/\/work$/)
  })

  test('unknown URLs return 404 with helpful links', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('link', { name: 'See our work' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Read the blog' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Request a quote' }).first()).toBeVisible()
  })

  test('v1 Sanity studio URL redirects to the admin', async ({ request }) => {
    const response = await request.get('/studio', { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(response.headers()['location']).toBe('/admin')
  })

  test('RSS, sitemap, and robots are served', async ({ request }) => {
    const rss = await request.get('/rss.xml')
    expect(rss.headers()['content-type']).toContain('application/rss+xml')
    expect(await rss.text()).toContain('<item>')

    const sitemap = await request.get('/sitemap.xml')
    expect(await sitemap.text()).toContain('/work/stocksense')

    const robots = await request.get('/robots.txt')
    expect(await robots.text()).toContain('Disallow: /admin')
  })
})
