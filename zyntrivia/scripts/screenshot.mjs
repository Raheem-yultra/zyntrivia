// Dev helper: full-page screenshots for design review.
// Usage: node scripts/screenshot.mjs <outDir> <width> <path> [path...]
import { chromium } from '@playwright/test'
import path from 'node:path'

const [outDir, widthArg, ...paths] = process.argv.slice(2)
const width = Number(widthArg) || 1440
const base = process.env.BASE_URL ?? 'http://localhost:3000'

// PW_CHANNEL=chrome|msedge uses an installed browser instead of Playwright's download.
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined })
const context = await browser.newContext({
  viewport: { width, height: 900 },
  reducedMotion: process.env.REDUCED_MOTION ? 'reduce' : 'no-preference',
})
const page = await context.newPage()
const errors = []
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})
page.on('pageerror', (error) => errors.push(error.message))

for (const route of paths) {
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 180_000 })
  // Scroll through the page so lazy images load before a full-page capture.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(Number(process.env.WAIT_MS ?? 5000))
  const name = `${route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home'}-${width}.png`
  if (process.env.SECTIONS) {
    const sections = await page.locator('[data-section]').all()
    for (const section of sections) {
      const id = await section.getAttribute('data-section')
      await section.screenshot({ path: path.join(outDir, name.replace('.png', `-${id}.png`)) })
    }
  } else {
    await page.screenshot({ path: path.join(outDir, name), fullPage: !process.env.VIEWPORT_ONLY })
  }
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  console.log(`${route} -> ${name} (scrollWidth ${scrollWidth} / viewport ${width})`)
}
if (errors.length) console.log(`console errors:\n${errors.join('\n')}`)
await browser.close()
