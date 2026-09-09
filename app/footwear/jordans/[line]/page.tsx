import HubClient from "@/components/HubClient";
import { notFound } from "next/navigation";

const LINES = Array.from({ length: 14 }, (_, i) => `jordan-${i + 1}`);

export function generateStaticParams() {
  return LINES.map((line) => ({ line }));
}

export default async function JordanLinePage({ params }: { params: Promise<{ line: string }> }) {
  const { line } = await params;
  if (!LINES.includes(line)) notFound();
  const n = line.replace("jordan-", "");
  return (
    <HubClient
      title={`Jordan ${n}`}
      blurb="Athletic footwear only — no apparel, cards, watches, or electronics."
      category="sneakers"
      match={`jordan\\s?${n}\\b|air jordan\\s?${n}\\b`}
    />
  );
}
