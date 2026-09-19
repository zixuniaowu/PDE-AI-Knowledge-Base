import type { MetadataRoute } from "next";
import {
  listDomains,
  listUseCases,
  listPatterns,
  listPhases,
  listGuides,
  listIntersections,
  listReferences,
} from "@pde/content-core";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

interface Entry {
  path: string;
  updated?: string;
  priority: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    { path: "/", priority: 1 },
    { path: "/vendors/", priority: 0.8 },
    { path: "/guide/", priority: 0.9 },
    { path: "/domains/", priority: 0.9 },
    { path: "/process/", priority: 0.9 },
    { path: "/patterns/", priority: 0.8 },
    { path: "/matrix/", priority: 0.8 },
  ];

  for (const g of listGuides()) {
    entries.push({ path: `/guide/${g.data.id}/`, updated: g.data.updated, priority: 0.7 });
  }
  for (const d of listDomains()) {
    entries.push({ path: `/domains/${d.id}/`, updated: d.updated, priority: 0.7 });
    for (const uc of listUseCases(d.id)) {
      entries.push({
        path: `/domains/${d.id}/${uc.data.id}/`,
        updated: uc.data.updated,
        priority: 0.6,
      });
    }
  }
  for (const p of listPhases()) {
    entries.push({
      path: `/process/${p.data.method}/${p.data.id}/`,
      updated: p.data.updated,
      priority: 0.6,
    });
  }
  for (const p of listPatterns()) {
    entries.push({ path: `/patterns/${p.data.id}/`, updated: p.data.updated, priority: 0.6 });
  }
  for (const r of listReferences()) {
    entries.push({ path: `/references/${r.data.id}/`, updated: r.data.updated, priority: 0.5 });
  }
  for (const d of listDomains()) {
    for (const p of listPhases()) {
      entries.push({
        path: `/matrix/${d.id}/${p.data.method}/${p.data.id}/`,
        priority: 0.3,
      });
    }
  }

  return entries.map((e) => ({
    url: `${base}${e.path}`,
    lastModified: e.updated ? new Date(`${e.updated}T00:00:00Z`) : new Date(),
    changeFrequency: "weekly",
    priority: e.priority,
  }));
}
