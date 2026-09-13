/**
 * コンテンツから
 *  1. モバイル用 JSON (apps/mobile/src/data/content.json)
 *  2. Web 検索用インデックス (apps/web/public/search-index.json)
 * を生成する。
 */
import fs from "node:fs";
import path from "node:path";
import {
  listDomains,
  listUseCases,
  listPatterns,
  listPhases,
  listMethods,
  listGuides,
  listIntersections,
  listReferences,
  resolveContentRoot,
} from "../packages/content-core/src/index";

const root = resolveContentRoot();

// ── 1. mobile bundle ───────────────────────────────────────────
const data = {
  generatedAt: new Date().toISOString(),
  domains: listDomains(root).map((meta) => ({
    ...meta,
    useCases: listUseCases(meta.id, root).map((uc) => ({ ...uc.data, body: uc.content })),
  })),
  process: {
    methods: listMethods(root),
    phases: listPhases(undefined, root).map((p) => ({ ...p.data, body: p.content })),
  },
  patterns: listPatterns(root).map((p) => ({ ...p.data, body: p.content })),
  guides: listGuides(root).map((g) => ({ ...g.data, body: g.content })),
};

const outDir = path.resolve("apps/mobile/src/data");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "content.json");
fs.writeFileSync(outFile, JSON.stringify(data, null, 2) + "\n");

// ── 2. search index ────────────────────────────────────────────
function excerpt(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 800);
}

const searchIndex = [
  ...listDomains(root).map((d) => ({
    url: `/domains/${d.id}`,
    section: "領域",
    title: `${d.icon ?? ""} ${d.name}`.trim(),
    summary: d.description,
    body: "",
  })),
  ...listDomains(root).flatMap((d) =>
    listUseCases(d.id, root).map((uc) => ({
      url: `/domains/${d.id}/${uc.data.id}`,
      section: "ユースケース",
      title: uc.data.title,
      summary: uc.data.summary,
      body: excerpt(uc.content),
    }))
  ),
  ...listPhases(undefined, root).map((p) => ({
    url: `/process/${p.data.method}/${p.data.id}`,
    section: `工程 / ${p.data.method}`,
    title: p.data.title,
    summary: `人間と AI の役割分担`,
    body: excerpt(p.content),
  })),
  ...listPatterns(root).map((p) => ({
    url: `/patterns/${p.data.id}`,
    section: "パターン",
    title: p.data.title,
    summary: p.data.summary,
    body: excerpt(p.content),
  })),
  ...listGuides(root).map((g) => ({
    url: `/guide/${g.data.id}`,
    section: "ガイド",
    title: g.data.title,
    summary: g.data.summary,
    body: excerpt(g.content),
  })),
  ...listIntersections(root).map((ix) => ({
    url: `/matrix/${ix.data.domain}/${ix.data.method}/${ix.data.phase}`,
    section: "交点ノート",
    title: ix.data.title,
    summary: `${ix.data.domain} × ${ix.data.method}/${ix.data.phase}`,
    body: excerpt(ix.content),
  })),
  ...listReferences(root).map((r) => ({
    url: `/references/${r.data.id}`,
    section: "リファレンス",
    title: r.data.title,
    summary: r.data.summary,
    body: excerpt(r.content),
  })),
];

const searchFile = path.resolve("apps/web/public/search-index.json");
fs.writeFileSync(searchFile, JSON.stringify(searchIndex) + "\n");

// ── 3. RSS feed ────────────────────────────────────────────────
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zixuniaowu.github.io/PDE-AI-Knowledge-Base"
).replace(/\/$/, "");

const feedItems = [
  ...listGuides(root).map((g) => ({
    title: `[ガイド] ${g.data.title}`,
    url: `/guide/${g.data.id}/`,
    summary: g.data.summary,
    updated: g.data.updated,
  })),
  ...listDomains(root).flatMap((d) =>
    listUseCases(d.id, root).map((uc) => ({
      title: `[${d.name}] ${uc.data.title}`,
      url: `/domains/${d.id}/${uc.data.id}/`,
      summary: uc.data.summary,
      updated: uc.data.updated,
    }))
  ),
  ...listPatterns(root).map((p) => ({
    title: `[パターン] ${p.data.title}`,
    url: `/patterns/${p.data.id}/`,
    summary: p.data.summary,
    updated: p.data.updated,
  })),
].sort((a, b) => b.updated.localeCompare(a.updated));

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>PDE Knowledge Base</title>
<link>${siteUrl}/</link>
<description>あらゆる領域と開発プロセスにAIを組み込むための実践ナレッジベース</description>
<language>ja</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${feedItems
  .map(
    (it) => `<item>
<title>${it.title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</title>
<link>${siteUrl}${it.url}</link>
<description>${it.summary.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</description>
<pubDate>${new Date(it.updated + "T00:00:00Z").toUTCString()}</pubDate>
<guid>${siteUrl}${it.url}</guid>
</item>`
  )
  .join("\n")}
</channel></rss>
`;
const feedFile = path.resolve("apps/web/public/feed.xml");
fs.writeFileSync(feedFile, feedXml);

// ── 4. llms.txt (AI可読インデックス) ───────────────────────────
const llms = [
  "# PDE — Product Design Engineer Knowledge Base",
  "",
  "> PDE（Product Design Engineer）は、製品の課題を考え、インタラクションを設計し、プロダクションコードを自分で書ける人。このナレッジベースは、領域×工程のマトリクスで PDE の実践知を整理する。",
  "",
  "## Guide (start here)",
  ...listGuides(root).map((g) => `- [${g.data.title}](${siteUrl}/guide/${g.data.id}/): ${g.data.summary}`),
  "",
  "## Domains",
  ...listDomains(root).map((d) => `- [${d.name}](${siteUrl}/domains/${d.id}/): ${d.description}`),
  "",
  "## Use cases",
  ...listDomains(root).flatMap((d) =>
    listUseCases(d.id, root).map(
      (uc) => `- [${d.name} / ${uc.data.title}](${siteUrl}/domains/${d.id}/${uc.data.id}/): ${uc.data.summary}`
    )
  ),
  "",
  "## Process phases",
  ...listPhases(undefined, root).map(
    (p) => `- [${p.data.method} / ${p.data.title}](${siteUrl}/process/${p.data.method}/${p.data.id}/): 人間とAIの役割分担と受け入れ基準`
  ),
  "",
  "## Patterns",
  ...listPatterns(root).map((p) => `- [${p.data.title}](${siteUrl}/patterns/${p.data.id}/): ${p.data.summary}`),
  "",
  "## Intersection notes (domain x process)",
  ...listIntersections(root).map(
    (ix) => `- [${ix.data.title}](${siteUrl}/matrix/${ix.data.domain}/${ix.data.method}/${ix.data.phase}/)`
  ),
  "",
  "## References",
  ...listReferences(root).map(
    (r) => `- [${r.data.title}](${siteUrl}/references/${r.data.id}/): ${r.data.summary}`
  ),
  "",
].join("\n");
const llmsFile = path.resolve("apps/web/public/llms.txt");
fs.writeFileSync(llmsFile, llms);

console.log(
  `✅ ${outFile} (domains: ${data.domains.length}, phases: ${data.process.phases.length}, patterns: ${data.patterns.length}, guides: ${data.guides.length})\n✅ ${searchFile} (${searchIndex.length} entries)\n✅ ${feedFile} (${feedItems.length} items)\n✅ ${llmsFile}`
);
