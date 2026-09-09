import { NextRequest, NextResponse } from "next/server";
import { filterDeals, loadAllDeals } from "@/lib/deals";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const featured = searchParams.get("featured") === "true";
  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const cohort = searchParams.get("cohort") || undefined;

  try {
    const deals = await loadAllDeals();
    const filtered = filterDeals(deals, { featured, q, category, cohort });
    return NextResponse.json(filtered, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    console.error("deals route failed", err);
    return NextResponse.json([], { status: 200 });
  }
}
