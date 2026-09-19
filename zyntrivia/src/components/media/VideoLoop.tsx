'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  src: string
  type: string
  poster?: string
  label: string
  width: number
  height: number
  className?: string
}

/**
 * Muted product loop: nothing downloads until it scrolls near the viewport, and it
 * never autoplays for people who prefer reduced motion.
 */
export function VideoLoop({ src, type, poster, label, width, height, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      setReduced(query.matches)
      if (query.matches) video.pause()
    }
    syncMotion()
    query.addEventListener('change', syncMotion)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || query.matches) return
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      query.removeEventListener('change', syncMotion)
    }
  }, [])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      width={width}
      height={height}
      aria-label={label}
      controls={reduced}
      className={cn('block h-auto w-full', className)}
    >
      <source src={src} type={type} />
    </video>
  )
}
