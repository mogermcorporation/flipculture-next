import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { DENIM_BRAND_ROUTES } from "@/lib/merchandise";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.keys(DENIM_BRAND_ROUTES).map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand } = await params;
  const spec = DENIM_BRAND_ROUTES[brand];
  if (!spec) return pageMeta({ path: "/streetwear/denim", title: "Denim | Flip Culture", description: "Denim by brand." });
  return pageMeta({
    path: `/streetwear/denim/${brand}`,
    title: `${spec.title} Denim | Flip Culture`,
    description: `Live ${spec.title} denim bins — jeans and cuts from the streetwear wall.`
  });
}

export default async function DenimBrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const spec = DENIM_BRAND_ROUTES[brand];
  if (!spec) notFound();
  return (
    <HubClient
      title={`${spec.title} denim`}
      blurb={`${spec.title} jeans and denim only. Grouped by brand, never by age.`}
      category="streetwear"
      denimOnly
      denimBrand={spec.title}
    />
  );
}
