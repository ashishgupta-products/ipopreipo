export type InvestorType = "Retail" | "sHNI" | "bHNI" | "Employee" | "DII" | "General";

export type UserRole = "user" | "admin" | "analyst";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  investorType: InvestorType;
  phone?: string;
  panMasked?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfileUpdate {
  name?: string;
  phone?: string;
  panMasked?: string;
  bio?: string;
  investorType?: InvestorType;
  avatarUrl?: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  ipoId: string;
  ipoSlug: string;
  createdAt: string;
  ipoDetails?: {
    name: string;
    category: string;
    status: string;
    gmp: number;
    gmpPercent: number;
    priceBandMax: number;
    expectedListingPrice: number;
    closeDate?: string;
    openDate?: string;
    logoUrl?: string;
  };
}

export type ApplicationStatus = "Applied" | "Allotted" | "Not Allotted" | "Refunded" | "Listed";

export interface IPOApplication {
  id: string;
  userId: string;
  ipoId: string;
  ipoSlug: string;
  ipoName: string;
  category: "Retail" | "sHNI" | "bHNI" | "Employee";
  lotsApplied: number;
  lotSize: number;
  bidPrice: number;
  totalAmount: number;
  panMasked?: string;
  applicationNumber?: string;
  status: ApplicationStatus;
  allottedLots?: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
  token?: string;
}
