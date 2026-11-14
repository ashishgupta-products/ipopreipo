import { IpoItem } from '../types';
import { INDIAN_IPOS } from '../data/ipoData';
import liveData from '../data/live_ipos.json';
import {
  getIpoMultiYearFinancials,
  getIpoPeers,
  getIpoQuota,
  getIpoPromoterHolding,
  getIpoObjectsOfIssue,
  getIpoAnchorDetails,
  getIpoLeadManagers,
  getIpoGmpHistory,
  getIpoDailyGmpChange,
  getIpoLogoUrl
} from './ipoEnricher';

export interface LiveIpoPayload {
  lastUpdated: string;
  count: number;
  ipos: IpoItem[];
}

export type EffectiveIpoStatus = 'LIVE' | 'UPCOMING' | 'LISTED';

/**
 * Canonical Entity Mapping to prevent duplicate ghost rows across scrapers and databases
 */
export const CANONICAL_IPO_IDS: Record<string, string> = {
  'reliance-jio': 'jio-platforms',
  'jio': 'jio-platforms',
  'jio-platforms': 'jio-platforms',
  'makemytrip': 'makemytrip',
  'nse': 'nse',
  'national-stock-exchange': 'nse',
  'bse': 'bse',
  'bse-limited': 'bse',
};

/**
 * Master Registry of Publicly Listed Securities (Domestic & International)
 * Guarantees that already listed corporations can NEVER be classified as 'UPCOMING'
 */
export const KNOWN_LISTED_ENTITIES = new Set([
  'nse',
  'bse',
  'makemytrip',
  'jio-platforms',
  'reliance-jio',
  'swiggy',
  'zomato',
  'paytm',
  'nykaa',
  'ola-electric',
  'hyundai',
  'bajaj-housing-finance'
]);

/**
 * Determines the true operational status of an IPO based on realized market data and SEBI timeline.
 * - 'LISTED': Official listing price is recorded, listing gain realized, or entity is verified listed.
 * - 'LIVE': Bidding is actively open today (now >= biddingStarts && now <= biddingEnds).
 * - 'UPCOMING': Verified unlisted pre-IPO entity with active SEBI draft / awaiting bidding.
 */
export function getEffectiveIpoStatus(ipo: IpoItem): EffectiveIpoStatus {
  if (!ipo) return 'UPCOMING';

  const lowerId = (ipo.id || '').toLowerCase().trim();
  const lowerName = (ipo.name || '').toLowerCase().trim();
  const upperSym = (ipo.symbol || '').toUpperCase().trim();
  const lowerAbout = (ipo.about || '').toLowerCase();
  const canonicalId = CANONICAL_IPO_IDS[lowerId] || lowerId;

  // 1. Definite LISTED conditions from market execution data
  if (
    ipo.status === 'LISTED' ||
    (typeof ipo.listingPrice === 'number' && ipo.listingPrice > 0) ||
    typeof ipo.listingGainPercent === 'number' ||
    typeof ipo.listingDayClose === 'number'
  ) {
    return 'LISTED';
  }

  // 2. Master Listed Securities Registry & Dual-Listing Verification Gate
  if (
    KNOWN_LISTED_ENTITIES.has(canonicalId) ||
    KNOWN_LISTED_ENTITIES.has(lowerId) ||
    upperSym === 'NSE' ||
    upperSym === 'BSE' ||
    upperSym === 'MMYT' ||
    upperSym === 'JIO' ||
    lowerName === 'nse' ||
    lowerName === 'national stock exchange' ||
    lowerName.includes('jio platforms') ||
    lowerAbout.includes('is listed on nasdaq') ||
    lowerAbout.includes('listed on nasdaq') ||
    lowerAbout.includes('is listed on bse') ||
    lowerAbout.includes('listed on bse') ||
    lowerAbout.includes('is listed on nse') ||
    lowerAbout.includes('listed on nse')
  ) {
    return 'LISTED';
  }

  // Check if official listing date has passed
  const listDateStr = ipo.timeline?.listingDate;
  if (listDateStr && listDateStr !== 'TBA' && listDateStr !== '–' && listDateStr !== '-') {
    const listD = new Date(listDateStr);
    if (!isNaN(listD.getTime()) && listD <= new Date()) {
      return 'LISTED';
    }
  }

  // In scraped Zerodha data, 'CLOSED' denotes issues that concluded bidding and completed their listing cycle
  if (ipo.status === 'CLOSED') {
    return 'LISTED';
  }

  // 3. LIVE verification (actively open for subscription today)
  const bStartStr = ipo.timeline?.biddingStarts;
  const bEndStr = ipo.timeline?.biddingEnds;

  const isBiddingAnnounced =
    Boolean(bStartStr && bEndStr) &&
    bStartStr !== 'TBA' &&
    bEndStr !== 'TBA' &&
    !bStartStr!.toLowerCase().includes('announced') &&
    !bEndStr!.toLowerCase().includes('announced') &&
    bStartStr !== '–' &&
    bEndStr !== '–';

  if (isBiddingAnnounced) {
    const start = new Date(bStartStr!);
    const end = new Date(bEndStr!);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      end.setHours(23, 59, 59, 999);
      const now = new Date();
      if (now >= start && now <= end) {
        return 'LIVE';
      }
      if (now > end) {
        // If bidding ended, check if listing date is already past
        if (listDateStr && listDateStr !== 'TBA' && listDateStr !== '–') {
          const listD = new Date(listDateStr);
          if (!isNaN(listD.getTime()) && listD <= now) {
            return 'LISTED';
          }
        }
        return 'UPCOMING';
      }
    }
  }

  // If status is marked ONGOING but bidding dates are TBA (e.g. Zerodha table 0 drafts), it's UPCOMING
  return 'UPCOMING';
}

