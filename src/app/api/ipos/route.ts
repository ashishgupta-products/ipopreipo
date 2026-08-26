import { NextResponse } from "next/server";
import { fetchUpvalyIPOs } from "@/lib/upvaly";

// Revalidate every 60 seconds (Incremental Static Regeneration & Edge Caching)
export const revalidate = 60;

export async function GET() {
  try {
    const ipos = await fetchUpvalyIPOs();
    return NextResponse.json(
      { success: true, data: ipos },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch IPO data" },
      { status: 500 }
    );
  }
}
