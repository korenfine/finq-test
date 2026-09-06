import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4200',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Optional escape hatch: set PLAYWRIGHT_CHANNEL=chrome to drive an
        // already-installed system Chrome instead of Playwright's bundled
        // Chromium build — useful on hosts (e.g. old Linux distros) where
        // `playwright install` can't download a compatible browser at all.
        channel: process.env.PLAYWRIGHT_CHANNEL,
      },
    },
  ],
  webServer: [
    {
      command: 'npx nx serve server',
      url: 'http://localhost:3333/health',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npx nx serve client',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
