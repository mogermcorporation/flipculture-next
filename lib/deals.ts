import listingsSnapshot from "@/data/listings.json";
import { classifyListing, listingMatchesCategory, type CatalogCategory } from "@/lib/classify";
import { resolveFacets } from "@/lib/merchandise";
import type { CohortRow, Deal, ListingRow } from "@/lib/types";
import { withEpn } from "@/lib/epn";

const LIVE_LISTINGS = "https://flipculture-two.vercel.app/api/listings";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://zhlkkihvttikuhsjwhcv.supabase.co";
const SUPABASE_ANON =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobGtraWh2dHRpa3Voc2p3aGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNzgxODYsImV4cCI6MjEwMzk1NDE4Nn0.N5xCAjFUbyBawVKF2HhAi-csl4yoeYk91g2HopRyu8A";

const COHORT_TABLES = ["items_genz", "items_millennial", "items_og"] as const;
const HERO_FEATURED = new Set(["featured", "rarest_grail"]);

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
}

function priceValue(v: unknown): string {
  const n = num(v);
  return n.toFixed(2);
}

function ebayNumericId(raw?: string | null, url?: string | null): string {
  if (raw && /^\d+$/.test(raw)) return raw;
  if (raw) {
    const m = raw.match(/(\d{6,})/);
    if (m) return m[1];
  }
  if (url) {
    const m = url.match(/\/itm\/(\d+)/);
    if (m) return m[1];
  }
  return "";
}

function browseItemId(ebayId: string): string {
  return ebayId.includes("|") ? ebayId : `v1|${ebayId}|0`;
}

function itemWebUrl(ebayId: string, affiliate?: string | null, product?: string | null): string {
  if (affiliate) return withEpn(affiliate);
  if (ebayId) return withEpn(`https://www.ebay.com/itm/${ebayId}`);
  if (product) return withEpn(product);
  return withEpn("https://www.ebay.com");
}

function mapCategory(title: string, category?: string): string | null {
  return classifyListing(title, category);
}

function isFeaturedRow(row: { featured?: boolean | null; hero_role?: string | null }): boolean {
  return Boolean(row.featured) || HERO_FEATURED.has(String(row.hero_role || ""));
}

function toDeal(opts: {
  ebayId: string;
  title: string;
  price: unknown;
  image?: string | null;
  affiliate?: string | null;
  product?: string | null;
  category?: string;
  featured?: boolean;
  cohort?: string;
  heroRole?: string | null;
  soldAvg?: unknown;
  discount?: unknown;
  condition?: string | null;
  family?: string | null;
  apparel?: string | null;
  denim_brand?: string | null;
  collectible_kind?: string | null;
  tier?: string | null;
  sneakers?: { family?: string | null };
  streetwear?: { apparel?: string | null };
  collectibles?: { kind?: string | null };
  watches?: { tier?: string | null };
}): Deal | null {
  const title = opts.title?.trim();
  if (!title) return null;
  const ebayId = ebayNumericId(opts.ebayId, opts.affiliate || opts.product);
  if (!ebayId && !opts.affiliate) return null;
  const value = priceValue(opts.price);
  if (value === "0.00") return null;
  const image = opts.image || "/logo.png";
  const web = itemWebUrl(ebayId, opts.affiliate, opts.product);
  const category = mapCategory(title, opts.category);
  if (!category) return null;
  const facets = resolveFacets(title, opts);
  return {
    itemId: browseItemId(ebayId || web),
    title,
    itemWebUrl: web,
    price: { value, currency: "USD" },
    image: { imageUrl: image },
    additionalImages: [],
    featured: Boolean(opts.featured),
    category,
    cohort: opts.cohort,
    originalPrice: num(opts.soldAvg) || undefined,
    discountPercent: num(opts.discount) || undefined,
    soldAvg: num(opts.soldAvg) || undefined,
    condition: opts.condition || undefined,
    family: facets.family,
    apparel: facets.apparel,
    denimBrand: facets.denimBrand,
    collectibleKind: facets.collectibleKind,
    watchTier: facets.watchTier
  };
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, { ...init, next: { revalidate: 120 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchCohort(table: string): Promise<CohortRow[]> {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=ebay_id,title,model,kind,price,sold_avg,discount_pct,image_url,product_url,affiliate_url,authenticity_guarantee,ended,cohort,condition,featured,hero_role,category&ended=eq.false`;
  const body = await fetchJson<CohortRow[]>(url, {
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`
    }
  });
  return Array.isArray(body) ? body : [];
}

