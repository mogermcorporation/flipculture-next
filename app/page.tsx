import HomeClient from "@/components/HomeClient";
import JsonLd from "@/components/JsonLd";
import { loadAllDeals } from "@/lib/deals";
import { toCard } from "@/lib/journal";
import { mixHero } from "@/lib/merchandise";
import { getFeaturedPost, getJournalStrip } from "@/lib/posts";
import { DEFAULT_DESC, DEFAULT_TITLE, itemListLd, pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const featured = getFeaturedPost();
  return pageMeta({
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    image: featured?.image || "/logo.png",
    imageAlt: featured?.imageAlt || "Flip Culture journal"
  });
}

export default async function Page() {
  const deals = await loadAllDeals();
  const { rarest, cheapest } = mixHero(deals);
  const featuredPost = getFeaturedPost();
  const featured = featuredPost ? toCard(featuredPost) : null;
  const journal = getJournalStrip(featured?.slug);
  return (
    <>
      <JsonLd data={itemListLd("Rarest Grails", rarest)} />
      <JsonLd data={itemListLd("Lowest BIN Deals", cheapest)} />
      <HomeClient featured={featured} journal={journal} />
    </>
  );
}
