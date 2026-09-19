/**
 * 画面キャプチャ + ランタイムエラー検出。
 * 使い方: `pnpm shot`（dev サーバー http://localhost:3000 に対して実行。
 * SHOT_BASE_URL で対象を変更可）。出力は screenshots/（gitignore 済み）。
 *
 * ラウンドの締めとして playwright test の後に実行し、
 * 変更したページを目視確認するためのもの。
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.env.SHOT_BASE_URL ?? "http://localhost:3000";
const OUT = "screenshots";

const PAGES = [
  { path: "/", name: "home" },
  { path: "/guide/", name: "guide" },
  { path: "/guide/what-is-pde/", name: "guide-what-is" },
  { path: "/domains/", name: "domains" },
  { path: "/domains/education/", name: "domain-education" },
  { path: "/process/", name: "process" },
  { path: "/patterns/", name: "patterns" },
  { path: "/patterns/rag/", name: "pattern-rag" },
  { path: "/matrix/", name: "matrix" },
  { path: "/references/market-demand/", name: "market-demand" },
  { path: "/references/oss-experiment/", name: "oss-experiment" },
  { path: "/references/field-tips/", name: "field-tips" },
];

const errors = [];

async function capture(browser, { path, name }, scheme, viewport, suffix) {
  const ctx = await browser.newContext({ viewport, colorScheme: scheme });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`PAGEERROR ${path} (${suffix}): ${e.message.slice(0, 140)}`));
  page.on("console", (m) => {
    if (m.type() === "error") {
      errors.push(`CONSOLE ${path} (${suffix}): ${m.text().slice(0, 140)}`);
    }
  });
  // ネットワーク層の検出: chunk 404 やリソース読み込み失敗 = ステールキャスト/ビルド不整合のシグナル
  page.on("response", (res) => {
    if (res.status() >= 400 && res.url().includes("_next")) {
      errors.push(`HTTP ${res.status()} ${path} (${suffix}): ${res.url().split("/").pop()}`);
    }
  });
  page.on("requestfailed", (req) => {
    errors.push(`REQFAILED ${path} (${suffix}): ${req.url().split("/").pop()} ${req.failure()?.errorText ?? ""}`);
  });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500); // mermaid 等のクライアント描画を待つ
  await page.screenshot({ path: `${OUT}/${name}-${suffix}.png`, fullPage: true });
  await ctx.close();
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

const desktop = { width: 1280, height: 800 };
for (const p of PAGES) {
  await capture(browser, p, "light", desktop, "desktop-light");
  await capture(browser, p, "dark", desktop, "desktop-dark");
}
// モバイルはトップと主要ページだけ
for (const p of [PAGES[0], PAGES[5], PAGES[9]]) {
  await capture(browser, p, "light", { width: 390, height: 844 }, "mobile");
}

await browser.close();

const count = PAGES.length * 2 + 3;
if (errors.length > 0) {
  console.error(`❌ ${errors.length} runtime errors:\n${errors.join("\n")}`);
  process.exit(1);
}
console.log(`✅ ${count} screenshots → ${OUT}/ (runtime errors: 0)`);
