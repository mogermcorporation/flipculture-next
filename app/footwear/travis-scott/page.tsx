import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/footwear/travis-scott",
  title: "Travis Scott Sneakers | Flip Culture",
  description: "Live Travis Scott sneaker bins — Dunks, Jordans, and footwear collabs."
});

export default function TravisScottPage() {
  return (
    <HubClient
      title="Travis Scott"
      blurb="Travis Scott sneakers only — Dunks, Jordans, and footwear collabs."
      category="sneakers"
      match="travis scott"
    />
  );
}
