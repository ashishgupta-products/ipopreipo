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
    prospectusUrl: row.prospectus_url || undefined,
    drhpUrl: row.drhp_url || undefined,
    gmpTrends: row.gmp_trends || undefined,
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

    const seenSymbols = new Set<string>();
    const apiIPOs: UpvalyIPO[] = [];

    const addItems = (items: UpvalyIPO[]) => {
      for (const item of items) {
        const symKey = ((item.symbol || item.name || "") + "_" + (item.type || "")).trim().toUpperCase();
        if (!symKey || !seenSymbols.has(symKey)) {
          if (symKey) seenSymbols.add(symKey);
          apiIPOs.push(item);
        }
      }
    };

    if (resActive.ok) {
      const json = await resActive.json();
      if (json.status === "success" && Array.isArray(json.data)) {
        addItems(json.data);
      }
    }

    if (resClosed.ok) {
      const json = await resClosed.json();
      if (json.status === "success" && Array.isArray(json.data)) {
        addItems(json.data);
      }
    }

    if (apiIPOs.length === 0) {
      throw new Error("Failed to retrieve any data from active or closed endpoints");
    }

    // Fetch existing slugs to handle duplicate slug conflicts in memory
    const slugToIdMap = new Map<string, string>();
    if (sql) {
      try {
        const existingIpos = await sql`SELECT id, slug FROM ipos`;
        for (const row of existingIpos) {
          slugToIdMap.set(row.slug, row.id);
        }
      } catch (dbReadErr) {
        console.warn("Could not read existing ipos from database:", dbReadErr);
      }
    }

    const inMemoryIPOs: IPOData[] = [];
    const seenIds = new Set<string>();
    const seenSlugs = new Set<string>();

    // Map raw API array to standard IPOData objects
    for (const item of apiIPOs) {
      try {
        if (item.type && item.type.toLowerCase() === "sse") {
          continue;
        }
      const rawSymbol = (item.symbol || slugify(item.name) || "ipo").trim();
      const baseId = `api-${rawSymbol}`;
      let id = baseId;
      let idCounter = 1;
      while (seenIds.has(id)) {
        id = `${baseId}-${idCounter++}`;
      }
      seenIds.add(id);

      let baseSlug = slugify(item.name);
      if (!baseSlug) baseSlug = `ipo-${rawSymbol.toLowerCase()}`;
      let slug = baseSlug;
      let slugCounter = 1;
      while (seenSlugs.has(slug)) {
        slug = `${baseSlug}-${slugCounter++}`;
      }
      seenSlugs.add(slug);
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
      const typeLower = (item.type || "").toLowerCase();
      if (typeLower.includes("sme")) {
        category = "sme";
      }

      let status: IPOStatus = "upcoming";
      const statusLower = (item.status || "").toLowerCase();
      if (statusLower === "live") {
        status = "live";
      } else if (statusLower === "closed") {
        status = "closed";
      } else if (statusLower === "listed") {
        status = "listed";
      }

      let exchange: IPOData["exchange"] = "BSE & NSE";
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

      let recommendation: IPOData["recommendation"] = "Neutral";
      if (gmpPercent > 20) {
        recommendation = "Apply for Listing Gain";
      } else if (gmpPercent > 10) {
        recommendation = "May Apply";
      } else if (gmpPercent < 0) {
        recommendation = "Avoid";
      }

      const rating = Math.min(5, Math.max(1, 3 + Math.round((gmpPercent / 15) * 10) / 10));

      const parsedIPO: IPOData = {
        id,
        slug,
        name: item.name,
        companyName: item.name,
        logoUrl: item.logoUrl || undefined,
        category,
        status,
        exchange,
        priceBandMin,
        priceBandMax,
        lotSize,
        minInvestment,
        issueSizeTotalCr: parseNumber(item.issueSize?.totalIssueSize),
        freshIssueCr: parseNumber(item.issueSize?.freshIssue),
        ofsCr: parseNumber(item.issueSize?.offerForSale),
        faceValue: 10,
        gmp,
        gmpPercent,
        gmpUpdatedTime: "Live",
        expectedListingPrice,
        totalSubscription,
        qibSubscription,
        niiSubscription,
        retailSubscription,
        openDate,
        closeDate,
        allotmentDate,
        refundDate,
        dematCreditDate,
        listingDate,
        registrarName: "Check Website",
        registrarWebsite: item.detailsUrl || "",
        registrarCheckUrl: item.detailsUrl || "",
        recommendation,
        rating,
        leadManagers: [],
        highlights: item.strengths || [],
        risks: item.risks || [],
        drhpUrl: item.drhpLink || undefined,
        prospectusUrl: item.rhpLink || undefined,
        gmpTrends: item.greyMarketPremium?.gmpTrends || undefined,
      };

        inMemoryIPOs.push(parsedIPO);
      } catch (parseItemErr) {
        console.error(`Error parsing IPO item ${item.name}:`, parseItemErr);
      }
    }

    // Background async batch sync to Neon PostgreSQL without blocking HTTP response
    const db = sql;
    if (db && inMemoryIPOs.length > 0) {
      const upsertPromises = inMemoryIPOs.map(async (parsedIPO) => {
        try {
          await db`
            INSERT INTO ipos (
              id, slug, name, company_name, logo_url, category, status, exchange,
              price_band_min, price_band_max, lot_size, min_investment,
              issue_size_total_cr, fresh_issue_cr, ofs_cr, face_value,
              gmp, gmp_percent, expected_listing_price,
              total_subscription, qib_subscription, nii_subscription, retail_subscription,
              open_date, close_date, allotment_date, refund_date, demat_credit_date, listing_date,
              registrar_name, registrar_website, registrar_check_url, recommendation, rating,
              highlights, risks, drhp_url, prospectus_url, gmp_trends
            ) VALUES (
              ${parsedIPO.id}, ${parsedIPO.slug}, ${parsedIPO.name}, ${parsedIPO.companyName}, ${parsedIPO.logoUrl || null}, ${parsedIPO.category}, ${parsedIPO.status}, ${parsedIPO.exchange},
              ${parsedIPO.priceBandMin}, ${parsedIPO.priceBandMax}, ${parsedIPO.lotSize}, ${parsedIPO.minInvestment},
              ${parsedIPO.issueSizeTotalCr}, ${parsedIPO.freshIssueCr}, ${parsedIPO.ofsCr}, 10,
              ${parsedIPO.gmp}, ${parsedIPO.gmpPercent}, ${parsedIPO.expectedListingPrice},
              ${parsedIPO.totalSubscription}, ${parsedIPO.qibSubscription}, ${parsedIPO.niiSubscription}, ${parsedIPO.retailSubscription},
              ${parsedIPO.openDate}, ${parsedIPO.closeDate}, ${parsedIPO.allotmentDate}, ${parsedIPO.refundDate}, ${parsedIPO.dematCreditDate}, ${parsedIPO.listingDate},
              'Check Website', ${parsedIPO.registrarWebsite || ''}, ${parsedIPO.registrarCheckUrl || ''}, ${parsedIPO.recommendation}, ${parsedIPO.rating},
              ${parsedIPO.highlights}, ${parsedIPO.risks}, ${parsedIPO.drhpUrl || null}, ${parsedIPO.prospectusUrl || null}, ${JSON.stringify(parsedIPO.gmpTrends || null)}
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
              drhp_url = EXCLUDED.drhp_url,
              prospectus_url = EXCLUDED.prospectus_url,
              gmp_trends = EXCLUDED.gmp_trends,
              updated_at = CURRENT_TIMESTAMP;
          `;
        } catch (upsertError) {
          console.error(`Failed to sync IPO item: ${parsedIPO.name} (${parsedIPO.id})`, upsertError);
        }
      });

      // Execute batch sync concurrently in background without blocking response
      Promise.allSettled(upsertPromises).catch(err => {
        console.error("Background Neon DB sync batch error:", err);
      });
    }

    // Sort and immediately serve in-memory parsed IPO list with zero latency delay
    inMemoryIPOs.sort((a, b) => {
      const orderA = a.status === "live" ? 1 : a.status === "upcoming" ? 2 : 3;
      const orderB = b.status === "live" ? 1 : b.status === "upcoming" ? 2 : 3;
      if (orderA !== orderB) return orderA - orderB;
      return (b.openDate || "").localeCompare(a.openDate || "");
    });

    localCache = inMemoryIPOs;
    localCacheTimestamp = now;
    return localCache;
  } catch (error) {
    console.error("Upvaly API / DB sync error:", error);
    if (localCache && localCache.length > 0) {
      return localCache;
    }
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM ipos ORDER BY open_date DESC`;
        if (rows && rows.length > 0) {
          return rows.map(mapRowToIPO);
        }
      } catch (dbError) {
        console.error("Local database query fallback failed.", dbError);
      }
    }
    return [];
  }
}
