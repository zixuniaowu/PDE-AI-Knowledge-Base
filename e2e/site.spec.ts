import { expect, test } from "@playwright/test";
import { p } from "./helpers";

test.describe("ホームとグローバルナビ", () => {
  test("ホームにタイトルと全体マップが表示される", async ({ page }) => {
    await page.goto(p("/"));
    await expect(page.locator(".hero-kicker")).toContainText("FORWARD DEPLOYED ENGINEER");
    await expect(page.getByText(/課題ヒアリング/).first()).toBeVisible();
    await expect(page.locator(".hero-stat").first()).toBeVisible();
  });

  test("全ページでヘッダーとフッターが表示される", async ({ page }) => {
    for (const path of ["/guide/", "/domains/", "/process/", "/patterns/", "/matrix/"]) {
      await page.goto(p(path));
      await expect(page.getByRole("link", { name: "FDE", exact: true })).toBeVisible();
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
    await expect(page.getByRole("link", { name: /STEP 2/ }).first()).toBeVisible();
  });

  test("ホームにヒーロー統計とナレッジ数がある", async ({ page }) => {
    await page.goto(p("/"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText("現場に入り");
    await expect(page.locator(".hero-kicker")).toContainText("FORWARD DEPLOYED ENGINEER");
    await expect(page.getByText(/ナレッジ公開中/)).toBeVisible();
    await expect(page.getByText(/\d+ ページ/).first()).toBeVisible();
  });


  test("ホームに市場分析の統計グラフと出所リンクがある", async ({ page }) => {
    await page.goto(p("/"));
    await expect(page.getByText("FDE の市場（週次で追跡）")).toBeVisible();
    expect(await page.locator(".chart-slice").count()).toBeGreaterThanOrEqual(5);
    await expect(
      page.getByRole("link", { name: "フリーランススタート" }).first()
    ).toBeVisible();
    await expect(page.getByText("108.1 万円").first()).toBeVisible();
  });

  test("ホームに知識グラフ（スキルの点と線）がある", async ({ page }) => {
    await page.goto(p("/"));
    await expect(page.locator(".kg-graph circle").first()).toBeVisible();
    expect(await page.locator(".kg-graph circle").count()).toBeGreaterThanOrEqual(20);
    await expect(page.locator(".kg-graph a").first()).toBeVisible();
  });

  test("ホームに月別案件数バーと魚骨図がある", async ({ page }) => {
    await page.goto(p("/"));
    const bars = page.locator(".weekly-bars rect");
    await expect(bars.first()).toBeVisible();
    expect(await bars.count()).toBeGreaterThanOrEqual(1);
    await expect(page.getByText("週別 FDE 案件数（直近 6 週）")).toBeVisible();
    await expect(page.locator(".market-sources tbody tr")).toHaveCount(4);
    await expect(page.getByText("レバテックフリーランス").first()).toBeVisible();
    const fish = page.locator(".fishbone circle");
    await expect(fish.first()).toBeVisible();
    expect(await fish.count()).toBeGreaterThanOrEqual(1);
  });

  test("知識グラフのノードはドラッグで動かせる", async ({ page }) => {
    await page.goto(p("/"));
    const node = page.locator('.kg-graph circle[data-node="rag"]');
    await node.scrollIntoViewIfNeeded();
    const before = await node.boundingBox();
    await page.mouse.move(before!.x + before!.width / 2, before!.y + before!.height / 2);
    await page.mouse.down();
    await page.mouse.move(before!.x + 150, before!.y + 110, { steps: 10 });
    await page.mouse.up();
    const after = await node.boundingBox();
    expect(Math.abs(after!.x - before!.x)).toBeGreaterThan(40);
    expect(Math.abs(after!.y - before!.y)).toBeGreaterThan(20);
  });

  test("FDE とはページに概念図（mermaid SVG）が描画される", async ({ page }) => {
    await page.goto(p("/guide/what-is-pde/"));
    await expect(page.locator(".mermaid-figure svg")).toHaveCount(2, { timeout: 15000 });
    await expect(page.locator(".mermaid-figure svg").first()).toBeVisible();
  });
});

test.describe("領域とユースケース", () => {
  test("領域一覧に 10 領域が表示される", async ({ page }) => {
    await page.goto(p("/domains/"));
    expect(await page.locator("a.card").count()).toBeGreaterThanOrEqual(10);
  });

  test("教育領域からユースケースを開き、プロンプト例と目次を確認", async ({ page }) => {
    await page.goto(p("/domains/education/"));
    await expect(page.getByRole("heading", { level: 1, name: /教育/ })).toBeVisible();
    await page.locator("a.card", { hasText: "採点支援ツール（教育）" }).click();
    await expect(page).toHaveURL(/\/domains\/education\/grading-assistant\/?$/);
    await expect(page.getByRole("heading", { name: "製品の中核機能とプロンプト" })).toBeVisible();
    await expect(page.locator("pre").first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: "目次" })).toBeVisible();
  });

  test("本文中の .md 相対リンクはルート URL に書き換えられる（回帰テスト）", async ({ page }) => {
    await page.goto(p("/domains/education/"));
    // index.md 内の ./use-cases/grading-assistant.md リンク
    const link = page.locator(".prose a", { hasText: "採点支援ツール（教育）" });
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

  test("工程一覧に waterfall の V モデル図がある", async ({ page }) => {
    await page.goto(p("/process/"));
    const v = page.locator(".vmodel-wrap svg");
    await expect(v.first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator(".vmodel-wrap svg rect").nth(7)).toBeVisible();
    await expect(page.getByText("UAT（受入テスト）").first()).toBeVisible();
  });

  test("交点ページ（ノートあり）は交点ノートを表示する", async ({ page }) => {
    await page.goto(p("/matrix/healthcare/agile/review/"));
    await expect(page.getByText("交点ノート")).toBeVisible();
    await expect(page.getByText("多職種カンファレンス")).toBeVisible();
    await expect(page.getByText("FDEの仕事").first()).toBeVisible();
    await expect(page.getByText("AIツールの使いどころ").first()).toBeVisible();
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
    await expect(page.getByRole("link", { name: /採点支援ツール（教育）/ })).toBeVisible();
  });
});

test.describe("リファレンス", () => {
  test("用語集が表示され、目次と内部リンクがある", async ({ page }) => {
    await page.goto(p("/references/glossary/"));
    await expect(page.getByRole("heading", { name: "用語集" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "目次" })).toBeVisible();
    await expect(page.getByText("ハルシネーション").first()).toBeVisible();
  });

  test("需要分析ページに図（パイプライン・タイムライン等）がある", async ({ page }) => {
    await page.goto(p("/references/market-demand/"));
    await expect(page.getByRole("heading", { name: "FDE の市場需要分析" })).toBeVisible();
    await expect
      .poll(async () => page.locator(".mermaid-figure svg").count(), { timeout: 20000 })
      .toBeGreaterThanOrEqual(4);
  });

  test("プロンプト小技集は 15 以上のコピペ例（コードブロック）を含む", async ({ page }) => {
    await page.goto(p("/references/prompt-tips/"));
    await expect(page.getByRole("heading", { name: "すぐ使えるプロンプト小技集" })).toBeVisible();
    expect(await page.locator(".prose pre").count()).toBeGreaterThanOrEqual(15);
  });

  test("市場需要分析ページが表示され、旧称 Prompt-Driven は存在しない", async ({ page }) => {
    await page.goto(p("/references/market-demand/"));
    await expect(page.getByRole("heading", { name: "FDE の市場需要分析" })).toBeVisible();
    await expect(page.getByText("フリーランススタート").first()).toBeVisible();
    const oldTerm = await page.content().then((c) => c.includes("Prompt-Driven"));
    expect(oldTerm).toBe(false);
  });

  test("クラウド別サービスマップが表示される（AWS/Azure/GCP/SAP）", async ({ page }) => {
    await page.goto(p("/references/cloud-ai-services/"));
    await expect(page.getByRole("heading", { name: "クラウド別 AI 導入サービスマップ" })).toBeVisible();
    await expect(page.getByText("Bedrock").first()).toBeVisible();
    await expect(page.getByText("SAP").first()).toBeVisible();
  });

  test("業務プロセスページが ERP 流の 6 プロセスを含む", async ({ page }) => {
    await page.goto(p("/references/business-processes/"));
    await expect(page.getByRole("heading", { name: "業務プロセスと AI の接点" })).toBeVisible();
    for (const term of ["O2C", "購買（P2P", "S/4HANA", "freee"]) {
      await expect(page.getByText(term).first()).toBeVisible();
    }
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
