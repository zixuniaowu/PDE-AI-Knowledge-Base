import { z } from "zod";

/** kebab-case id（作成後変更禁止） */
export const idSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "id は kebab-case (例: my-domain)");

export const ownersSchema = z
  .array(z.string().regex(/^@[A-Za-z0-9-]+$/, "owners は @username 形式"))
  .min(1, "owners は必須 (例: [\"@zixuniaowu\"])");

export const statusSchema = z.enum(["draft", "reviewed", "approved"]);

/** YAML の日付は Date としてパースされることがあるため文字列へ正規化 */
const dateSchema = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updated は YYYY-MM-DD")
);

export const domainMetaSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).max(8).optional(),
  tags: z.array(z.string()).default([]),
  owners: ownersSchema,
  status: statusSchema,
  updated: dateSchema,
});

export const domainDocSchema = z.object({
  id: idSchema,
  type: z.literal("domain"),
  title: z.string().min(1),
  updated: dateSchema,
});

export const phaseLinkSchema = z.object({
  method: idSchema,
  phase: idSchema,
});

export const useCaseDocSchema = z.object({
  id: idSchema,
  type: z.literal("use-case"),
  domain: idSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  aiPatterns: z.array(idSchema).default([]),
  phaseLinks: z.array(phaseLinkSchema).default([]),
  owners: ownersSchema,
  status: statusSchema,
  updated: dateSchema,
});

export const phaseDocSchema = z.object({
  id: idSchema,
  type: z.literal("phase"),
  method: idSchema,
  order: z.number().int().min(1),
  title: z.string().min(1),
  owners: ownersSchema,
  status: statusSchema,
  updated: dateSchema,
});

export const patternDocSchema = z.object({
  id: idSchema,
  type: z.literal("pattern"),
  title: z.string().min(1),
  summary: z.string().min(1),
  owners: ownersSchema,
  status: statusSchema,
  updated: dateSchema,
});

export const guideDocSchema = z.object({
  id: idSchema,
  type: z.literal("guide"),
  order: z.number().int().min(0),
  title: z.string().min(1),
  summary: z.string().min(1),
  owners: ownersSchema,
  status: statusSchema,
  updated: dateSchema,
});

export type DomainMeta = z.infer<typeof domainMetaSchema>;
export type DomainDoc = z.infer<typeof domainDocSchema>;
export type UseCaseDoc = z.infer<typeof useCaseDocSchema>;
export type PhaseDoc = z.infer<typeof phaseDocSchema>;
export type PatternDoc = z.infer<typeof patternDocSchema>;
export type GuideDoc = z.infer<typeof guideDocSchema>;
