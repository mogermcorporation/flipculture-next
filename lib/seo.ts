import type { Metadata } from "next";
import { POSTS } from "@/lib/posts";
import type { Deal } from "@/lib/types";

export const SITE_URL = "https://flipcultureusa.vercel.app";
export const SITE_NAME = "Flip Culture";
export const DEFAULT_TITLE = "Flip Culture | Sneakers, Streetwear, Collectibles & Watches";
export const DEFAULT_DESC =
  "Live marketplace bins for athletic sneakers, streetwear, sports cards & memorabilia, and watches. Dual grid: Rarest Grails vs Lowest BIN Deals.";

export function canonicalFor(path: string): string {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMeta(opts: { path: string; title: string; description: string }): Metadata {
  const url = canonicalFor(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description
    }
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESC
  };
}

export function itemListLd(name: string, deals: Deal[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: deals.length,
    itemListElement: deals.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: d.title,
        image: d.image?.imageUrl,
        url: d.itemWebUrl,
        offers: {
          "@type": "Offer",
          price: d.price.value,
          priceCurrency: d.price.currency || "USD",
          url: d.itemWebUrl,
          availability: "https://schema.org/InStock"
        }
      }
    }))
  };
}

export const SITEMAP_PATHS = [
  "/",
  "/blog",
  ...POSTS.map((post) => `/blog/${post.slug}`),
  "/streetwear",
  "/streetwear/denim",
  "/streetwear/denim/true-religion",
  "/streetwear/denim/evisu",
  "/streetwear/denim/levis",
  "/streetwear/denim/diesel",
  "/collectibles",
  "/footwear/travis-scott",
  "/footwear/kobes",
  "/footwear/nike-core",
  "/footwear/jordans",
  ...Array.from({ length: 14 }, (_, i) => `/footwear/jordans/jordan-${i + 1}`),
  "/watches",
  "/watches/rolex",
  "/watches/patek",
  "/watches/ap",
  "/watches/richard-mille"
];
