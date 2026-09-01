import { IPOData, IPOCategory, IPOStatus } from "@/types/ipo";
import { sql } from "@/lib/db";
import defaultIPOs from "@/data/ipos.json";

let localCache: IPOData[] | null = null;
let localCacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute local in-memory cache

// Maps Neon database row back to TypeScript IPOData
function mapRowToIPO(row: any): IPOData {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    companyName: row.company_name || row.companyName || row.name,
    logoUrl: row.logo_url || row.logoUrl || undefined,
    category: (row.category as IPOCategory) || "mainboard",
    status: (row.status as IPOStatus) || "upcoming",
    exchange: (row.exchange as IPOData["exchange"]) || "BSE & NSE",
    priceBandMin: Number(row.price_band_min || row.priceBandMin || 0),
    priceBandMax: Number(row.price_band_max || row.priceBandMax || 0),
    issuePrice: row.issue_price !== null && row.issue_price !== undefined ? Number(row.issue_price) : (row.issuePrice !== undefined ? Number(row.issuePrice) : undefined),
    lotSize: Number(row.lot_size || row.lotSize || 1),
    minInvestment: Number(row.min_investment || row.minInvestment || 0),
    issueSizeTotalCr: row.issue_size_total_cr !== null && row.issue_size_total_cr !== undefined ? Number(row.issue_size_total_cr) : (row.issueSizeTotalCr !== undefined ? Number(row.issueSizeTotalCr) : 0),
    freshIssueCr: row.fresh_issue_cr !== null && row.fresh_issue_cr !== undefined ? Number(row.fresh_issue_cr) : (row.freshIssueCr !== undefined ? Number(row.freshIssueCr) : 0),
    ofsCr: row.ofs_cr !== null && row.ofs_cr !== undefined ? Number(row.ofs_cr) : (row.ofsCr !== undefined ? Number(row.ofsCr) : 0),
    faceValue: Number(row.face_value || row.faceValue || 10),
    gmp: Number(row.gmp || 0),
    gmpPercent: Number(row.gmp_percent || row.gmpPercent || 0),
    gmpUpdatedTime: row.gmp_updated_time || row.gmpUpdatedTime || "Live",
    expectedListingPrice: Number(row.expected_listing_price || row.expectedListingPrice || 0),
    totalSubscription: Number(row.total_subscription || row.totalSubscription || 0),
    qibSubscription: Number(row.qib_subscription || row.qibSubscription || 0),
    niiSubscription: Number(row.nii_subscription || row.niiSubscription || 0),
    retailSubscription: Number(row.retail_subscription || row.retailSubscription || 0),
    openDate: row.open_date || row.openDate || "",
    closeDate: row.close_date || row.closeDate || "",
    allotmentDate: row.allotment_date || row.allotmentDate || "",
    refundDate: row.refund_date || row.refundDate || "",
    dematCreditDate: row.demat_credit_date || row.dematCreditDate || "",
    listingDate: row.listing_date || row.listingDate || "",
    listingPrice: row.listing_price !== null && row.listing_price !== undefined ? Number(row.listing_price) : (row.listingPrice !== undefined ? Number(row.listingPrice) : undefined),
    listingGainPercent: row.listing_gain_percent !== null && row.listing_gain_percent !== undefined ? Number(row.listing_gain_percent) : (row.listingGainPercent !== undefined ? Number(row.listingGainPercent) : undefined),
    currentMarketPrice: row.current_market_price !== null && row.current_market_price !== undefined ? Number(row.current_market_price) : (row.currentMarketPrice !== undefined ? Number(row.currentMarketPrice) : undefined),
    companyAddress: row.company_address || row.companyAddress || undefined,
    companyPhone: row.company_phone || row.companyPhone || undefined,
    companyEmail: row.company_email || row.companyEmail || undefined,
    companyWebsite: row.company_website || row.companyWebsite || undefined,
    registrarName: row.registrar_name || row.registrarName || "Check Website",
    registrarWebsite: row.registrar_website || row.registrarWebsite || "",
    registrarCheckUrl: row.registrar_check_url || row.registrarCheckUrl || "",
    registrarPhone: row.registrar_phone || row.registrarPhone || undefined,
    registrarEmail: row.registrar_email || row.registrarEmail || undefined,
    recommendation: (row.recommendation as IPOData["recommendation"]) || "May Apply",
    rating: Number(row.rating || 3.5),
    reviewScore: row.review_score !== null && row.review_score !== undefined ? Number(row.review_score) : (row.reviewScore !== undefined ? Number(row.reviewScore) : undefined),
    brokerReviews: row.broker_reviews || row.brokerReviews || undefined,
    memberReviews: row.member_reviews || row.memberReviews || undefined,
    leadManagers: Array.isArray(row.lead_managers) ? row.lead_managers : (Array.isArray(row.leadManagers) ? row.leadManagers : []),
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    risks: Array.isArray(row.risks) ? row.risks : [],
    prospectusUrl: row.prospectus_url || row.prospectusUrl || undefined,
    drhpUrl: row.drhp_url || row.drhpUrl || undefined,
    gmpTrends: row.gmp_trends || row.gmpTrends || undefined,
    financials: row.financials || undefined,
    lotSizes: row.lot_sizes || row.lotSizes || undefined,
    subscriptionBreakdown: row.subscription_breakdown || row.subscriptionBreakdown || undefined,
    peerComparison: row.peer_comparison || row.peerComparison || undefined,
    reservations: row.reservations || undefined,
    kpis: row.kpis || undefined,
    objectsOfIssue: row.objects_of_issue || row.objectsOfIssue || undefined,
  };
}

