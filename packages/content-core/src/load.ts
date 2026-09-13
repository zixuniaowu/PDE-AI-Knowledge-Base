import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ZodType, ZodTypeDef } from "zod";
import {
  domainDocSchema,
  domainMetaSchema,
  guideDocSchema,
  intersectionDocSchema,
  patternDocSchema,
  phaseDocSchema,
  referenceDocSchema,
  useCaseDocSchema,
  type DomainDoc,
  type DomainMeta,
  type GuideDoc,
  type IntersectionDoc,
  type PatternDoc,
  type PhaseDoc,
  type ReferenceDoc,
  type UseCaseDoc,
} from "./schema";

export interface ParsedDoc<T> {
  /** content ルートからの相対パス */
  file: string;
  data: T;
  content: string;
}

const DEFAULT_LOCALE = process.env.PDE_LOCALE ?? "ja";

/**
 * content/{locale} のルートを解決する。
 * 優先順位: PDE_CONTENT_DIR 環境変数 > cwd から上位に向かって探索
 */
export function resolveContentRoot(locale = DEFAULT_LOCALE): string {
  if (process.env.PDE_CONTENT_DIR) {
    return path.resolve(process.env.PDE_CONTENT_DIR, locale);
  }
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, "content", locale);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    `content/${locale} が見つかりません。PDE_CONTENT_DIR を設定するか、リポジトリ内で実行してください。`
  );
}

function parseMarkdown<Out, In>(
  filePath: string,
  schema: ZodType<Out, ZodTypeDef, In>
): ParsedDoc<Out> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new Error(`[frontmatter error] ${filePath}\n  ${issues}`);
  }
  return {
    file: path.basename(filePath),
    data: result.data,
    content: content.trim(),
  };
}

function listDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();
}

function listMd(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort();
}

// ── domains ────────────────────────────────────────────────────

export function listDomains(root = resolveContentRoot()): DomainMeta[] {
  const base = path.join(root, "domains");
  return listDirs(base).map((id) => {
    const file = path.join(base, id, "meta.json");
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const result = domainMetaSchema.safeParse(raw);
    if (!result.success) {
      const issues = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      throw new Error(`[meta.json error] ${file}\n  ${issues}`);
    }
    return result.data;
  });
}

export function getDomain(id: string, root = resolveContentRoot()): ParsedDoc<DomainDoc> & { meta: DomainMeta } {
  const base = path.join(root, "domains", id);
  const metaFile = path.join(base, "meta.json");
  const meta = domainMetaSchema.parse(JSON.parse(fs.readFileSync(metaFile, "utf8")));
  const doc = parseMarkdown(path.join(base, "index.md"), domainDocSchema);
  return { file: "index.md", data: doc.data, content: doc.content, meta };
}

export function listUseCases(domainId: string, root = resolveContentRoot()): ParsedDoc<UseCaseDoc>[] {
  const dir = path.join(root, "domains", domainId, "use-cases");
  return listMd(dir).map((f) => parseMarkdown(path.join(dir, f), useCaseDocSchema));
}

export function getUseCase(
  domainId: string,
  caseId: string,
  root = resolveContentRoot()
): ParsedDoc<UseCaseDoc> {
  return parseMarkdown(
    path.join(root, "domains", domainId, "use-cases", `${caseId}.md`),
    useCaseDocSchema
  );
}

// ── process ────────────────────────────────────────────────────

export function listMethods(root = resolveContentRoot()): string[] {
  return listDirs(path.join(root, "process"));
}

export function listPhases(method?: string, root = resolveContentRoot()): ParsedDoc<PhaseDoc>[] {
  const base = path.join(root, "process");
  const methods = method ? [method] : listMethods(root);
  const out: ParsedDoc<PhaseDoc>[] = [];
  for (const m of methods) {
    for (const f of listMd(path.join(base, m))) {
      const doc = parseMarkdown(path.join(base, m, f), phaseDocSchema);
      if (doc.data.method !== m) {
        throw new Error(
          `[frontmatter error] ${path.join(m, f)}\n  frontmatter method "${doc.data.method}" とディレクトリ "${m}" が一致しません`
        );
      }
      out.push(doc);
    }
  }
  return out.sort(
    (a, b) => a.data.method.localeCompare(b.data.method) || a.data.order - b.data.order
  );
}

export function getPhase(
  method: string,
  phaseId: string,
  root = resolveContentRoot()
): ParsedDoc<PhaseDoc> {
  return parseMarkdown(path.join(root, "process", method, `${phaseId}.md`), phaseDocSchema);
}

// ── patterns ───────────────────────────────────────────────────

export function listPatterns(root = resolveContentRoot()): ParsedDoc<PatternDoc>[] {
  const dir = path.join(root, "patterns");
  return listMd(dir).map((f) => parseMarkdown(path.join(dir, f), patternDocSchema));
}

export function getPattern(id: string, root = resolveContentRoot()): ParsedDoc<PatternDoc> {
  return parseMarkdown(path.join(root, "patterns", `${id}.md`), patternDocSchema);
}

// ── guide ──────────────────────────────────────────────────────

export function listGuides(root = resolveContentRoot()): ParsedDoc<GuideDoc>[] {
  const dir = path.join(root, "guide");
  return listMd(dir)
    .map((f) => parseMarkdown(path.join(dir, f), guideDocSchema))
    .sort((a, b) => a.data.order - b.data.order);
}

export function getGuide(id: string, root = resolveContentRoot()): ParsedDoc<GuideDoc> {
  return parseMarkdown(path.join(root, "guide", `${id}.md`), guideDocSchema);
}

// ── intersections (領域 × 工程 の交点ノート) ───────────────────

export function intersectionKey(domain: string, method: string, phase: string): string {
  return `${domain}--${method}--${phase}`;
}

export function listIntersections(root = resolveContentRoot()): ParsedDoc<IntersectionDoc>[] {
  const dir = path.join(root, "intersections");
  const docs = listMd(dir).map((f) => {
    const doc = parseMarkdown(path.join(dir, f), intersectionDocSchema);
    const expected = `${doc.data.domain}--${doc.data.method}--${doc.data.phase}`;
    if (doc.data.id !== expected || f !== `${expected}.md`) {
      throw new Error(
        `[intersections error] ${f}: ファイル名 / id は "{domain}--{method}--{phase}" 形式で一致させてください (期待値: ${expected})`
      );
    }
    return doc;
  });
  return docs.sort((a, b) => a.data.id.localeCompare(b.data.id));
}

export function getIntersection(
  domain: string,
  method: string,
  phase: string,
  root = resolveContentRoot()
): ParsedDoc<IntersectionDoc> | null {
  const file = path.join(
    root,
    "intersections",
    `${intersectionKey(domain, method, phase)}.md`
  );
  if (!fs.existsSync(file)) return null;
  return parseMarkdown(file, intersectionDocSchema);
}

// ── references（用語集など）───────────────────────────────────

export function listReferences(root = resolveContentRoot()): ParsedDoc<ReferenceDoc>[] {
  const dir = path.join(root, "references");
  return listMd(dir)
    .map((f) => parseMarkdown(path.join(dir, f), referenceDocSchema))
    .sort((a, b) => a.data.title.localeCompare(b.data.title, "ja"));
}

export function getReference(id: string, root = resolveContentRoot()): ParsedDoc<ReferenceDoc> {
  return parseMarkdown(path.join(root, "references", `${id}.md`), referenceDocSchema);
}
