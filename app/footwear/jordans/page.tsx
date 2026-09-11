import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/footwear/jordans",
  title: "Jordan 1–14 | Flip Culture",
  description: "Live Air Jordan 1 through 14 bins — athletic sneakers only."
});

export default function JordansIndexPage() {
  return (
    <HubClient
      title="Jordan 1–14"
      blurb="Athletic footwear only — Air Jordan 1 through 14. No apparel, cards, watches, or electronics."
      category="sneakers"
      match="(?:air )?jordan (?:1[0-4]|[1-9])(?:[^0-9]|$)"
    />
  );
}
