import { defineConfig, devices } from '@playwright/test'

import { loadTestEnv } from './tests/env'

loadTestEnv()

// https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Tests share one database (leads, rate limits, posts), so they run one at a time.
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      // PW_CHANNEL=chrome|msedge runs against an installed browser instead of a download.
      use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    reuseExistingServer: true,
    url: 'http://localhost:3000',
    timeout: 180_000,
  },
})
