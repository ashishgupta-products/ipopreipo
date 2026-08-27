import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/user-service";
import { fetchIPOs } from "@/lib/ipo-service";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [watchlist, allIpos] = await Promise.all([
      getUserWatchlist(session.id),
      fetchIPOs().catch(() => []),
    ]);

    const ipoMap = new Map(allIpos.map((ipo) => [ipo.slug, ipo]));

    const enrichedWatchlist = watchlist.map((item) => {
      const ipo = ipoMap.get(item.ipoSlug);
      return {
        ...item,
        ipoDetails: ipo
          ? {
              name: ipo.name,
              category: ipo.category,
              status: ipo.status,
              gmp: ipo.gmp,
              gmpPercent: ipo.gmpPercent,
              priceBandMax: ipo.priceBandMax,
              expectedListingPrice: ipo.expectedListingPrice,
              closeDate: ipo.closeDate,
              openDate: ipo.openDate,
              logoUrl: ipo.logoUrl,
            }
          : undefined,
      };
    });

    return NextResponse.json({
      success: true,
      watchlist: enrichedWatchlist,
    });
  } catch (err: any) {
    console.error("Get watchlist error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ipoSlug, ipoId } = body;

    if (!ipoSlug) {
      return NextResponse.json({ success: false, error: "ipoSlug is required" }, { status: 400 });
    }

    const item = await addToWatchlist(session.id, ipoId || ipoSlug, ipoSlug);
    return NextResponse.json({
      success: true,
      item,
      message: "Added to watchlist",
    });
  } catch (err: any) {
    console.error("Add watchlist error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const ipoSlug = searchParams.get("slug");

    if (!ipoSlug) {
      return NextResponse.json({ success: false, error: "slug query parameter is required" }, { status: 400 });
    }

    await removeFromWatchlist(session.id, ipoSlug);
    return NextResponse.json({
      success: true,
      message: "Removed from watchlist",
    });
  } catch (err: any) {
    console.error("Delete watchlist error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
}
