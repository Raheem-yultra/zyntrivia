import { ImageResponse } from 'next/og'

import { verifyOgSignature } from '@/lib/og'

// Values mirror design tokens (docs/02-DESIGN-SYSTEM.md §2); next/og can't read CSS variables.
const TOKENS = {
  bg: '#0B0C0E',
  surface: '#141619',
  border: '#262A30',
  borderInput: '#727984',
  text: '#F4F5F4',
  subtle: '#959AA2',
  accent: '#C6F24E',
  signal: '#4ADE9E',
}

async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    // Without a browser user agent, Google Fonts serves TrueType, which next/og needs.
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@96,700&text=${encodeURIComponent(text)}`,
      { next: { revalidate: 60 * 60 * 24 * 30 } },
    ).then((response) => response.text())
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    return url ? await fetch(url).then((response) => response.arrayBuffer()) : null
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const title = (params.get('title') ?? '').slice(0, 120)
  const eyebrow = (params.get('eyebrow') ?? '').slice(0, 40)
  if (!title || !verifyOgSignature(title, eyebrow, params.get('sig') ?? '')) {
    return new Response('Invalid signature', { status: 400 })
  }

  const font = await loadFont(`Zyntrivia${eyebrow}${title}`)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: TOKENS.bg,
        color: TOKENS.text,
        fontFamily: font ? 'Bricolage' : 'sans-serif',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 700 }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${TOKENS.subtle}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: TOKENS.accent,
            fontSize: 26,
          }}
        >
          Z
        </div>
        Zyntrivia
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 820 }}>
        {eyebrow && <div style={{ fontSize: 28, color: TOKENS.accent }}>{eyebrow}</div>}
        <div
          style={{ fontSize: title.length > 60 ? 58 : 72, lineHeight: 1.05, letterSpacing: -1.5 }}
        >
          {title}
        </div>
      </div>

      {/* Flow Canvas motif: three nodes, the last one complete. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {['Request', 'Build', 'Launch'].map((label, index) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 && (
              <div
                style={{
                  width: 56,
                  height: 3,
                  background: index === 2 ? TOKENS.accent : TOKENS.borderInput,
                }}
              />
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 20px',
                borderRadius: 10,
                background: TOKENS.surface,
                border: `2px solid ${index === 2 ? TOKENS.accent : TOKENS.border}`,
                fontSize: 24,
                color: TOKENS.text,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 6, background: TOKENS.signal }} />
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: font ? [{ name: 'Bricolage', data: font, weight: 700, style: 'normal' }] : undefined,
      headers: { 'Cache-Control': 'public, max-age=86400, immutable' },
    },
  )
}
