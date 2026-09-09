import HomeClient from "@/components/HomeClient";
import JsonLd from "@/components/JsonLd";
import { loadAllDeals } from "@/lib/deals";
import { mixHero } from "@/lib/merchandise";
import { itemListLd, pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMeta({
  path: "/",
  title: "Flip Culture | Sneakers, Streetwear, Collectibles & Watches",
  description:
    "Live marketplace bins for athletic sneakers, streetwear, sports cards & memorabilia, and watches. Dual grid: Rarest Grails vs Lowest BIN Deals."
});

export default async function Page() {
  const deals = await loadAllDeals();
  const { rarest, cheapest } = mixHero(deals);
  return (
    <>
      <JsonLd data={itemListLd("Rarest Grails", rarest)} />
      <JsonLd data={itemListLd("Lowest BIN Deals", cheapest)} />
      <HomeClient />
    </>
  );
}
