import { describe, expect, it } from "vitest";
import {
  getGuide,
  getPhase,
  getUseCase,
  listDomains,
  listGuides,
  listMethods,
  listPatterns,
  listPhases,
  listUseCases,
  resolveContentRoot,
} from "../src/load";

describe("resolveContentRoot", () => {
  it("finds content/ja from repo root cwd", () => {
    const root = resolveContentRoot();
    expect(root).toMatch(/content[\\/]ja$/);
  });
});

describe("listDomains", () => {
  it("returns seed domains with valid meta", () => {
    const domains = listDomains();
    const ids = domains.map((d) => d.id);
    expect(ids).toContain("education");
    expect(ids).toContain("software-development");
    expect(domains.length).toBeGreaterThanOrEqual(5);
    for (const d of domains) {
      expect(d.owners.length).toBeGreaterThan(0);
      expect(d.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("listUseCases", () => {
  it("returns use cases whose domain matches the directory", () => {
    const useCases = listUseCases("education");
    expect(useCases.length).toBeGreaterThanOrEqual(2);
    for (const uc of useCases) expect(uc.data.domain).toBe("education");
  });
});

describe("listPhases", () => {
  it("lists all methods and sorts by method then order", () => {
    const all = listPhases();
    expect(all.length).toBeGreaterThanOrEqual(11);
    expect(listMethods()).toContain("waterfall");
    expect(listMethods()).toContain("agile");
    const waterfall = listPhases("waterfall");
    const orders = waterfall.map((p) => p.data.order);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });

  it("throws on mismatched method directory", () => {
    expect(() => getPhase("waterfall", "review")).toThrow();
  });
});

describe("listPatterns", () => {
  it("includes rag with summary", () => {
    const patterns = listPatterns();
    expect(patterns.length).toBeGreaterThanOrEqual(6);
    const rag = patterns.find((p) => p.data.id === "rag");
    expect(rag?.data.summary).toBeTruthy();
  });
});

describe("listGuides", () => {
  it("returns ordered guide steps", () => {
    const guides = listGuides();
    expect(guides.length).toBeGreaterThanOrEqual(7);
    const orders = guides.map((g) => g.data.order);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
    expect(guides[0]?.data.id).toBe("what-is-pde");
  });
});

describe("referential integrity of seed content", () => {
  it("every aiPatterns / phaseLinks reference resolves", () => {
    const patternIds = new Set(listPatterns().map((p) => p.data.id));
    const phaseKeys = new Set(
      listPhases().map((p) => `${p.data.method}/${p.data.id}`)
    );
    for (const d of listDomains()) {
      for (const uc of listUseCases(d.id)) {
        for (const pid of uc.data.aiPatterns) {
          expect(patternIds.has(pid), `${uc.file}: pattern ${pid}`).toBe(true);
        }
        for (const link of uc.data.phaseLinks) {
          expect(
            phaseKeys.has(`${link.method}/${link.phase}`),
            `${uc.file}: phase ${link.method}/${link.phase}`
          ).toBe(true);
        }
      }
    }
  });

  it("guide navigation references resolve", () => {
    const guide = getGuide("step-6-contribute");
    expect(guide.content).toContain("STEP");
  });
});
