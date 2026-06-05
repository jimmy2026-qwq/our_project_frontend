import { defineConfig, devices } from '@playwright/test';

const frontendPort = Number(process.env.E2E_FRONTEND_PORT ?? 5173);
const baseURL =
  process.env.E2E_BASE_URL ?? `http://127.0.0.1:${frontendPort}`;

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.pw\.ts/,
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `PATH=/home/yqs/.local/node-v22.22.3-linux-x64/bin:$PATH npm run dev -- --host 127.0.0.1 --port ${frontendPort}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1365, height: 768 },
      },
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
      },
    },
  ],
});
