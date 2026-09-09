import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { canonicalFor, SITEMAP_PATHS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = SITEMAP_PATHS.map((path) => ({
    url: canonicalFor(path),
    lastModified: now,
    changeFrequency: path === "/" ? "hourly" : "daily",
    priority: path === "/" ? 1 : 0.7
  }));
  const posts = getAllPosts().map((post) => ({
    url: canonicalFor(`/blog/${post.slug}`),
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));
  return [...routes, ...posts];
}
