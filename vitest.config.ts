import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/content-core/tests/**/*.test.ts"],
  },
});
