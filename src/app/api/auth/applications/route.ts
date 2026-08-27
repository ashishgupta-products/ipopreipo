import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserApplications, createApplication, deleteApplication } from "@/lib/user-service";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const applications = await getUserApplications(session.id);
    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (err: any) {
    console.error("Get applications error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch applications" },
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
    const {
      ipoId,
      ipoSlug,
      ipoName,
      category,
      lotsApplied,
      lotSize,
      bidPrice,
      totalAmount,
      panMasked,
      applicationNumber,
      status,
      allottedLots,
    } = body;

    if (!ipoSlug || !ipoName) {
      return NextResponse.json(
        { success: false, error: "IPO name and slug are required" },
        { status: 400 }
      );
    }

    const application = await createApplication(session.id, {
      ipoId: ipoId || ipoSlug,
      ipoSlug,
      ipoName,
      category: category || "Retail",
      lotsApplied: Number(lotsApplied || 1),
      lotSize: Number(lotSize || 1),
      bidPrice: Number(bidPrice || 0),
      totalAmount: Number(totalAmount || 0),
      panMasked: panMasked || undefined,
      applicationNumber: applicationNumber || undefined,
      status: status || "Applied",
      allottedLots: allottedLots !== undefined ? Number(allottedLots) : undefined,
    });

    return NextResponse.json({
      success: true,
      application,
      message: "Application recorded successfully",
    });
  } catch (err: any) {
    console.error("Create application error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save application" },
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
    const appId = searchParams.get("id");

    if (!appId) {
      return NextResponse.json({ success: false, error: "id query parameter is required" }, { status: 400 });
    }

    await deleteApplication(session.id, appId);
    return NextResponse.json({
      success: true,
      message: "Application removed successfully",
    });
  } catch (err: any) {
    console.error("Delete application error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete application" },
      { status: 500 }
    );
  }
}
