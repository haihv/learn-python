import type { MetadataRoute } from "next";
import { curriculum } from "@/lib/curriculum";
import { stems } from "@/lib/stems";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/atlas"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];

  const moduleRoutes: MetadataRoute.Sitemap = curriculum.map((m) => ({
    url: absoluteUrl(`/learn/${m.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const stemRoutes: MetadataRoute.Sitemap = stems.map((s) => ({
    url: absoluteUrl(`/stem/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...moduleRoutes, ...stemRoutes];
}
