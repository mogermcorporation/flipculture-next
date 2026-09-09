import HubClient from "@/components/HubClient";
import { notFound } from "next/navigation";

const HOUSES: Record<string, { title: string; match: string; blurb: string }> = {
  rolex: {
    title: "Rolex",
    match: "rolex|submariner|datejust|daytona|gmt[- ]master",
    blurb: "Submariner, Datejust, GMT, vintage Daytona class. Complete watches only."
  },
  patek: {
    title: "Patek Philippe",
    match: "patek|nautilus",
    blurb: "Nautilus and Patek grails — most-valuable wall."
  },
  ap: {
    title: "Audemars Piguet",
    match: "audemars|piguet|royal oak|\\bap\\b",
    blurb: "Royal Oak and AP references. Watches only."
  },
  "richard-mille": {
    title: "Richard Mille",
    match: "richard mille|\\brm[- ]?\\d",
    blurb: "Richard Mille — most-valuable watch wall."
  }
};

export function generateStaticParams() {
  return Object.keys(HOUSES).map((house) => ({ house }));
}

export default async function WatchHousePage({ params }: { params: Promise<{ house: string }> }) {
  const { house } = await params;
  const spec = HOUSES[house];
  if (!spec) notFound();
  return <HubClient title={spec.title} blurb={spec.blurb} category="watches" match={spec.match} />;
}
