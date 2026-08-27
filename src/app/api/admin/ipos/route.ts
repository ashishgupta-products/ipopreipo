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
            company_address, company_phone, company_email, company_website,
            registrar_name, registrar_website, registrar_check_url, recommendation, rating,
            highlights, risks, drhp_url, prospectus_url,
            gmp_trends, financials, lot_sizes, subscription_breakdown, peer_comparison, reservations, kpis, objects_of_issue
          ) VALUES (
            ${id}, ${ipoData.slug}, ${ipoData.name}, ${ipoData.companyName || ipoData.name},
            ${ipoData.logoUrl || null}, ${ipoData.category || "mainboard"}, ${ipoData.status || "upcoming"},
            ${ipoData.exchange || "BSE & NSE"}, ${Number(ipoData.priceBandMin || 0)}, ${Number(ipoData.priceBandMax || 0)},
            ${ipoData.issuePrice ? Number(ipoData.issuePrice) : null}, ${Number(ipoData.lotSize || 1)},
            ${Number(ipoData.minInvestment || 0)}, ${Number(ipoData.issueSizeTotalCr || 0)},
            ${Number(ipoData.freshIssueCr || 0)}, ${Number(ipoData.ofsCr || 0)}, ${Number(ipoData.faceValue || 10)},
            ${Number(ipoData.gmp || 0)}, ${Number(ipoData.gmpPercent || 0)}, ${ipoData.gmpUpdatedTime || "Live"},
            ${Number(ipoData.expectedListingPrice || 0)}, ${Number(ipoData.totalSubscription || 0)},
            ${Number(ipoData.qibSubscription || 0)}, ${Number(ipoData.niiSubscription || 0)},
            ${Number(ipoData.retailSubscription || 0)}, ${ipoData.openDate || ""}, ${ipoData.closeDate || ""},
            ${ipoData.allotmentDate || ""}, ${ipoData.refundDate || ""}, ${ipoData.dematCreditDate || ""},
            ${ipoData.listingDate || ""}, ${ipoData.companyAddress || null}, ${ipoData.companyPhone || null},
            ${ipoData.companyEmail || null}, ${ipoData.companyWebsite || null},
            ${ipoData.registrarName || "Check Registrar"}, ${ipoData.registrarWebsite || ""},
            ${ipoData.registrarCheckUrl || ""}, ${ipoData.recommendation || "May Apply"},
            ${Number(ipoData.rating || 3.5)},
            ${ipoData.highlights || []}, ${ipoData.risks || []},
            ${ipoData.drhpUrl || null}, ${ipoData.prospectusUrl || null},
            ${ipoData.gmpTrends ? JSON.stringify(ipoData.gmpTrends) : null},
            ${ipoData.financials ? JSON.stringify(ipoData.financials) : null},
            ${ipoData.lotSizes ? JSON.stringify(ipoData.lotSizes) : null},
            ${ipoData.subscriptionBreakdown ? JSON.stringify(ipoData.subscriptionBreakdown) : null},
            ${ipoData.peerComparison ? JSON.stringify(ipoData.peerComparison) : null},
            ${ipoData.reservations ? JSON.stringify(ipoData.reservations) : null},
            ${ipoData.kpis ? JSON.stringify(ipoData.kpis) : null},
            ${ipoData.objectsOfIssue ? JSON.stringify(ipoData.objectsOfIssue) : null}
          )
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            company_name = EXCLUDED.company_name,
            category = EXCLUDED.category,
            status = EXCLUDED.status,
            exchange = EXCLUDED.exchange,
            price_band_min = EXCLUDED.price_band_min,
            price_band_max = EXCLUDED.price_band_max,
            lot_size = EXCLUDED.lot_size,
            min_investment = EXCLUDED.min_investment,
            issue_size_total_cr = EXCLUDED.issue_size_total_cr,
            fresh_issue_cr = EXCLUDED.fresh_issue_cr,
            ofs_cr = EXCLUDED.ofs_cr,
            face_value = EXCLUDED.face_value,
            gmp = EXCLUDED.gmp,
            gmp_percent = EXCLUDED.gmp_percent,
            expected_listing_price = EXCLUDED.expected_listing_price,
            total_subscription = EXCLUDED.total_subscription,
            qib_subscription = EXCLUDED.qib_subscription,
            nii_subscription = EXCLUDED.nii_subscription,
            retail_subscription = EXCLUDED.retail_subscription,
            open_date = EXCLUDED.open_date,
            close_date = EXCLUDED.close_date,
            allotment_date = EXCLUDED.allotment_date,
            refund_date = EXCLUDED.refund_date,
            demat_credit_date = EXCLUDED.demat_credit_date,
            listing_date = EXCLUDED.listing_date,
            company_address = EXCLUDED.company_address,
            company_website = EXCLUDED.company_website,
            registrar_name = EXCLUDED.registrar_name,
            registrar_website = EXCLUDED.registrar_website,
            registrar_check_url = EXCLUDED.registrar_check_url,
            recommendation = EXCLUDED.recommendation,
            rating = EXCLUDED.rating,
            highlights = EXCLUDED.highlights,
            risks = EXCLUDED.risks,
            drhp_url = EXCLUDED.drhp_url,
            prospectus_url = EXCLUDED.prospectus_url,
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
        if (updates.name !== undefined) {
          await sql`
            UPDATE ipos
            SET 
              name = ${updates.name},
              category = ${updates.category || "mainboard"},
              exchange = ${updates.exchange || "BSE & NSE"},
              price_band_min = ${Number(updates.priceBandMin || 0)},
              price_band_max = ${Number(updates.priceBandMax || 0)},
              lot_size = ${Number(updates.lotSize || 1)},
              min_investment = ${Number(updates.minInvestment || 0)},
              open_date = ${updates.openDate || ""},
              close_date = ${updates.closeDate || ""},
              allotment_date = ${updates.allotmentDate || ""},
              listing_date = ${updates.listingDate || ""},
              registrar_name = ${updates.registrarName || ""},
              recommendation = ${updates.recommendation || "May Apply"},
              rating = ${Number(updates.rating || 3.5)},
              company_website = ${updates.companyWebsite || null},
              company_address = ${updates.companyAddress || null},
              updated_at = ${now}
            WHERE slug = ${slug}
          `;
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
