import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { MOCK_CREDIT_CARDS } from "@/data/mockCreditCards";
import { CreditCardData } from "@/types/finance";

// In-memory store initialized with MOCK_CREDIT_CARDS
let creditCardsStore: CreditCardData[] = [...MOCK_CREDIT_CARDS];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: creditCardsStore,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch credit cards" },
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
      issuer,
      category = ["rewards"],
      rating = 4.5,
      joiningFee = 500,
      annualFee = 500,
      annualFeeWaiverCondition = "Waived on ₹1.0 Lakh spend/year",
      rewardRate = "2% Cashback",
      keyPrivileges = [],
      minIncomePerMonth = 25000,
      recommendedCreditScore = 750,
      pros = [],
      cons = [],
      applyUrl = "https://bank.com",
      isPopular = false,
      overview = "",
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const newCard: CreditCardData = {
      id: `card_${Date.now()}`,
      name,
      slug,
      issuer: issuer || "Commercial Bank",
      category: Array.isArray(category) ? category : [category],
      rating: Number(rating) || 4.5,
      joiningFee: Number(joiningFee) || 0,
      annualFee: Number(annualFee) || 0,
      annualFeeWaiverCondition: annualFeeWaiverCondition || "None",
      rewardRate: rewardRate || "1%",
      keyPrivileges: Array.isArray(keyPrivileges) ? keyPrivileges : [keyPrivileges],
      minIncomePerMonth: Number(minIncomePerMonth) || 25000,
      recommendedCreditScore: Number(recommendedCreditScore) || 750,
      pros: Array.isArray(pros) ? pros : [],
      cons: Array.isArray(cons) ? cons : [],
      applyUrl: applyUrl || "https://bank.com",
      isPopular: Boolean(isPopular),
      overview: overview || `${name} offered by ${issuer}.`,
    };

    const existingIdx = creditCardsStore.findIndex((c) => c.slug === slug);
    if (existingIdx >= 0) {
      creditCardsStore[existingIdx] = { ...creditCardsStore[existingIdx], ...newCard };
    } else {
      creditCardsStore.unshift(newCard);
    }

    return NextResponse.json({
      success: true,
      message: "Credit card created successfully",
      data: newCard,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save credit card" },
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

    const idx = creditCardsStore.findIndex((c) => c.slug === slug);
    if (idx < 0) {
      return NextResponse.json({ success: false, error: "Credit card not found" }, { status: 404 });
    }

    creditCardsStore[idx] = {
      ...creditCardsStore[idx],
      ...updates,
      category: Array.isArray(updates.category) ? updates.category : creditCardsStore[idx].category,
    };

    return NextResponse.json({
      success: true,
      message: "Credit card updated successfully",
      data: creditCardsStore[idx],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update credit card" },
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

    const idx = creditCardsStore.findIndex((c) => c.slug === slug || c.id === id);
    if (idx >= 0) {
      creditCardsStore.splice(idx, 1);
    }

    return NextResponse.json({
      success: true,
      message: "Credit card deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete credit card" },
      { status: 500 }
    );
  }
}
