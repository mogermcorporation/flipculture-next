import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/streetwear/denim",
  title: "Denim by Brand | Flip Culture",
  description: "Live denim bins grouped by brand: True Religion, Evisu, Levi's, Diesel, and more."
});

export default function DenimPage() {
  return (
    <HubClient
      title="Denim by brand"
      blurb="Jeans and denim grouped by house — True Religion, Evisu, Levi's, Diesel — not by age."
      category="streetwear"
      denimOnly
    />
  );
}
