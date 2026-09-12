import type { MetadataRoute } from "next";
import {
  listDomains,
  listUseCases,
  listPhases,
  listPatterns,
  listGuides,
} from "@pde/content-core";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/guide/", priority: 0.9 },
    { path: "/domains/", priority: 0.9 },
    { path: "/process/", priority: 0.9 },
    { path: "/patterns/", priority: 0.8 },
    { path: "/matrix/", priority: 0.8 },
    { path: "/search/", priority: 0.4 },
  ];

  for (const g of listGuides()) entries.push({ path: `/guide/${g.data.id}/`, priority: 0.7 });
  for (const d of listDomains()) {
    entries.push({ path: `/domains/${d.id}/`, priority: 0.7 });
    for (const uc of listUseCases(d.id)) {
      entries.push({ path: `/domains/${d.id}/${uc.data.id}/`, priority: 0.6 });
    }
  }
  for (const p of listPhases()) {
    entries.push({ path: `/process/${p.data.method}/${p.data.id}/`, priority: 0.6 });
  }
  for (const p of listPatterns()) {
    entries.push({ path: `/patterns/${p.data.id}/`, priority: 0.6 });
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
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: e.priority,
  }));
}
