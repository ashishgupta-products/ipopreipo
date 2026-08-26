import { IPOData, IPOCategory, IPOStatus } from "@/types/ipo";
import { sql } from "@/lib/db";
import fs from "fs";
import path from "path";

let localCache: IPOData[] | null = null;
let localCacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute local in-memory cache

// Maps Neon database row back to TypeScript IPOData
function mapRowToIPO(row: any): IPOData {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    companyName: row.company_name,
    logoUrl: row.logo_url || undefined,
    category: row.category as IPOCategory,
    status: row.status as IPOStatus,
    exchange: row.exchange as IPOData["exchange"],
    priceBandMin: Number(row.price_band_min || 0),
    priceBandMax: Number(row.price_band_max || 0),
    issuePrice: row.issue_price !== null && row.issue_price !== undefined ? Number(row.issue_price) : undefined,
    lotSize: Number(row.lot_size || 1),
    minInvestment: Number(row.min_investment || 0),
    issueSizeTotalCr: row.issue_size_total_cr !== null ? Number(row.issue_size_total_cr) : 0,
    freshIssueCr: row.fresh_issue_cr !== null ? Number(row.fresh_issue_cr) : 0,
    ofsCr: row.ofs_cr !== null ? Number(row.ofs_cr) : 0,
    faceValue: Number(row.face_value || 10),
    gmp: Number(row.gmp || 0),
    gmpPercent: Number(row.gmp_percent || 0),
    gmpUpdatedTime: row.gmp_updated_time || "Live",
    expectedListingPrice: Number(row.expected_listing_price || 0),
    totalSubscription: Number(row.total_subscription || 0),
    qibSubscription: Number(row.qib_subscription || 0),
    niiSubscription: Number(row.nii_subscription || 0),
    retailSubscription: Number(row.retail_subscription || 0),
    openDate: row.open_date || "",
    closeDate: row.close_date || "",
    allotmentDate: row.allotment_date || "",
    refundDate: row.refund_date || "",
    dematCreditDate: row.demat_credit_date || "",
    listingDate: row.listing_date || "",
    listingPrice: row.listing_price !== null && row.listing_price !== undefined ? Number(row.listing_price) : undefined,
    listingGainPercent: row.listing_gain_percent !== null && row.listing_gain_percent !== undefined ? Number(row.listing_gain_percent) : undefined,
    currentMarketPrice: row.current_market_price !== null && row.current_market_price !== undefined ? Number(row.current_market_price) : undefined,
    registrarName: row.registrar_name || "Check Website",
    registrarWebsite: row.registrar_website || "",
    registrarCheckUrl: row.registrar_check_url || "",
    registrarPhone: row.registrar_phone || undefined,
    registrarEmail: row.registrar_email || undefined,
    recommendation: row.recommendation as IPOData["recommendation"] || "May Apply",
    rating: Number(row.rating || 3.5),
    leadManagers: Array.isArray(row.lead_managers) ? row.lead_managers : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    risks: Array.isArray(row.risks) ? row.risks : [],
    prospectusUrl: row.prospectus_url || undefined,
    drhpUrl: row.drhp_url || undefined,
    gmpTrends: row.gmp_trends || undefined,
    financials: row.financials || undefined,
    lotSizes: row.lot_sizes || undefined,
  };
}

function loadLocalJSON(): IPOData[] {
  try {
    const srcJsonPath = path.join(process.cwd(), "src", "data", "ipos.json");
    if (fs.existsSync(srcJsonPath)) {
      const content = fs.readFileSync(srcJsonPath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    const publicJsonPath = path.join(process.cwd(), "public", "data", "ipos.json");
    if (fs.existsSync(publicJsonPath)) {
      const content = fs.readFileSync(publicJsonPath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load local ipos.json file:", err);
  }
  return [];
}

export async function fetchIPOs(): Promise<IPOData[]> {
  const now = Date.now();
  if (localCache && now - localCacheTimestamp < CACHE_DURATION) {
    return localCache;
  }

  // 1. First priority: Fetch from Neon PostgreSQL Database if connected
  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM ipos 
        ORDER BY 
          CASE 
            WHEN status = 'live' THEN 1 
            WHEN status = 'upcoming' THEN 2 
            ELSE 3 
          END,
          open_date DESC;
      `;
      if (rows && rows.length > 0) {
        const ipos = rows.map(mapRowToIPO);
        localCache = ipos;
        localCacheTimestamp = now;
        return ipos;
      }
    } catch (dbErr) {
      console.warn("Neon Database query failed, falling back to local JSON:", dbErr);
    }
  }

  // 2. Second priority: Flat-File JSON storage (updated by GitHub Actions)
  const fileIPOs = loadLocalJSON();
  if (fileIPOs.length > 0) {
    localCache = fileIPOs;
    localCacheTimestamp = now;
    return fileIPOs;
  }

  return [];
}

// Backward compatibility alias for any existing files referencing fetchUpvalyIPOs
export const fetchUpvalyIPOs = fetchIPOs;