function loadLocalJSON(): IPOData[] {
  if (Array.isArray(defaultIPOs) && defaultIPOs.length > 0) {
    return defaultIPOs as unknown as IPOData[];
  }
  return [];
}

let dbMigrationAttempted = false;
async function ensureDbMigrations() {
  if (!sql || dbMigrationAttempted) return;
  dbMigrationAttempted = true;
  try {
    // Ensure all modern columns exist on deployed Neon PostgreSQL
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS company_address TEXT;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS company_phone VARCHAR(50);`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS company_email VARCHAR(100);`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS company_website VARCHAR(555);`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS gmp_trends JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS financials JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS lot_sizes JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS subscription_breakdown JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS peer_comparison JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS reservations JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS kpis JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS objects_of_issue JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS broker_reviews JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS member_reviews JSONB;`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS highlights TEXT[];`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS risks TEXT[];`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS drhp_url VARCHAR(1000);`;
    await sql`ALTER TABLE ipos ADD COLUMN IF NOT EXISTS prospectus_url VARCHAR(1000);`;

    // Backfill missing logos in database from static baseline
    const staticList = loadLocalJSON();
    for (const item of staticList) {
      if (item.logoUrl) {
        await sql`
          UPDATE ipos 
          SET logo_url = ${item.logoUrl} 
          WHERE slug = ${item.slug} AND (logo_url IS NULL OR logo_url = '');
        `.catch(() => {});
      }
    }
  } catch (e) {
    console.warn("Auto-migration notice (columns may already exist):", e);
  }
}

export async function fetchIPOs(): Promise<IPOData[]> {
  const now = Date.now();
  if (localCache && now - localCacheTimestamp < CACHE_DURATION) {
    return localCache;
  }

  const baselineIPOs = loadLocalJSON();
  const baselineMap = new Map<string, IPOData>();
  baselineIPOs.forEach((ipo) => baselineMap.set(ipo.slug, ipo));

  // 1. First priority: Fetch from Neon PostgreSQL Database if connected
  if (sql) {
    try {
      await ensureDbMigrations();
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
        const dbIpos = rows.map(mapRowToIPO);
        
        // Merge with local baseline dataset so missing DB fields (e.g. empty GMP/sub/logo) are seamlessly enriched
        const mergedIPOs: IPOData[] = dbIpos.map((dbIpo) => {
          const base = baselineMap.get(dbIpo.slug);
          if (!base) return dbIpo;
          return {
            ...base,
            ...dbIpo,
            // Fall back to baseline for rich objects if DB field is empty or null
            logoUrl: dbIpo.logoUrl || base.logoUrl,
            gmp: dbIpo.gmp || base.gmp || 0,
            gmpPercent: dbIpo.gmpPercent || base.gmpPercent || 0,
            gmpTrends: dbIpo.gmpTrends && dbIpo.gmpTrends.length > 0 ? dbIpo.gmpTrends : base.gmpTrends,
            totalSubscription: dbIpo.totalSubscription || base.totalSubscription || 0,
            qibSubscription: dbIpo.qibSubscription || base.qibSubscription || 0,
            niiSubscription: dbIpo.niiSubscription || base.niiSubscription || 0,
            retailSubscription: dbIpo.retailSubscription || base.retailSubscription || 0,
            subscriptionBreakdown: dbIpo.subscriptionBreakdown && dbIpo.subscriptionBreakdown.length > 0 ? dbIpo.subscriptionBreakdown : base.subscriptionBreakdown,
            financials: dbIpo.financials && dbIpo.financials.length > 0 ? dbIpo.financials : base.financials,
            lotSizes: dbIpo.lotSizes && dbIpo.lotSizes.length > 0 ? dbIpo.lotSizes : base.lotSizes,
            peerComparison: dbIpo.peerComparison && dbIpo.peerComparison.length > 0 ? dbIpo.peerComparison : base.peerComparison,
            reservations: dbIpo.reservations || base.reservations,
            kpis: dbIpo.kpis || base.kpis,
            objectsOfIssue: dbIpo.objectsOfIssue && dbIpo.objectsOfIssue.length > 0 ? dbIpo.objectsOfIssue : base.objectsOfIssue,
            highlights: dbIpo.highlights && dbIpo.highlights.length > 0 ? dbIpo.highlights : base.highlights,
            risks: dbIpo.risks && dbIpo.risks.length > 0 ? dbIpo.risks : base.risks,
            leadManagers: dbIpo.leadManagers && dbIpo.leadManagers.length > 0 ? dbIpo.leadManagers : base.leadManagers,
            registrarName: (dbIpo.registrarName && dbIpo.registrarName !== "Check Website" && dbIpo.registrarName !== "Check Registrar") ? dbIpo.registrarName : (base.registrarName || dbIpo.registrarName),
            registrarWebsite: dbIpo.registrarWebsite || base.registrarWebsite,
            registrarCheckUrl: dbIpo.registrarCheckUrl || base.registrarCheckUrl,
            prospectusUrl: dbIpo.prospectusUrl || base.prospectusUrl,
            drhpUrl: dbIpo.drhpUrl || base.drhpUrl,
            companyAddress: dbIpo.companyAddress || base.companyAddress,
            companyWebsite: dbIpo.companyWebsite || base.companyWebsite,
            companyPhone: dbIpo.companyPhone || base.companyPhone,
            companyEmail: dbIpo.companyEmail || base.companyEmail,
          };
        });

        // Add any baseline IPOs that might not be in DB yet
        const dbSlugs = new Set(dbIpos.map((i) => i.slug));
        baselineIPOs.forEach((baseIpo) => {
          if (!dbSlugs.has(baseIpo.slug)) {
            mergedIPOs.push(baseIpo);
          }
        });

        localCache = mergedIPOs;
        localCacheTimestamp = now;
        return mergedIPOs;
      }
    } catch (dbErr) {
      console.warn("Neon Database query failed, falling back to local JSON:", dbErr);
    }
  }

  // 2. Second priority: Flat-File JSON storage (updated by GitHub Actions)
  if (baselineIPOs.length > 0) {
    localCache = baselineIPOs;
    localCacheTimestamp = now;
    return baselineIPOs;
  }

  return [];
}

// Backward compatibility alias for any existing files referencing fetchUpvalyIPOs
export const fetchUpvalyIPOs = fetchIPOs;
