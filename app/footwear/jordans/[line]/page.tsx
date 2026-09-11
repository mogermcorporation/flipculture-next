import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";

const LINES = Array.from({ length: 14 }, (_, i) => `jordan-${i + 1}`);

export function generateStaticParams() {
  return LINES.map((line) => ({ line }));
}

export async function generateMetadata({ params }: { params: Promise<{ line: string }> }): Promise<Metadata> {
  const { line } = await params;
  const n = line.replace("jordan-", "");
  return pageMeta({
    path: `/footwear/jordans/${line}`,
    title: `Jordan ${n} | Flip Culture`,
    description: `Live Jordan ${n} bins — athletic sneakers only. Deadstock and worn pairs with EPN-tagged buy links.`
  });
}

export default async function JordanLinePage({ params }: { params: Promise<{ line: string }> }) {
  const { line } = await params;
  if (!LINES.includes(line)) notFound();
  const n = line.replace("jordan-", "");
  return (
    <HubClient
      title={`Jordan ${n}`}
      blurb="Athletic footwear only — no apparel, cards, watches, or electronics."
      category="sneakers"
      match={`(?:air )?jordan ${n}(?:[^0-9]|$)`}
    />
  );
}
