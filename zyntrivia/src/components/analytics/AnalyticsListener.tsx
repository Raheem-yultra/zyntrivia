'use client'

import { useEffect } from 'react'

import {
  ANALYTICS_ATTRIBUTE,
  ATTRIBUTION_STORAGE_KEY,
  parseAnalyticsAttr,
  track,
  type AnalyticsEvent,
  type AnalyticsEvents,
  type Attribution,
} from '@/lib/analytics'

function captureAttribution() {
  try {
    if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return
    const params = new URLSearchParams(window.location.search)
    const attribution: Attribution = {
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
      landingPage: window.location.pathname,
      referrer: document.referrer || undefined,
    }
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Storage unavailable (private mode); attribution is optional.
  }
}

/** One delegated click listener for every element with data-analytics. */
export function AnalyticsListener() {
  useEffect(() => {
    captureAttribution()
    const onClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element ? event.target.closest(`[${ANALYTICS_ATTRIBUTE}]`) : null
      const parsed = parseAnalyticsAttr(target?.getAttribute(ANALYTICS_ATTRIBUTE) ?? null)
      if (parsed) {
        track(parsed.event as AnalyticsEvent, parsed.props as AnalyticsEvents[AnalyticsEvent])
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
