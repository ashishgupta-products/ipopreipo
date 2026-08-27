import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { fetchIPOs } from "@/lib/ipo-service";
import { sql } from "@/lib/db";
import { MOCK_ARTICLES } from "@/data/mockArticles";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.email !== "admin@ipopreipo.com")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const ipos = await fetchIPOs().catch(() => []);
    
    const totalIpos = ipos.length;
    const mainboardCount = ipos.filter((i) => (i.category as string)?.toLowerCase() === "mainboard").length;
    const smeCount = ipos.filter((i) => (i.category as string)?.toLowerCase() === "sme").length;
    const liveCount = ipos.filter((i) => (i.status as string)?.toLowerCase() === "live").length;
    const upcomingCount = ipos.filter((i) => (i.status as string)?.toLowerCase() === "upcoming").length;
    const listedCount = ipos.filter((i) => (i.status as string)?.toLowerCase() === "listed").length;
    const positiveGmpCount = ipos.filter((i) => (i.gmp || 0) > 0).length;

    let totalUsers = 3; // Fallback demo users count
    let totalArticles = MOCK_ARTICLES.length;
    let totalApplications = 0;

    if (sql) {
      try {
        const [usersRow, articlesRow, appsRow] = await Promise.all([
          sql`SELECT COUNT(*) as count FROM users`,
          sql`SELECT COUNT(*) as count FROM articles`,
          sql`SELECT COUNT(*) as count FROM user_applications`,
        ]);
        if (usersRow && usersRow[0]) totalUsers = Number(usersRow[0].count);
        if (articlesRow && articlesRow[0]) totalArticles = Number(articlesRow[0].count);
        if (appsRow && appsRow[0]) totalApplications = Number(appsRow[0].count);
      } catch (err) {
        console.warn("Neon DB stats aggregate query fallback:", err);
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalIpos,
        mainboardCount,
        smeCount,
        liveCount,
        upcomingCount,
        listedCount,
        positiveGmpCount,
        totalUsers,
        totalArticles,
        totalApplications,
        lastSyncedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
