/**
 * モバイルアプリ用にコンテンツを 1 つの JSON にまとめる。
 * 出力: apps/mobile/src/data/content.json
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
  resolveContentRoot,
} from "../packages/content-core/src/index";

const root = resolveContentRoot();

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

console.log(
  `✅ ${outFile} を生成しました (domains: ${data.domains.length}, phases: ${data.process.phases.length}, patterns: ${data.patterns.length}, guides: ${data.guides.length})`
);
