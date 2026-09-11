import { withEpn, imageUrl } from "@/lib/epn";
import type { Deal } from "@/lib/types";

function money(value?: string) {
  const n = parseFloat(String(value ?? ""));
  if (!Number.isFinite(n)) return "N/A";
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function DealCard({
  deal,
  vaultIndex,
  metric
}: {
  deal: Deal;
  vaultIndex?: number;
  metric?: "value" | "bin";
}) {
  const href = withEpn(deal.itemWebUrl);
  const label = metric === "bin" ? "BUY IT NOW" : "CURRENT VALUE";
  const src = imageUrl(deal);
  return (
    <article
      data-wall={deal.category}
      className="relative group bg-neutral-900/90 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-2xl hover:border-purple-500 transition-all duration-300 hover:-translate-y-1.5"
    >
      <div className="relative z-10">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-[4/3] bg-neutral-950 rounded-xl overflow-hidden mb-4 border border-neutral-800/80 flex items-center justify-center p-4 relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={deal.title}
            width={480}
            height={360}
            className="h-full w-full object-contain group-hover:scale-105 transition duration-500"
          />
          {typeof vaultIndex === "number" ? (
            <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase shadow-md">
              VAULT #{vaultIndex}
            </span>
          ) : null}
        </a>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-base line-clamp-2 text-white hover:text-purple-400 transition leading-snug"
        >
          {deal.title}
        </a>
        {deal.soldAvg ? (
          <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-wider">
            Sold avg ${money(String(deal.soldAvg))}
            {deal.discountPercent ? ` · ${deal.discountPercent}% under` : ""}
          </p>
        ) : null}
      </div>
      <div className="relative z-10 mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">{label}</span>
          <span className="text-xl font-black text-emerald-400">${money(deal.price?.value)}</span>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 uppercase tracking-wider"
        >
          View Drop
        </a>
      </div>
    </article>
  );
}
