/**
 * Content-Security-Policy.
 *
 * script-src keeps 'unsafe-inline'/'unsafe-eval' because Next's bootstrap, the
 * JSON-LD <script> blocks, and the self-contained StockSense demo SPA all need
 * them — a nonce pipeline would mean going dynamic on every static page. The
 * directives that actually stop the common attacks are still enforced:
 * frame-ancestors (clickjacking), object-src (plugin injection), base-uri (base
 * tag hijack), form-action (exfil), and an allowlist that blocks any external
 * script origin other than Plausible.
 *
 * frame-src allows cal.com because /quote embeds the booking widget.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://plausible.io",
  "frame-src 'self' https://cal.com https://*.cal.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // The StockSense demo is a static SPA embedded at public/projects/stocksense-demo.
  // afterFiles rewrites run AFTER static/public files are checked, so real assets
  // (JS/CSS/wasm) are served directly and only unknown client routes fall back to
  // index.html — the standard SPA deep-link fix, with no effect on asset loading.
  async rewrites() {
    return {
      afterFiles: [
        { source: '/projects/stocksense-demo', destination: '/projects/stocksense-demo/index.html' },
        { source: '/projects/stocksense-demo/', destination: '/projects/stocksense-demo/index.html' },
        { source: '/projects/stocksense-demo/:path*', destination: '/projects/stocksense-demo/index.html' },
      ],
    };
  },
};

export default nextConfig;
