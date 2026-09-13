import { expect, test } from "@playwright/test";

/**
 * 内部リンクの死活チェック: 主要ページから辿れる内部リンクを
 * 実際に GET し、全て 200 であることを検証する（上限つき）。
 */
test("主要ページからの内部リンクが全て生きている", async ({ request }) => {
  const seeds = ["/", "/guide/", "/domains/", "/process/", "/patterns/", "/matrix/", "/references/glossary/"];
  const visited = new Set<string>();
  const queue: string[] = [...seeds];
  const MAX_PAGES = 120;
  const failures: string[] = [];

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    const res = await request.get(path);
    if (res.status() !== 200) {
      failures.push(`${res.status()} ${path}`);
      continue;
    }

    const html = await res.text();
    const hrefs = [...html.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (visited.has(href) || queue.includes(href)) continue;
      if (/\.(xml|txt|json|js|css|png|svg|webmanifest|ico|woff2?)$/.test(href)) continue;
      if (href.startsWith("//")) continue;
      queue.push(href);
    }
  }

  expect(visited.size, "クロールしたページ数").toBeGreaterThanOrEqual(80);
  expect(failures, `死んでいるリンク: ${failures.join(", ")}`).toEqual([]);
});
