# IPO & Pre-IPO India Platform 🇮🇳

An institutional-grade, modern web platform for tracking Indian Mainboard & SME Initial Public Offerings (IPOs), real-time Grey Market Premiums (GMP), live bidding subscription rates, unlisted Pre-IPO equity shares, brokers, payment apps, and credit cards.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Vanilla CSS**, and clean minimal fintech design inspired by **Groww** & **Zerodha**.

---

## 🚀 Key Features

### 1. 📈 Mainboard & SME IPO Tracking
- **Live Grey Market Premium (GMP)**: Real-time estimated listing gains, percentage gains, and sentiment indicators (Bullish / Neutral / Bearish).
- **Subscription Tracker**: Live subscription breakdowns across QIB (Qualified Institutional Buyers), NII (Non-Institutional Investors), Retail (RII), and Employee quotas.
- **Deep-Dive Insight Pages (`/ipo/[id]`)**: Detailed timelines (Bidding, Allotment, Refund, Listing), issue structure (Fresh Issue vs OFS), lot sizes, price bands, valuations (P/E, RONW, EPS), and registrar allotment links.
- **Registrar Allotment Hub**: Direct quick-access portals for Link Intime, KFintech, Bigshare, Skyline, Cameo, and Purva Sharegistry.
- **Listing Gain Calculator**: Dynamic profit projector calculating expected listing returns based on price band, lot size, and live GMP.

### 2. 🦄 Dedicated Pre-IPO Marketplace (`/pre-ipo`)
- **Unlisted Equities Directory**: Track high-growth Indian pre-IPO companies before they list on NSE & BSE (e.g., Tata Technologies, NSE India, boAt, PharmEasy, Reliance Retail, OYO, HDB Financial Services, Hexaware).
- **Fundamental Metrics**: Valuation, last funding round, sector classification, revenue run-rate, and demat delivery processes.
- **Pre-IPO Advisory Contact**: Direct inquiry desk for institutional and HNI allocation assistance.

### 3. 🏦 Broker Comparison & Reviews (`/brokers` & `/brokers/[id]`)
- Comprehensive guides and analysis of India's leading discount and full-service brokers:
  - **Zerodha (Kite)**
  - **Groww**
  - **Angel One**
  - **Upstox**
  - **ICICI Direct**
- Brokerage fees, account opening charges, AMC, trading platforms, and direct IPO application walkthroughs.

### 4. 💳 Payment Apps & UPI 2.0 ASBA (`/payment-apps` & `/payment-apps/[id]`)
- Detailed guides for applying for IPOs via UPI 2.0 mandate blocking:
  - **Google Pay (GPay)**
  - **PhonePe**
  - **Paytm UPI**
  - **BHIM UPI**
  - **Cred UPI**
- Step-by-step mandate approval workflows, high-value transaction limits (up to ₹5,00,000 for HNI/Retail), and troubleshooting failed mandate blocks.

### 5. 💳 Credit Cards Directory & Reviews (`/credit-cards` & `/credit-cards/[id]`)
- Premier card reviews for Indian market participants:
  - **HDFC Bank Regalia Gold**
  - **SBI Card Cashback**
  - **Axis Bank Magnus / Atlas**
  - **ICICI Bank Amazon Pay**
  - **IDFC FIRST Wealth**
- Reward rates, lounge access, milestone bonuses, annual fees, and fee-waiver eligibility.

### 6. 🕷️ Automated Web Scraper (`scraper/scrape_ipos.py`)
- Automated Python web scraper with rotating User-Agents and resilient HTML parsing.
- Scrapes live market GMP, issues, dates, and subscription figures.
- Automated via **GitHub Actions** (`.github/workflows/scrape_ipos.yml`) to keep data fresh.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript 5
- **Styling**: Vanilla CSS with tailored design tokens (Inter & Outfit typography, Groww/Zerodha minimal slate & emerald aesthetic)
- **Icons**: Lucide React
- **Automation / Scraping**: Python 3.12, BeautifulSoup4, Requests
- **CI/CD**: GitHub Actions

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- Python 3.10+ (for running scraper locally)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ashishgupta-products/ipopreipo.git
   cd ipopreipo
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🐍 Running the Scraper Locally

```bash
# Install scraper dependencies
pip install -r scraper/requirements.txt

# Run scraper
python scraper/scrape_ipos.py
```
This updates `public/data/live_ipos.json` and `src/data/live_ipos.json`.

---

## 📁 Project Architecture

```
ipopreipo/
├── .github/
│   └── workflows/
│       └── scrape_ipos.yml     # Automated data scraper workflow
├── public/
│   └── data/                   # Public JSON assets
├── scraper/
│   ├── requirements.txt        # Scraper dependencies
│   └── scrape_ipos.py          # Real-time web scraper
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with responsive Navbar & Footer
│   │   ├── page.tsx            # Clean Home with live IPO board & tools
│   │   ├── pre-ipo/            # Dedicated Pre-IPO marketplace
│   │   ├── ipo/[id]/           # Dynamic IPO insight pages (60+ pre-rendered)
│   │   ├── brokers/            # Brokers list & [id] reviews
│   │   ├── payment-apps/       # UPI payment apps list & [id] guides
│   │   └── credit-cards/       # Credit cards list & [id] reviews
│   ├── components/
│   │   ├── Navbar.tsx          # Responsive navigation (IPOs, Preipo, Payment Apps, Brokers, Credit Cards)
│   │   ├── Footer.tsx          # SEBI disclaimer & site links
│   │   ├── IpoCard.tsx         # IPO display card with live GMP & subscription
│   │   └── GainCalculator.tsx  # Dynamic listing gain projector
│   ├── data/
│   │   ├── ipoData.ts          # Mainboard & SME IPO dataset
│   │   ├── preIpoData.ts       # Unlisted pre-IPO companies
│   │   ├── brokersData.ts      # Broker dataset & reviews
│   │   ├── paymentAppsData.ts  # Payment app guides & UPI steps
│   │   └── creditCardsData.ts  # Credit card reviews & reward details
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   └── index.css               # Clean slate/white design system
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## ⚖️ Disclaimer

*Market investments and unlisted equity securities are subject to market risks. Please read all offer documents, DRHP/RHP, and SEBI regulations carefully before investing. Grey Market Premium (GMP) is an unofficial, unregulated benchmark and should not be used as the sole criteria for investment decisions.*
