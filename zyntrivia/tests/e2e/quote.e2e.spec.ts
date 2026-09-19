import { expect, test, type Page } from '@playwright/test'

import { QUOTE_LIMIT, hashClientKey } from '../../src/lib/rate-limit'
import { captureAnalytics } from '../helpers/analytics'
import { testPayload } from '../helpers/payload'
import { waitForHomepage, waitForQuoteWizard } from '../helpers/ready'

const EMAIL_DOMAIN = 'e2e.example.com'
const DESCRIPTION = 'We track stock in three spreadsheets and reorders keep getting missed.'

/** Each test submits from its own documentation-range IP, so rate limits never collide. */
function testIp(): string {
  return `198.51.100.${Math.floor(Math.random() * 250) + 1}`
}

const uniqueEmail = (label: string) => `${label}-${Date.now()}@${EMAIL_DOMAIN}`

async function cleanup(ips: string[] = []) {
  const payload = await testPayload()
  await payload.delete({
    collection: 'quote-requests',
    where: { email: { contains: `@${EMAIL_DOMAIN}` } },
    overrideAccess: true,
  })
  if (ips.length > 0) {
    await payload.delete({
      collection: 'rate-limit-hits',
      where: { key: { in: ips.map(hashClientKey) } },
      overrideAccess: true,
    })
  }
}

async function leadsFor(email: string) {
  const payload = await testPayload()
  const { docs } = await payload.find({
    collection: 'quote-requests',
    where: { email: { equals: email } },
    overrideAccess: true,
  })
  return docs
}

/** Turnstile's test site key issues a token without interaction; wait for it before sending. */
async function waitForTurnstile(page: Page) {
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, {
    timeout: 30_000,
  })
}

