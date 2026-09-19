import type { Page } from '@playwright/test'

export type CapturedEvent = { event: string; props: Record<string, unknown> }

const MARKER = '[analytics:json]'

/**
 * Records the events `track()` logs outside production. An init script mirrors each
 * `console.info('[analytics]', event, props)` call as a JSON string, so the event can be
 * read synchronously even when the page navigates straight after it fires.
 * Call before the first `page.goto`.
 */
export async function captureAnalytics(page: Page) {
  const events: CapturedEvent[] = []

  await page.addInitScript((marker) => {
    const original = console.info.bind(console)
    console.info = (...args: unknown[]) => {
      original(...args)
      if (args[0] === '[analytics]')
        original(marker, JSON.stringify({ event: args[1], props: args[2] }))
    }
  }, MARKER)

  page.on('console', (message) => {
    const text = message.text()
    if (!text.startsWith(MARKER)) return
    try {
      events.push(JSON.parse(text.slice(MARKER.length).trim()) as CapturedEvent)
    } catch {
      // Not an analytics payload.
    }
  })

  const has = (event: string, props: Record<string, unknown> = {}) =>
    events.some(
      (captured) =>
        captured.event === event &&
        Object.entries(props).every(([key, value]) => captured.props[key] === value),
    )

  return { events, has }
}
