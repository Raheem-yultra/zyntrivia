// Captures real screenshots of the bundled StockSense demo into src/seed/assets.
// Run with the dev server up: PW_CHANNEL=chrome node scripts/capture-stocksense.mjs
import { chromium } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const assets = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/seed/assets')
const base = process.env.BASE_URL ?? 'http://localhost:3000'

const SHOTS = [
  { name: 'stocksense-dashboard', link: 'Dashboard', ready: /Recent activity/ },
  { name: 'stocksense-inventory', link: 'Stock Levels', ready: /(PER|PKG)-\d{4}/ },
  { name: 'stocksense-expiry', link: 'Expiry Monitor', ready: /(PER|PKG)-\d{4}/ },
  { name: 'stocksense-transfers', link: 'Transfers', ready: /Discrepancy|Confirmed|Pending/ },
  { name: 'stocksense-ledger', link: 'Audit Trail', ready: /(PER|PKG)-\d{4}/ },
]

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`${base}/projects/stocksense-demo`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /enter as owner/i }).click()
await page.waitForTimeout(8000)

for (const shot of SHOTS) {
  await page.getByRole('link', { name: shot.link, exact: true }).first().click()
  // Queries run against Postgres in WebAssembly; wait for real rows, not skeletons.
  const ready = await page
    .locator('main')
    .getByText(shot.ready)
    .first()
    .waitFor({ timeout: 45_000 })
    .then(() => true)
    .catch(() => false)
  if (!ready) {
    console.log(`skipped ${shot.name}: view didn't finish loading`)
    continue
  }
  await page.waitForTimeout(1500)
  // Crop to the content so short views don't end in empty space.
  const height = await page.evaluate(() => {
    const main = document.querySelector('main') ?? document.body
    const bottoms = Array.from(main.querySelectorAll('*')).map(
      (el) => el.getBoundingClientRect().bottom,
    )
    return Math.min(900, Math.max(560, Math.ceil(Math.max(0, ...bottoms)) + 32))
  })
  await page.screenshot({
    path: path.join(assets, `${shot.name}.png`),
    clip: { x: 0, y: 0, width: 1440, height },
  })
  console.log(`captured ${shot.name} (${height}px tall)`)
}
await browser.close()
