/**
 * 静的エクスポートされた apps/web/out を配信する最小 HTTP サーバー。
 * E2E テスト（Playwright）から使う。依存ゼロで動く。
 */
import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("apps/web/out");
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";

    const file = path.join(ROOT, pathname);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      res.end();
      return;
    }

    let target = file;
    let stat = await fs.stat(target).catch(() => null);
    if (stat?.isDirectory()) target = path.join(target, "index.html");

    let data;
    try {
      data = await fs.readFile(target);
    } catch {
      // 拡張子なしのパス → ディレクトリの index.html を試す
      data = await fs.readFile(path.join(ROOT, pathname, "index.html"));
      target = path.join(ROOT, pathname, "index.html");
    }

    res.writeHead(200, {
      "content-type": TYPES[path.extname(target)] ?? "application/octet-stream",
    });
    res.end(data);
  } catch {
    const notFound = await fs
      .readFile(path.join(ROOT, "404.html"))
      .catch(() => Buffer.from("404"));
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(notFound);
  }
});

server.listen(PORT, () => {
  console.log(`serving ${ROOT} on http://localhost:${PORT}`);
});
