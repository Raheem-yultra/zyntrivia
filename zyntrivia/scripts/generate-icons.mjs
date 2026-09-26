/**
 * Regenerates public/favicon.svg and the raster icons from the logo mark.
 *
 *   node scripts/generate-icons.mjs
 *
 * The geometry is the mark in src/components/layout/LogoMark.tsx; src/logo-mark.test.ts fails
 * if favicon.svg stops matching it. Colors are the dark-theme tokens from
 * docs/02-DESIGN-SYSTEM.md (bg, text-subtle, accent) — an image can't read CSS variables.
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')

const FRAME = 'M11 3H3v8M21 3h8v8M29 21v8h-8M3 21v8h8'
const Z = 'M10.5 10.5h11l-11 11h11'
const BG = '#0B0C0E'
const FRAME_COLOR = '#959AA2'
const Z_COLOR = '#C6F24E'

const round = (n) => Number(n.toFixed(3))

/**
 * Frame and Z are sized independently, in the 32-unit box, about its centre. Widths are what
 * you see on screen (the script divides out the scale), so they read as plain numbers.
 */
function iconSvg({ size, radius, frame, z }) {
  const dimensions = size ? ` width="${size}" height="${size}"` : ''
  const about = (scale) => `translate(16 16) scale(${scale}) translate(-16 -16)`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"${dimensions}>
  <rect width="32" height="32" rx="${radius}" fill="${BG}"/>
  <g fill="none" stroke-linecap="square">
    <path transform="${about(frame.scale)}" d="${FRAME}" stroke="${FRAME_COLOR}" stroke-width="${round(frame.width / frame.scale)}"/>
    <path transform="${about(z.scale)}" d="${Z}" stroke="${Z_COLOR}" stroke-width="${round(z.width / z.scale)}" stroke-linejoin="miter"/>
  </g>
</svg>
`
}

// Rounded tile, for places that show the icon as-is (browser tabs). At 16px a unit is half a
// pixel, so the Z is enlarged and both strokes are heavier than the navbar's to keep it legible.
const TILE = {
  radius: 7,
  frame: { scale: 0.86, width: 2.6 },
  z: { scale: 1.15, width: 3.6 },
}
// Full-bleed square: iOS and Android apply their own mask, so the corners must be filled.
const APPLE = {
  radius: 0,
  frame: { scale: 0.74, width: 2.03 },
  z: { scale: 0.74, width: 2.59 },
}
// Kept inside the maskable safe zone (a circle 80% of the icon's width).
const MASKABLE = {
  radius: 0,
  frame: { scale: 0.6, width: 1.65 },
  z: { scale: 0.6, width: 2.1 },
}

const png = (svg) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()

/** An .ico that embeds PNGs, which every current browser reads. */
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)

  let offset = header.length + images.length * 16
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size, 0)
    entry.writeUInt8(size, 1)
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)])
}

const write = async (name, data) => {
  await writeFile(path.join(PUBLIC, name), data)
  console.log(`${name.padEnd(30)} ${data.length} bytes`)
}

await write('favicon.svg', iconSvg({ ...TILE }))
await write('favicon-96x96.png', await png(iconSvg({ ...TILE, size: 96 })))
await write('apple-touch-icon.png', await png(iconSvg({ ...APPLE, size: 180 })))
await write('web-app-manifest-192x192.png', await png(iconSvg({ ...MASKABLE, size: 192 })))
await write('web-app-manifest-512x512.png', await png(iconSvg({ ...MASKABLE, size: 512 })))

const sizes = [16, 32, 48]
const images = await Promise.all(
  sizes.map(async (size) => ({ size, data: await png(iconSvg({ ...TILE, size })) })),
)
await write('favicon.ico', ico(images))
