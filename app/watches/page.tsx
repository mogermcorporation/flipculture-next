import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/watches",
  title: "Watches | Flip Culture",
  description: "Live watch bins — Rolex, Patek Philippe, Audemars Piguet, Richard Mille. Complete watches only."
});

export default function WatchesPage() {
  return (
    <HubClient
      title="Watches"
      blurb="Trending daily pieces and grail references. Complete watches only — no parts, no electronics."
      category="watches"
    />
  );
}
