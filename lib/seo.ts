import type { Metadata } from "next";
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

export function absoluteAssetUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return `${SITE_URL}/logo.png`;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function pageMeta(opts: {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const url = canonicalFor(opts.path);
  const image = absoluteAssetUrl(opts.image || "/logo.png");
  const imageAlt = opts.imageAlt || opts.title;
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": `${SITE_URL}/rss.xml` }
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: opts.type || "website",
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
      images: [{ url: image, width: 1200, height: 675, alt: imageAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image]
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

export function blogPostingLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  imageAlt: string;
}) {
  const url = canonicalFor(`/blog/${post.slug}`);
  const image = absoluteAssetUrl(post.image);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: [image],
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` }
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url
  };
}

export function blogIndexLd(
  posts: { slug: string; title: string; date: string; image: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Flip Culture Blog",
    url: canonicalFor("/blog"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: canonicalFor(`/blog/${post.slug}`),
        name: post.title,
        image: absoluteAssetUrl(post.image),
        datePublished: post.date
      }))
    }
  };
}

export const SITEMAP_PATHS = [
  "/",
  "/blog",
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
