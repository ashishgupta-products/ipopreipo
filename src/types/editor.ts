export type ArticleCategory = 
  | "IPO News" 
  | "Research Report" 
  | "Market Analysis" 
  | "Pre-IPO Insights" 
  | "Buying Guide" 
  | "Credit Cards Guide"
  | "Regulatory & SEBI";

export type ArticleStatus = "Published" | "Draft" | "In Review" | "Scheduled";

export interface ArticleAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface ArticlePost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  status: ArticleStatus;
  author: ArticleAuthor;
  tags: string[];
  featuredImage?: string;
  seoTitle: string;
  seoDescription: string;
  relatedIpoSlug?: string;
  publishDate: string;
  views: number;
  readingTimeMins: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
}

export interface IPOResearchReport {
  id: string;
  ipoName: string;
  ipoSlug: string;
  analystName: string;
  publishDate: string;
  verdict: "Apply for Long Term" | "Apply for Listing Gain" | "Avoid" | "Neutral" | "May Apply";
  targetPriceRange?: string;
  financialScore: number; // out of 10
  managementScore: number; // out of 10
  valuationScore: number; // out of 10
  industryScore: number; // out of 10
  overallRating: number; // out of 5
  bullPoints: string[];
  bearPoints: string[];
  summary: string;
  status: ArticleStatus;
}

export interface NewsAlert {
  id: string;
  title: string;
  message: string;
  category: "Allotment Alert" | "GMP Surge" | "DRHP Filed" | "Listing Day" | "Breaking";
  targetAudience: string;
  sentTime: string;
  deliveredCount: number;
  openRatePercent: number;
  linkUrl?: string;
}
