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
];

const searchFile = path.resolve("apps/web/public/search-index.json");
fs.writeFileSync(searchFile, JSON.stringify(searchIndex) + "\n");

console.log(
  `✅ ${outFile} (domains: ${data.domains.length}, phases: ${data.process.phases.length}, patterns: ${data.patterns.length}, guides: ${data.guides.length})\n✅ ${searchFile} (${searchIndex.length} entries)`
);
