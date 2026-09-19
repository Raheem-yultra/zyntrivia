import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

/** Strips scripts, event handlers, and external references from an uploaded SVG. */
export function sanitizeSvg(svg: string): string {
  const { window } = new JSDOM('')
  const purify = DOMPurify(window)
  return purify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['foreignObject', 'use'],
  })
}
