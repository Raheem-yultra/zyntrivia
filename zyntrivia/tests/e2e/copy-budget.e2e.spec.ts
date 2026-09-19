import { expect, test, type Page } from '@playwright/test'

/**
 * docs/01-PRD.md §4–5 and CLAUDE.md: word budgets are hard limits, every homepage section has a
 * visual, and marketing copy avoids the banned patterns. Runs against live CMS content, so an
 * edit that breaks a budget fails here before it ships.
 *
 * Markup contract:
 * - `data-budget="N"`: the element's text must be N words or fewer.
 * - `data-budget-skip`: text inside is left out of the enclosing budget (e.g. "Before"/"After" terms).
 * - `data-visual`: a diagram, screenshot, UI fragment, or interactive element. Text inside is not copy.
 */

const MARKETING_PAGES = [
  '/',
  '/work',
  '/work/stocksense',
  '/work/resourceable',
  '/work/workflowai',
  '/services',
  '/services/web-apps',
  '/services/automation',
  '/services/internal-tools',
  '/services/ai-agents',
  '/process',
  '/about',
  '/quote',
]

const HEADLINE_WORDS = 10
const BODY_WORDS = 45
const MAX_SENTENCES = 2
const BANNED_WORDS =
  /\b(cutting-edge|seamless(ly)?|leverage[sd]?|empower(s|ed|ing)?|unlock(s|ed|ing)?)\b/i
// Saying we don't publish prices is fine; showing an amount or a rate is not.
const PRICING =
  /(\$|€|£)\s?\d|\d\s?(USD|EUR|GBP)\b|\bper (hour|month|project)\b|\/(hr|mo)\b|\bstarting at\b|\bfrom \$/i

type Violation = { rule: string; text: string; detail?: string }

