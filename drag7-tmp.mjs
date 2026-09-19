import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
let ok = false;
for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
  await page.waitForTimeout(attempt * 600);
  const node = page.locator('.kg-graph circle[data-node="rag"]');
  await node.scrollIntoViewIfNeeded();
  const before = await node.boundingBox();
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
  await page.mouse.down();
  await page.mouse.move(before.x + 160, before.y + 120, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(1200);
  const after = await node.boundingBox();
  const dx = Math.round(after.x - before.x);
  const dy = Math.round(after.y - before.y);
  console.log(`attempt ${attempt}: dx=${dx}, dy=${dy} → ${Math.abs(dx) > 100 ? "✓ 拖拽后钉在原地" : "✗"}`);
  if (Math.abs(dx) > 100) ok = true;
}
await page.locator(".kg-wrap").screenshot({ path: "/tmp/opencode/shots/drag7-after.png" });
console.log(ok ? "结论: dev 拖拽正常" : "结论: dev 仍失败");
await browser.close();