async function fetchLiveListings(): Promise<ListingRow[]> {
  const body = await fetchJson<{ items?: ListingRow[] }>(LIVE_LISTINGS);
  if (body && Array.isArray(body.items) && body.items.length) return body.items;
  return (listingsSnapshot as { items: ListingRow[] }).items || [];
}

export async function loadAllDeals(): Promise<Deal[]> {
  const [genz, mill, og] = await Promise.all(COHORT_TABLES.map((t) => fetchCohort(t)));
  const cohortRows = [...genz, ...mill, ...og];
  const cohortDeals = cohortRows
    .map((row) =>
      toDeal({
        ebayId: row.ebay_id,
        title: row.title,
        price: row.price,
        image: row.image_url,
        affiliate: row.affiliate_url,
        product: row.product_url,
        category: row.category || row.kind || "sneakers",
        featured: isFeaturedRow(row),
        cohort: row.cohort || undefined,
        heroRole: row.hero_role,
        soldAvg: row.sold_avg,
        discount: row.discount_pct,
        condition: row.condition,
        family: row.family,
        apparel: row.apparel,
        denim_brand: row.denim_brand,
        collectible_kind: row.collectible_kind,
        tier: row.tier
      })
    )
    .filter((d): d is Deal => Boolean(d));

  if (!cohortDeals.length) {
    const listings = await fetchLiveListings();
    return listings
      .map((row, i) =>
        toDeal({
          ebayId: ebayNumericId(null, row.affiliate_url) || `listing-${i}`,
          title: row.title,
          price: row.sale_price,
          image: row.image_url,
          affiliate: row.affiliate_url,
          category: row.category,
          featured: i < 3,
          family: row.family,
          apparel: row.apparel,
          denim_brand: row.denim_brand,
          collectible_kind: row.collectible_kind,
          tier: row.tier,
          sneakers: row.sneakers,
          streetwear: row.streetwear,
          collectibles: row.collectibles,
          watches: row.watches
        })
      )
      .filter((d): d is Deal => Boolean(d));
  }

  const seen = new Set(cohortDeals.map((d) => d.itemId));
  const listings = await fetchLiveListings();
  for (const row of listings) {
    const deal = toDeal({
      ebayId: ebayNumericId(null, row.affiliate_url),
      title: row.title,
      price: row.sale_price,
      image: row.image_url,
      affiliate: row.affiliate_url,
      category: row.category,
      featured: false,
      family: row.family,
      apparel: row.apparel,
      denim_brand: row.denim_brand,
      collectible_kind: row.collectible_kind,
      tier: row.tier,
      sneakers: row.sneakers,
      streetwear: row.streetwear,
      collectibles: row.collectibles,
      watches: row.watches
    });
    if (!deal || seen.has(deal.itemId)) continue;
    seen.add(deal.itemId);
    cohortDeals.push(deal);
  }
  return cohortDeals;
}

export function filterDeals(
  deals: Deal[],
  opts: { featured?: boolean; q?: string; category?: string; cohort?: string }
): Deal[] {
  let out = deals.filter((d) => classifyListing(d.title, d.category));
  if (opts.q) {
    const q = opts.q.toLowerCase();
    return out.filter((d) => d.title.toLowerCase().includes(q));
  }
  if (opts.cohort) {
    return out.filter((d) => d.cohort === opts.cohort);
  }
  if (opts.featured) {
    const flagged = out.filter((d) => d.featured);
    if (flagged.length) return flagged;
    return [...out].sort((a, b) => num(b.price.value) - num(a.price.value)).slice(0, 3);
  }
  if (opts.category) {
    const wanted = opts.category as CatalogCategory;
    return out.filter((d) => listingMatchesCategory(d.title, d.category, wanted));
  }
  return out;
}

export function rarest(deals: Deal[], n = 6): Deal[] {
  return [...deals].sort((a, b) => num(b.price.value) - num(a.price.value)).slice(0, n);
}

export function cheapest(deals: Deal[], n = 6): Deal[] {
  return [...deals].sort((a, b) => num(a.price.value) - num(b.price.value)).slice(0, n);
}

export { withEpn };
