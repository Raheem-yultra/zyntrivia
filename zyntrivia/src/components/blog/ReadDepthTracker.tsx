'use client'

import { useEffect } from 'react'

import { track } from '@/lib/analytics'

/** Fires blog_read_75 once when the reader passes 75% of the article body. */
export function ReadDepthTracker({ slug, targetId }: { slug: string; targetId: string }) {
  useEffect(() => {
    const article = document.getElementById(targetId)
    if (!article) return
    let fired = false
    let frame = 0

    const check = () => {
      frame = 0
      const rect = article.getBoundingClientRect()
      const read = (window.innerHeight - rect.top) / rect.height
      if (!fired && read >= 0.75) {
        fired = true
        track('blog_read_75', { slug })
        window.removeEventListener('scroll', onScroll)
      }
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    check()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [slug, targetId])

  return null
}
