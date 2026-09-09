import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flip Culture Blog | Sourcing Guides, Legit Checks & Resale Trends",
  description:
    "Deep dives into flipping Air Jordans, sourcing high-spec gaming laptops, spot-checking vintage streetwear, and maximizing resale margins."
};

const POSTS = [
  {
    tag: "Sneaker Legit Checks",
    date: "August 2026",
    title: "How to Spot Fake Air Jordan 1 Retros in 2026: The Complete Legit Check Guide",
    excerpt:
      "Crucial details on leather texture, heel shape, hourglass silhouettes, and Wings logo embossing before you buy or flip high-value pairs."
  },
  {
    tag: "Tech Resale Analysis",
    date: "August 2026",
    title: "Top 5 Gaming Laptops That Hold Their Resale Value Best",
    excerpt:
      "Why ASUS ROG Zephyrus, Razer Blade, and Steam Deck OLED models consistently yield high margins on the secondary market."
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
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-2.5 text-center text-xs font-black uppercase tracking-widest">
        Flip Culture Field Guides & Market Insights
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-purple-400 text-xs font-bold uppercase tracking-widest">
          Back to Storefront
        </Link>
        <h1 className="text-4xl font-black mt-6 mb-2">FLIP CULTURE BLOG</h1>
        <p className="text-neutral-400 text-sm mb-12">
          Market trends, legit checks, hardware reviews, and sourcing breakdowns for high-value flips.
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
      </div>
    </main>
  );
}
