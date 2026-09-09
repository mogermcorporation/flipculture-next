import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/collectibles",
  title: "Sports Cards & Memorabilia | Flip Culture",
  description: "Live sports cards and game-used memorabilia bins. Trading cards, autographs, and artifacts — not sneakers, not watches."
});

export default function CollectiblesPage() {
  return (
    <HubClient
      title="Sports Cards & Memorabilia"
      blurb="Trading cards, game-used, and autograph memorabilia. Not sneakers, not watches."
      category="collectibles"
    />
  );
}
