import { IPOData, IPOCategory, IPOStatus } from "@/types/ipo";
import { sql } from "@/lib/db";

interface UpvalyIPOSchedule {
  startDate?: string;
  endDate?: string;
  listingDate?: string;
  allotmentFinalization?: string;
  refundInitiation?: string;
  shareCredit?: string;
}

interface UpvalyIPOGMPTrend {
  date: string;
  gmp: string;
  gain: string;
}

interface UpvalyIPOSubscription {
  reserved?: string;
  applied?: string;
  subscription?: string;
}

interface UpvalyIPO {
  symbol: string;
  type: string;
  name: string;
  logoUrl?: string;
  detailsUrl?: string;
  priceRange?: string;
  lotSize?: string;
  status: string;
  schedule?: UpvalyIPOSchedule;
  issueSize?: {
    totalIssueSize?: string | null;
    freshIssue?: string | null;
    offerForSale?: string | null;
  };
  aboutCompany?: string;
  drhpLink?: string;
  rhpLink?: string;
  strengths?: string[];
  risks?: string[];
  greyMarketPremium?: {
    gmpSource?: string;
    gmpTrends?: UpvalyIPOGMPTrend[] | null;
  };
  subscriptionNumbers?: {
    institutional?: UpvalyIPOSubscription;
    nii?: UpvalyIPOSubscription;
    retail?: UpvalyIPOSubscription;
    total?: UpvalyIPOSubscription;
  };
  exchanges?: string;
}

let localCache: IPOData[] | null = null;
let localCacheTimestamp = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes local cache when running in same process

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

function parseNumber(val: string | null | undefined): number {
  if (!val) return 0;
  const isNegative = val.includes("-") || val.toLowerCase().includes("dis") || val.toLowerCase().includes("minus");
  const cleaned = val.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  return isNegative ? -num : num;
}

// Maps database row back to IPOData typescript interface
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
    priceBandMin: Number(row.price_band_min),
    priceBandMax: Number(row.price_band_max),
    issuePrice: row.issue_price !== null ? Number(row.issue_price) : undefined,
    lotSize: Number(row.lot_size),
    minInvestment: Number(row.min_investment),
    issueSizeTotalCr: row.issue_size_total_cr !== null ? Number(row.issue_size_total_cr) : 0,
    freshIssueCr: row.fresh_issue_cr !== null ? Number(row.fresh_issue_cr) : 0,
    ofsCr: row.ofs_cr !== null ? Number(row.ofs_cr) : 0,
    faceValue: Number(row.face_value),
    gmp: Number(row.gmp),
    gmpPercent: Number(row.gmp_percent),
    gmpUpdatedTime: row.gmp_updated_time || "Live",
    expectedListingPrice: Number(row.expected_listing_price),
    totalSubscription: Number(row.total_subscription),
    qibSubscription: Number(row.qib_subscription),
    niiSubscription: Number(row.nii_subscription),
    retailSubscription: Number(row.retail_subscription),
    openDate: row.open_date || "",
    closeDate: row.close_date || "",
    allotmentDate: row.allotment_date || "",
    refundDate: row.refund_date || "",
    dematCreditDate: row.demat_credit_date || "",
    listingDate: row.listing_date || "",
    listingPrice: row.listing_price !== null ? Number(row.listing_price) : undefined,
    listingGainPercent: row.listing_gain_percent !== null ? Number(row.listing_gain_percent) : undefined,
    currentMarketPrice: row.current_market_price !== null ? Number(row.current_market_price) : undefined,
    registrarName: row.registrar_name || "Check Website",
    registrarWebsite: row.registrar_website || "",
    registrarCheckUrl: row.registrar_check_url || "",
    registrarPhone: row.registrar_phone || undefined,
    registrarEmail: row.registrar_email || undefined,
    recommendation: row.recommendation as IPOData["recommendation"],
    rating: Number(row.rating),
    leadManagers: [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    risks: Array.isArray(row.risks) ? row.risks : [],
  };
}

