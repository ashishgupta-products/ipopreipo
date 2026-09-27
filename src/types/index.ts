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

export interface IpoFinancialYear {
  period: string; // e.g. "FY24" or "FY23"
  assetsCr: number;
  revenueCr: number;
  patCr: number;
  netWorthCr: number;
  reservesCr?: number;
  totalBorrowingCr: number;
  ebitdaCr?: number;
}

export interface IpoPeerComparison {
  name: string;
  cmp?: number;
  peRatio: number;
  revenueCr: number;
  patCr: number;
  ronw: number;
  eps?: number;
}

export interface IpoReservationQuota {
  qibPercent: number; // e.g. 50%
  niiPercent: number; // e.g. 15%
  sHniPercent?: number; // e.g. 5% (₹2L - ₹10L)
  bHniPercent?: number; // e.g. 10% (> ₹10L)
  retailPercent: number; // e.g. 35%
  employeeShares?: number;
  employeeDiscount?: number; // e.g. ₹15/share
}

export interface IpoPromoterHolding {
  preIssuePercent: number; // e.g. 84.5%
  postIssuePercent: number; // e.g. 68.2%
  promoters: string[];
}

export interface IpoAnchorDetails {
  bidDate?: string;
  sharesAllocated?: number;
  anchorPortionCr?: number;
  lockIn30DaysDate?: string;
  lockIn90DaysDate?: string;
  topAnchors?: string[];
}

export interface IpoLotBracket {
  category: string;
  lots: number;
  shares: number;
  amount: number;
}

export interface IpoGmpDaily {
  date: string; // e.g. "27 Sep 2024" or "26 Sep"
  gmp: number; // e.g. 1560
  dailyChange: number; // e.g. +60 or -20 or 0
  estListingPrice: number; // priceBandHigh + gmp
  gainPercent: number; // (gmp / priceBandHigh) * 100
  fireRating?: number;
}

export interface IpoItem {
  id: string;
  name: string;
  symbol: string;
  logoUrl?: string;
  category: IpoCategory;
  status: IpoStatus;
  priceBandLow: number;
  priceBandHigh: number;
  faceValue?: number;
  lotSize: number;
  issueSizeCr: number;
  freshIssueCr?: number;
  ofsCr?: number;
  gmp: number; // in INR
  dailyGmpChange?: number; // Today's change compared to yesterday (e.g. +45, -10, 0)
  gmpDailyHistory?: IpoGmpDaily[]; // Daily historical records of GMP
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
    ebitdaMargin?: number;
    patMargin?: number;
    debtToEquity?: number;
  };
  multiYearFinancials?: IpoFinancialYear[];
  peers?: IpoPeerComparison[];
  quotaReservation?: IpoReservationQuota;
  promoterHolding?: IpoPromoterHolding;
  objectsOfIssue?: string[];
  anchorDetails?: IpoAnchorDetails;
  leadManagers?: string[];
  registeredOffice?: string;
  yearIncorporated?: number;
  rhpUrl?: string;
  drhpUrl?: string;
  strengths?: string[];
  risks?: string[];
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

export * from './analyst';
