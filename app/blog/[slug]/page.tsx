import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import MarkdownBody from "@/components/MarkdownBody";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { shopWallsFor } from "@/lib/journal";
import { getAllPosts, getPost } from "@/lib/posts";
import { blogPostingLd, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return pageMeta({ path: "/blog", title: "Flip Culture Blog", description: "Journal" });
  return pageMeta({
    path: `/blog/${post.slug}`,
    title: `${post.title} | Flip Culture`,
    description: post.excerpt,
    image: post.image,
    imageAlt: post.imageAlt,
    type: "article",
    publishedTime: post.date
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const walls = shopWallsFor(post);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <JsonLd data={blogPostingLd(post)} />
      <SiteHeader brandAs="p" />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-purple-400 text-xs font-bold uppercase tracking-widest">
          All journal posts
        </Link>
        <article className="mt-6">
          <p className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">
            {(post.tags[0] || "Journal")} · {post.dateLabel}
          </p>
          <h1 className="text-3xl md:text-4xl font-black mt-3 mb-3 leading-tight">{post.title}</h1>
          <time dateTime={post.date} className="block text-neutral-500 text-xs font-bold uppercase tracking-widest mb-6">
            {post.dateLabel} · {post.author}
          </time>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.imageAlt}
            width={1600}
            height={900}
            className="w-full aspect-video object-cover rounded-2xl border border-neutral-800 mb-8"
          />
          <MarkdownBody markdown={post.body} />
          <nav aria-label="Shop this wall" className="mt-10 pt-8 border-t border-neutral-800">
            <p className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-3">Shop this wall</p>
            <ul className="flex flex-wrap gap-2">
              {walls.map((wall) => (
                <li key={wall.href}>
                  <Link
                    href={wall.href}
                    className="inline-block px-3 py-1.5 rounded-full border border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-300 hover:border-purple-500 hover:text-white"
                  >
                    {wall.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
