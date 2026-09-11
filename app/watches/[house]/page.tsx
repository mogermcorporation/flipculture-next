import type { Metadata } from "next";
import HubClient from "@/components/HubClient";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";

const HOUSES: Record<string, { title: string; match: string; blurb: string; description: string }> = {
  rolex: {
    title: "Rolex",
    match: "rolex|submariner|datejust|daytona|gmt[- ]master",
    blurb: "Submariner, Datejust, GMT, vintage Daytona class. Complete watches only.",
    description: "Live Rolex bins — Submariner, Datejust, GMT-Master, Daytona. Complete watches only."
  },
  patek: {
    title: "Patek Philippe",
    match: "patek|nautilus",
    blurb: "Nautilus and Patek grails — most-valuable wall.",
    description: "Live Patek Philippe bins — Nautilus and grail references."
  },
  ap: {
    title: "Audemars Piguet",
    match: "audemars|piguet|royal oak|(?:^|[^a-z0-9])ap(?:[^a-z0-9]|$)",
    blurb: "Royal Oak and AP references. Watches only.",
    description: "Live Audemars Piguet bins — Royal Oak and AP references."
  },
  "richard-mille": {
    title: "Richard Mille",
    match: "richard mille|rm[- ]?[0-9]",
    blurb: "Richard Mille — most-valuable watch wall.",
    description: "Live Richard Mille bins — RM references, complete watches only."
  }
};

export function generateStaticParams() {
  return Object.keys(HOUSES).map((house) => ({ house }));
}

export async function generateMetadata({ params }: { params: Promise<{ house: string }> }): Promise<Metadata> {
  const { house } = await params;
  const spec = HOUSES[house];
  if (!spec) return pageMeta({ path: "/watches", title: "Watches | Flip Culture", description: "Live watch bins." });
  return pageMeta({
    path: `/watches/${house}`,
    title: `${spec.title} | Flip Culture`,
    description: spec.description
  });
}

export default async function WatchHousePage({ params }: { params: Promise<{ house: string }> }) {
  const { house } = await params;
  const spec = HOUSES[house];
  if (!spec) notFound();
  return <HubClient title={spec.title} blurb={spec.blurb} category="watches" match={spec.match} />;
}
