import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminMetrics } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as any).role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const metrics = await getAdminMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error) {
    console.error("Admin metrics error:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