function enrichSingleIpo(item: IpoItem): IpoItem {
  const effectiveStatus = getEffectiveIpoStatus(item);
  return {
    ...item,
    status: effectiveStatus,
    logoUrl: item.logoUrl || getIpoLogoUrl(item.name, item.symbol),
    faceValue: item.faceValue || (item.category === 'SME' ? 10 : 10),
    dailyGmpChange: getIpoDailyGmpChange(item),
    gmpDailyHistory: getIpoGmpHistory(item),
    multiYearFinancials: (item.multiYearFinancials && item.multiYearFinancials.length > 0) ? item.multiYearFinancials : getIpoMultiYearFinancials(item),
    peers: getIpoPeers(item),
    quotaReservation: getIpoQuota(item),
    promoterHolding: getIpoPromoterHolding(item),
    objectsOfIssue: (item.objectsOfIssue && item.objectsOfIssue.length > 0) ? item.objectsOfIssue : getIpoObjectsOfIssue(item),
    anchorDetails: getIpoAnchorDetails(item) || undefined,
    leadManagers: getIpoLeadManagers(item),
    registeredOffice: item.registeredOffice || (item.category === 'SME' ? 'Corporate Industrial Zone, India' : 'Mumbai / Bengaluru / New Delhi, India'),
    yearIncorporated: item.yearIncorporated || 2014,
    rhpUrl: item.rhpUrl || 'https://www.sebi.gov.in/filings/public-issues.html',
    drhpUrl: item.drhpUrl || 'https://www.sebi.gov.in/filings/public-issues.html',
    strengths: item.strengths,
    risks: item.risks
  };
}

export function isRelevantEquityIpo(item: IpoItem): boolean {
  if (!item) return false;
  const sym = (item.symbol || '').toUpperCase();
  const cat = (item.category || '').toUpperCase();
  const id = (item.id || '').toLowerCase();
  const name = (item.name || '').toLowerCase();
  if (sym.includes('ZCZP') || sym.includes('SSE') || cat === 'SSE') return false;
  if (id.includes('foundation') || name.includes('foundation')) return false;
  return true;
}

export function getMergedIpos(): IpoItem[] {
  try {
    const rawLiveList: IpoItem[] = (liveData as any).ipos || [];
    const liveList = rawLiveList.filter(isRelevantEquityIpo);
    
    // Map existing live IDs using canonical identities
    const liveIds = new Set(liveList.map((i) => CANONICAL_IPO_IDS[i.id] || i.id));
    
    // Add baseline IPOs that might not be in the current live weekly window
    const additional = INDIAN_IPOS.filter((base) => {
      const cId = CANONICAL_IPO_IDS[base.id] || base.id;
      return !liveIds.has(cId) && isRelevantEquityIpo(base);
    });

    const combined = [...liveList, ...additional];

    // Canonical Entity Deduplication Pipeline:
    // Deduplicates rows, resolving conflicting statuses in favor of market-realized 'LISTED'
    const dedupedMap = new Map<string, IpoItem>();
    for (const raw of combined) {
      const canonicalId = CANONICAL_IPO_IDS[raw.id] || raw.id;
      const itemWithCanonicalId = { ...raw, id: canonicalId };
      const enriched = enrichSingleIpo(itemWithCanonicalId);

      const existing = dedupedMap.get(canonicalId);
      if (!existing) {
        dedupedMap.set(canonicalId, enriched);
      } else {
        if (existing.status !== 'LISTED' && enriched.status === 'LISTED') {
          dedupedMap.set(canonicalId, enriched);
        } else if (existing.status === 'LISTED') {
          dedupedMap.set(canonicalId, { ...enriched, ...existing, status: 'LISTED' });
        }
      }
    }

    return Array.from(dedupedMap.values());
  } catch (error) {
    console.error('Error reading live IPO data, falling back to baseline:', error);
    return INDIAN_IPOS.filter(isRelevantEquityIpo).map(enrichSingleIpo);
  }
}

export function getScrapedLiveOnly(): IpoItem[] {
  try {
    const list = (((liveData as any).ipos as IpoItem[]) || INDIAN_IPOS).filter(isRelevantEquityIpo);
    const dedupedMap = new Map<string, IpoItem>();
    for (const raw of list) {
      const canonicalId = CANONICAL_IPO_IDS[raw.id] || raw.id;
      const item = { ...raw, id: canonicalId };
      const enriched = enrichSingleIpo(item);
      const existing = dedupedMap.get(canonicalId);
      if (!existing || (existing.status !== 'LISTED' && enriched.status === 'LISTED')) {
        dedupedMap.set(canonicalId, enriched);
      }
    }
    return Array.from(dedupedMap.values());
  } catch {
    return INDIAN_IPOS.filter(isRelevantEquityIpo).map(enrichSingleIpo);
  }
}

export function getLastUpdatedTimestamp(): string {
  try {
    return (liveData as any).lastUpdated || new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function getIpoById(id: string): IpoItem | undefined {
  const ipos = getMergedIpos();
  const normalized = decodeURIComponent(id).toLowerCase().trim();
  const found = ipos.find((item) => 
    item.id.toLowerCase() === normalized || 
    item.symbol.toLowerCase() === normalized ||
    item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized
  );
  return found ? enrichSingleIpo(found) : undefined;
}
