import { cn } from '@/lib/cn'

/**
 * Geometry of the mark, in a 32-unit box. `public/favicon.svg` and the raster icons are
 * generated from these same two paths by `scripts/generate-icons.mjs`; `logo-mark.test.ts`
 * fails if the favicon drifts from them.
 */
export const MARK_FRAME_PATH = 'M11 3H3v8M21 3h8v8M29 21v8h-8M3 21v8h8'
export const MARK_Z_PATH = 'M10.5 10.5h11l-11 11h11'

type Props = {
  className?: string
  /** Draws the Z in and out on a loop. Only for loading states (see `BrandLoader`). */
  animated?: boolean
}

/** Bracketed frame with a Z, drawn in token colors. Decorative: callers supply any label. */
export function LogoMark({ className, animated = false }: Props) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={cn('size-7 shrink-0', className)} fill="none">
      <path
        d={MARK_FRAME_PATH}
        className="stroke-text-subtle"
        strokeWidth="2.25"
        strokeLinecap="square"
      />
      <path
        d={MARK_Z_PATH}
        // Normalised length so the draw animation can use unit dash values.
        pathLength={1}
        className={cn('stroke-accent', animated && 'animate-mark-draw')}
        strokeWidth="2.75"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  )
}
