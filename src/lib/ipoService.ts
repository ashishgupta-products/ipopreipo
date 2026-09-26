import { IpoItem } from '../types';
import { INDIAN_IPOS } from '../data/ipoData';
import liveData from '../data/live_ipos.json';

export interface LiveIpoPayload {
  lastUpdated: string;
  count: number;
  ipos: IpoItem[];
}

export function getMergedIpos(): IpoItem[] {
  try {
    const liveList: IpoItem[] = (liveData as any).ipos || [];
    
    // Map existing live IDs
    const liveIds = new Set(liveList.map((i) => i.id));
    
    // Add baseline IPOs that might not be in the current live weekly window
    const additional = INDIAN_IPOS.filter((base) => !liveIds.has(base.id));

    return [...liveList, ...additional];
  } catch (error) {
    console.error('Error reading live IPO data, falling back to baseline:', error);
    return INDIAN_IPOS;
  }
}

export function getScrapedLiveOnly(): IpoItem[] {
  try {
    return ((liveData as any).ipos as IpoItem[]) || INDIAN_IPOS;
  } catch {
    return INDIAN_IPOS;
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
  return ipos.find((item) => 
    item.id.toLowerCase() === normalized || 
    item.symbol.toLowerCase() === normalized ||
    item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized
  );
}

