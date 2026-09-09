import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/footwear/nike-core",
  title: "Nike Core Sneakers | Flip Culture",
  description: "Live Dunk, Air Force, and Air Max bins — sneakers only."
});

export default function NikeCorePage() {
  return (
    <HubClient
      title="Nike Core"
      blurb="Dunks, Air Force, Air Max — sneakers only."
      category="sneakers"
      match="dunk|air force|af[- ]?1|air max|nike sb"
    />
  );
}
