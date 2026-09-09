import { classifyListing, type CatalogCategory } from "@/lib/classify";
import type { Deal } from "@/lib/types";

export type SneakerFamily = "jordan" | "travis" | "kobe" | "trending";
export type StreetwearApparel = "tees" | "hoodies" | "denim" | "other";
export type CollectibleKind = "cards" | "memorabilia";
export type WatchTier = "trending" | "grail";

export const SNEAKER_RAILS: { id: SneakerFamily; label: string }[] = [
  { id: "jordan", label: "Jordan 1–14" },
  { id: "travis", label: "Travis Scott" },
  { id: "kobe", label: "Kobes" },
  { id: "trending", label: "Trending" }
];

export const STREETWEAR_RAILS: { id: StreetwearApparel; label: string }[] = [
  { id: "tees", label: "Tees" },
  { id: "hoodies", label: "Hoodies" },
  { id: "denim", label: "Denim" }
];

export const COLLECTIBLE_RAILS: { id: CollectibleKind; label: string }[] = [
  { id: "cards", label: "Sports cards" },
  { id: "memorabilia", label: "Memorabilia" }
];

export const WATCH_RAILS: { id: WatchTier; label: string }[] = [
  { id: "trending", label: "Trending" },
  { id: "grail", label: "Grail" }
];

export const DENIM_BRAND_ORDER = ["True Religion", "Evisu", "Levi's", "Diesel"] as const;

