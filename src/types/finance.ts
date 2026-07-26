export type CardCategory = "all" | "lifetime_free" | "cashback" | "travel" | "rewards" | "fuel";

export interface ReviewFeeDetail {
  label: string;
  value: string;
  category?: "Core & Renewal" | "Transactions & Foreign Use" | "Interest & Penalties";
  description?: string;
}

export interface LatePaymentFee {
  balanceRange: string;
  charge: string;
}

export interface ReviewEligibilityDetail {
  label: string;
  value: string;
}

export interface ReviewFAQ {
  question: string;
  answer: string;
}

export interface ReviewRatingCategory {
  category: string;
  score: number; // out of 5
}

export interface UserReview {
  id: string;
  userName: string;
  userTitle?: string; // e.g. "Verified Cardholder", "Trader", "Customer"
  rating: number; // 1 to 5
  date: string; // e.g. "2026-07-24"
  headline: string;
  comment: string;
  proTag?: string;
  conTag?: string;
  helpfulCount: number;
}

export interface MccExclusion {
  category: string;
  mccCodes: string;
  explanation: string;
}

export interface ApplicationStepGroup {
  mode: "Online Application" | "Offline Application";
  steps: string[];
}

export interface RequiredDocumentGroup {
  category: string;
  documents: string[];
}

export interface CreditCardData {
  id: string;
  slug: string;
  name: string;
  issuer: string;
  issuerLogo?: string;
  logoUrl?: string;
  category: CardCategory[];
  rating: number; // 1 to 5
  joiningFee: number; // in ₹ (0 for lifetime free)
  annualFee: number; // in ₹
  annualFeeWaiverCondition: string; // e.g. "Waived on spends of ₹1.0 Lakh/year"
  rewardRate: string; // e.g. "5% Cashback on Amazon & Flipkart"
  keyPrivileges: string[];
  minIncomePerMonth: number; // in ₹
  recommendedCreditScore: number; // e.g. 750
  pros: string[];
  cons: string[];
  applyUrl: string;
  isPopular?: boolean;

  // Detailed Review Fields
  overview?: string;
  feeDetails?: ReviewFeeDetail[];
  latePaymentFees?: LatePaymentFee[];
  eligibility?: ReviewEligibilityDetail[];
  ratingBreakdown?: ReviewRatingCategory[];
  faqs?: ReviewFAQ[];
  userReviews?: UserReview[];

  // Finology Select Complete Sections
  featuresAndBenefits?: string[];
  mccExclusions?: MccExclusion[];
  whoShouldGet?: string[];
  applicationSteps?: ApplicationStepGroup[];
  requiredDocuments?: RequiredDocumentGroup[];
  detailedReview?: string;
}

export interface PaymentAppData {
  id: string;
  slug: string;
  name: string;
  developer: string;
  logoUrl?: string;
  downloadsTier: string; // e.g. "500M+ Downloads"
  playStoreRating: number; // 1 to 5
  appStoreRating: number; // 1 to 5
  upiLiteSupport: boolean;
  ruPayUpiSupport: boolean;
  creditScoreCheckFree: boolean;
  cashbackPolicy: string;
  joiningBonus?: string;
  platformFee?: string;
  referralBonus?: string;
  mobileRechargeFee?: string;
  upiSuccessRate?: string;
  welcomeFriendsBack?: string;
  productBasket?: string[];
  cashbackRewardsReality?: {
    type: "right" | "wrong";
    text: string;
  }[];
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  downloadUrl: string;

  // Detailed Review Fields
  overview?: string;
  feeDetails?: ReviewFeeDetail[];
  eligibility?: ReviewEligibilityDetail[];
  ratingBreakdown?: ReviewRatingCategory[];
  faqs?: ReviewFAQ[];
  userReviews?: UserReview[];
}

export interface BankData {
  id: string;
  slug: string;
  name: string;
  type: "Private Sector Bank" | "Public Sector Bank" | "Small Finance Bank";
  logoUrl?: string;
  savingsInterestRate: string; // e.g. "3.00% - 7.00% p.a."
  minBalanceRequirement: string; // e.g. "₹0 (Zero Balance) or ₹10,000"
  fdInterestRatePeak: string; // e.g. "7.75% p.a. (Senior Citizens: 8.25%)"
  rating: number; // 1 to 5
  branchCount: string; // e.g. "8,700+ Branches"
  atmCount: string; // e.g. "20,000+ ATMs"
  digitalBankingScore: string; // e.g. "4.8/5 (NetBanking & Mobile App)"
  pros: string[];
  cons: string[];
  openAccountUrl: string;

  // Detailed Review Fields
  overview?: string;
  feeDetails?: ReviewFeeDetail[];
  eligibility?: ReviewEligibilityDetail[];
  ratingBreakdown?: ReviewRatingCategory[];
  faqs?: ReviewFAQ[];
  userReviews?: UserReview[];
}
