export type IPOCategory = "mainboard" | "sme";
export type IPOStatus = "upcoming" | "live" | "closed" | "allotment_out" | "listed";

export interface SubscriptionDetail {
  category: string;
  subCategory?: string;
  sharesOffered: number;
  bidsReceived: number;
  subscriptionTimes: number;
}

export interface LotSizeDetail {
  applicationCategory: string;
  lots: number;
  shares: number;
  amount: number;
}

export interface FinancialMetric {
  year: string;
  revenue: number; // In ₹ Crores (Total Income / Revenue)
  pat: number; // Profit After Tax in ₹ Crores
  netWorth: number; // In ₹ Crores
  assets?: number; // In ₹ Crores (Total Assets)
  reserves?: number; // In ₹ Crores (Reserves & Surplus)
  borrowing?: number; // In ₹ Crores (Total Borrowings / Debt)
  ebitda?: number;
  eps?: number; // In ₹
  ronw?: number; // Return on Net Worth %
  revenueGrowthYoY?: number; // YoY %
  patGrowthYoY?: number; // YoY %
}

export interface IssueObject {
  purpose: string;
  amountCr?: number;
}

export interface AnchorInvestorAlloc {
  investorName: string;
  category: "FII" | "DII" | "Mutual Fund" | "AIF" | "Insurance";
  sharesAllocated: number;
  amount: number; // in ₹ Cr
  lockInExpiry30Days: string; // ISO date
  lockInExpiry90Days: string; // ISO date
}

export interface PeerComparisonDetail {
  companyName: string;
  faceValue: number;
  peRatio: number;
  ronw?: number;
  eps?: number;
}

export interface IPOReservation {
  category: string;
  sharesOffered: string;
  percentage: string;
  amountCr: string;
}

export interface IPOKpiDetail {
  roe?: string;
  roce?: string;
  ronw?: string;
  debtEquity?: string;
  patMargin?: string;
  ebitdaMargin?: string;
  nav?: string;
  priceToBookValue?: string;
  preIpoEps?: string;
  postIpoEps?: string;
  preIpoPe?: string;
  postIpoPe?: string;
  marketCapUpperBand?: string;
  asOfDate?: string;
}

export interface BrokerReviewSummary {
  subscribe: number;
  mayApply: number;
  neutral: number;
  avoid: number;
}

export interface IPOData {
  id: string;
  slug: string;
  name: string;
  companyName: string;
  logoUrl?: string;
  category: IPOCategory;
  status: IPOStatus;
  exchange: "BSE" | "NSE" | "BSE & NSE" | "BSE SME" | "NSE Emerge";
  
  // Issue Pricing
  priceBandMin: number;
  priceBandMax: number;
  issuePrice?: number;
  lotSize: number;
  minInvestment: number;
  issueSizeTotalCr: number;
  freshIssueCr: number;
  ofsCr: number;
  faceValue: number;
  
  // Grey Market Premium (GMP)
  gmp: number; // in ₹
  gmpPercent: number; // in %
  gmpUpdatedTime: string;
  expectedListingPrice: number;
  gmpTrends?: Array<{ date: string; gmp: string; gain: string }>;
  
  // Live Bidding Multiplier
  totalSubscription: number;
  qibSubscription: number;
  niiSubscription: number;
  sNiiSubscription?: number;
  bNiiSubscription?: number;
  retailSubscription: number;
  employeeSubscription?: number;
  shareholderSubscription?: number;

  // Key Dates (YYYY-MM-DD)
  openDate: string;
  closeDate: string;
  allotmentDate: string;
  refundDate: string;
  dematCreditDate: string;
  listingDate: string;

  // Listing Data
  listingPrice?: number;
  listingGainPercent?: number;
  currentMarketPrice?: number;

  // Registrars & Lead Managers
  registrarName: string;
  registrarWebsite: string;
  registrarCheckUrl: string;
  registrarPhone?: string;
  registrarEmail?: string;
  leadManagers: string[];

  // Company Contact Information
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;

  // Strategic Insights & Review Score
  recommendation: "May Apply" | "Apply for Listing Gain" | "Apply for Long Term" | "Avoid" | "Neutral";
  rating: number; // 1 to 5
  reviewScore?: number; // 0 to 100
  brokerReviews?: BrokerReviewSummary;
  memberReviews?: BrokerReviewSummary;
  highlights: string[];
  risks: string[];

