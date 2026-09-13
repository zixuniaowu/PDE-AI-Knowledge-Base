import { defineConfig } from "@playwright/test";

/**
 * E2E テスト: 静的エクスポートされたサイトを実際のブラウザで検証する。
 * 事前に `pnpm build:mobile-content && pnpm build:web` が必要。
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4173",
    locale: "ja-JP",
  },
  webServer: {
    command: "node scripts/serve-static.mjs",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
