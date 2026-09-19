import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const PAGES = [
  '/',
  '/work',
  '/work/stocksense',
  '/services',
  '/services/automation',
  '/process',
  '/about',
  '/blog',
  '/blog/when-to-replace-a-spreadsheet-with-an-internal-tool',
  '/blog/automations-that-fail-loudly',
  '/blog/topic/automation',
  '/quote',
  '/quote/thanks',
  '/privacy',
  '/terms',
  '/this-page-does-not-exist',
]

async function audit(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(TAGS)
    // The Turnstile widget is a third-party iframe outside our control.
    .exclude('iframe[src*="challenges.cloudflare.com"]')
    .analyze()
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    targets: violation.nodes.slice(0, 5).map((node) => node.target.join(' ')),
  }))
}

test.describe('Accessibility (axe, WCAG 2.2 AA)', () => {
  for (const path of PAGES) {
    test(`${path} has no violations`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const violations = await audit(page)
      expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    })
  }

  test('/quote steps 2 and 3 have no violations, including error states', async ({ page }) => {
    await page.goto('/quote?type=automation&step=2')
    await expect(page.getByRole('radio', { name: 'Just exploring' })).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
    expect(await audit(page)).toEqual([])

    await page.getByRole('radio', { name: 'Just exploring' }).click()
    await page.getByRole('radio', { name: 'An idea' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL(/step=3/)
    await page.getByRole('button', { name: 'Send request' }).click()
    await expect(page.getByLabel('Work email')).toHaveAttribute('aria-invalid', 'true')
    const violations = await audit(page)
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
  })

  test('mobile menu has no violations when open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
    const violations = await audit(page)
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
  })

  test('FAQ answers have no violations when expanded', async ({ page }) => {
    await page.goto('/')
    for (const question of await page.locator('[data-section="faq"]').getByRole('button').all()) {
      await question.click()
    }
    const violations = await audit(page)
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
  })
})
