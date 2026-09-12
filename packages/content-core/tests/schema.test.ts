import { describe, expect, it } from "vitest";
import {
  dateSchema,
  domainMetaSchema,
  idSchema,
  phaseDocSchema,
  useCaseDocSchema,
} from "../src/schema";

describe("idSchema", () => {
  it("accepts kebab-case", () => {
    expect(idSchema.safeParse("education").success).toBe(true);
    expect(idSchema.safeParse("software-development").success).toBe(true);
    expect(idSchema.safeParse("a").success).toBe(true);
  });

  it("rejects non kebab-case", () => {
    expect(idSchema.safeParse("Education").success).toBe(false);
    expect(idSchema.safeParse("my_domain").success).toBe(false);
    expect(idSchema.safeParse("-lead").success).toBe(false);
    expect(idSchema.safeParse("trail-").success).toBe(false);
    expect(idSchema.safeParse("").success).toBe(false);
  });
});

describe("dateSchema", () => {
  it("normalizes YAML Date objects to YYYY-MM-DD strings", () => {
    const d = new Date("2026-09-12T00:00:00Z");
    expect(dateSchema.parse(d)).toBe("2026-09-12");
  });

  it("accepts valid strings and rejects others", () => {
    expect(dateSchema.safeParse("2026-09-12").success).toBe(true);
    expect(dateSchema.safeParse("2026-9-12").success).toBe(false);
    expect(dateSchema.safeParse("2026/09/12").success).toBe(false);
  });
});

describe("useCaseDocSchema", () => {
  const base = {
    id: "grading-assistant",
    type: "use-case",
    domain: "education",
    title: "採点・フィードバック支援",
    summary: "サマリー",
    owners: ["@zixuniaowu"],
    status: "draft",
    updated: "2026-09-12",
  };

  it("defaults aiPatterns and phaseLinks to empty arrays", () => {
    const parsed = useCaseDocSchema.parse(base);
    expect(parsed.aiPatterns).toEqual([]);
    expect(parsed.phaseLinks).toEqual([]);
  });

  it("requires domain and owners", () => {
    const { domain: _d, ...noDomain } = base;
    expect(useCaseDocSchema.safeParse(noDomain).success).toBe(false);
    expect(useCaseDocSchema.safeParse({ ...base, owners: [] }).success).toBe(false);
  });

  it("validates phaseLinks shape", () => {
    expect(
      useCaseDocSchema.safeParse({
        ...base,
        phaseLinks: [{ method: "agile", phase: "review" }],
      }).success
    ).toBe(true);
    expect(
      useCaseDocSchema.safeParse({ ...base, phaseLinks: [{ method: "Agile" }] }).success
    ).toBe(false);
  });
});

describe("phaseDocSchema", () => {
  const base = {
    id: "requirements",
    type: "phase",
    method: "waterfall",
    title: "要件定義",
    owners: ["@zixuniaowu"],
    status: "draft",
    updated: "2026-09-12",
  };

  it("requires integer order >= 1", () => {
    expect(phaseDocSchema.safeParse({ ...base, order: 1 }).success).toBe(true);
    expect(phaseDocSchema.safeParse({ ...base, order: 0 }).success).toBe(false);
    expect(phaseDocSchema.safeParse({ ...base, order: 1.5 }).success).toBe(false);
    expect(phaseDocSchema.safeParse(base).success).toBe(false);
  });
});

describe("domainMetaSchema", () => {
  it("tags default to empty array", () => {
    const parsed = domainMetaSchema.parse({
      id: "education",
      name: "教育",
      description: "説明",
      owners: ["@zixuniaowu"],
      status: "draft",
      updated: "2026-09-12",
    });
    expect(parsed.tags).toEqual([]);
  });
});
