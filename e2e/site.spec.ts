import { expect, test } from "@playwright/test";
import { p } from "./helpers";

test.describe("ホームとグローバルナビ", () => {
  test("ホームにタイトルと主要カードが表示される", async ({ page }) => {
    await page.goto(p("/"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Prompt-Driven");
    await expect(page.getByRole("link", { name: "始め方", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /領域 \d+ 件/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /工程 \d+ 件/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /パターン \d+ 件/ })).toBeVisible();
  });

  test("全ページでヘッダーとフッターが表示される", async ({ page }) => {
    for (const path of ["/guide/", "/domains/", "/process/", "/patterns/", "/matrix/", "/search/"]) {
      await page.goto(p(path));
      await expect(page.getByRole("link", { name: "PDE", exact: true })).toBeVisible();
      await expect(page.getByText("Code: MIT / Content: CC BY 4.0")).toBeVisible();
    }
  });
});

test.describe("ガイド", () => {
  test("ガイド一覧に 7 ステップ以上ある", async ({ page }) => {
    await page.goto(p("/guide/"));
    const cards = page.locator("a.card");
    expect(await cards.count()).toBeGreaterThanOrEqual(7);
  });

  test("STEP 1 に目次と本文、次の STEP へのリンクがある", async ({ page }) => {
    await page.goto(p("/guide/step-1-pick-a-task/"));
    await expect(page.getByRole("heading", { name: /STEP 1/ })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "目次" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "やることリスト" })).toBeVisible();
    await expect(page.getByRole("link", { name: /STEP 2.*→/ })).toBeVisible();
  });
});

test.describe("領域とユースケース", () => {
  test("領域一覧に 10 領域が表示される", async ({ page }) => {
    await page.goto(p("/domains/"));
    expect(await page.locator("a.card").count()).toBeGreaterThanOrEqual(10);
  });

  test("教育領域からユースケースを開き、プロンプト例と目次を確認", async ({ page }) => {
    await page.goto(p("/domains/education/"));
    await expect(page.getByRole("heading", { name: /教育/ })).toBeVisible();
    await page.locator("a.card", { hasText: "採点・フィードバック支援" }).click();
    await expect(page).toHaveURL(/\/domains\/education\/grading-assistant\/?$/);
    await expect(page.getByRole("heading", { name: /プロンプト（初版/ })).toBeVisible();
    await expect(page.locator("pre").first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: "目次" })).toBeVisible();
  });

  test("本文中の .md 相対リンクはルート URL に書き換えられる（回帰テスト）", async ({ page }) => {
    await page.goto(p("/domains/education/"));
    // index.md 内の ./use-cases/grading-assistant.md リンク
    const link = page.locator(".prose a", { hasText: "採点・フィードバック支援" });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/domains\/education\/grading-assistant\//);
  });
});

test.describe("工程と交点", () => {
  test("工程一覧に waterfall と agile の両方が表示される", async ({ page }) => {
    await page.goto(p("/process/"));
    await expect(page.getByRole("heading", { name: "工程" })).toBeVisible();
    for (const method of ["waterfall", "agile"]) {
      await expect(page.locator(".section-label", { hasText: method })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: /1\. 要件定義/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /1\. スプリントプランニング/ })).toBeVisible();
  });

  test("交点ページ（ノートあり）は交点ノートを表示する", async ({ page }) => {
    await page.goto(p("/matrix/healthcare/agile/review/"));
    await expect(page.getByText("交点ノート")).toBeVisible();
    await expect(page.getByText("多職種カンファレンス")).toBeVisible();
    await expect(page.getByText("人間の役割").first()).toBeVisible();
    await expect(page.getByText("AIの役割").first()).toBeVisible();
  });

  test("交点ページ（ノートなし）は執筆の導線を表示する", async ({ page }) => {
    await page.goto(p("/matrix/education/waterfall/deployment/"));
    await expect(page.getByText("この交点専用の知見はまだありません")).toBeVisible();
  });

  test("マトリクスに 10 領域 × 工程の表がある", async ({ page }) => {
    await page.goto(p("/matrix/"));
    expect(await page.locator("table.matrix tbody tr").count()).toBeGreaterThanOrEqual(10);
    await expect(page.locator("table.matrix thead th").first()).toContainText("領域");
  });
});

test.describe("パターン", () => {
  test("RAG パターンに適用ユースケースの逆リンクがある", async ({ page }) => {
    await page.goto(p("/patterns/rag/"));
    await expect(page.getByRole("heading", { name: "このパターンを使っているユースケース" })).toBeVisible();
    await expect(page.getByRole("link", { name: /採点・フィードバック支援/ })).toBeVisible();
  });
});

test.describe("検索", () => {
  test("キーワードで検索して該当ページが出る", async ({ page }) => {
    await page.goto(p("/search/"));
    const input = page.getByPlaceholder(/キーワードで検索/);
    await expect(input).toBeVisible();
    await input.fill("採点");
    await expect(page.getByRole("link", { name: /採点・フィードバック支援/ }).first()).toBeVisible();
  });
});

test.describe("リファレンス", () => {
  test("用語集が表示され、目次と内部リンクがある", async ({ page }) => {
    await page.goto(p("/references/glossary/"));
    await expect(page.getByRole("heading", { name: "用語集" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "目次" })).toBeVisible();
    await expect(page.getByText("ハルシネーション").first()).toBeVisible();
  });

  test("プロンプト小技集は 15 以上のコピペ例（コードブロック）を含む", async ({ page }) => {
    await page.goto(p("/references/prompt-tips/"));
    await expect(page.getByRole("heading", { name: "すぐ使えるプロンプト小技集" })).toBeVisible();
    expect(await page.locator(".prose pre").count()).toBeGreaterThanOrEqual(15);
  });
});

test.describe("404 とアセット", () => {
  test("存在しないページはカスタム 404 を返す", async ({ page }) => {
    await page.goto(p("/nonexistent-page/"), { waitUntil: "load" });
    await expect(page.getByText("ページが見つかりません")).toBeVisible();
  });

  test("RSS / llms.txt / sitemap / manifest / sw が配信される", async ({ request }) => {
    expect((await request.get(p("/feed.xml"))).status()).toBe(200);
    const llms = await request.get(p("/llms.txt"));
    expect(llms.status()).toBe(200);
    expect(await llms.text()).toContain("## Domains");
    const sitemap = await request.get(p("/sitemap.xml"));
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("<urlset");
    expect((await request.get(p("/manifest.json"))).status()).toBe(200);
    expect((await request.get(p("/sw.js"))).status()).toBe(200);
  });
});
