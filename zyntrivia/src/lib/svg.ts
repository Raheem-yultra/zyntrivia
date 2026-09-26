import DOMPurify from 'dompurify'

/**
 * Strips scripts, event handlers, and external references from an uploaded SVG.
 *
 * jsdom is imported dynamically, not at module load. `Media.ts` (a Payload collection)
 * imports this file, and every Payload collection is part of the config the admin panel
 * loads to render `/admin` — so a top-level `import { JSDOM } from 'jsdom'` pulls jsdom's
 * whole module graph into that route even though sanitizeSvg only runs when someone
 * uploads an SVG. On Vercel that graph includes a version of html-encoding-sniffer whose
 * CJS code does a static `require()` of an ES-only file in @exodus/bytes, which Node
 * refuses — taking down all of /admin with an unrelated 500. Deferring the import here
 * confines that failure to SVG uploads instead of the whole CMS.
 *
 * That inner require() is unconditional in jsdom's own code (both the file
 * html-encoding-sniffer requires and the one jsdom requires directly at its own top
 * level), so an actual SVG upload may still hit the same error in production. Replacing
 * jsdom here with a lighter DOM implementation (e.g. linkedom) would remove it for good.
 */
export async function sanitizeSvg(svg: string): Promise<string> {
  const { JSDOM } = await import('jsdom')
  const { window } = new JSDOM('')
  const purify = DOMPurify(window)
  return purify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['foreignObject', 'use'],
  })
}
