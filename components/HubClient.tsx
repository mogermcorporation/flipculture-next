import { DealGrid, DenimBrandRails } from "@/components/CatalogRails";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { classifyListing, listingMatchesCategory, type CatalogCategory } from "@/lib/classify";
import { loadAllDeals } from "@/lib/deals";
import { listingApparel, listingDenimBrand } from "@/lib/merchandise";
import type { Deal } from "@/lib/types";

function compileMatch(match?: string): RegExp | null {
  if (!match) return null;
  try {
    return new RegExp(match, "i");
  } catch {
    return null;
  }
}

function dealKey(d: Deal): string {
  const id = d.itemId.match(/(\d{6,})/)?.[1];
  if (id) return id;
  return `${d.title.trim().toLowerCase()}|${d.price?.value || ""}`;
}

function uniqueDeals(deals: Deal[]): Deal[] {
  const seen = new Set<string>();
  const out: Deal[] = [];
  for (const d of deals) {
    const key = dealKey(d);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(d);
  }
  return out;
}

export default async function HubClient({
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
  const rx = compileMatch(match);
  const deals = await loadAllDeals();
  const rows = uniqueDeals(
    deals.filter((d) => {
      if (!listingMatchesCategory(d.title, d.category, category)) return false;
      if (!classifyListing(d.title, d.category)) return false;
      if (denimOnly && listingApparel(d) !== "denim") return false;
      if (denimBrand && listingDenimBrand(d) !== denimBrand) return false;
      if (rx && !rx.test(d.title)) return false;
      return true;
    })
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <SiteHeader brandAs="p" />
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black">{title}</h1>
          <p className="text-neutral-400 text-sm mt-2 mb-10 max-w-2xl">{blurb}</p>
          {rows.length ? (
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
