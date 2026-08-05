import { NextResponse } from "next/server";
import { fetchUpvalyIPOs } from "@/lib/upvaly";

export async function GET() {
  try {
    const ipos = await fetchUpvalyIPOs();
    return NextResponse.json({ success: true, data: ipos });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch IPO data" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