/** Everything below runs in the page: count words the way `countWords` in src/lib/words.ts does. */
async function collectViolations(page: Page): Promise<Violation[]> {
  return page.evaluate(
    ({ HEADLINE_WORDS, BODY_WORDS, MAX_SENTENCES, banned, pricing }) => {
      const violations: { rule: string; text: string; detail?: string }[] = []
      const bannedRe = new RegExp(banned, 'i')
      const pricingRe = new RegExp(pricing, 'i')
      const main = document.querySelector('main')
      if (!main) return [{ rule: 'landmark', text: 'No <main> element' }]

      const inVisual = (element: Element) => Boolean(element.closest('[data-visual]'))
      const words = (text: string) => {
        const trimmed = text.replace(/\s+/g, ' ').trim()
        return trimmed ? trimmed.split(' ').length : 0
      }
      const copyText = (element: Element) => {
        const clone = element.cloneNode(true) as Element
        clone
          .querySelectorAll('[data-budget-skip], [data-visual], .sr-only')
          .forEach((node) => node.remove())
        return (clone.textContent ?? '').replace(/\s+/g, ' ').trim()
      }

      for (const element of main.querySelectorAll('[data-budget]')) {
        const limit = Number(element.getAttribute('data-budget'))
        const text = copyText(element)
        if (words(text) > limit) {
          violations.push({ rule: `budget ≤${limit}`, text, detail: `${words(text)} words` })
        }
      }

      for (const heading of main.querySelectorAll('h1, h2, h3')) {
        if (inVisual(heading)) continue
        const text = copyText(heading)
        if (words(text) > HEADLINE_WORDS) {
          violations.push({
            rule: `headline ≤${HEADLINE_WORDS}`,
            text,
            detail: `${words(text)} words`,
          })
        }
        if (text.length > 3 && text === text.toUpperCase() && /[A-Z]/.test(text)) {
          violations.push({ rule: 'sentence case', text })
        }
      }

      for (const paragraph of main.querySelectorAll('p, dd')) {
        if (inVisual(paragraph) || paragraph.closest('.prose')) continue
        const text = copyText(paragraph)
        if (words(text) > BODY_WORDS) {
          violations.push({ rule: `body ≤${BODY_WORDS}`, text, detail: `${words(text)} words` })
        }
        const sentences = text
          .split(/(?<=[.!?])\s+(?=[A-Z0-9“"])/)
          .filter((part) => part.trim().length > 0)
        if (sentences.length > MAX_SENTENCES) {
          violations.push({
            rule: `≤${MAX_SENTENCES} sentences`,
            text,
            detail: `${sentences.length} sentences`,
          })
        }
      }

      const copy = [...main.querySelectorAll('h1, h2, h3, p, dd, li, a, button')]
        .filter((element) => !inVisual(element))
        .map(copyText)
      for (const text of new Set(copy)) {
        if (text.includes('!')) violations.push({ rule: 'no exclamation marks', text })
        if (bannedRe.test(text)) violations.push({ rule: 'banned word', text })
        if (pricingRe.test(text)) violations.push({ rule: 'no pricing', text })
        if (/\s→$/.test(text)) violations.push({ rule: 'no → appended to links', text })
      }

      // Gradient text and ALL-CAPS eyebrows are banned (docs/02-DESIGN-SYSTEM.md anti-slop list).
      for (const element of main.querySelectorAll('*')) {
        const style = getComputedStyle(element)
        if (style.backgroundClip === 'text' || style.webkitBackgroundClip === 'text') {
          violations.push({ rule: 'no gradient text', text: copyText(element) })
        }
        if (style.textTransform === 'uppercase' && !inVisual(element) && copyText(element)) {
          violations.push({ rule: 'no all-caps labels', text: copyText(element) })
        }
      }

      return violations
    },
    {
      HEADLINE_WORDS,
      BODY_WORDS,
      MAX_SENTENCES,
      banned: BANNED_WORDS.source,
      pricing: PRICING.source,
    },
  )
}

test.describe('Copy rules', () => {
  for (const path of MARKETING_PAGES) {
    test(`${path} stays within word budgets and copy rules`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const violations = await collectViolations(page)
      expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    })
  }

  test('every homepage section contains a visual', async ({ page }) => {
    await page.goto('/')
    const sections = await page.locator('main [data-section]').evaluateAll((nodes) =>
      nodes.map((node) => ({
        section: node.getAttribute('data-section'),
        visuals: node.querySelectorAll('[data-visual]').length,
      })),
    )
    expect(sections.length).toBeGreaterThan(0)
    expect(sections.filter((section) => section.visuals === 0)).toEqual([])
  })

  test('each homepage section has at most one primary CTA', async ({ page }) => {
    await page.goto('/')
    const counts = await page.locator('main [data-section]').evaluateAll((nodes) =>
      nodes.map((node) => ({
        section: node.getAttribute('data-section'),
        primary: [...node.querySelectorAll('a, button')].filter(
          (element) => element.textContent?.trim() === 'Request a quote',
        ).length,
      })),
    )
    expect(counts.filter((entry) => entry.primary > 1)).toEqual([])
  })

  test('the quote form has no budget field on any step', async ({ page }) => {
    const budgetControls = page.locator('form').getByRole('radiogroup', { name: /budget/i })
    const budgetInputs = page.locator('form [name*="budget" i], form [id*="budget" i]')

    await page.goto('/quote?type=automation&step=2')
    await page.getByRole('radio', { name: 'Just exploring' }).click()
    await page.getByRole('radio', { name: 'An idea' }).click()
    for (const step of [2, 3]) {
      await expect(
        page.getByRole('heading', { name: new RegExp(`Step ${step} of 3`) }),
      ).toBeAttached()
      await expect(budgetControls).toHaveCount(0)
      await expect(page.locator('form').getByLabel(/budget/i)).toHaveCount(0)
      await expect(budgetInputs).toHaveCount(0)
      if (step === 2) await page.getByRole('button', { name: 'Continue' }).click()
    }

    await page.goto('/quote?step=1')
    await expect(page.locator('form').getByText(/budget/i)).toHaveCount(0)
  })
})
