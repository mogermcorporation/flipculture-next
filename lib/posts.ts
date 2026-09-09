import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  formatPostDate,
  isWallId,
  toCard,
  type JournalCard,
  type JournalPost,
  type WallId
} from "@/lib/journal";

export type { JournalCard, JournalPost };

const JOURNAL_DIR = path.join(process.cwd(), "content/journal");

function parseWalls(value: unknown): WallId[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(isWallId);
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((tag) => String(tag).trim()).filter(Boolean);
}

export function parsePost(slug: string, raw: string): JournalPost | null {
  const { data, content } = matter(raw);
  const image = String(data.image || "").trim();
  if (!image) return null;
  const title = String(data.title || "").trim();
  if (!title) return null;
  const excerpt = String(data.excerpt || data.description || "").trim();
  const date = String(data.date || "").slice(0, 10);
  if (!date) return null;
  return {
    slug,
    title,
    excerpt,
    author: String(data.author || "Flip Culture").trim() || "Flip Culture",
    date,
    dateLabel: formatPostDate(date),
    image,
    imageAlt: String(data.imageAlt || title).trim() || title,
    tags: parseTags(data.tags),
    relatedWalls: parseWalls(data.relatedWalls),
    featured: Boolean(data.featured),
    body: content.trim()
  };
}

export function getAllPosts(): JournalPost[] {
  if (!fs.existsSync(JOURNAL_DIR)) return [];
  return fs
    .readdirSync(JOURNAL_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(JOURNAL_DIR, file), "utf8");
      return parsePost(slug, raw);
    })
    .filter((post): post is JournalPost => Boolean(post?.image))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): JournalPost | undefined {
  const file = path.join(JOURNAL_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const post = parsePost(slug, fs.readFileSync(file, "utf8"));
  return post?.image ? post : undefined;
}

export function getFeaturedPost(): JournalPost | null {
  const posts = getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0] ?? null;
}

export function getJournalStrip(featuredSlug?: string, limit = 3): JournalCard[] {
  const posts = getAllPosts();
  const cards = posts.map(toCard);
  if (posts.length <= 3) return cards.slice(0, limit);
  return cards.filter((post) => post.slug !== featuredSlug).slice(0, limit);
}

export function latestPosts(limit = 3): JournalCard[] {
  return getAllPosts().map(toCard).slice(0, limit);
}

export function serializeFrontmatter(post: {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  imageAlt: string;
  tags: string[];
  relatedWalls: WallId[];
  featured: boolean;
}): string {
  const yamlTags = post.tags.map((tag) => `  - ${tag}`).join("\n") || "  []";
  const yamlWalls = post.relatedWalls.map((wall) => `  - ${wall}`).join("\n") || "  []";
  return `---
title: ${JSON.stringify(post.title)}
description: ${JSON.stringify(post.excerpt)}
date: ${JSON.stringify(post.date)}
author: ${JSON.stringify(post.author)}
image: ${JSON.stringify(post.image)}
imageAlt: ${JSON.stringify(post.imageAlt)}
tags:
${yamlTags}
relatedWalls:
${yamlWalls}
featured: ${post.featured}
---
`;
}
