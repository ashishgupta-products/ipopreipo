import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { MOCK_PAYMENT_APPS } from "@/data/mockPaymentApps";
import { PaymentAppData } from "@/types/finance";

// In-memory store initialized with MOCK_PAYMENT_APPS
let paymentAppsStore: PaymentAppData[] = [...MOCK_PAYMENT_APPS];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: paymentAppsStore,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch payment apps" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.email !== "admin@ipopreipo.com")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      developer = "Fintech India Pvt Ltd",
      downloadsTier = "100M+ Downloads",
      playStoreRating = 4.5,
      appStoreRating = 4.6,
      upiLiteSupport = true,
      ruPayUpiSupport = true,
      creditScoreCheckFree = true,
      cashbackPolicy = "Scratch cards and merchant rewards",
      joiningBonus = "₹0",
      referralBonus = "₹50 / invite",
      upiSuccessRate = "99.5%",
      keyFeatures = [],
      pros = [],
      cons = [],
      downloadUrl = "https://play.google.com",
      overview = "",
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const newApp: PaymentAppData = {
      id: `pay_${Date.now()}`,
      name,
      slug,
      developer,
      downloadsTier,
      playStoreRating: Number(playStoreRating) || 4.5,
      appStoreRating: Number(appStoreRating) || 4.6,
      upiLiteSupport: Boolean(upiLiteSupport),
      ruPayUpiSupport: Boolean(ruPayUpiSupport),
      creditScoreCheckFree: Boolean(creditScoreCheckFree),
      cashbackPolicy,
      joiningBonus,
      referralBonus,
      upiSuccessRate,
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : [keyFeatures],
      pros: Array.isArray(pros) ? pros : [],
      cons: Array.isArray(cons) ? cons : [],
      downloadUrl: downloadUrl || "https://play.google.com",
      overview: overview || `${name} by ${developer}.`,
    };

    const existingIdx = paymentAppsStore.findIndex((p) => p.slug === slug);
    if (existingIdx >= 0) {
      paymentAppsStore[existingIdx] = { ...paymentAppsStore[existingIdx], ...newApp };
    } else {
      paymentAppsStore.unshift(newApp);
    }

    return NextResponse.json({
      success: true,
      message: "Payment app added successfully",
      data: newApp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save payment app" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.email !== "admin@ipopreipo.com")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, updates } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const idx = paymentAppsStore.findIndex((p) => p.slug === slug);
    if (idx < 0) {
      return NextResponse.json({ success: false, error: "Payment app not found" }, { status: 404 });
    }

    paymentAppsStore[idx] = {
      ...paymentAppsStore[idx],
      ...updates,
    };

    return NextResponse.json({
      success: true,
      message: "Payment app updated successfully",
      data: paymentAppsStore[idx],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update payment app" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.email !== "admin@ipopreipo.com")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    if (!slug && !id) {
      return NextResponse.json({ success: false, error: "slug or id required" }, { status: 400 });
    }

    const idx = paymentAppsStore.findIndex((p) => p.slug === slug || p.id === id);
    if (idx >= 0) {
      paymentAppsStore.splice(idx, 1);
    }

    return NextResponse.json({
      success: true,
      message: "Payment app deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete payment app" },
      { status: 500 }
    );
  }
}
