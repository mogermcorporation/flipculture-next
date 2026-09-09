import Link from "next/link";
import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/blog",
  title: "Flip Culture Blog | Sourcing Guides, Legit Checks & Resale Trends",
  description:
    "Deep dives into flipping Air Jordans, spotting vintage streetwear, sports cards, and watch market floors."
});

const POSTS = [
  {
    tag: "Sneaker Legit Checks",
    date: "August 2026",
    title: "How to Spot Fake Air Jordan 1 Retros in 2026: The Complete Legit Check Guide",
    excerpt:
      "Crucial details on leather texture, heel shape, hourglass silhouettes, and Wings logo embossing before you buy or flip high-value pairs."
  },
  {
    tag: "Watch Floors",
    date: "September 2026",
    title: "Rolex Sub vs Datejust vs Vintage Daytona: What the BIN Board Is Actually Paying",
    excerpt:
      "How we separate complete watches from parts, and why Patek Nautilus, AP Royal Oak, and Richard Mille sit on the most-valuable wall."
  },
  {
    tag: "Sourcing Strategy",
    date: "August 2026",
    title: "Sourcing Vintage Streetwear & Grails: Thrift to Marketplace Blueprint",
    excerpt:
      "How to evaluate tag dates, single-stitch construction, and authentic wear when flipping 90s apparel and hype streetwear."
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <SiteHeader brandAs="p" />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-purple-400 text-xs font-bold uppercase tracking-widest">
          Back to Storefront
        </Link>
        <h1 className="text-4xl font-black mt-6 mb-2">FLIP CULTURE BLOG</h1>
        <p className="text-neutral-400 text-sm mb-12">
          Market trends, legit checks, and sourcing breakdowns for sneakers, streetwear, collectibles, and watches.
        </p>
        <div className="space-y-8">
          {POSTS.map((post) => (
            <article key={post.title} className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/50">
              <p className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">
                {post.tag} · {post.date}
              </p>
              <h2 className="text-xl font-black mt-2 mb-3">{post.title}</h2>
              <p className="text-neutral-400 text-sm">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
