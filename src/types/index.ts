export type IpoCategory = 'MAINBOARD' | 'SME';

export type IpoStatus = 'UPCOMING' | 'ONGOING' | 'CLOSED' | 'LISTED';

export interface IpoTimeline {
  biddingStarts: string; // e.g. "2026-10-02"
  biddingEnds: string; // e.g. "2026-10-06"
  allotmentFinalization: string;
  refundInitiation: string;
  creditOfShares: string;
  listingDate: string;
}

export interface IpoSubscription {
  qib: number; // e.g. 54.2x
  nii: number; // e.g. 28.5x
  retail: number; // e.g. 14.8x
  employee?: number;
  total: number;
}

export interface IpoItem {
  id: string;
  name: string;
  symbol: string;
  category: IpoCategory;
  status: IpoStatus;
  priceBandLow: number;
  priceBandHigh: number;
  lotSize: number;
  issueSizeCr: number;
  freshIssueCr?: number;
  ofsCr?: number;
  gmp: number; // in INR
  gmpUpdatedDate: string;
  gmpTrend: 'UP' | 'DOWN' | 'STABLE';
  fireRating: 1 | 2 | 3 | 4 | 5; // 1-5 🔥
  exchange: 'NSE' | 'BSE' | 'NSE & BSE' | 'NSE SME' | 'BSE SME';
  registrar: string;
  registrarUrl: string;
  timeline: IpoTimeline;
  subscription?: IpoSubscription;
  listingPrice?: number;
  sector: string;
  about: string;
  financialHighlights?: {
    revenueCr: number;
    patCr: number;
    eps: number;
    peRatio: number;
    ronw: number;
  };
  tags: string[];
}

export interface PreIpoItem {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  sharePrice: number;
  change1YPercent: number;
  lotSize: number;
  minInvestment: number;
  valuationCr: number;
  peRatio?: number;
  faceValue: number;
  isin: string;
  expectedIpoTimeline: string;
  about: string;
  financials: {
    revenueCr: number;
    ebitdaCr: number;
    patCr: number;
    yoyGrowth: number;
  };
  investors: string[];
  status: 'HOT' | 'STEADY' | 'NEW';
  promoters: string;
}

export interface RegistrarInfo {
  name: string;
  code: string;
  url: string;
  supportPhone: string;
  supportEmail: string;
  featuredIpos: string[];
}
