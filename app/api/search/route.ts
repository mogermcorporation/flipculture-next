import { NextRequest, NextResponse } from "next/server";
import { filterDeals, loadAllDeals } from "@/lib/deals";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || req.nextUrl.searchParams.get("query") || "";
  try {
    const deals = await loadAllDeals();
    const filtered = filterDeals(deals, { q });
    return NextResponse.json(filtered, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    console.error("search route failed", err);
    return NextResponse.json([], { status: 200 });
  }
}
