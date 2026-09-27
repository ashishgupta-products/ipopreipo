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

function enrichSingleIpo(item: IpoItem): IpoItem {
  return {
    ...item,
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

export function getMergedIpos(): IpoItem[] {
  try {
    const liveList: IpoItem[] = (liveData as any).ipos || [];
    
    // Map existing live IDs
    const liveIds = new Set(liveList.map((i) => i.id));
    
    // Add baseline IPOs that might not be in the current live weekly window
    const additional = INDIAN_IPOS.filter((base) => !liveIds.has(base.id));

    const combined = [...liveList, ...additional];
    return combined.map(enrichSingleIpo);
  } catch (error) {
    console.error('Error reading live IPO data, falling back to baseline:', error);
    return INDIAN_IPOS.map(enrichSingleIpo);
  }
}

export function getScrapedLiveOnly(): IpoItem[] {
  try {
    const list = ((liveData as any).ipos as IpoItem[]) || INDIAN_IPOS;
    return list.map(enrichSingleIpo);
  } catch {
    return INDIAN_IPOS.map(enrichSingleIpo);
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
