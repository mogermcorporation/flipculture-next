import DealCard from "@/components/DealCard";
import type { Deal } from "@/lib/types";
import { groupDenimByBrand } from "@/lib/merchandise";

export function Rail({ title, deals }: { title: string; deals: Deal[] }) {
  if (!deals.length) return null;
  return (
    <section className="mb-10">
      <h3 className="text-lg font-black mb-4 tracking-tight">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
        {deals.slice(0, 10).map((d) => (
          <div key={d.itemId} className="w-64 shrink-0 snap-start">
            <DealCard deal={d} metric="bin" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DenimBrandRails({ deals }: { deals: Deal[] }) {
  const groups = groupDenimByBrand(deals);
  if (!groups.length) return null;
  return (
    <section className="mb-10" data-rail="denim-by-brand">
      <h3 className="text-lg font-black mb-4 tracking-tight">Denim</h3>
      {groups.map((g) => (
        <div key={g.brand} className="mb-6" data-denim-brand={g.brand}>
          <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-300 mb-3">{g.brand}</h4>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {g.deals.slice(0, 10).map((d) => (
              <div key={d.itemId} className="w-64 shrink-0 snap-start">
                <DealCard deal={d} metric="bin" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export function DealGrid({ deals }: { deals: Deal[] }) {
  if (!deals.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {deals.map((d) => (
        <DealCard key={d.itemId} deal={d} metric="bin" />
      ))}
    </div>
  );
}
