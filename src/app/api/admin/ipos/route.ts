import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { fetchIPOs } from "@/lib/ipo-service";
import fs from "fs";
import path from "path";

function updateLocalJson(updatedIpos: any[]) {
  try {
    const srcPath = path.join(process.cwd(), "src", "data", "ipos.json");
    if (fs.existsSync(srcPath)) {
      fs.writeFileSync(srcPath, JSON.stringify(updatedIpos, null, 2), "utf-8");
    }
    const publicPath = path.join(process.cwd(), "public", "data", "ipos.json");
    if (fs.existsSync(publicPath)) {
      fs.writeFileSync(publicPath, JSON.stringify(updatedIpos, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Failed to write to local ipos.json:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.email !== "admin@ipopreipo.com")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const ipoData = await req.json();
    if (!ipoData.name || !ipoData.slug) {
      return NextResponse.json({ success: false, error: "Name and Slug are required" }, { status: 400 });
    }

    const id = ipoData.id || ipoData.slug;
    const now = new Date().toISOString();

    if (sql) {
      try {
        await sql`
          INSERT INTO ipos (
            id, slug, name, company_name, logo_url, category, status, exchange,
            price_band_min, price_band_max, issue_price, lot_size, min_investment,
            issue_size_total_cr, fresh_issue_cr, ofs_cr, face_value,
            gmp, gmp_percent, gmp_updated_time, expected_listing_price,
            total_subscription, qib_subscription, nii_subscription, retail_subscription,
            open_date, close_date, allotment_date, refund_date, demat_credit_date, listing_date,
            registrar_name, registrar_website, registrar_check_url, recommendation, rating
          ) VALUES (
            ${ipoData.id}, ${ipoData.slug}, ${ipoData.name}, ${ipoData.companyName || ipoData.name},
            ${ipoData.logoUrl || null}, ${ipoData.category || "mainboard"}, ${ipoData.status || "upcoming"},
            ${ipoData.exchange || "BSE & NSE"}, ${Number(ipoData.priceBandMin || 0)}, ${Number(ipoData.priceBandMax || 0)},
            ${ipoData.issuePrice ? Number(ipoData.issuePrice) : null}, ${Number(ipoData.lotSize || 1)},
            ${Number(ipoData.minInvestment || 0)}, ${Number(ipoData.issueSizeTotalCr || 0)},
            ${Number(ipoData.freshIssueCr || 0)}, ${Number(ipoData.ofsCr || 0)}, ${Number(ipoData.faceValue || 10)},
            ${Number(ipoData.gmp || 0)}, ${Number(ipoData.gmpPercent || 0)}, ${ipoData.gmpUpdatedTime || "Just now"},
            ${Number(ipoData.expectedListingPrice || 0)}, ${Number(ipoData.totalSubscription || 0)},
            ${Number(ipoData.qibSubscription || 0)}, ${Number(ipoData.niiSubscription || 0)},
            ${Number(ipoData.retailSubscription || 0)}, ${ipoData.openDate || ""}, ${ipoData.closeDate || ""},
            ${ipoData.allotmentDate || ""}, ${ipoData.refundDate || ""}, ${ipoData.dematCreditDate || ""},
            ${ipoData.listingDate || ""}, ${ipoData.registrarName || "Check Registrar"},
            ${ipoData.registrarWebsite || ""}, ${ipoData.registrarCheckUrl || ""},
            ${ipoData.recommendation || "May Apply"}, ${Number(ipoData.rating || 3.5)}
          )
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            price_band_min = EXCLUDED.price_band_min,
            price_band_max = EXCLUDED.price_band_max,
            gmp = EXCLUDED.gmp,
            gmp_percent = EXCLUDED.gmp_percent,
            status = EXCLUDED.status,
            updated_at = ${now}
        `;
      } catch (err) {
        console.warn("Neon insert/update IPO failed, updating local fallback:", err);
      }
    }

    // Also update local JSON array
    const all = await fetchIPOs();
    const existingIndex = all.findIndex((i) => i.slug === ipoData.slug);
    if (existingIndex >= 0) {
      all[existingIndex] = { ...all[existingIndex], ...ipoData };
    } else {
      all.unshift({ ...ipoData, id });
    }
    updateLocalJson(all);

    return NextResponse.json({
      success: true,
      message: "IPO listing created/updated successfully",
      data: ipoData,
    });
  } catch (err: any) {
    console.error("Admin create IPO error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create IPO" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.email !== "admin@ipopreipo.com")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { slug, updates } = await req.json();
    if (!slug || !updates) {
      return NextResponse.json({ success: false, error: "Slug and updates are required" }, { status: 400 });
    }

    const now = new Date().toISOString();

    if (sql) {
      try {
        if (updates.gmp !== undefined) {
          const gmpVal = Number(updates.gmp);
          const priceMax = Number(updates.priceBandMax || 100);
          const gmpPercent = priceMax > 0 ? (gmpVal / priceMax) * 100 : 0;
          await sql`
            UPDATE ipos
            SET gmp = ${gmpVal}, gmp_percent = ${gmpPercent}, gmp_updated_time = 'Updated just now', updated_at = ${now}
            WHERE slug = ${slug}
          `;
        }
        if (updates.status !== undefined) {
          await sql`UPDATE ipos SET status = ${updates.status}, updated_at = ${now} WHERE slug = ${slug}`;
        }
      } catch (err) {
        console.warn("Neon update IPO failed:", err);
      }
    }

    const all = await fetchIPOs();
    const idx = all.findIndex((i) => i.slug === slug);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates };
      updateLocalJson(all);
    }

    return NextResponse.json({
      success: true,
      message: `IPO ${slug} updated successfully`,
    });
  } catch (err: any) {
    console.error("Admin update IPO error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update IPO" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.email !== "admin@ipopreipo.com")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ success: false, error: "slug query param is required" }, { status: 400 });
    }

    if (sql) {
      try {
        await sql`DELETE FROM ipos WHERE slug = ${slug}`;
      } catch (err) {
        console.warn("Neon delete IPO failed:", err);
      }
    }

    const all = await fetchIPOs();
    const filtered = all.filter((i) => i.slug !== slug);
    updateLocalJson(filtered);

    return NextResponse.json({
      success: true,
      message: `IPO ${slug} deleted successfully`,
    });
  } catch (err: any) {
    console.error("Admin delete IPO error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete IPO" },
      { status: 500 }
    );
  }
}