async function answerStepsOneAndTwo(page: Page) {
  await page.goto('/quote')
  await page.getByRole('radio', { name: /^Copying data between apps/ }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page).toHaveURL(/step=2/)
  await page.getByRole('radio', { name: 'In 1–3 months' }).click()
  await page.getByRole('radio', { name: 'An existing tool to replace' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page).toHaveURL(/step=3/)
}

test.describe('Quote funnel', () => {
  const usedIps: string[] = []

  test.beforeAll(async () => {
    await cleanup()
  })

  test.afterAll(async () => {
    await cleanup(usedIps)
  })

  test('homepage tile to thanks page stores the lead and fires every step event', async ({
    page,
  }) => {
    const ip = testIp()
    usedIps.push(ip)
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': ip })
    const analytics = await captureAnalytics(page)
    const email = uniqueEmail('funnel')

    await page.goto('/?utm_source=e2e&utm_medium=test&utm_campaign=funnel')
    await waitForHomepage(page)
    await page
      .locator('[data-section="final-cta"]')
      .getByRole('link', { name: /^Copying data between apps/ })
      .click()

    // The tile answers step 1, so the wizard opens on step 2.
    await expect(page).toHaveURL(/\/quote\?.*step=2/)
    await expect(page.getByRole('radio', { name: 'In 1–3 months' })).toBeVisible()
    await expect.poll(() => analytics.has('cta_click', { location: 'final' })).toBe(true)
    await expect
      .poll(() => analytics.has('quote_step_view', { step: 2, type: 'automation' }))
      .toBe(true)

    await page.getByRole('radio', { name: 'In 1–3 months' }).click()
    await page.getByRole('radio', { name: 'An existing tool to replace' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL(/step=3/)
    await expect.poll(() => analytics.has('quote_step_complete', { step: 2 })).toBe(true)
    await expect.poll(() => analytics.has('quote_step_view', { step: 3 })).toBe(true)

    await page.getByLabel('Name').fill('E2E Tester')
    await page.getByLabel('Work email').fill(email)
    await page.getByLabel('Company').fill('Example Supplies')
    await page.getByLabel('What should the software do?').fill(DESCRIPTION)
    await page.getByLabel('How did you hear about us?').selectOption('search')
    await waitForTurnstile(page)
    await page.getByRole('button', { name: 'Send request' }).click()

    await expect(page).toHaveURL(/\/quote\/thanks\?type=automation/)
    await expect(page.getByRole('heading', { level: 1, name: 'Request received' })).toBeVisible()
    await expect
      .poll(() => analytics.has('quote_submit', { type: 'automation', timeline: '1-3-months' }))
      .toBe(true)
    // P4-4: the conversion is counted once, even though the thanks page renders after it.
    await page.waitForLoadState('networkidle')
    expect(analytics.events.filter((captured) => captured.event === 'quote_submit')).toHaveLength(1)

    const [lead] = await leadsFor(email)
    expect(lead).toMatchObject({
      status: 'new',
      projectType: 'automation',
      timeline: '1-3-months',
      stage: 'replace-tool',
      name: 'E2E Tester',
      company: 'Example Supplies',
      description: DESCRIPTION,
      source: 'search',
    })
    expect(lead?.meta?.utmSource).toBe('e2e')
    expect(lead?.meta?.utmCampaign).toBe('funnel')
    expect(lead?.meta?.userAgentHash).toMatch(/^[0-9a-f]{32}$/)
  })

  test('can be completed with the keyboard alone', async ({ page }) => {
    const ip = testIp()
    usedIps.push(ip)
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': ip })
    const email = uniqueEmail('keyboard')
    await page.goto('/quote')
    await waitForQuoteWizard(page)

    // Tab from the top of the page to the first choice.
    for (let index = 0; index < 40; index++) {
      await page.keyboard.press('Tab')
      const role = await page.evaluate(() => document.activeElement?.getAttribute('role'))
      if (role === 'radio') break
    }
    await expect(page.getByRole('radio', { name: /^Copying data between apps/ })).toBeFocused()
    await page.keyboard.press('ArrowDown')
    // Arrow keys move the selection and the roving tabindex with it, so wait for focus to
    // land on the new tile before tabbing out of the group.
    await expect(page.getByRole('radio', { name: /^Spreadsheets nobody trusts/ })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.getByRole('radio', { name: /^Spreadsheets nobody trusts/ })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Continue' })).toBeFocused()
    await page.keyboard.press('Enter')

    // Focus moves to the new step's heading.
    await expect(page.getByRole('heading', { name: /Step 2 of 3/ })).toBeFocused()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Space')
    await expect(page.getByRole('radio', { name: 'As soon as possible' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await page.keyboard.press('Tab')
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('radio', { name: 'An existing tool to replace' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.getByRole('radio', { name: 'An existing tool to replace' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Back' })).toBeFocused()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    await expect(page.getByRole('heading', { name: /Step 3 of 3/ })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Name')).toBeFocused()
    await page.keyboard.type('Keyboard Tester')
    await page.keyboard.press('Tab')
    await page.keyboard.type(email)
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('What should the software do?')).toBeFocused()
    await page.keyboard.type(DESCRIPTION)
    await waitForTurnstile(page)

    // Enter in a text input submits the form.
    await page.getByLabel('Name').focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/quote\/thanks/)
    expect(await leadsFor(email)).toHaveLength(1)
  })

  test('shows inline errors and keeps answers when going back', async ({ page }) => {
    const analytics = await captureAnalytics(page)
    await page.goto('/quote')
    await page.evaluate(() => window.sessionStorage.clear())
    await page.reload()
    // Continue only does anything once the wizard has taken over from the server fallback.
    await waitForQuoteWizard(page)

    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(
      page.getByRole('radiogroup', { name: 'What would you like help with?' }),
    ).toHaveAccessibleDescription('Choose what you’re building.')
    await expect.poll(() => analytics.has('quote_error', { kind: 'validation' })).toBe(true)

    await page.getByRole('radio', { name: /^Copying data between apps/ }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('radio', { name: 'Just exploring' }).click()
    await page.getByRole('radio', { name: 'An idea' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL(/step=3/)

    await page.getByLabel('Name').fill('A')
    await page.getByLabel('Work email').fill('not-an-email')
    await page.getByLabel('What should the software do?').fill('Too short')
    await page.getByRole('button', { name: 'Send request' }).click()
    await expect(page.getByLabel('Work email')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Work email')).toHaveAccessibleDescription(
      'Enter a valid email address.',
    )
    await expect(page.getByLabel('What should the software do?')).toHaveAccessibleDescription(
      /at least 30 characters\)/,
    )

    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page).toHaveURL(/step=2/)
    await expect(page.getByRole('radio', { name: 'Just exploring' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    // Browser history works too, and the typed details survive.
    await page.goBack()
    await expect(page).toHaveURL(/step=3/)
    await expect(page.getByLabel('Name')).toHaveValue('A')
  })

  test('a bookmarked later step sends people back to the first unanswered one', async ({
    page,
  }) => {
    await page.goto('/quote')
    await page.evaluate(() => window.sessionStorage.clear())
    await page.goto('/quote?step=3')
    await expect(page).toHaveURL(/step=1/)
    await expect(
      page.getByRole('radiogroup', { name: 'What would you like help with?' }),
    ).toBeVisible()
  })

  test('the sixth request in an hour is rejected and not stored', async ({ page }) => {
    const ip = testIp()
    usedIps.push(ip)
    const payload = await testPayload()
    for (let index = 0; index < QUOTE_LIMIT.limit; index++) {
      await payload.create({
        collection: 'rate-limit-hits',
        data: { key: hashClientKey(ip), bucket: QUOTE_LIMIT.bucket },
        overrideAccess: true,
      })
    }

    await page.setExtraHTTPHeaders({ 'x-forwarded-for': ip })
    const analytics = await captureAnalytics(page)
    const email = uniqueEmail('limited')
    await answerStepsOneAndTwo(page)
    await page.getByLabel('Name').fill('Rate Limited')
    await page.getByLabel('Work email').fill(email)
    await page.getByLabel('What should the software do?').fill(DESCRIPTION)
    await waitForTurnstile(page)
    await page.getByRole('button', { name: 'Send request' }).click()

    await expect(page.getByText(/several requests in the last hour/)).toBeVisible()
    await expect(page).toHaveURL(/step=3/)
    await expect.poll(() => analytics.has('quote_error', { kind: 'rate_limit' })).toBe(true)
    expect(await leadsFor(email)).toHaveLength(0)
  })

  test('a filled honeypot looks successful but stores nothing', async ({ page }) => {
    const ip = testIp()
    usedIps.push(ip)
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': ip })
    const email = uniqueEmail('bot')
    await answerStepsOneAndTwo(page)
    await page.getByLabel('Name').fill('Bot')
    await page.getByLabel('Work email').fill(email)
    await page.getByLabel('What should the software do?').fill(DESCRIPTION)
    await page.locator('#quote-website').fill('https://spam.example.com', { force: true })
    await page.getByRole('button', { name: 'Send request' }).click()

    await expect(page).toHaveURL(/\/quote\/thanks/)
    expect(await leadsFor(email)).toHaveLength(0)
  })
})
