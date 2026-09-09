import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/streetwear",
  title: "Streetwear | Flip Culture",
  description: "Live streetwear bins — tees, hoodies, and denim grouped by brand. Apparel only, never sneakers."
});

export default function StreetwearPage() {
  return (
    <HubClient
      title="Streetwear"
      blurb="Tees, hoodies, and denim grouped by brand — True Religion, Evisu, Levi's, Diesel. Never sneakers."
      category="streetwear"
    />
  );
}
