import type { MetadataRoute } from "next";
import { canonicalFor, SITEMAP_PATHS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return SITEMAP_PATHS.map((path) => ({
    url: canonicalFor(path),
    lastModified: now,
    changeFrequency: path === "/" ? "hourly" : "daily",
    priority: path === "/" ? 1 : 0.7
  }));
}
