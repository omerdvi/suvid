import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:3001',
    ...devices['Galaxy S9+']
  },
  webServer: {
    command: 'npm run build && npm run start',
    env: {
      SUVID_DATA_DIR: 'test-results/e2e-data',
      SUVID_ADMIN_KEY: 'e2e-admin-key'
    },
    url: 'http://127.0.0.1:3001',
    reuseExistingServer: false,
    timeout: 120_000
  }
});
