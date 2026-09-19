'use client'

import { useEffect } from 'react'

import { track, type AnalyticsEvent, type AnalyticsEvents } from '@/lib/analytics'

export function TrackOnMount<E extends AnalyticsEvent>({
  event,
  props,
}: {
  event: E
  props: AnalyticsEvents[E]
}) {
  const key = JSON.stringify(props)
  useEffect(() => {
    track(event, JSON.parse(key) as AnalyticsEvents[E])
  }, [event, key])
  return null
}