export async function fetchUpvalyIPOs(): Promise<IPOData[]> {
  const now = Date.now();
  if (localCache && now - localCacheTimestamp < CACHE_DURATION) {
    return localCache;
  }

  try {
    console.log("Fetching live and closed IPO data from Upvaly...");
    const [resActive, resClosed] = await Promise.all([
      fetch("https://finapi.upvaly.com/api/ipo", {
        next: { revalidate: 600 },
      }),
      fetch("https://finapi.upvaly.com/api/ipo?status=CLOSED", {
        next: { revalidate: 600 },
      })
    ]);

    let apiIPOs: UpvalyIPO[] = [];

    if (resActive.ok) {
      const json = await resActive.json();
      if (json.status === "success" && Array.isArray(json.data)) {
        apiIPOs = apiIPOs.concat(json.data);
      }
    }

    if (resClosed.ok) {
      const json = await resClosed.json();
      if (json.status === "success" && Array.isArray(json.data)) {
        apiIPOs = apiIPOs.concat(json.data);
      }
    }

    if (apiIPOs.length === 0) {
      throw new Error("Failed to retrieve any data from active or closed endpoints");
    }

    // Fetch existing slugs to handle duplicate slug conflicts in memory
    const existingIpos = await sql`SELECT id, slug FROM ipos`;
    const slugToIdMap = new Map<string, string>();
    for (const row of existingIpos) {
      slugToIdMap.set(row.slug, row.id);
    }

    // Map raw API array to database schema and upsert them sequentially
    for (const item of apiIPOs) {
      if (item.type && item.type.toLowerCase() === "sse") {
        continue;
      }
      const id = `api-${item.symbol}`;
      let slug = slugify(item.name);
      
      const existingId = slugToIdMap.get(slug);
      if (existingId && existingId !== id) {
        // Resolve slug collision by appending the unique symbol
        slug = `${slug}-${item.symbol.toLowerCase()}`;
      }
      slugToIdMap.set(slug, id);
      
      let priceBandMin = 0;
      let priceBandMax = 0;
      if (item.priceRange) {
        const parts = item.priceRange.split("–").map(p => p.trim());
        if (parts.length === 2) {
          priceBandMin = parseNumber(parts[0]);
          priceBandMax = parseNumber(parts[1]);
        } else if (parts.length === 1) {
          priceBandMin = parseNumber(parts[0]);
          priceBandMax = priceBandMin;
        }
      }

      const lotSize = parseNumber(item.lotSize) || 1;
      const minInvestment = priceBandMax * lotSize;

      let category: IPOCategory = "mainboard";
      const typeLower = item.type.toLowerCase();
      if (typeLower.includes("sme")) {
        category = "sme";
      }

      let status: IPOStatus = "upcoming";
      const statusLower = item.status.toLowerCase();
      if (statusLower === "live") {
        status = "live";
      } else if (statusLower === "closed") {
        status = "closed";
      } else if (statusLower === "listed") {
        status = "listed";
      }

      let exchange = "BSE & NSE";
      if (item.exchanges) {
        const exLower = item.exchanges.toLowerCase();
        if (exLower.includes("bse sme")) {
          exchange = "BSE SME";
        } else if (exLower.includes("nse emerge")) {
          exchange = "NSE Emerge";
        } else if (exLower.includes("bse") && exLower.includes("nse")) {
          exchange = "BSE & NSE";
        } else if (exLower.includes("bse")) {
          exchange = "BSE";
        } else if (exLower.includes("nse")) {
          exchange = "NSE";
        }
      }

      let gmp = 0;
      let gmpPercent = 0;
      const trends = item.greyMarketPremium?.gmpTrends;
      if (trends && trends.length > 0) {
        gmp = parseNumber(trends[0].gmp);
        gmpPercent = parseNumber(trends[0].gain);
      }

      if (gmp > 0 && gmpPercent === 0 && priceBandMax > 0) {
        gmpPercent = Math.round((gmp / priceBandMax) * 10000) / 100;
      }

      const expectedListingPrice = priceBandMax + gmp;

      const openDate = item.schedule?.startDate || "";
      const closeDate = item.schedule?.endDate || "";
      const allotmentDate = item.schedule?.allotmentFinalization || "";
      const refundDate = item.schedule?.refundInitiation || "";
      const dematCreditDate = item.schedule?.shareCredit || "";
      const listingDate = item.schedule?.listingDate || "";

      const totalSubscription = parseNumber(item.subscriptionNumbers?.total?.subscription);
      const qibSubscription = parseNumber(item.subscriptionNumbers?.institutional?.subscription);
      const niiSubscription = parseNumber(item.subscriptionNumbers?.nii?.subscription);
      const retailSubscription = parseNumber(item.subscriptionNumbers?.retail?.subscription);

      let recommendation = "Neutral";
      if (gmpPercent > 20) {
        recommendation = "Apply for Listing Gain";
      } else if (gmpPercent > 10) {
        recommendation = "May Apply";
      } else if (gmpPercent < 0) {
        recommendation = "Avoid";
      }

      const rating = Math.min(5, Math.max(1, 3 + Math.round((gmpPercent / 15) * 10) / 10));

      // Upsert into Neon PostgreSQL
      try {
        await sql`
          INSERT INTO ipos (
            id, slug, name, company_name, logo_url, category, status, exchange,
            price_band_min, price_band_max, lot_size, min_investment,
            issue_size_total_cr, fresh_issue_cr, ofs_cr, face_value,
            gmp, gmp_percent, expected_listing_price,
            total_subscription, qib_subscription, nii_subscription, retail_subscription,
            open_date, close_date, allotment_date, refund_date, demat_credit_date, listing_date,
            registrar_name, registrar_website, registrar_check_url, recommendation, rating,
            highlights, risks
          ) VALUES (
            ${id}, ${slug}, ${item.name}, ${item.name}, ${item.logoUrl || null}, ${category}, ${status}, ${exchange},
            ${priceBandMin}, ${priceBandMax}, ${lotSize}, ${minInvestment},
            ${parseNumber(item.issueSize?.totalIssueSize)}, ${parseNumber(item.issueSize?.freshIssue)}, ${parseNumber(item.issueSize?.offerForSale)}, 10,
            ${gmp}, ${gmpPercent}, ${expectedListingPrice},
            ${totalSubscription}, ${qibSubscription}, ${niiSubscription}, ${retailSubscription},
            ${openDate}, ${closeDate}, ${allotmentDate}, ${refundDate}, ${dematCreditDate}, ${listingDate},
            'Check Website', ${item.detailsUrl || ''}, ${item.detailsUrl || ''}, ${recommendation}, ${rating},
            ${item.strengths || []}, ${item.risks || []}
          )
          ON CONFLICT (id) DO UPDATE SET
            slug = EXCLUDED.slug,
            name = EXCLUDED.name,
            company_name = EXCLUDED.company_name,
            logo_url = EXCLUDED.logo_url,
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
            recommendation = EXCLUDED.recommendation,
            rating = EXCLUDED.rating,
            highlights = EXCLUDED.highlights,
            risks = EXCLUDED.risks,
            updated_at = CURRENT_TIMESTAMP;
        `;
      } catch (upsertError) {
        console.error(`Failed to sync IPO item: ${item.name} (${id})`, upsertError);
      }
    }

    console.log("Successfully synced Upvaly IPOs to Neon PostgreSQL.");
    
    // Retrieve all active and upcoming records from the DB to serve as the unified source of truth
    const rows = await sql`
      SELECT * FROM ipos 
      ORDER BY 
        CASE status 
          WHEN 'live' THEN 1 
          WHEN 'upcoming' THEN 2 
          ELSE 3 
        END,
        open_date DESC;
    `;
    const dbIPOs = rows.map(mapRowToIPO);

    localCache = dbIPOs;
    localCacheTimestamp = now;
    return localCache;
  } catch (error) {
    console.error("Database sync failed. Serving cached fallback if available...", error);
    try {
      // Offline fallback: try getting whatever is currently inside Postgres
      const rows = await sql`SELECT * FROM ipos ORDER BY open_date DESC`;
      if (rows && rows.length > 0) {
        return rows.map(mapRowToIPO);
      }
    } catch (dbError) {
      console.error("Local database query failed as well.", dbError);
    }
    // Hard fallback to empty array
    return [];
  }
}
