/** Analytics events — docs/03-ARCHITECTURE.md §7. Plausible, cookieless. */

export type CtaLocation =
  | 'hero'
  | 'nav'
  | 'sticky_mobile'
  | 'services'
  | 'work'
  | 'final'
  | 'blog_inline'
  | 'blog_end'
  | 'case_study'
  | 'footer'
  | 'page'

export type QuoteErrorKind = 'validation' | 'turnstile' | 'rate_limit' | 'server'

export type AnalyticsEvents = {
  cta_click: { location: CtaLocation; label: string }
  secondary_cta_click: { location: string; label: string }
  quote_step_view: { step: number; type: string }
  quote_step_complete: { step: number; type: string }
  quote_submit: { type: string; timeline: string }
  quote_error: { kind: QuoteErrorKind }
  case_study_view: { slug: string }
  demo_open: { slug: string }
  repo_open: { slug: string }
  blog_read_75: { slug: string }
  faq_open: { question_id: string }
}

export type AnalyticsEvent = keyof AnalyticsEvents

type PlausibleProps = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: PlausibleProps }) => void) & {
      q?: unknown[]
    }
  }
}

export function track<E extends AnalyticsEvent>(event: E, props: AnalyticsEvents[E]): void {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics]', event, props)
    return
  }
  window.plausible?.(event, { props })
}

export const ANALYTICS_ATTRIBUTE = 'data-analytics'

/**
 * Attach to any link or button rendered on the server; a single delegated listener
 * (components/analytics/AnalyticsListener) sends the event on click.
 */
export function analyticsAttrs<E extends AnalyticsEvent>(
  event: E,
  props: AnalyticsEvents[E],
): { [ANALYTICS_ATTRIBUTE]: string } {
  return { [ANALYTICS_ATTRIBUTE]: JSON.stringify({ event, props }) }
}

export function parseAnalyticsAttr(
  value: string | null,
): { event: AnalyticsEvent; props: AnalyticsEvents[AnalyticsEvent] } | null {
  if (!value) return null
  try {
    const parsed: unknown = JSON.parse(value)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'event' in parsed &&
      'props' in parsed &&
      typeof parsed.event === 'string'
    ) {
      return parsed as { event: AnalyticsEvent; props: AnalyticsEvents[AnalyticsEvent] }
    }
  } catch {
    // Ignore malformed attributes.
  }
  return null
}

/** Campaign attribution captured on landing and attached to quote requests. */
export type Attribution = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  landingPage?: string
  referrer?: string
}

export const ATTRIBUTION_STORAGE_KEY = 'zyn:attribution'
