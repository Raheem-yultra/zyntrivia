import { expect, type Page } from '@playwright/test'

/**
 * Interactive islands only respond after hydration; before that, links do full page loads and
 * the delegated analytics listener isn't attached. These wait for a signal that only exists
 * once the client code has run.
 */

/** The hero sequence marks its first node done after hydration and the connectors load. */
export async function waitForHomepage(page: Page) {
  await expect(page.locator('[data-flow-node][data-state="done"]').first()).toBeAttached()
}

/** The wizard's server fallback has no radiogroup; the hydrated wizard does. */
export async function waitForQuoteWizard(page: Page) {
  await expect(page.locator('form').getByRole('radiogroup').first()).toBeVisible()
}
