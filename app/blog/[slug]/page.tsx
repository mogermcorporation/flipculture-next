import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getPost, POSTS } from "@/lib/posts";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return pageMeta({ path: "/blog", title: "Flip Culture Blog", description: "Journal" });
  return pageMeta({
    path: `/blog/${post.slug}`,
    title: `${post.title} | Flip Culture`,
    description: post.excerpt
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <SiteHeader brandAs="p" />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-purple-400 text-xs font-bold uppercase tracking-widest">
          All journal posts
        </Link>
        <article className="mt-6">
          <p className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">
            {post.tag} · {post.dateLabel}
          </p>
          <h1 className="text-3xl md:text-4xl font-black mt-3 mb-6 leading-tight">{post.title}</h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.imageAlt}
            width={800}
            height={800}
            className="w-full aspect-video object-cover rounded-2xl border border-neutral-800 mb-8"
          />
          <div className="space-y-5 text-neutral-300 text-sm leading-relaxed">
            {post.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
