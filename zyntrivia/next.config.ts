import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
const isProduction = process.env.NODE_ENV === 'production'

const csp = (directives: Record<string, string[]>) =>
  Object.entries(directives)
    .map(([name, values]) => [name, ...values].join(' '))
    .join('; ')

/*
 * Site CSP. 'unsafe-inline' stays for Next's inline bootstrap and JSON-LD (a nonce
 * pipeline would force every static page to render dynamically). The directives that
 * stop common attacks are enforced: object-src, base-uri, form-action, frame-ancestors,
 * and an origin allowlist limited to Plausible and Cloudflare Turnstile.
 */
const SITE_CSP = csp({
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    ...(isProduction ? [] : ["'unsafe-eval'"]),
    'https://plausible.io',
    'https://challenges.cloudflare.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'", 'data:'],
  'media-src': ["'self'", 'blob:'],
  'connect-src': ["'self'", 'https://plausible.io', 'https://challenges.cloudflare.com'],
  'frame-src': ["'self'", 'https://challenges.cloudflare.com'],
  // 'self' so the Payload admin can show live previews.
  'frame-ancestors': ["'self'"],
  'worker-src': ["'self'", 'blob:'],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'object-src': ["'none'"],
  ...(isProduction ? { 'upgrade-insecure-requests': [] } : {}),
})

// The StockSense demo is a prebuilt SPA running Postgres in WebAssembly.
const DEMO_CSP = SITE_CSP.replace(
  "'self' 'unsafe-inline'",
  "'self' 'unsafe-inline' 'wasm-unsafe-eval'",
)

// Payload admin: the code field loads the Monaco editor from jsDelivr.
const ADMIN_CSP = csp({
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
  'media-src': ["'self'", 'blob:'],
  'connect-src': ["'self'", 'https://cdn.jsdelivr.net'],
  'worker-src': ["'self'", 'blob:'],
  'frame-src': ["'self'"],
  'frame-ancestors': ["'self'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'object-src': ["'none'"],
})

const COMMON_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  ...(isProduction
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['jsdom'],
  experimental: {
    // Two root layouts (site and Payload admin) need app/global-not-found.tsx for unmatched URLs.
    globalNotFound: true,
  },
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  async headers() {
    // Later rules override earlier ones for the same header key.
    return [
      {
        source: '/:path*',
        headers: [...COMMON_HEADERS, { key: 'Content-Security-Policy', value: SITE_CSP }],
      },
      {
        source: '/projects/stocksense-demo/:path*',
        headers: [{ key: 'Content-Security-Policy', value: DEMO_CSP }],
      },
      { source: '/admin', headers: [{ key: 'Content-Security-Policy', value: ADMIN_CSP }] },
      { source: '/admin/:path*', headers: [{ key: 'Content-Security-Policy', value: ADMIN_CSP }] },
    ]
  },
  async redirects() {
    // v1 routes that no longer exist. All other v1 paths (/work, /services, /process,
    // /about, /quote, /privacy, /terms, /work/:slug) are kept in v2.
    return [
      { source: '/studio', destination: '/admin', permanent: true },
      { source: '/studio/:path*', destination: '/admin', permanent: true },
      { source: '/home', destination: '/', permanent: true },
    ]
  },
  async rewrites() {
    // Deep links inside the StockSense demo SPA fall back to its index.html. afterFiles
    // runs after public files are matched, so real assets are served directly.
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/projects/stocksense-demo',
          destination: '/projects/stocksense-demo/index.html',
        },
        {
          source: '/projects/stocksense-demo/',
          destination: '/projects/stocksense-demo/index.html',
        },
        {
          source: '/projects/stocksense-demo/:path*',
          destination: '/projects/stocksense-demo/index.html',
        },
      ],
      fallback: [],
    }
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
