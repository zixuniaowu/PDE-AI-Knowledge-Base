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
  "guide/_template.md",
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
step("guide", () => listGuides(root));
step("intersections", () => listIntersections(root));
step("references", () => listReferences(root));

// 参照整合チェック
const patterns = safe(() => listPatterns(root), []);
const patternIds = new Set(patterns.map((p) => p.data.id));
const phaseIds = new Set(
  safe(() => listPhases(undefined, root), []).map((p) => `${p.data.method}/${p.data.id}`)
);
const domainIds = new Set(domains.map((d) => d.id));
const useCases = domains.flatMap((d) => safe(() => listUseCases(d.id, root), []));
for (const uc of useCases) {
  if (!domainIds.has(uc.data.domain)) {
    errors.push(`- ${uc.file}: domain "${uc.data.domain}" が domains/ に存在しません`);
  }
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

// 交点ノートの参照整合
const intersections = safe(() => listIntersections(root), []);
for (const ix of intersections) {
  if (!domainIds.has(ix.data.domain)) {
    errors.push(`- intersections/${ix.file}: domain "${ix.data.domain}" が存在しません`);
  }
  if (!phaseIds.has(`${ix.data.method}/${ix.data.phase}`)) {
    errors.push(
      `- intersections/${ix.file}: 工程 ${ix.data.method}/${ix.data.phase} が存在しません`
    );
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

// ── 簡体字（中国語简体）の混入チェック ────────────────────────
// 機械翻訳由来の事故防止。简体固有の字形のみを検出（日本語で使う字は対象外）。
const SIMPLIFIED_ONLY = /[设构验东贝页风问阅仅价传伤严业举义乐习书买亿众优让谢质责贵费资赏赠输进远违连迟选递络归泽泄净动华协单历厅县购储处备复奖宁实宠导对总织结绝细终经绩续维缩级纪红约纯纳纸纷线]/g;

const contentFiles: string[] = [];
function walk(dir: string) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(md|json)$/.test(e.name)) contentFiles.push(p);
  }
}
walk(root);
const hits: string[] = [];
for (const f of contentFiles) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, idx) => {
    const m = line.match(SIMPLIFIED_ONLY);
    if (m) hits.push(`${path.relative(root, f)}:${idx + 1}: ${m.join("")} — ${line.trim().slice(0, 60)}`);
  });
}
if (hits.length > 0) {
  console.error("\n❌ 简体字（中国語简体）の混入を検出しました:");
  for (const h of hits) console.error("  " + h);
  process.exit(1);
}
console.log("  简体字混入: なし");
