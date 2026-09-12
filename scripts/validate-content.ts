import fs from "node:fs";
import path from "node:path";
import {
  listDomains,
  listUseCases,
  listPatterns,
  listPhases,
  listMethods,
  getDomain,
  resolveContentRoot,
} from "../packages/content-core/src/index";

const root = resolveContentRoot();
const errors: string[] = [];
const counts: Record<string, number> = {};

function step(name: string, fn: () => unknown) {
  try {
    const result = fn();
    const n = Array.isArray(result) ? result.length : 1;
    counts[name] = n;
  } catch (e) {
    errors.push(`- ${name}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// テンプレート存在チェック（新規参入の入口を守る）
const requiredTemplates = [
  "domains/_template/meta.json",
  "domains/_template/index.md",
  "domains/_template/use-cases/_template.md",
  "process/_template.md",
  "patterns/_template.md",
];
for (const t of requiredTemplates) {
  if (!fs.existsSync(path.join(root, t))) {
    errors.push(`- template missing: ${t}`);
  }
}

step("domains", () => listDomains(root));

const domains = safe(() => listDomains(root), []);
for (const d of domains) {
  step(`domains/${d.id}/use-cases`, () => listUseCases(d.id, root));
  step(`domains/${d.id}/index`, () => getDomain(d.id, root));
}

step("process/phases", () => listPhases(undefined, root));
step("process/methods", () => listMethods(root));
step("patterns", () => listPatterns(root));

// 参照整合チェック
const patterns = safe(() => listPatterns(root), []);
const patternIds = new Set(patterns.map((p) => p.data.id));
const phaseIds = new Set(
  safe(() => listPhases(undefined, root), []).map((p) => `${p.data.method}/${p.data.id}`)
);
const useCases = domains.flatMap((d) => safe(() => listUseCases(d.id, root), []));
for (const uc of useCases) {
  for (const pid of uc.data.aiPatterns) {
    if (!patternIds.has(pid)) {
      errors.push(`- ${uc.file}: aiPatterns "${pid}" が patterns/ に存在しません`);
    }
  }
  for (const link of uc.data.phaseLinks) {
    if (!phaseIds.has(`${link.method}/${link.phase}`)) {
      errors.push(
        `- ${uc.file}: phaseLinks ${link.method}/${link.phase} が process/ に存在しません`
      );
    }
  }
}

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

if (errors.length > 0) {
  console.error(`\n❌ コンテンツ検証に失敗しました (${errors.length} 件)\n`);
  for (const e of errors) console.error(e);
  process.exit(1);
}

console.log("\n✅ コンテンツ検証 OK\n");
for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
