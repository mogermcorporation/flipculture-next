import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/footwear/kobes",
  title: "Kobes | Flip Culture",
  description: "Live Kobe Bryant sneaker bins — Protro and Zoom Kobe footwear only."
});

export default function KobesPage() {
  return (
    <HubClient
      title="Kobes"
      blurb="Kobe Bryant sneakers. Apparel and electronics stay off this wall."
      category="sneakers"
      match="kobe"
    />
  );
}
