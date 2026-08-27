import re
from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

IPOCategory = Literal["mainboard", "sme"]
IPOStatus = Literal["upcoming", "live", "closed", "allotment_out", "listed"]

def slugify(text: str) -> str:
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text

def parse_number(val: Any) -> float:
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    val_str = str(val).strip()
    if not val_str or val_str == "-" or val_str.lower() == "na" or val_str.lower() == "null":
        return 0.0
    is_negative = "-" in val_str or "dis" in val_str.lower() or "minus" in val_str.lower()
    cleaned = re.sub(r"[^\d.]", "", val_str)
    try:
        num = float(cleaned)
        return -num if is_negative else num
    except ValueError:
        return 0.0

def parse_date_str(val: str) -> str:
    """Parses various date formats e.g. 'Aug 26, 2026', 'Tue, Sep 1, 2026', '26-Aug-2026', '26/08/2026' into 'YYYY-MM-DD'"""
    if not val or not isinstance(val, str):
        return ""
    val = val.strip()
    if not val or val == "-" or val.lower() == "na":
        return ""
    
    # Remove day of week like 'Tue, ' or 'Friday '
    val = re.sub(r'^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[,\s]+', '', val, flags=re.I).strip()
    
    # Common formats
    date_formats = [
        "%b %d, %Y",
        "%d-%b-%Y",
        "%d-%b-%y",
        "%d/%m/%Y",
        "%Y-%m-%d",
        "%B %d, %Y",
        "%d %b %Y",
        "%d %B %Y",
        "%d %b, %Y",
        "%d %B, %Y",
        "%b %d %Y",
    ]
    for fmt in date_formats:
        try:
            dt = datetime.strptime(val, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    # If unparseable, return trimmed original
    return val

class SubscriptionDetail(BaseModel):
    category: str
    subCategory: Optional[str] = None
    sharesOffered: float = 0.0
    bidsReceived: float = 0.0
    subscriptionTimes: float = 0.0

class LotSizeDetail(BaseModel):
    applicationCategory: str
    lots: int = 1
    shares: int = 1
    amount: int = 0

class FinancialMetric(BaseModel):
    year: str
    revenue: float = 0.0 # in ₹ Cr (Total Income / Revenue)
    pat: float = 0.0 # in ₹ Cr (Profit After Tax)
    netWorth: float = 0.0 # in ₹ Cr
    assets: Optional[float] = None # in ₹ Cr (Total Assets)
    reserves: Optional[float] = None # in ₹ Cr (Reserves & Surplus)
    borrowing: Optional[float] = None # in ₹ Cr (Total Borrowings / Debt)
    ebitda: Optional[float] = None
    eps: Optional[float] = None
    ronw: Optional[float] = None # Return on Net Worth %
    revenueGrowthYoY: Optional[float] = None # YoY %
    patGrowthYoY: Optional[float] = None # YoY %

class PeerComparisonDetail(BaseModel):
    companyName: str
    faceValue: float = 10.0
    peRatio: float = 0.0
    ronw: Optional[float] = None
    eps: Optional[float] = None

class IPOReservation(BaseModel):
    category: str
    sharesOffered: str = ""
    percentage: str = ""
    amountCr: str = ""

class IssueObject(BaseModel):
    purpose: str
    amountCr: Optional[float] = None

class IPOKpiDetail(BaseModel):
    roe: Optional[str] = None
    roce: Optional[str] = None
    ronw: Optional[str] = None
    debtEquity: Optional[str] = None
    patMargin: Optional[str] = None
    ebitdaMargin: Optional[str] = None
    nav: Optional[str] = None
    priceToBookValue: Optional[str] = None
    preIpoEps: Optional[str] = None
    postIpoEps: Optional[str] = None
    preIpoPe: Optional[str] = None
    postIpoPe: Optional[str] = None
    marketCapUpperBand: Optional[str] = None
    asOfDate: Optional[str] = None

class GMPTrend(BaseModel):
    date: str
    gmp: str
    gain: str

class BrokerReviewSummary(BaseModel):
    subscribe: int = 0
    mayApply: int = 0
    neutral: int = 0
    avoid: int = 0

class IPOData(BaseModel):
    id: str
    slug: str
    name: str
    companyName: str
    logoUrl: Optional[str] = None
    category: IPOCategory = "mainboard"
    status: IPOStatus = "upcoming"
    exchange: str = "BSE & NSE"
    
    # Pricing & Lot
    priceBandMin: int = 0
    priceBandMax: int = 0
    issuePrice: Optional[int] = None
    lotSize: int = 1
    minInvestment: int = 0
    issueSizeTotalCr: float = 0.0
    freshIssueCr: float = 0.0
    ofsCr: float = 0.0
    faceValue: int = 10
    
    # Grey Market Premium (GMP)
    gmp: int = 0
    gmpPercent: float = 0.0
    gmpUpdatedTime: str = "Live"
    expectedListingPrice: int = 0
    gmpTrends: Optional[List[GMPTrend]] = None
    
    # Subscriptions
    totalSubscription: float = 0.0
    qibSubscription: float = 0.0
    niiSubscription: float = 0.0
    retailSubscription: float = 0.0
    
    # Key Dates (YYYY-MM-DD)
    openDate: str = ""
    closeDate: str = ""
    allotmentDate: str = ""
    refundDate: str = ""
    dematCreditDate: str = ""
    listingDate: str = ""
    
    # Listing Info
    listingPrice: Optional[int] = None
    listingGainPercent: Optional[float] = None
    currentMarketPrice: Optional[int] = None
    
    # Registrars & Lead Managers
    registrarName: str = "Check Website"
    registrarWebsite: str = ""
    registrarCheckUrl: str = ""
    registrarPhone: Optional[str] = None
    registrarEmail: Optional[str] = None
    leadManagers: List[str] = Field(default_factory=list)
    
    # Insights & Review Score
    recommendation: str = "May Apply"
    rating: float = 3.5
    reviewScore: Optional[int] = None
    brokerReviews: Optional[BrokerReviewSummary] = None
    memberReviews: Optional[BrokerReviewSummary] = None
    highlights: List[str] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)
    
    # Detailed Tables
    financials: Optional[List[FinancialMetric]] = None
    lotSizes: Optional[List[LotSizeDetail]] = None
    subscriptionBreakdown: Optional[List[SubscriptionDetail]] = None
    peerComparison: Optional[List[PeerComparisonDetail]] = None
    reservations: Optional[List[IPOReservation]] = None
    kpis: Optional[IPOKpiDetail] = None
    objectsOfIssue: Optional[List[IssueObject]] = None
    prospectusUrl: Optional[str] = None
    drhpUrl: Optional[str] = None
