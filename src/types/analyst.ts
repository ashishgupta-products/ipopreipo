export interface AnalystStatKPIs {
  totalReviews: string;
  applyRate: string;
  winRate: string;
  avgListingGain: string;
  avgTotalGain: string;
}

export interface AnalystPillars {
  accuracy: number;
  returnQuality: number;
  consistency: number;
  horizon: number;
}

export interface AnalystVerdictBreakdown {
  apply: number;
  mayApply: number;
  neutral: number;
  avoid: number;
}

export interface AnalystHighlightCall {
  name: string;
  gain: string;
}

export interface AnalystReviewHistoryItem {
  ipoName: string;
  verdict: string;
  listingGain: string | null;
  totalGain: string | null;
  pdfUrl?: string;
}

export interface IpoAnalyst {
  rank: number;
  name: string;
  slug: string;
  profileUrl: string;
  logo: string;
  isSebiRegistered: boolean;
  sebiRegId?: string;
  reviews1Y: number;
  score: number;
  rating: string;
  bio?: string;
  website?: string;
  mainboardCount?: string;
  smeCount?: string;
  stats?: AnalystStatKPIs;
  pillars?: AnalystPillars;
  verdictBreakdown?: AnalystVerdictBreakdown;
  bestCall?: AnalystHighlightCall | null;
  worstCall?: AnalystHighlightCall | null;
  reviewHistory?: AnalystReviewHistoryItem[];
}