export const DENIM_BRAND_ROUTES: Record<string, { title: string; pattern: RegExp }> = {
  "true-religion": { title: "True Religion", pattern: /true\s*religion/i },
  evisu: { title: "Evisu", pattern: /evisu/i },
  levis: { title: "Levi's", pattern: /levi'?s|\blevis\b/i },
  diesel: { title: "Diesel", pattern: /\bdiesel\b/i }
};

const WALLS: CatalogCategory[] = ["sneakers", "streetwear", "collectibles", "watches"];

function priceOf(d: Deal): number {
  const n = parseFloat(d.price?.value ?? "");
  return Number.isFinite(n) ? n : 0;
}

function stored(v?: string | null): string {
  return (v || "").trim().toLowerCase();
}

export function sneakerFamily(title: string): SneakerFamily {
  if (/travis\s*scott|cactus jack/i.test(title)) return "travis";
  if (/\bkobe\b|protro/i.test(title)) return "kobe";
  if (/\b(?:air\s*)?jordan\s*(?:1[0-4]|[1-9])\b/i.test(title)) return "jordan";
  return "trending";
}

export function streetwearApparel(title: string): StreetwearApparel {
  if (/\b(denim|jeans|selvedge)\b/i.test(title)) return "denim";
  if (/\b(hoodie|hooded|crewneck|sweatshirt)\b/i.test(title)) return "hoodies";
  if (/\b(t-shirt|\btee\b|graphic tee)\b/i.test(title)) return "tees";
  return "other";
}

export function denimBrand(title: string): string {
  if (/true\s*religion/i.test(title)) return "True Religion";
  if (/evisu/i.test(title)) return "Evisu";
  if (/levi'?s|\blevis\b/i.test(title)) return "Levi's";
  if (/\bdiesel\b/i.test(title)) return "Diesel";
  if (/wrangler/i.test(title)) return "Wrangler";
  if (/g-?star/i.test(title)) return "G-Star";
  if (/nudie/i.test(title)) return "Nudie";
  if (/acne\s*studios/i.test(title)) return "Acne Studios";
  if (/\bag\s+(jeans|denim)|adriano goldschmied/i.test(title)) return "AG";
  if (/\bcitizens of humanity\b/i.test(title)) return "Citizens of Humanity";
  return "Other";
}

export function collectibleKind(title: string): CollectibleKind {
  const card = /\b(sports card|trading card|panini|topps|prizm|bowman|upper deck|psa\s?\d|bgs\s?\d|sgc\s?\d|rookie card|pokemon|yu-?gi-oh|graded card|hobby box|breaker|\bcard\b)\b/i.test(
    title
  );
  if (card) return "cards";
  return "memorabilia";
}

export function watchTier(title: string): WatchTier {
  if (/patek|nautilus|audemars|piguet|royal oak|richard mille|\brm[- ]?\d|daytona/i.test(title)) {
    return "grail";
  }
  return "trending";
}

export type ListingFacets = {
  family?: string;
  apparel?: string;
  denimBrand?: string;
  collectibleKind?: string;
  watchTier?: string;
};

export function resolveFacets(
  title: string,
  raw?: {
    family?: string | null;
    apparel?: string | null;
    denim_brand?: string | null;
    denimBrand?: string | null;
    collectible_kind?: string | null;
    tier?: string | null;
    sneakers?: { family?: string | null };
    streetwear?: { apparel?: string | null };
    collectibles?: { kind?: string | null };
    watches?: { tier?: string | null };
  }
): ListingFacets {
  const familyRaw = stored(raw?.sneakers?.family) || stored(raw?.family);
  const apparelRaw = stored(raw?.streetwear?.apparel) || stored(raw?.apparel);
  const denimRaw = stored(raw?.denim_brand) || stored(raw?.denimBrand);
  const kindRaw = stored(raw?.collectibles?.kind) || stored(raw?.collectible_kind);
  const tierRaw = stored(raw?.watches?.tier) || stored(raw?.tier);

  let family: SneakerFamily = sneakerFamily(title);
  if (/travis/.test(familyRaw)) family = "travis";
  else if (/kobe/.test(familyRaw)) family = "kobe";
  else if (/jordan/.test(familyRaw)) family = "jordan";
  else if (/trend/.test(familyRaw)) family = "trending";

  let apparel: StreetwearApparel = streetwearApparel(title);
  if (/denim|jean/.test(apparelRaw)) apparel = "denim";
  else if (/hoodie|crew|sweat/.test(apparelRaw)) apparel = "hoodies";
  else if (/tee|shirt/.test(apparelRaw)) apparel = "tees";

  const brand = denimRaw
    ? DENIM_BRAND_ORDER.find((b) => b.toLowerCase() === denimRaw) ||
      (denimRaw === "levis" ? "Levi's" : denimBrand(title))
    : denimBrand(title);

  let kind: CollectibleKind = collectibleKind(title);
  if (/card/.test(kindRaw)) kind = "cards";
  else if (/memo/.test(kindRaw)) kind = "memorabilia";

  let tier: WatchTier = watchTier(title);
  if (/grail/.test(tierRaw)) tier = "grail";
  else if (/trend/.test(tierRaw)) tier = "trending";

  return {
    family,
    apparel,
    denimBrand: brand,
    collectibleKind: kind,
    watchTier: tier
  };
}

export function listingFamily(d: Deal): SneakerFamily {
  return (d.family as SneakerFamily) || sneakerFamily(d.title);
}

export function listingApparel(d: Deal): StreetwearApparel {
  return (d.apparel as StreetwearApparel) || streetwearApparel(d.title);
}

export function listingDenimBrand(d: Deal): string {
  return d.denimBrand || denimBrand(d.title);
}

export function listingCollectibleKind(d: Deal): CollectibleKind {
  return (d.collectibleKind as CollectibleKind) || collectibleKind(d.title);
}

export function listingWatchTier(d: Deal): WatchTier {
  return (d.watchTier as WatchTier) || watchTier(d.title);
}

export function mixHero(deals: Deal[]): { rarest: Deal[]; cheapest: Deal[] } {
  const rarest: Deal[] = [];
  const cheapest: Deal[] = [];
  const used = new Set<string>();
  for (const wall of WALLS) {
    const pool = deals.filter((d) => classifyListing(d.title, d.category) === wall);
    const high = [...pool].sort((a, b) => priceOf(b) - priceOf(a));
    const low = [...pool].sort((a, b) => priceOf(a) - priceOf(b));
    const r = high.find((d) => !used.has(d.itemId));
    if (r) {
      rarest.push(r);
      used.add(r.itemId);
    }
    const c = low.find((d) => !used.has(d.itemId));
    if (c) {
      cheapest.push(c);
      used.add(c.itemId);
    }
  }
  return { rarest, cheapest };
}

export function groupDenimByBrand(deals: Deal[]): { brand: string; deals: Deal[] }[] {
  const denim = deals.filter((d) => listingApparel(d) === "denim");
  const map = new Map<string, Deal[]>();
  for (const d of denim) {
    const brand = listingDenimBrand(d);
    const list = map.get(brand) || [];
    list.push(d);
    map.set(brand, list);
  }
  const ordered: { brand: string; deals: Deal[] }[] = [];
  for (const brand of DENIM_BRAND_ORDER) {
    const rows = map.get(brand);
    if (rows?.length) ordered.push({ brand, deals: rows });
    map.delete(brand);
  }
  const rest = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [brand, rows] of rest) {
    if (brand === "Other") continue;
    ordered.push({ brand, deals: rows });
  }
  const other = map.get("Other");
  if (other?.length) ordered.push({ brand: "Other", deals: other });
  return ordered;
}
