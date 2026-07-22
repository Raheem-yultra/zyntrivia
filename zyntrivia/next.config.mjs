/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
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
