import { ArticlePost, IPOResearchReport, NewsAlert } from "@/types/editor";

export const MOCK_ARTICLES: ArticlePost[] = [
  {
    id: "art-1",
    slug: "hyundai-motor-india-ipo-deep-dive-valuation-analysis",
    title: "Hyundai Motor India IPO Analysis: Is the Premium Valuation Justified?",
    excerpt: "Detailed break-up of Hyundai Motor India's ₹27,870 Cr mega IPO. We analyze operational margins, SUV market share, and EV roadmap vs Maruti Suzuki & Tata Motors.",
    content: `
# Hyundai Motor India IPO: Complete Analytical Review

Hyundai Motor India Limited (HMIL), India's second-largest passenger vehicle maker, has opened its mega ₹27,870 Crore initial public offering. The entire issue is an Offer for Sale (OFS) by parent Hyundai Motor Company Korea.

## Key Financial & Operational Highlights
- **Market Share**: HMIL commands an ~14.6% market share in India's passenger vehicle segment.
- **SUV Leadership**: Creta and Venue account for over 60% of total domestic volumes.
- **Financial Performance**: FY24 Revenue stood at ₹69,829 Cr with a PAT of ₹6,047 Cr (ROE of 29.5%).

## Valuation & Peer Multiples
At the upper price band of ₹1,960, Hyundai is valued at a Price-to-Earnings (P/E) multiple of **26.2x FY24 EPS**, compared to Maruti Suzuki's 29.5x and Tata Motors' 11.4x.

### Analyst Verdict
**Apply for Long Term**. High operational efficiency, premium SUV portfolio, and Talegaon plant expansion give HMIL strong multi-year compounding potential.
    `,
    category: "Research Report",
    status: "Published",
    author: {
      name: "Rajesh Sharma",
      role: "Head of Equity Research",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    tags: ["Hyundai IPO", "Auto Sector", "Mainboard IPO", "Valuation Report"],
    featuredImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Hyundai Motor India IPO Review: Valuation & Financial Analysis",
    seoDescription: "Hyundai Motor India IPO analysis, GMP, lot size, subscription status and analyst verdict on applying.",
    relatedIpoSlug: "hyundai-motor-india-ipo",
    publishDate: "2026-07-22",
    views: 45200,
    readingTimeMins: 6,
    isBreaking: false,
    isFeatured: true
  },
  {
    id: "art-2",
    slug: "top-5-pre-ipo-stocks-to-watch-in-2026",
    title: "Top 5 High-Growth Pre-IPO & Unlisted Shares in India (2026 Edition)",
    excerpt: "An in-depth look at Tata Capital, National Stock Exchange (NSE), Reliance Retail, boAt, and Swiggy before their official mainboard listing DRHP filings.",
    content: `
# Unlisted Equities Guide: Pre-IPO Opportunities in India

Investing in unlisted shares before an official IPO offers high upside potential for patient investors. Here are the top 5 high-demand pre-IPO shares analyzed by our team.

## 1. Tata Capital Limited
- **Sector**: Financial Services / NBFC
- **Current Unlisted Price**: ₹950 per share
- **Expected IPO Timeline**: Q4 2026

## 2. National Stock Exchange (NSE)
- **Sector**: Financial Infrastructure
- **Current Unlisted Price**: ₹6,200 per share
- **Key Catalyst**: Awaiting SEBI No-Objection Certificate.

## 3. Reliance Retail Ventures
- **Sector**: Omnichannel Retail
- **Current Unlisted Price**: ₹2,850 per share
- **Store Count**: 18,800+ stores across India.
    `,
    category: "Pre-IPO Insights",
    status: "Published",
    author: {
      name: "Priya Malhotra",
      role: "Pre-IPO & Wealth Specialist",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    tags: ["Pre-IPO", "Tata Capital", "NSE Unlisted", "Wealth Management"],
    featuredImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Best Pre-IPO Shares in India 2026: Valuation & Buying Guide",
    seoDescription: "Explore top 5 pre-IPO unlisted shares in India including Tata Capital, NSE, and Reliance Retail.",
    publishDate: "2026-07-20",
    views: 31800,
    readingTimeMins: 8,
    isBreaking: false,
    isFeatured: true
  },
  {
    id: "art-3",
    slug: "sebi-streamlines-sme-ipo-listing-guidelines-2026",
    title: "SEBI Mandates Stricter Audit & Minimum Lot Size Norms for SME IPOs",
    excerpt: "Capital market regulator SEBI releases new regulatory circular introducing minimum net worth criteria and mandatory promoter lock-in extensions for SME listings.",
    content: `
# SEBI SME IPO Regulatory Updates

To curb speculative froth in small and medium enterprise (SME) listings, SEBI has implemented new operational guidelines effective August 1, 2026.

## Major Changes Mandated:
1. **Minimum Operating Profit**: SME companies must demonstrate positive EBITDA in 2 out of the last 3 financial years.
2. **Promoter Lock-In**: 50% of promoter holding locked in for 3 years instead of 1 year.
3. **Lot Size Floor**: Application size minimum floor increased to ₹2,00,000 for retail investors.
    `,
    category: "Regulatory & SEBI",
    status: "Published",
    author: {
      name: "Amitabh Verma",
      role: "Senior Financial Journalist",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    tags: ["SEBI", "SME IPO", "Regulations", "Market News"],
    seoTitle: "SEBI SME IPO New Rules 2026: Lock-in, Lot Size & Profit Criteria",
    seoDescription: "SEBI updates guidelines for SME IPOs. Check new minimum lot size, promoter lock-in, and audit norms.",
    publishDate: "2026-07-23",
    views: 18900,
    readingTimeMins: 4,
    isBreaking: true
  },
  {
    id: "art-4",
    slug: "swiggy-ipo-drhp-filed-issue-size-gmp",
    title: "Swiggy Files DRHP for ₹10,400 Cr IPO: Food Delivery & Instamart Financials Revealed",
    excerpt: "Food tech giant Swiggy submits DRHP with SEBI for ₹3,750 Cr fresh issue and ₹6,650 Cr OFS. Quick commerce growth drives revenue spike.",
    content: `
# Swiggy DRHP Analysis & Draft Prospectus Summary

Swiggy Limited has officially filed its Draft Red Herring Prospectus (DRHP) with SEBI for a public listing aiming to raise ₹10,400 Crores.

## Swiggy vs Zomato Financial Comparison:
- **Swiggy Instamart GOV Growth**: +74% YoY growth in Quick Commerce Gross Order Value.
- **Contribution Margin**: Improved to positive 1.2% in Q4 FY26.
    `,
    category: "IPO News",
    status: "Draft",
    author: {
      name: "Rajesh Sharma",
      role: "Head of Equity Research"
    },
    tags: ["Swiggy IPO", "Zomato", "Quick Commerce", "DRHP"],
    seoTitle: "Swiggy IPO DRHP Filed: Issue Size, Financials, Instamart GOV",
    seoDescription: "Swiggy files DRHP with SEBI for 10400 Cr IPO. Check fresh issue size, Instamart growth and comparison with Zomato.",
    publishDate: "2026-07-24",
    views: 0,
    readingTimeMins: 5
  },
  {
    id: "art-5",
    slug: "sbi-cashback-vs-hdfc-millennia-vs-amazon-pay-icici-comparison-2026",
    title: "SBI Cashback vs. HDFC Millennia vs. Amazon Pay ICICI: Which Card Gives Maximum Returns in 2026?",
    excerpt: "Detailed 3-way credit card showdown analyzing 5% cashback caps, MCC category exclusions, CashPoints vs direct statement credit, annual fee waivers, and lounge perks.",
    content: `
# SBI Cashback vs HDFC Millennia vs Amazon Pay ICICI: Ultimate 2026 Cashback Showdown

Choosing the right entry-level cashback credit card can save you ₹10,000 to ₹25,000 annually on routine e-commerce shopping, food delivery, and utility bill payments. However, each card comes with distinct capping rules, fee waiver thresholds, Merchant Category Code (MCC) exclusions, and reward redemption mechanisms.

In this comprehensive guide, we compare India's top 3 cashback powerhouses: **SBI Cashback Credit Card**, **HDFC Millennia Credit Card**, and **Amazon Pay ICICI Credit Card**.

---

## 1. Executive Summary & Quick Feature Specs Table

| Feature / Parameter | SBI Cashback Card | HDFC Millennia | Amazon Pay ICICI |
| :--- | :--- | :--- | :--- |
| **Joining / Annual Fee** | ₹999 + GST | ₹1,000 + GST | **₹0 (Lifetime Free)** |
| **Annual Fee Waiver** | Spend **₹2,00,000** | Spend **₹1,00,000** | **N/A (Always ₹0)** |
| **Online Cashback Rate** | **5% Flat (All Online)** | **5% (Partner Apps)** | **5% (Amazon Prime)** |
| **Merchant Restrictions** | **None (Universal)** | Amazon, Flipkart, Swiggy | Amazon Only (3% Non-Prime) |
| **Monthly Cashback Cap** | **₹5,000 / month** | **₹1,000 / month** | **Unlimited (No Cap)** |
| **Redemption Process** | **Auto-Statement Credit** | Manual CashPoints | **Auto-Amazon Pay Balance** |
| **Domestic Lounge Access** | ❌ None | **4 Visits / year** | ❌ None |

---

## 2. Ratings & Category Scores

| Rating Category | SBI Cashback Card | HDFC Millennia | Amazon Pay ICICI |
| :--- | :--- | :--- | :--- |
| **Charges & Annual Fee** | ⭐⭐⭐⭐ (3.5/5) | ⭐⭐⭐⭐ (3.8/5) | ⭐⭐⭐⭐⭐ (5.0/5) |
| **Rewards & Cashback Ease** | ⭐⭐⭐⭐⭐ (5.0/5) | ⭐⭐⭐⭐ (4.2/5) | ⭐⭐⭐⭐⭐ (4.8/5) |
| **Customer Service & App** | ⭐⭐⭐⭐ (3.5/5) | ⭐⭐⭐⭐⭐ (4.5/5) | ⭐⭐⭐⭐ (4.0/5) |

---

## 3. Pros & Cons Analysis

### SBI Cashback Card
* **Pros:** Auto cashback credit within 2 days; 5% flat online cashback on any merchant; ₹2L annual fee waiver.
* **Cons:** No airport lounge access; ₹5,000 monthly cashback cap.

### HDFC Millennia Card
* **Pros:** 4 complimentary domestic lounge visits per year; ₹1L spend fee waiver; 5% CashPoints on top partner apps.
* **Cons:** 1,000 CashPoints monthly capping; manual CashPoints redemption required.

### Amazon Pay ICICI Card
* **Pros:** 100% Lifetime Free (₹0 annual fee); Unlimited 5% cashback on Amazon.in; auto-credited to Amazon Pay balance.
* **Cons:** Lower 3% for Non-Prime members; no airport lounge access; 1% for non-Amazon online spends.

---

## 4. Who Should Get Which Card? (Target Audience Guide)

* **Choose SBI Cashback Credit Card if:** You shop across multiple platforms (Myntra, Flipkart, Swiggy, Nykaa, MakeMyTrip) and want maximum uncapped monthly cashback without merchant lock-ins.
* **Choose Amazon Pay ICICI if:** You are an active Amazon Prime subscriber and want a 100% Lifetime Free card with zero annual fees forever.
* **Choose HDFC Millennia if:** You want a balanced card offering 5% cashback on top apps **PLUS complimentary airport lounge access** and an easy ₹1 Lakh annual spend fee waiver.

---

## 5. Merchant Category Code (MCC) Exclusions Matrix

Before swiping your card, note the critical MCC category exclusions across these cards:

| Excluded Category | SBI Cashback Card | HDFC Millennia | Amazon Pay ICICI |
| :--- | :--- | :--- | :--- |
| **Fuel & Petrol Pumps** | Excluded (MCC 5172, 5541, 5542) | Excluded (1% Surcharge Waiver) | Excluded (1% Waiver) |
| **Rent Payments** | Excluded (MCC 6513, 7349) | Excluded (1% Fee Applied) | Excluded |
| **Utility Bills** | Excluded (MCC 4900, 4814, 4899) | 1% CashPoints (Capped 500/mo) | 2% Cashback |
| **E-Wallet Loading** | Excluded (MCC 6540, 6541) | Excluded | Excluded |
| **Gold & Jewelry** | Excluded (MCC 5051, 5094) | Excluded | 1% Cashback |
| **Education Fees** | Excluded (MCC 8211, 8220) | 1% CashPoints | 1% Cashback |
| **Railway Purchases** | Excluded (MCC 4011, 4112) | 1% CashPoints | 1% Cashback |

---

## 6. Maximum Savings & Reward Capping Calculations

* **SBI Cashback Card:** Maximum cashback is **₹5,000 per statement cycle**, which equals **₹60,000 maximum annual savings**.
* **HDFC Millennia:** Maximum cashback is **1,000 CashPoints per month**, which equals **₹12,000 maximum annual savings**.
* **Amazon Pay ICICI:** **Unlimited cashback** with zero upper capping per billing cycle.

---

## 7. Complete Fee Schedules & Late Payment Charges Matrix

### Late Payment Charges Comparison:
| Statement Balance | SBI Cashback Fee | HDFC Millennia Fee | Amazon Pay ICICI Fee |
| :--- | :--- | :--- | :--- |
| **₹0 to ₹500** | ₹0 | ₹0 | ₹0 |
| **₹501 to ₹1,000** | ₹400 | ₹100 | ₹100 |
| **₹1,001 to ₹10,000** | ₹750 | ₹500 | ₹500 |
| **₹10,001 to ₹25,000** | ₹950 | ₹800 | ₹750 |
| **₹25,001 to ₹50,000** | ₹1,100 | ₹1,100 | ₹1,000 |
| **More than ₹50,000** | ₹1,300 | ₹1,300 | ₹1,200 |

---

## 8. Step-by-Step Application Guide

### Online Application:
1. Visit the official issuer website or apply directly via our portal.
2. Fill out personal, employment, and gross monthly income details.
3. Complete online KYC verification via Aadhaar OTP & Video KYC.
4. Receive card delivery at your residence within 3-5 business days upon approval.

### Offline Application:
1. Visit your nearest bank branch (SBI, HDFC, or ICICI Bank).
2. Complete the physical credit card application form with bank executives.
3. Submit self-attested copies of PAN, Aadhaar, and Income proofs.

---

## 9. Required Documents Checklist

* **Proof of Identity:** PAN Card, Aadhaar Card, Driver's License, Passport, or Voter ID.
* **Proof of Address:** Aadhaar Card, Utility Bills (<3 months old), Passport, or Bank Statement.
* **Proof of Income:** Salary Slips (Last 3 months), Form 16 / ITR, or Bank Account Statement (Last 6 months).

---

## 10. Frequently Asked Questions (FAQs)

### Q1. Which card is best for overall e-commerce shopping?
**SBI Cashback Credit Card** is the winner because it provides a flat 5% cashback on all online purchases with no merchant lock-ins.

### Q2. How is cashback credited for SBI Cashback Card vs Amazon Pay ICICI?
SBI Cashback is automatically credited directly to your credit card statement within 2 days of statement generation. Amazon Pay ICICI cashback is credited as Amazon Pay balance.

### Q3. Does HDFC Millennia provide free airport lounge access?
Yes, HDFC Millennia offers 4 complimentary domestic airport lounge visits per year (1 visit per calendar quarter).
    `,
    category: "Credit Cards Guide",
    status: "Published",
    author: {
      name: "Priya Malhotra",
      role: "Pre-IPO & Wealth Specialist",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    tags: ["SBI Cashback", "HDFC Millennia", "Amazon Pay ICICI", "Credit Card Comparison", "Cashback Cards"],
    featuredImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    seoTitle: "SBI Cashback vs HDFC Millennia vs Amazon Pay ICICI: Best Cashback Card 2026",
    seoDescription: "Compare SBI Cashback, HDFC Millennia and Amazon Pay ICICI credit cards. Check cashback rates, capping, fee waivers, MCC exclusions, and lounge access.",
    publishDate: "2026-07-25",
    views: 52400,
    readingTimeMins: 9,
    isBreaking: false,
    isFeatured: true
  },
  {
    id: "art-6",
    slug: "top-5-credit-cards-in-india-buyers-guide-2026",
    title: "Top 5 Best Credit Cards in India (2026 Edition): Income-Based Decision Guide",
    excerpt: "Discover the top 5 credit cards for salaried & self-employed individuals in India. Categorized by monthly income brackets, lounge perks, required documents, and rewards.",
    content: `
# Top 5 Best Credit Cards in India (2026 Edition)

Whether you are applying for your very first credit card or upgrading your wallet for maximum cashback and airport lounge access, choosing the right card based on your gross monthly income is crucial.

Here is our handpicked list of the top 5 credit cards in India for 2026.

---

## 1. Overview Specs Table

| Card Name | Issuer | Min Income | Annual Fee | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **SBI Cashback Card** | SBI Card | ₹30,000 / mo | ₹999 (Waived on ₹2L) | 5% Online Cashback |
| **Amazon Pay ICICI** | ICICI Bank | ₹25,000 / mo | **₹0 (Lifetime Free)** | Unlimited Amazon Spends |
| **HDFC Millennia** | HDFC Bank | ₹35,000 / mo | ₹1,000 (Waived on ₹1L) | Shopping + Lounge Access |
| **Axis Airtel Card** | Axis Bank | ₹25,000 / mo | ₹500 (Waived on ₹2L) | 25% Utility & Bill Pay |
| **IDFC FIRST Wealth** | IDFC FIRST | ₹1,00,000 / mo | **₹0 (Lifetime Free)** | Low 1.5% Forex & Lounges |

---

## 2. Ratings & Category Scores

| Card Name | Charges Rating | Rewards Rating | Customer Service | Overall Rating |
| :--- | :--- | :--- | :--- | :--- |
| **SBI Cashback Card** | ⭐⭐⭐ (3.5/5) | ⭐⭐⭐⭐⭐ (5.0/5) | ⭐⭐⭐ (3.5/5) | **4.8 / 5.0** |
| **Amazon Pay ICICI** | ⭐⭐⭐⭐⭐ (5.0/5) | ⭐⭐⭐⭐⭐ (4.8/5) | ⭐⭐⭐⭐ (4.0/5) | **4.7 / 5.0** |
| **HDFC Millennia** | ⭐⭐⭐⭐ (3.8/5) | ⭐⭐⭐⭐ (4.2/5) | ⭐⭐⭐⭐⭐ (4.5/5) | **4.6 / 5.0** |
| **Axis Airtel Card** | ⭐⭐⭐⭐ (4.0/5) | ⭐⭐⭐⭐⭐ (4.7/5) | ⭐⭐⭐⭐ (3.8/5) | **4.5 / 5.0** |
| **IDFC FIRST Wealth** | ⭐⭐⭐⭐⭐ (5.0/5) | ⭐⭐⭐⭐ (4.3/5) | ⭐⭐⭐⭐⭐ (4.8/5) | **4.9 / 5.0** |

---

## 3. Pros & Cons Analysis

### Highlights Across Top Cards:
* **SBI Cashback:** Best 5% flat online cashback without merchant restrictions.
* **Amazon Pay ICICI:** 100% Lifetime Free card with no annual maintenance fees.
* **HDFC Millennia:** Balanced card with domestic airport lounge access.
* **Axis Airtel:** Massive 25% cashback on Airtel wifi & mobile bills.
* **IDFC FIRST Wealth:** Low 1.5% international Forex markup & free lounge access.

---

## 4. Target Audience Guide: Who Should Get Which Card?

* **Salaried Beginners (Income ₹25k - ₹35k/mo):** Apply for **Amazon Pay ICICI** (Lifetime Free) or **SBI Cashback Card** for daily savings.
* **Frequent Domestic Travelers:** Apply for **HDFC Millennia** to get 4 free airport lounge passes per year.
* **High Household Bill Payers:** Apply for **Axis Airtel Card** for 25% utility cashback.
* **HNIs & International Travelers:** Apply for **IDFC FIRST Wealth** for low 1.5% Forex fees.

---

## 5. Category Exclusions & MCC Code Warnings

Watch out for non-reward categories across major cards:
* **Fuel Purchases:** MCC 5172, 5541, 5542 (1% Surcharge waiver applies, no cashback).
* **E-Wallet Loadings:** MCC 6540, 6541.
* **House Rent Payments:** MCC 6513, 7349.
* **Jewelry & Gold:** MCC 5051, 5094.
* **Utility & Education Fees:** Check card-specific rules.

---

## 6. Reward Capping Calculations

* **SBI Cashback Card:** Capped at ₹5,000 / month (Max ₹60,000/year savings).
* **HDFC Millennia:** Capped at 1,000 CashPoints / month.
* **Amazon Pay ICICI:** **Unlimited** reward earnings.
* **Axis Airtel Card:** Capped at ₹300 / month for Airtel 25% category.

---

## 7. Fee Schedules & Late Payment Charges Matrix

| Statement Balance | Standard Penalty Charge |
| :--- | :--- |
| **Up to ₹500** | ₹0 |
| **₹501 to ₹1,000** | ₹100 - ₹400 |
| **₹1,001 to ₹10,000** | ₹500 - ₹750 |
| **₹10,001 to ₹25,000** | ₹750 - ₹950 |
| **More than ₹25,000** | ₹1,000 - ₹1,300 |

---

## 8. Step-by-Step Application Guide

1. Choose your preferred card based on your monthly income and primary expense category.
2. Click **Apply Now** on our platform to be redirected to the bank's official instant approval page.
3. Provide your mobile number, PAN, and employment information.
4. Complete digital Aadhaar OTP and Video KYC verification.
5. Card physical dispatch occurs within 3-5 working days.

---

## 9. Required Documents Checklist

* **Proof of Identity:** PAN Card, Aadhaar Card, Passport, or Voter ID.
* **Proof of Address:** Aadhaar Card, Utility Bill (< 3 months old), or Passport.
* **Proof of Income:** Last 3 months Salary Slips, Form 16 / ITR, or 6 months Bank Statement.

---

## 10. Frequently Asked Questions (FAQs)

### Q1. Which credit card is 100% free for life?
**Amazon Pay ICICI Credit Card** and **IDFC FIRST Wealth Credit Card** are 100% Lifetime Free cards with zero joining and zero renewal fees.

### Q2. What credit score is required for approval?
A CIBIL credit score of **750 or higher** significantly increases approval odds across all major Indian credit card issuers.
    `,
    category: "Credit Cards Guide",
    status: "Published",
    author: {
      name: "Rajesh Sharma",
      role: "Head of Equity Research",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    tags: ["Best Credit Cards", "Buyer Guide", "Lifetime Free", "Lounge Access", "Personal Finance"],
    featuredImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Top 5 Credit Cards in India 2026: Compare Cashback, Fees & Eligibility",
    seoDescription: "Explore top 5 credit cards in India including SBI Cashback, HDFC Millennia, Amazon Pay ICICI, Airtel Axis, and IDFC Wealth.",
    publishDate: "2026-07-25",
    views: 38900,
    readingTimeMins: 7,
    isBreaking: false,
    isFeatured: true
  },
  {
    id: "art-7",
    slug: "hdfc-millennia-credit-card-review-2026",
    title: "HDFC Millennia Credit Card Review (2026): Features, Lounge Access & Fee Waiver Math",
    excerpt: "Comprehensive review of HDFC Millennia Credit Card. Analyze 5% CashPoints on Amazon & Swiggy, 4 domestic lounge visits, ₹1L spend fee reversal, and CashPoints redemption rules.",
    content: `
# HDFC Millennia Credit Card: Complete Review & Benefit Breakdown

The **HDFC Millennia Credit Card** is one of India's most sought-after rewards cards for young professionals. It offers a sweet spot between e-commerce cashback and airport lounge access.

---

## 1. Overview Specs Table

| Feature / Parameter | Details |
| :--- | :--- |
| **Joining Fee** | ₹1,000 + GST |
| **Annual Renewal Fee** | ₹1,000 + GST (Waived on spending ₹1,00,000 annually) |
| **Primary Benefit** | 5% CashPoints on top partner merchants |
| **Partner Merchants** | Amazon, Flipkart, Myntra, Swiggy, Zomato, BookMyShow, Cult.fit, Uber |
| **Lounge Access** | 4 complimentary domestic airport lounge visits per year (1/quarter) |
| **Card Type & Network** | Cashback & Rewards (Visa / Mastercard / RuPay) |

---

## 2. Ratings & Category Scores

* **Charges & Fee Waiver Ease:** ⭐⭐⭐⭐ (3.8/5)
* **Rewards Value & Perks:** ⭐⭐⭐⭐ (4.2/5)
* **Customer Service & Banking App:** ⭐⭐⭐⭐⭐ (4.5/5)
* **Overall Rating:** **4.6 / 5.0**

---

## 3. Pros & Cons Analysis

### Pros:
* 5% CashPoints on major online shopping and food delivery apps.
* 4 complimentary domestic airport lounge visits per year.
* Low ₹1,00,000 annual spend threshold for 100% fee waiver.
* Available on RuPay network for UPI credit transactions.

### Cons:
* Monthly 1,000 CashPoints cap on 5% category.
* Requires manual redemption of CashPoints via NetBanking.

---

## 4. Target Audience Guide: Who Should Get This Card?

* Young professionals spending ₹10,000 to ₹25,000 monthly on food delivery, commuting, and e-commerce.
* Frequent domestic travelers seeking low-cost airport lounge access.
* Individuals looking for easy annual fee waiver math (₹1L spend per year).

---

## 5. Category Exclusions & MCC Codes Table

| Excluded Category | MCC Code(s) | Explanation |
| :--- | :--- | :--- |
| **Fuel Purchases** | 5172, 5541, 5542, 5983 | 1% Surcharge waiver applies (Spends ₹400-₹5,000), no CashPoints |
| **Rent Payments** | 6513, 7349 | 1% fee charged by bank on rent transactions |
| **Wallet Loadings** | 6540, 6541 | Adding money to digital wallets excluded |
| **Gold & Jewelry** | 5051, 5094, 7631 | Jewelry purchases excluded from 5% category |

---

## 6. Maximum Savings & Reward Capping Calculations

* **Monthly 5% Cap:** 1,000 CashPoints per month.
* **Monthly 1% Cap:** 1,000 CashPoints per month on other online/offline spends.
* **Maximum Annual Value:** Up to **₹24,000 annual CashPoints** + **4 Lounge Visits (~₹4,000 value)**.

---

## 7. Complete Fee Schedules & Late Payment Charges Matrix

* **Joining / Annual Fee:** ₹1,000 + GST.
* **Finance Charge (APR):** 3.60% per month (43.2% per annum).
* **Forex Markup Fee:** 3.50%.
* **Late Payment Charges:**
  * Balance < ₹500: ₹0
  * Balance ₹501 - ₹1,000: ₹100
  * Balance ₹1,001 - ₹10,000: ₹500
  * Balance ₹10,001 - ₹25,000: ₹800
  * Balance > ₹25,000: ₹1,100 - ₹1,300

---

## 8. Step-by-Step Application Guide

### Online Application:
1. Visit the HDFC Bank official website or apply via our portal.
2. Select HDFC Millennia Credit Card and complete customer authentication.
3. Fill out employment details and complete Video KYC.
4. Physical card is dispatched within 3 business days.

---

## 9. Required Documents Checklist

* **Proof of Identity:** PAN Card, Aadhaar Card, Passport, or Voter ID.
* **Proof of Address:** Aadhaar Card, Utility Bills, or Bank Statement.
* **Proof of Income:** Salary Slips (Last 3 months), Form 16, or ITR.

---

## 10. Frequently Asked Questions (FAQs)

### Q1. How do I redeem HDFC Millennia CashPoints?
You can redeem CashPoints via HDFC NetBanking against your credit card statement balance (1 CashPoint = ₹1.00, min 500 points required).

### Q2. Is airport lounge access free on HDFC Millennia?
Yes, you get 4 complimentary domestic airport lounge access visits per calendar year (1 visit per quarter).
    `,
    category: "Credit Cards Guide",
    status: "Published",
    author: {
      name: "Priya Malhotra",
      role: "Pre-IPO & Wealth Specialist",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    tags: ["HDFC Millennia", "HDFC Credit Card", "Lounge Access", "CashPoints", "Review"],
    featuredImage: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80",
    seoTitle: "HDFC Millennia Credit Card Review 2026: Lounge Access & CashPoints",
    seoDescription: "Detailed review of HDFC Millennia Credit Card. Check 5% CashPoints, monthly capping, lounge access, and annual fee waiver rules.",
    publishDate: "2026-07-26",
    views: 24500,
    readingTimeMins: 6,
    isBreaking: false,
    isFeatured: false
  }
];

export const MOCK_RESEARCH_REPORTS: IPOResearchReport[] = [
  {
    id: "rep-1",
    ipoName: "Hyundai Motor India Limited",
    ipoSlug: "hyundai-motor-india-ipo",
    analystName: "Rajesh Sharma, CFA",
    publishDate: "2026-07-22",
    verdict: "Apply for Long Term",
    targetPriceRange: "₹2,250 - ₹2,400",
    financialScore: 8.5,
    managementScore: 9.0,
    valuationScore: 7.0,
    industryScore: 8.8,
    overallRating: 4.5,
    bullPoints: [
      "2nd largest passenger vehicle manufacturer in India with ~14.6% market share",
      "High margin SUV portfolio (Creta, Venue, Alcazar) accounting for 60%+ volumes",
      "Strong parent backing & cash-flow positive balance sheet with zero debt",
      "Expansion into Talegaon plant adds 250,000 unit capacity by 2027"
    ],
    bearPoints: [
      "100% OFS issue; zero proceeds going to company balance sheet",
      "Royalty payout to Korean parent increases from 2.2% to 3.5% of revenue",
      "Intense competition in EV transition phase from Tata Motors & Mahindra"
    ],
    summary: "Hyundai India is a marquee auto franchise with best-in-class return metrics (ROE ~29.5%). Though priced at a full 26.2x P/E, long term compounding potential makes it a key portfolio anchor.",
    status: "Published"
  },
  {
    id: "rep-2",
    ipoName: "Swiggy Limited",
    ipoSlug: "swiggy-ipo",
    analystName: "Priya Malhotra",
    publishDate: "2026-07-24",
    verdict: "Apply for Listing Gain",
    targetPriceRange: "₹420 - ₹480",
    financialScore: 7.2,
    managementScore: 8.2,
    valuationScore: 6.8,
    industryScore: 9.2,
    overallRating: 3.8,
    bullPoints: [
      "Hyper-growth in Instamart Quick Commerce GOV (+74% YoY)",
      "Duopoly market structure with Zomato ensures pricing power",
      "High average order value in premium urban cohorts"
    ],
    bearPoints: [
      "Consolidated net loss still remains at ₹2,350 Cr in FY25",
      "Zepto & Blinkit aggressively expanding dark store density"
    ],
    summary: "Swiggy offers high growth exposure to India's booming quick commerce and food delivery ecosystem. Recommended for risk-seeking investors targeting listing gains.",
    status: "Draft"
  }
];

export const MOCK_NEWS_ALERTS: NewsAlert[] = [
  {
    id: "alt-1",
    title: "Hyundai Motor India Allotment Out!",
    message: "Hyundai Motor India IPO allotment status is now live on Link Intime & BSE portal. Click here to check your application status instantly.",
    category: "Allotment Alert",
    targetAudience: "Registered Allotment Seekers (142,000+ users)",
    sentTime: "2026-07-23 18:30",
    deliveredCount: 138400,
    openRatePercent: 68.4,
    linkUrl: "/allotment"
  },
  {
    id: "alt-2",
    title: "Swiggy IPO GMP Surges +42%!",
    message: "Swiggy Unlisted GMP jumped from ₹85 to ₹120 per share following DRHP approval. Read full valuation analysis.",
    category: "GMP Surge",
    targetAudience: "IPO Watchlist Subscribers (45,000+ users)",
    sentTime: "2026-07-24 09:15",
    deliveredCount: 44200,
    openRatePercent: 74.2,
    linkUrl: "/ipo/swiggy-ipo"
  }
];
