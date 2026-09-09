export const WALL_IDS = ["sneakers", "streetwear", "collectibles", "watches"] as const;
export type WallId = (typeof WALL_IDS)[number];

export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  dateLabel: string;
  image: string;
  imageAlt: string;
  tags: string[];
  relatedWalls: WallId[];
  featured: boolean;
  body: string;
};

export type JournalCard = Omit<JournalPost, "body">;

export const WALL_LINKS: Record<WallId, { href: string; label: string }> = {
  sneakers: { href: "/footwear/jordans", label: "Sneakers" },
  streetwear: { href: "/streetwear", label: "Streetwear" },
  collectibles: { href: "/collectibles", label: "Collectibles" },
  watches: { href: "/watches/rolex", label: "Watches" }
};

export function isWallId(value: string): value is WallId {
  return (WALL_IDS as readonly string[]).includes(value);
}

export function formatPostDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function toCard(post: JournalPost): JournalCard {
  const { body: _body, ...card } = post;
  return card;
}

export function shopWallsFor(post: Pick<JournalPost, "relatedWalls" | "tags">): { href: string; label: string }[] {
  const chips: { href: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const wall of post.relatedWalls) {
    const link = WALL_LINKS[wall];
    if (link && !seen.has(link.href)) {
      seen.add(link.href);
      chips.push(link);
    }
  }
  const tagHubs: Record<string, { href: string; label: string }> = {
    rolex: { href: "/watches/rolex", label: "Rolex" },
    patek: { href: "/watches/patek", label: "Patek" },
    jordan: { href: "/footwear/jordans", label: "Jordans" },
    denim: { href: "/streetwear/denim", label: "Denim" }
  };
  for (const tag of post.tags) {
    const hub = tagHubs[tag.toLowerCase()];
    if (hub && !seen.has(hub.href)) {
      seen.add(hub.href);
      chips.push(hub);
    }
  }
  if (!seen.has("/#feed")) chips.push({ href: "/#feed", label: "Live catalog" });
  return chips;
}
