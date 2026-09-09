import Link from "next/link";
import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { latestPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/blog",
  title: "Flip Culture Blog | Sourcing Guides, Legit Checks & Resale Trends",
  description:
    "Deep dives into flipping Air Jordans, spotting vintage streetwear, sports cards, and watch market floors."
});

export default function BlogPage() {
  const posts = latestPosts(3);
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
          {posts.map((post) => (
            <article key={post.slug} className="border border-neutral-800 rounded-2xl p-6 bg-neutral-900/50">
              <Link href={`/blog/${post.slug}`} className="block group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  width={640}
                  height={360}
                  className="w-full aspect-video object-cover rounded-xl border border-neutral-800 mb-4"
                />
                <p className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">
                  {post.tag} · {post.dateLabel}
                </p>
                <h2 className="text-xl font-black mt-2 mb-3 group-hover:text-purple-300 transition">{post.title}</h2>
                <p className="text-neutral-400 text-sm">{post.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
