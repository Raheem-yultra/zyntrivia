import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { MARK_FRAME_PATH, MARK_Z_PATH } from '@/components/layout/LogoMark'

const PUBLIC = path.resolve(__dirname, '..', 'public')
const favicon = readFileSync(path.join(PUBLIC, 'favicon.svg'), 'utf8')

describe('favicon', () => {
  it('draws the same mark as the navbar logo', () => {
    // Regenerate with `node scripts/generate-icons.mjs` after changing the mark.
    expect(favicon).toContain(`d="${MARK_FRAME_PATH}"`)
    expect(favicon).toContain(`d="${MARK_Z_PATH}"`)
  })

  it('is a small vector, not a wrapped raster', () => {
    expect(favicon.length).toBeLessThan(2_000)
    expect(favicon).not.toContain('<image')
  })

  it('has every raster size the page and manifest point at', () => {
    const png = (name: string) => readFileSync(path.join(PUBLIC, name))
    // A PNG stores its dimensions at bytes 16-23 of the IHDR chunk.
    const dimensions = (name: string) => [png(name).readUInt32BE(16), png(name).readUInt32BE(20)]
    expect(dimensions('favicon-96x96.png')).toEqual([96, 96])
    expect(dimensions('apple-touch-icon.png')).toEqual([180, 180])
    expect(dimensions('web-app-manifest-192x192.png')).toEqual([192, 192])
    expect(dimensions('web-app-manifest-512x512.png')).toEqual([512, 512])
  })

  it('packs 16, 32, and 48px images into favicon.ico', () => {
    const ico = readFileSync(path.join(PUBLIC, 'favicon.ico'))
    const count = ico.readUInt16LE(4)
    const sizes = Array.from({ length: count }, (_, index) => ico[6 + index * 16])
    expect(sizes).toEqual([16, 32, 48])
  })
})
