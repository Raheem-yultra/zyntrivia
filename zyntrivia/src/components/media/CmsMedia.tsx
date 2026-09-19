import Image from 'next/image'

import type { Media } from '@/payload-types'
import { cn } from '@/lib/cn'
import { SITE_URL } from '@/lib/site'

import { VideoLoop } from './VideoLoop'

type Props = {
  media: Media | number | null | undefined
  poster?: Media | number | null
  sizes: string
  className?: string
  priority?: boolean
}

export function isMediaDoc(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

/** Payload prefixes URLs with serverURL; same-site files are served as relative paths. */
export function mediaSrc(url: string): string {
  try {
    const parsed = new URL(url, SITE_URL)
    return parsed.origin === new URL(SITE_URL).origin ? `${parsed.pathname}${parsed.search}` : url
  } catch {
    return url
  }
}

/** Renders an uploaded image (next/image), SVG, or muted video loop. */
export function CmsMedia({ media, poster, sizes, className, priority = false }: Props) {
  if (!isMediaDoc(media) || !media.url) return null
  const src = mediaSrc(media.url)

  if (media.mimeType?.startsWith('video/')) {
    return (
      <VideoLoop
        src={src}
        type={media.mimeType}
        poster={isMediaDoc(poster) && poster.url ? mediaSrc(poster.url) : undefined}
        label={media.alt}
        width={media.width ?? 1600}
        height={media.height ?? 900}
        className={className}
      />
    )
  }

  if (media.mimeType === 'image/svg+xml') {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- SVGs are sanitized on upload and don't need optimisation.
      <img
        src={src}
        alt={media.alt}
        width={media.width ?? undefined}
        height={media.height ?? undefined}
        loading={priority ? 'eager' : 'lazy'}
        className={cn('h-auto w-full', className)}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={media.alt}
      width={media.width ?? 1600}
      height={media.height ?? 900}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-full', className)}
    />
  )
}
