import { NextResponse } from "next/server";
import { MOCK_OFS } from "@/data/mockOFS";
import fs from "fs";
import path from "path";

// Revalidate every 60 seconds (Incremental Static Regeneration & Edge Caching)
export const revalidate = 60;

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), "public", "data", "ofs.json");
    
    if (fs.existsSync(jsonPath)) {
      const fileData = fs.readFileSync(jsonPath, "utf-8");
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return NextResponse.json(
          { success: true, data: parsed, source: "live_sync" },
          {
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            },
          }
        );
      }
    }

    // Fallback to in-memory MOCK_OFS
    return NextResponse.json(
      { success: true, data: MOCK_OFS, source: "default" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch OFS data" },
      { status: 500 }
    );
  }
}
