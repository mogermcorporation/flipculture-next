"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DealCard from "@/components/DealCard";
import { classifyListing, listingMatchesCategory, type CatalogCategory } from "@/lib/classify";
import type { Deal } from "@/lib/types";

export default function HubClient({
  title,
  blurb,
  category,
  match
}: {
  title: string;
  blurb: string;
  category: CatalogCategory;
  match?: string;
}) {
  const [rows, setRows] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rx = match ? new RegExp(match, "i") : null;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/deals?category=${category}`);
        const json = await res.json();
        const deals: Deal[] = Array.isArray(json) ? json : [];
        setRows(
          deals.filter((d) => {
            if (!listingMatchesCategory(d.title, d.category, category)) return false;
            if (rx && !rx.test(d.title)) return false;
            return Boolean(classifyListing(d.title, d.category));
          })
        );
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, match]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-purple-400 text-xs font-bold uppercase tracking-widest">
          Back to Flip Culture
        </Link>
        <h1 className="text-4xl font-black mt-4">{title}</h1>
        <p className="text-neutral-400 text-sm mt-2 mb-10 max-w-2xl">{blurb}</p>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-neutral-900/50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : rows.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rows.map((d) => (
              <DealCard key={d.itemId} deal={d} metric="bin" />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-3xl p-10">
            Nothing live on this hub yet. Ingest will fill it — we will not fake SKUs.
          </p>
        )}
      </div>
    </main>
  );
}
