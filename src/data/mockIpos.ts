import { IPOData } from "@/types/ipo";

export const MOCK_IPOS: IPOData[] = [
  {
    id: "1",
    slug: "shree-balaji-textiles",
    name: "Shree Balaji (Mala) Textiles Limited",
    companyName: "Shree Balaji (Mala) Textiles Limited",
    logoUrl: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=120&q=80",
    category: "sme",
    status: "live",
    exchange: "BSE SME",
    priceBandMin: 66,
    priceBandMax: 70,
    lotSize: 2000,
    minInvestment: 140000,
    issueSizeTotalCr: 28.5,
    freshIssueCr: 28.5,
    ofsCr: 0,
    faceValue: 10,
    gmp: 16,
    gmpPercent: 22.86,
    gmpUpdatedTime: "Just now",
    expectedListingPrice: 86,
    totalSubscription: 3.04,
    qibSubscription: 1.15,
    niiSubscription: 4.82,
    sNiiSubscription: 4.20,
    bNiiSubscription: 5.44,
    retailSubscription: 3.15,
    openDate: "2026-07-22",
    closeDate: "2026-07-24",
    allotmentDate: "2026-07-27",
    refundDate: "2026-07-28",
    dematCreditDate: "2026-07-28",
    listingDate: "2026-07-29",
    registrarName: "Bigshare Services Pvt Ltd",
    registrarWebsite: "https://www.bigshareonline.com",
    registrarCheckUrl: "https://ipo.bigshareonline.com/ipo_status.html",
    leadManagers: ["Interactive Financial Services Limited"],
    recommendation: "Apply for Listing Gain",
    rating: 4.2,
    highlights: [
      "Rapid revenue growth in premium synthetic yarns & textile weaving.",
      "High ROE of 24.5% in FY25.",
      "Strong demand pipeline from export houses."
    ],
    risks: [
      "Volatile raw material costs (cotton & polyester).",
      "Competitive SME textile sector."
    ],
    lotSizes: [
      { applicationCategory: "Retail (Min)", lots: 1, shares: 2000, amount: 140000 },
      { applicationCategory: "Retail (Max)", lots: 1, shares: 2000, amount: 140000 },
      { applicationCategory: "S-HNI (Min)", lots: 2, shares: 4000, amount: 280000 },
      { applicationCategory: "S-HNI (Max)", lots: 7, shares: 14000, amount: 980000 },
      { applicationCategory: "B-HNI (Min)", lots: 8, shares: 16000, amount: 1120000 },
      { applicationCategory: "B-HNI (Max)", lots: 0, shares: 0, amount: 0 }
    ],
    financials: [
      { year: "FY24", revenue: 45.2, pat: 3.8, netWorth: 18.5, eps: 4.2, ronw: 20.5 },
      { year: "FY25", revenue: 68.4, pat: 6.9, netWorth: 28.2, eps: 6.8, ronw: 24.5 }
    ],
    peerComparison: [
      { companyName: "Sangam (India) Limited", faceValue: 10, peRatio: 18.4 },
      { companyName: "Filatex India Limited", faceValue: 2, peRatio: 14.2 },
      { companyName: "Banswara Syntex Limited", faceValue: 10, peRatio: 11.5 }
    ],
    reservations: [
      { category: "QIB Shares Offered", sharesOffered: "10,25,000 Shares", percentage: "25.00%", amountCr: "₹7.18 Cr" },
      { category: "NII (HNI) Shares Offered", sharesOffered: "8,50,000 Shares", percentage: "20.73%", amountCr: "₹5.95 Cr" },
      { category: "Retail Shares Offered", sharesOffered: "19,80,000 Shares", percentage: "48.29%", amountCr: "₹13.86 Cr" },
      { category: "Market Maker Shares", sharesOffered: "2,45,000 Shares", percentage: "5.98%", amountCr: "₹1.72 Cr" }
    ],
    kpis: {
      asOfDate: "Mar 31, 2025",
      roe: "24.50%",
      ronw: "24.50%",
      ebitdaMargin: "14.20%",
      priceToBookValue: "2.48",
      preIpoEps: "6.80",
      postIpoEps: "5.10",
      preIpoPe: "10.29",
      postIpoPe: "13.73"
    }
  },
  {
    id: "2",
    slug: "cube-highways-trust",
    name: "Cube Highways Trust InvIT",
    companyName: "Cube Highways and Infrastructure InvIT",
    logoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=120&q=80",
    category: "mainboard",
    status: "live",
    exchange: "BSE & NSE",
    priceBandMin: 151,
    priceBandMax: 152,
    lotSize: 94,
    minInvestment: 14288,
    issueSizeTotalCr: 5200.0,
    freshIssueCr: 3500.0,
    ofsCr: 1700.0,
    faceValue: 100,
    gmp: 0,
    gmpPercent: 0,
    gmpUpdatedTime: "1 hour ago",
    expectedListingPrice: 152,
    totalSubscription: 0.85,
    qibSubscription: 1.10,
    niiSubscription: 0.65,
    retailSubscription: 0.72,
    openDate: "2026-07-22",
    closeDate: "2026-07-24",
    allotmentDate: "2026-07-27",
    refundDate: "2026-07-28",
    dematCreditDate: "2026-07-30",
    listingDate: "2026-07-31",
    registrarName: "KFin Technologies Limited",
    registrarWebsite: "https://www.kfintech.com",
    registrarCheckUrl: "https://ris.kfintech.com/ipostatus/",
    leadManagers: ["ICICI Securities", "Morgan Stanley India", "Axis Capital"],
    recommendation: "Apply for Long Term",
    rating: 3.8,
    highlights: [
      "Stable cash flows backed by operational toll roads across India.",
      "High distribution yield expected (9.5% annualized).",
      "Backed by top global infrastructure investors (I Squared Capital)."
    ],
    risks: [
      "Interest rate risk on leveraged debt.",
      "Traffic growth fluctuations."
    ],
    lotSizes: [
      { applicationCategory: "Retail (Min)", lots: 1, shares: 94, amount: 14288 },
      { applicationCategory: "Retail (Max)", lots: 13, shares: 1222, amount: 185744 },
      { applicationCategory: "S-HNI (Min)", lots: 15, shares: 1410, amount: 214320 },
      { applicationCategory: "S-HNI (Max)", lots: 69, shares: 6486, amount: 985872 },
      { applicationCategory: "B-HNI (Min)", lots: 70, shares: 6580, amount: 1000160 },
      { applicationCategory: "B-HNI (Max)", lots: 0, shares: 0, amount: 0 }
    ],
    financials: [
      { year: "FY24", revenue: 2150.0, pat: 410.0, netWorth: 8500.0, ronw: 12.1 },
      { year: "FY25", revenue: 2680.0, pat: 540.0, netWorth: 9200.0, ronw: 13.8 }
    ],
    peerComparison: [
      { companyName: "IRB InvIT Fund", faceValue: 10, peRatio: 15.6 },
      { companyName: "National Highways Infra Trust", faceValue: 10, peRatio: 12.8 },
      { companyName: "India Grid Trust", faceValue: 10, peRatio: 18.2 }
    ],
    reservations: [
      { category: "Institutional Investors", sharesOffered: "24,00,00,000 Units", percentage: "75.00%", amountCr: "₹3,900.00 Cr" },
      { category: "Non-Institutional Investors", sharesOffered: "8,00,00,000 Units", percentage: "25.00%", amountCr: "₹1,300.00 Cr" }
    ],
    kpis: {
      asOfDate: "Mar 31, 2025",
      roe: "13.80%",
      ronw: "13.80%",
      ebitdaMargin: "65.40%",
      priceToBookValue: "1.55",
      preIpoEps: "5.87",
      postIpoEps: "5.87",
      preIpoPe: "25.89",
      postIpoPe: "25.89"
    }
  },
  {
    id: "3",
    slug: "metalic-technoforge",
    name: "Metalic Technoforge Limited",
    companyName: "Metalic Technoforge Limited",
    logoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=120&q=80",
    category: "sme",
    status: "live",
    exchange: "NSE Emerge",
    priceBandMin: 72,
    priceBandMax: 77,
    lotSize: 1600,
    minInvestment: 123200,
    issueSizeTotalCr: 18.2,
    freshIssueCr: 18.2,
    ofsCr: 0,
    faceValue: 10,
    gmp: 8,
    gmpPercent: 10.39,
    gmpUpdatedTime: "30 mins ago",
    expectedListingPrice: 85,
    totalSubscription: 1.42,
    qibSubscription: 0.50,
    niiSubscription: 2.10,
    retailSubscription: 1.65,
    openDate: "2026-07-21",
    closeDate: "2026-07-23",
    allotmentDate: "2026-07-24",
    refundDate: "2026-07-27",
    dematCreditDate: "2026-07-27",
    listingDate: "2026-07-28",
    registrarName: "Link Intime India Private Ltd",
    registrarWebsite: "https://www.linkintime.co.in",
    registrarCheckUrl: "https://linkintime.co.in/initial_offer/public-issues.html",
    leadManagers: ["Beeline Capital Advisors Pvt Ltd"],
    recommendation: "Neutral",
    rating: 3.2,
    highlights: [
      "Precision forged components for automotive & industrial machinery.",
      "Expanding manufacturing capacity in Gujarat."
    ],
    risks: [
      "Concentrated customer base in auto sector."
    ],
    lotSizes: [
      { applicationCategory: "Retail (Min)", lots: 1, shares: 1600, amount: 123200 },
      { applicationCategory: "Retail (Max)", lots: 1, shares: 1600, amount: 123200 },
      { applicationCategory: "S-HNI (Min)", lots: 2, shares: 3200, amount: 246400 },
      { applicationCategory: "S-HNI (Max)", lots: 8, shares: 12800, amount: 985600 },
      { applicationCategory: "B-HNI (Min)", lots: 9, shares: 14400, amount: 1108800 },
      { applicationCategory: "B-HNI (Max)", lots: 0, shares: 0, amount: 0 }
    ],
    financials: [
      { year: "FY24", revenue: 32.5, pat: 2.1, netWorth: 12.4, eps: 3.1, ronw: 16.9 },
      { year: "FY25", revenue: 41.8, pat: 3.4, netWorth: 15.8, eps: 4.8, ronw: 21.5 }
    ],
    peerComparison: [
      { companyName: "Metalic Forgings India", faceValue: 10, peRatio: 16.5 },
      { companyName: "Forgewell Limited", faceValue: 10, peRatio: 22.1 },
      { companyName: "Sona BLW Precision Forgings", faceValue: 10, peRatio: 68.4 }
    ],
    reservations: [
      { category: "QIB Shares Offered", sharesOffered: "6,20,000 Shares", percentage: "26.27%", amountCr: "₹4.77 Cr" },
      { category: "NII (HNI) Shares Offered", sharesOffered: "4,80,000 Shares", percentage: "20.34%", amountCr: "₹3.70 Cr" },
      { category: "Retail Shares Offered", sharesOffered: "11,20,000 Shares", percentage: "47.46%", amountCr: "₹8.62 Cr" },
      { category: "Market Maker Shares", sharesOffered: "1,40,000 Shares", percentage: "5.93%", amountCr: "₹1.08 Cr" }
    ],
    kpis: {
      asOfDate: "Mar 31, 2025",
      roe: "21.50%",
      ronw: "21.50%",
      ebitdaMargin: "11.80%",
      priceToBookValue: "4.87",
      preIpoEps: "4.80",
      postIpoEps: "3.90",
      preIpoPe: "16.04",
      postIpoPe: "19.74"
    }
  },
  {
    id: "4",
    slug: "nexus-clean-energy",
    name: "Nexus Clean Energy India Limited",
    companyName: "Nexus Clean Energy India Limited",
    logoUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=120&q=80",
    category: "mainboard",
    status: "upcoming",
    exchange: "BSE & NSE",
    priceBandMin: 405,
    priceBandMax: 425,
    lotSize: 35,
    minInvestment: 14875,
    issueSizeTotalCr: 1850.0,
    freshIssueCr: 1200.0,
    ofsCr: 650.0,
    faceValue: 5,
    gmp: 65,
    gmpPercent: 15.29,
    gmpUpdatedTime: "2 hours ago",
    expectedListingPrice: 490,
    totalSubscription: 0,
    qibSubscription: 0,
    niiSubscription: 0,
    retailSubscription: 0,
    openDate: "2026-07-28",
    closeDate: "2026-07-30",
    allotmentDate: "2026-07-31",
    refundDate: "2026-08-03",
    dematCreditDate: "2026-08-03",
    listingDate: "2026-08-04",
    registrarName: "KFin Technologies Limited",
    registrarWebsite: "https://www.kfintech.com",
    registrarCheckUrl: "https://ris.kfintech.com/ipostatus/",
    leadManagers: ["Kotak Mahindra Capital", "JM Financial", "IIFL Securities"],
    recommendation: "Apply for Listing Gain",
    rating: 4.6,
    highlights: [
      "Leading solar EPC & green hydrogen developer in Western India.",
      "Order book exceeds ₹4,500 Cr as of June 2026.",
      "PAT grew at 48% CAGR over FY23-FY25."
    ],
    risks: [
      "Dependency on government solar tariffs and grid connection policies."
    ],
    lotSizes: [
      { applicationCategory: "Retail (Min)", lots: 1, shares: 35, amount: 14875 },
      { applicationCategory: "Retail (Max)", lots: 13, shares: 455, amount: 193375 },
      { applicationCategory: "S-HNI (Min)", lots: 14, shares: 490, amount: 208250 },
      { applicationCategory: "S-HNI (Max)", lots: 67, shares: 2345, amount: 996625 },
      { applicationCategory: "B-HNI (Min)", lots: 68, shares: 2380, amount: 1011500 },
      { applicationCategory: "B-HNI (Max)", lots: 0, shares: 0, amount: 0 }
    ],
    financials: [
      { year: "FY24", revenue: 890.0, pat: 92.0, netWorth: 410.0, eps: 12.5, ronw: 22.4 },
      { year: "FY25", revenue: 1420.0, pat: 168.0, netWorth: 578.0, eps: 21.0, ronw: 29.1 }
    ],
    peerComparison: [
      { companyName: "Sterling & Wilson Renewable Energy", faceValue: 1, peRatio: 48.9 },
      { companyName: "Waaree Renewable Technologies", faceValue: 2, peRatio: 112.5 },
      { companyName: "KPI Green Energy Limited", faceValue: 10, peRatio: 58.2 }
    ],
    reservations: [
      { category: "QIB Portion", sharesOffered: "2,17,64,705 Shares", percentage: "50.00%", amountCr: "₹925.00 Cr" },
      { category: "NII (HNI) Portion", sharesOffered: "6,52,94,117 Shares", percentage: "15.00%", amountCr: "₹277.50 Cr" },
      { category: "Retail Portion", sharesOffered: "1,52,35,294 Shares", percentage: "35.00%", amountCr: "₹647.50 Cr" }
    ],
    kpis: {
      asOfDate: "Mar 31, 2025",
      roe: "29.10%",
      ronw: "29.10%",
      ebitdaMargin: "18.50%",
      priceToBookValue: "7.35",
      preIpoEps: "21.00",
      postIpoEps: "18.50",
      preIpoPe: "20.24",
      postIpoPe: "22.97"
    }
  },
  {
    id: "5",
    slug: "swiggy-limited",
    name: "Swiggy Limited IPO",
    companyName: "Swiggy Limited",
    logoUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=120&q=80",
    category: "mainboard",
    status: "listed",
    exchange: "BSE & NSE",
    priceBandMin: 371,
    priceBandMax: 390,
    issuePrice: 390,
    lotSize: 38,
    minInvestment: 14820,
    issueSizeTotalCr: 11370.0,
    freshIssueCr: 4499.0,
    ofsCr: 6871.0,
    faceValue: 1,
    gmp: 0,
    gmpPercent: 0,
    gmpUpdatedTime: "Listed",
    expectedListingPrice: 420,
    totalSubscription: 3.59,
    qibSubscription: 6.02,
    niiSubscription: 1.25,
    retailSubscription: 1.14,
    employeeSubscription: 1.82,
    openDate: "2026-06-05",
    closeDate: "2026-06-07",
    allotmentDate: "2026-06-08",
    refundDate: "2026-06-11",
    dematCreditDate: "2026-06-11",
    listingDate: "2026-06-12",
    listingPrice: 420,
    listingGainPercent: 7.69,
    currentMarketPrice: 445.5,
    registrarName: "Link Intime India Private Ltd",
    registrarWebsite: "https://www.linkintime.co.in",
    registrarCheckUrl: "https://linkintime.co.in/initial_offer/public-issues.html",
    leadManagers: ["Kotak Mahindra Capital", "Citigroup Global Markets", "Jefferies India", "Avendus Capital"],
    recommendation: "Apply for Long Term",
    rating: 4.4,
    highlights: [
      "India's premier quick-commerce (Instamart) and food delivery ecosystem.",
      "Rapidly scaling GOV (Gross Order Value) with improving contribution margin."
    ],
    risks: [
      "Intense competition from Zomato and Zepto.",
      "Cash burn in quick commerce expansion."
    ],
    lotSizes: [
      { applicationCategory: "Retail (Min)", lots: 1, shares: 38, amount: 14820 },
      { applicationCategory: "Retail (Max)", lots: 13, shares: 494, amount: 192660 },
      { applicationCategory: "S-HNI (Min)", lots: 14, shares: 532, amount: 207480 },
      { applicationCategory: "S-HNI (Max)", lots: 67, shares: 2546, amount: 992940 },
      { applicationCategory: "B-HNI (Min)", lots: 68, shares: 2584, amount: 1007760 },
      { applicationCategory: "B-HNI (Max)", lots: 0, shares: 0, amount: 0 }
    ],
    financials: [
      { year: "FY23", revenue: 8263.0, pat: -4179.0, netWorth: 9810.0, eps: -12.5, ronw: -42.6 },
      { year: "FY24", revenue: 11247.0, pat: -2350.0, netWorth: 7650.0, eps: -7.2, ronw: -30.7 },
      { year: "FY25", revenue: 14500.0, pat: -1420.0, netWorth: 6800.0, eps: -4.1, ronw: -20.9 }
    ],
    peerComparison: [
      { companyName: "Zomato Limited", faceValue: 1, peRatio: 125.4 }
    ],
    reservations: [
      { category: "QIB Portion", sharesOffered: "14,57,69,230 Shares", percentage: "50.00%", amountCr: "₹5,685.00 Cr" },
      { category: "NII (HNI) Portion", sharesOffered: "4,37,30,769 Shares", percentage: "15.00%", amountCr: "₹1,705.50 Cr" },
      { category: "Retail Portion", sharesOffered: "10,20,38,461 Shares", percentage: "35.00%", amountCr: "₹3,979.50 Cr" }
    ],
    kpis: {
      asOfDate: "Jun 30, 2025",
      roe: "-20.90%",
      ronw: "-20.90%",
      ebitdaMargin: "-8.40%",
      priceToBookValue: "5.73",
      preIpoEps: "-4.10",
      postIpoEps: "-4.10",
      preIpoPe: "N/A",
      postIpoPe: "N/A"
    }
  },
  {
    id: "6",
    slug: "waaree-energies",
    name: "Waaree Energies Limited",
    companyName: "Waaree Energies Limited",
    logoUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=120&q=80",
    category: "mainboard",
    status: "listed",
    exchange: "BSE & NSE",
    priceBandMin: 1427,
    priceBandMax: 1503,
    issuePrice: 1503,
    lotSize: 9,
    minInvestment: 13527,
    issueSizeTotalCr: 4321.0,
    freshIssueCr: 3600.0,
    ofsCr: 721.0,
    faceValue: 10,
    gmp: 0,
    gmpPercent: 0,
    gmpUpdatedTime: "Listed",
    expectedListingPrice: 2550,
    totalSubscription: 76.34,
    qibSubscription: 208.63,
    niiSubscription: 62.49,
    retailSubscription: 10.79,
    employeeSubscription: 5.45,
    shareholderSubscription: 14.20,
    openDate: "2026-05-15",
    closeDate: "2026-05-17",
    allotmentDate: "2026-05-20",
    refundDate: "2026-05-21",
    dematCreditDate: "2026-05-21",
    listingDate: "2026-05-22",
    listingPrice: 2550,
    listingGainPercent: 69.66,
    currentMarketPrice: 2980.0,
    registrarName: "Link Intime India Private Ltd",
    registrarWebsite: "https://www.linkintime.co.in",
    registrarCheckUrl: "https://linkintime.co.in/initial_offer/public-issues.html",
    leadManagers: ["Axis Capital", "Jefferies India", "SBI Capital Markets", "Nomura Financial"],
    recommendation: "Apply for Listing Gain",
    rating: 4.8,
    highlights: [
      "Largest manufacturer of solar PV modules in India with 12 GW installed capacity.",
      "Massive listing gain of ~70% on debuting."
    ],
    risks: [
      "Global solar cell price volatility."
    ],
    lotSizes: [
      { applicationCategory: "Retail (Min)", lots: 1, shares: 9, amount: 13527 },
      { applicationCategory: "Retail (Max)", lots: 14, shares: 126, amount: 189378 },
      { applicationCategory: "S-HNI (Min)", lots: 15, shares: 135, amount: 202905 },
      { applicationCategory: "S-HNI (Max)", lots: 73, shares: 657, amount: 987471 },
      { applicationCategory: "B-HNI (Min)", lots: 74, shares: 666, amount: 1000998 },
      { applicationCategory: "B-HNI (Max)", lots: 0, shares: 0, amount: 0 }
    ],
    financials: [
      { year: "FY23", revenue: 6750.0, pat: 500.0, netWorth: 2100.0, eps: 18.5, ronw: 23.8 },
      { year: "FY24", revenue: 11398.0, pat: 1274.0, netWorth: 4200.0, eps: 46.2, ronw: 30.3 },
      { year: "FY25", revenue: 14850.0, pat: 1850.0, netWorth: 6200.0, eps: 65.5, ronw: 29.8 }
    ],
    peerComparison: [
      { companyName: "Premier Energies Limited", faceValue: 1, peRatio: 84.5 },
      { companyName: "Websol Energy System Ltd", faceValue: 10, peRatio: 45.2 }
    ],
    reservations: [
      { category: "QIB Portion", sharesOffered: "1,43,74,584 Shares", percentage: "50.00%", amountCr: "₹2,160.50 Cr" },
      { category: "NII (HNI) Portion", sharesOffered: "43,12,375 Shares", percentage: "15.00%", amountCr: "₹648.15 Cr" },
      { category: "Retail Portion", sharesOffered: "1,00,62,209 Shares", percentage: "35.00%", amountCr: "₹1,512.35 Cr" }
    ],
    kpis: {
      asOfDate: "Jun 30, 2025",
      roe: "29.80%",
      ronw: "29.80%",
      ebitdaMargin: "16.40%",
      priceToBookValue: "6.95",
      preIpoEps: "65.50",
      postIpoEps: "65.50",
      preIpoPe: "22.95",
      postIpoPe: "22.95"
    }
  },
  {
    id: "7",
    slug: "lohia-corp",
    name: "Lohia Corp Limited IPO",
    companyName: "Lohia Corp Limited",
    logoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=120&q=80",
    category: "mainboard",
    status: "upcoming",
    exchange: "BSE & NSE",
    priceBandMin: 220,
    priceBandMax: 235,
    lotSize: 60,
    minInvestment: 14100,
    issueSizeTotalCr: 600.0,
    freshIssueCr: 600.0,
    ofsCr: 0,
    faceValue: 10,
    gmp: 32,
    gmpPercent: 13.62,
    gmpUpdatedTime: "Just now",
    expectedListingPrice: 267,
    totalSubscription: 0,
    qibSubscription: 0,
    niiSubscription: 0,
    retailSubscription: 0,
    openDate: "2026-08-05",
    closeDate: "2026-08-07",
    allotmentDate: "2026-08-10",
    refundDate: "2026-08-11",
    dematCreditDate: "2026-08-11",
    listingDate: "2026-08-12",
    registrarName: "KFin Technologies Limited",
    registrarWebsite: "https://www.kfintech.com",
    registrarCheckUrl: "https://ris.kfintech.com/ipostatus/",
    registrarPhone: "+91-40-67162222 / 1800-309-4001",
    registrarEmail: "einward.ris@kfintech.com",
    leadManagers: ["ICICI Securities Limited", "IIFL Securities Limited"],
    companyAddress: "D-3A, Panki Industrial Estate, Kanpur - 208022, Uttar Pradesh, India",
    companyPhone: "+91-512-3045100",
    companyEmail: "investors@lohiagroup.com",
    companyWebsite: "https://www.lohiagroup.com",
    recommendation: "Apply for Long Term",
    rating: 4.3,
    highlights: [
      "Global leader in machinery for flexible woven plastic packaging.",
      "Presence in over 85 countries with robust export order book."
    ],
    risks: [
      "Fluctuations in foreign exchange rates & global capital expenditure cycles."
    ],
    lotSizes: [
      { applicationCategory: "Retail (Min)", lots: 1, shares: 60, amount: 14100 },
      { applicationCategory: "Retail (Max)", lots: 14, shares: 840, amount: 197400 },
      { applicationCategory: "S-HNI (Min)", lots: 15, shares: 900, amount: 211500 },
      { applicationCategory: "S-HNI (Max)", lots: 70, shares: 4200, amount: 987000 },
      { applicationCategory: "B-HNI (Min)", lots: 71, shares: 4260, amount: 1001100 },
      { applicationCategory: "B-HNI (Max)", lots: 0, shares: 0, amount: 0 }
    ],
    peerComparison: [
      { companyName: "Rajoo Engineers Limited", faceValue: 1, peRatio: 18.27 },
      { companyName: "LMW Limited", faceValue: 10, peRatio: 134.25 },
      { companyName: "Mamata Machinery Limited", faceValue: 10, peRatio: 62.07 },
      { companyName: "Jyoti CNC Automation Limited", faceValue: 2, peRatio: 54.60 },
      { companyName: "Windsor Machines Limited", faceValue: 2, peRatio: 2561.00 }
    ],
    reservations: [
      { category: "QIB Shares Offered", sharesOffered: "7,73,21,826 Shares", percentage: "45.23%", amountCr: "₹4,438.27 Cr" },
      { category: "HNI / NII Shares Offered", sharesOffered: "2,31,96,549 Shares", percentage: "13.57%", amountCr: "₹1,331.48 Cr" },
      { category: "Retail Shares Offered", sharesOffered: "5,41,25,280 Shares", percentage: "31.66%", amountCr: "₹3,106.79 Cr" },
      { category: "Shareholder Quota", sharesOffered: "1,30,55,629 Shares", percentage: "7.64%", amountCr: "₹749.39 Cr" },
      { category: "Employee Quota", sharesOffered: "32,57,347 Shares", percentage: "1.60%", amountCr: "₹169.38 Cr" }
    ],
    kpis: {
      asOfDate: "Mar 31, 2026",
      roe: "43.02%",
      ronw: "43.02%",
      ebitdaMargin: "92.46%",
      priceToBookValue: "19.60",
      preIpoEps: "15.06",
      postIpoEps: "15.06",
      preIpoPe: "38.12",
      postIpoPe: "38.12"
    },
    financials: [
      { year: "FY24", revenue: 780.0, pat: 85.0, netWorth: 380.0, eps: 11.2, ronw: 22.4 },
      { year: "FY25", revenue: 1120.0, pat: 142.0, netWorth: 512.0, eps: 15.1, ronw: 27.7 }
    ]
  },
  {
    id: "8",
    slug: "sbi-funds-management",
    name: "SBI Funds Management Limited IPO",
    companyName: "SBI Funds Management Limited",
    logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=80",
    category: "mainboard",
    status: "upcoming",
    exchange: "BSE & NSE",
    priceBandMin: 880,
    priceBandMax: 950,
    lotSize: 15,
    minInvestment: 14250,
    issueSizeTotalCr: 8000.0,
    freshIssueCr: 2000.0,
    ofsCr: 6000.0,
    faceValue: 10,
    gmp: 120,
    gmpPercent: 12.63,
    gmpUpdatedTime: "Just now",
    expectedListingPrice: 1070,
    totalSubscription: 0,
    qibSubscription: 0,
    niiSubscription: 0,
    retailSubscription: 0,
    openDate: "2026-08-15",
    closeDate: "2026-08-18",
    allotmentDate: "2026-08-19",
    refundDate: "2026-08-20",
    dematCreditDate: "2026-08-20",
    listingDate: "2026-08-21",
    registrarName: "KFin Technologies Limited",
    registrarWebsite: "https://www.kfintech.com",
    registrarCheckUrl: "https://ris.kfintech.com/ipostatus/",
    registrarPhone: "+91-40-67162222",
    registrarEmail: "sbifml.ipo@kfintech.com",
    leadManagers: ["SBI Capital Markets Limited", "Kotak Mahindra Capital", "Citigroup Global Markets"],
    companyAddress: "SBI LHO Building, BKC, Bandra Kurla Complex, Mumbai - 400051, Maharashtra, India",
    companyPhone: "+91-22-61793000",
    companyEmail: "investors@sbimf.com",
    companyWebsite: "https://www.sbimf.com",
    recommendation: "Apply for Long Term",
    rating: 4.7,
    highlights: [
      "Largest mutual fund house in India with over ₹10 Lakh Crore in assets under management (AUM).",
      "Highly profitable asset manager with strong parentage & brand trust of SBI.",
      "Growing market share in high-margin equity products."
    ],
    risks: [
      "Performance is sensitive to changes in equity market AUM inflows.",
      "Intense regulatory pressure on mutual fund expense structures by SEBI."
    ],
    lotSizes: [
      { applicationCategory: "Retail (Min)", lots: 1, shares: 15, amount: 14250 },
      { applicationCategory: "Retail (Max)", lots: 13, shares: 195, amount: 185250 },
      { applicationCategory: "S-HNI (Min)", lots: 15, shares: 225, amount: 213750 },
      { applicationCategory: "S-HNI (Max)", lots: 70, shares: 1050, amount: 997500 },
      { applicationCategory: "B-HNI (Min)", lots: 71, shares: 1065, amount: 1011750 },
      { applicationCategory: "B-HNI (Max)", lots: 0, shares: 0, amount: 0 }
    ],
    peerComparison: [
      { companyName: "HDFC Asset Management Company Limited", faceValue: 5, peRatio: 36.40 },
      { companyName: "Nippon Life India Asset Management Limited", faceValue: 10, peRatio: 28.50 },
      { companyName: "Aditya Birla Sun Life AMC Limited", faceValue: 5, peRatio: 18.20 }
    ],
    reservations: [
      { category: "QIB Portion", sharesOffered: "4,21,05,263 Shares", percentage: "50.00%", amountCr: "₹4,000.00 Cr" },
      { category: "NII (HNI) Portion", sharesOffered: "1,26,31,578 Shares", percentage: "15.00%", amountCr: "₹1,200.00 Cr" },
      { category: "Retail Portion", sharesOffered: "2,94,73,684 Shares", percentage: "35.00%", amountCr: "₹2,800.00 Cr" }
    ],
    kpis: {
      asOfDate: "Mar 31, 2026",
      roe: "32.40%",
      ronw: "32.40%",
      ebitdaMargin: "68.20%",
      priceToBookValue: "11.50",
      preIpoEps: "34.20",
      postIpoEps: "34.20",
      preIpoPe: "27.78",
      postIpoPe: "27.78"
    },
    financials: [
      { year: "FY24", revenue: 2840.0, pat: 1450.0, netWorth: 4100.0, eps: 28.1, ronw: 30.5 },
      { year: "FY25", revenue: 3620.0, pat: 1980.0, netWorth: 5800.0, eps: 34.2, ronw: 32.4 }
    ]
  }
];
