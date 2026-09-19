'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { buttonClasses } from '@/components/ui/Button'
import { analyticsAttrs } from '@/lib/analytics'
import { cn } from '@/lib/cn'

/** Homepage only: appears on small screens after half the page has scrolled past. */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setVisible(scrollable > 0 && window.scrollY / scrollable >= 0.5)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div
        data-sticky-cta
        inert={!visible}
        className={cn(
          'fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-bg pt-3 transition-transform duration-[220ms] ease-out md:hidden',
          'pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]',
          // Clears the iOS home indicator so the button is not half under it.
          'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
          visible ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <Link
          href="/quote"
          className={cn(buttonClasses('primary', 'lg'), 'w-full')}
          {...analyticsAttrs('cta_click', { location: 'sticky_mobile', label: 'Request a quote' })}
        >
          Request a quote
        </Link>
      </div>
    </>
  )
}
