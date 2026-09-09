"use client";

import { useEffect, useState } from "react";
import { DealGrid, DenimBrandRails } from "@/components/CatalogRails";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { classifyListing, listingMatchesCategory, type CatalogCategory } from "@/lib/classify";
import { listingApparel, listingDenimBrand } from "@/lib/merchandise";
import type { Deal } from "@/lib/types";

export default function HubClient({
  title,
  blurb,
  category,
  match,
  denimOnly,
  denimBrand
}: {
  title: string;
  blurb: string;
  category: CatalogCategory;
  match?: string;
  denimOnly?: boolean;
  denimBrand?: string;
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
            if (!classifyListing(d.title, d.category)) return false;
            if (denimOnly && listingApparel(d) !== "denim") return false;
            if (denimBrand && listingDenimBrand(d) !== denimBrand) return false;
            if (rx && !rx.test(d.title)) return false;
            return true;
          })
        );
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, match, denimOnly, denimBrand]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <SiteHeader brandAs="p" />
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black">{title}</h1>
          <p className="text-neutral-400 text-sm mt-2 mb-10 max-w-2xl">{blurb}</p>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-neutral-900/50 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : rows.length ? (
            denimOnly && !denimBrand ? (
              <DenimBrandRails deals={rows} />
            ) : (
              <DealGrid deals={rows} />
            )
          ) : (
            <p className="text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-3xl p-10">
              Nothing live on this hub yet. Ingest will fill it — we will not fake SKUs.
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
