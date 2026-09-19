import { test, expect, type Page } from '@playwright/test'

import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()

    const context = await browser.newContext({ baseURL: 'http://localhost:3000' })
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await page.context().close()
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin$/)
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('lists quote requests for signed-in users', async () => {
    await page.goto('/admin/collections/quote-requests')
    await expect(page.locator('h1', { hasText: 'Quote Requests' }).first()).toBeVisible()
  })

  // Opens a seeded post: the create view autosaves a draft as soon as it loads.
  test('opens the post editor with its fields', async () => {
    await page.goto('/admin/collections/posts')
    await page.locator('.cell-title a').first().click()
    await expect(page).toHaveURL(/\/admin\/collections\/posts\/\d+/)
    // Blocks inside the rich text editor reuse field ids, so take the document-level field.
    await expect(page.locator('#field-title').first()).toBeVisible()
    await expect(page.locator('#field-excerpt')).toBeVisible()
    await expect(page.locator('#field-slug')).toBeVisible()
    await expect(page.locator('.rich-text-lexical').first()).toBeVisible()
  })

  test('the v1 Sanity studio link lands on the admin', async () => {
    await page.goto('/studio')
    await expect(page).toHaveURL(/\/admin$/)
  })
})