  // Detailed Tables
  subscriptionBreakdown?: SubscriptionDetail[];
  lotSizes?: LotSizeDetail[];
  financials?: FinancialMetric[];
  peerComparison?: PeerComparisonDetail[];
  anchorInvestors?: AnchorInvestorAlloc[];
  reservations?: IPOReservation[];
  kpis?: IPOKpiDetail;
  objectsOfIssue?: IssueObject[];
  prospectusUrl?: string;
  drhpUrl?: string;
}

export interface PreIPOData {
  id: string;
  slug: string;
  companyName: string;
  logoUrl?: string;
  sector: string;
  description: string;
  estimatedPrice: number;
  faceValue: number;
  minSharesToBuy: number;
  minInvestmentAmount: number;
  valuationCr: number;
  fundingRaisedCr: number;
  keyInvestors: string[];
  revenueLastFyCr: number;
  patLastFyCr: number;
  expectedIpoTimeline: string; // e.g. "Q4 2026 / Q1 2027"
  status: "Available" | "High Demand" | "Sold Out";
  
  // Fundamentals
  panNumber?: string;
  isinNumber?: string;
  cinNumber?: string;
  depository?: string;
  rta?: string;
  peRatio?: number;
  pbRatio?: number;
  deRatio?: number;
  roePercent?: number;
  bookValue?: number;
  totalShares?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

export interface AnchorLockInItem {
  id: string;
  ipoName: string;
  slug: string;
  category: IPOCategory;
  listingDate: string;
  totalAnchorShares: number;
  anchorAmountCr: number;
  lockIn30DaysDate: string;
  lockIn30DaysShares: number;
  lockIn30DaysStatus: "Active" | "Expiring Soon" | "Expired";
  lockIn90DaysDate: string;
  lockIn90DaysShares: number;
  lockIn90DaysStatus: "Active" | "Expiring Soon" | "Expired";
}

export interface BuybackData {
  id: string;
  companyName: string;
  slug: string;
  issueType: "Tender Offer" | "Open Market";
  buybackPrice: number;
  currentMarketPrice: number;
  premiumPercent: number;
  issueSizeCr: number;
  recordDate: string;
  openDate?: string;
  closeDate?: string;
  acceptanceRatioEstimate: string;
  status: "Upcoming" | "Active" | "Closed";
}

export interface BrokerFeeDetail {
  label: string;
  value: string;
}

export interface BrokerFAQ {
  question: string;
  answer: string;
}

import { UserReview } from "./finance";

export interface BrokerData {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  type: "Discount Broker" | "Full-Service Broker";
  equityDeliveryFee: string;
  equityIntradayFee: string;
  fnOFee: string;
  dematAnualFee: string;
  accountOpeningFee: string;
  ipoApplicationMethod: string;
  rating: number;
  activeClientsNse: string;
  pros: string[];
  cons: string[];
  openAccountUrl: string;

  // Review Details
  overview?: string;
  productOfferings?: string[];
  feeDetails?: BrokerFeeDetail[];
  faqs?: BrokerFAQ[];
  userReviews?: UserReview[];
}

export type OFSStatus = "Live (Retail Day)" | "Live (Non-Retail)" | "Upcoming" | "Closed" | "Allotted";

export interface OFSData {
  id: string;
  companyName: string;
  symbol: string;
  slug: string;
  exchange: "NSE" | "BSE" | "NSE & BSE";
  sellerName: string; // e.g. "Promoter / Govt of India"
  sector?: string;
  floorPrice: number;
  currentMarketPrice: number;
  discountPercent: number; // Discount of Floor Price to CMP
  retailDiscountPercent?: number; // Additional retail discount if offered (e.g. 5%)
  issueSizeCr: number;
  sharesOffered: number;
  greenShoeShares?: number;
  promoterPreHoldingPercent: number;
  promoterPostHoldingPercent: number;
  retailQuotaPercent: number; // usually 10% or 20%
  nonRetailDate: string; // T-Day (Institutional)
  retailDate: string; // T+1 Day (Retail)
  nonRetailSubscriptionTimes?: number;
  settlementDate?: string;
  indicativeClearingPrice?: number;
  status: OFSStatus;
  overview?: string;
}

