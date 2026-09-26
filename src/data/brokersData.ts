export interface BrokerCharges {
  equityDelivery: string;
  equityIntraday: string;
  equityFutures: string;
  equityOptions: string;
  accountOpening: string;
  dematAmc: string;
  dpCharges: string;
  callAndTrade: string;
}

export interface BrokerItem {
  id: string;
  name: string;
  tagline: string;
  category: 'Discount' | 'Full Service';
  rating: number;
  activeClients: string;
  equityDelivery: string;
  intradayFo: string;
  accountOpening: string;
  amc: string;
  ipoUpiRating: string;
  highlights: string[];
  bestFor: string;
  link: string;
  about: string;
  pros: string[];
  cons: string[];
  charges: BrokerCharges;
  ipoFeatures: string[];
  platforms: string[];
  sebiRegNo: string;
  headquarters: string;
}

export const BROKERS_DATA: BrokerItem[] = [
  {
    id: 'zerodha',
    name: 'Zerodha',
    tagline: 'India’s pioneer discount broker and largest retail investment ecosystem.',
    category: 'Discount',
    rating: 4.8,
    activeClients: '7.8 Million+',
    equityDelivery: '₹0 (Free)',
    intradayFo: '₹20 or 0.03%',
    accountOpening: '₹200',
    amc: '₹300 / year',
    ipoUpiRating: '99.8% (Instant Mandates)',
    highlights: ['Kite web & mobile platform', 'Seamless IPO ASBA via any UPI app', 'Sensibull F&O integration', 'Coin for direct mutual funds'],
    bestFor: 'Active traders, long-term investors & reliable IPO bidders',
    link: 'https://zerodha.com',
    about: 'Zerodha kicked off the discount broking revolution in India in 2010. Today, it stands as the benchmark for technological reliability and customer trust. With zero debt and no external funding, Zerodha processes over 15% of all retail trading volumes on the NSE and BSE.',
    pros: [
      'Zero brokerage on long-term equity delivery and IPO allotments',
      'Ultra-fast, clean Kite web and mobile application',
      'Instant UPI ASBA mandate dispatch for Mainboard and SME IPOs',
      'No spam calls, pushy advisory, or hidden relationship manager charges',
      'Rich ecosystem: Coin (Direct MF), Varsity (Education), Sensibull (Options)'
    ],
    cons: [
      'Account opening fee of ₹200 for Equity & F&O',
      'Quarterly Demat maintenance charge of ₹75+GST',
      'No 3-in-1 banking integration (unlike ICICI Direct or Kotak)'
    ],
    charges: {
      equityDelivery: '₹0 (Free)',
      equityIntraday: '0.03% or ₹20/executed order (whichever is lower)',
      equityFutures: '0.03% or ₹20/executed order (whichever is lower)',
      equityOptions: 'Flat ₹20 per executed order',
      accountOpening: '₹200 (Online paperless)',
      dematAmc: '₹300 + GST / year (charged quarterly)',
      dpCharges: '₹13.50 + GST per scrip on debit',
      callAndTrade: '₹50 per executed order'
    },
    ipoFeatures: [
      '1-Click IPO application with auto-filled Demat number',
      'Support for UPI IDs from PhonePe, Google Pay, BHIM, and Paytm',
      'Real-time mandate status indicator and bid modification',
      'High success rate for SME and Mainboard allotments'
    ],
    platforms: ['Kite Web', 'Kite Mobile (Android & iOS)', 'Console (Backoffice)', 'Coin (Direct Mutual Funds)'],
    sebiRegNo: 'INZ000031633 / CDSL: IN-DP-431-2019',
    headquarters: 'Bengaluru, Karnataka'
  },
  {
    id: 'groww',
    name: 'Groww',
    tagline: 'Simple, transparent investing with one of India’s largest active client bases.',
    category: 'Discount',
    rating: 4.7,
    activeClients: '10.5 Million+',
    equityDelivery: '₹20 or 0.05%',
    intradayFo: '₹20 flat',
    accountOpening: '₹0 (Free)',
    amc: '₹0 (Lifetime Free)',
    ipoUpiRating: '99.6% (Fast Tracking)',
    highlights: ['Zero Demat AMC for lifetime', '1-click UPI IPO application', 'Clean intuitive UI for beginners', 'Direct stock & mutual fund baskets'],
    bestFor: 'Beginners, mobile-first users & zero-maintenance investors',
    link: 'https://groww.in',
    about: 'Groww was founded in 2016 to simplify investing for everyday Indians. Rapidly surpassing 10 million active demat holders, Groww provides an exceptionally clean interface for stocks, IPOs, US equities, mutual funds, and fixed deposits.',
    pros: [
      'Lifetime Free Demat account with zero annual AMC charges forever',
      'Completely free online account opening within 5 minutes via Aadhaar KYC',
      'Most beginner-friendly mobile interface for first-time IPO applicants',
      'Track live subscription numbers and registrar allotment links in-app',
      'Seamless UPI payments directly linked through in-app Groww Pay'
    ],
    cons: [
      'Charges ₹20 or 0.05% on equity delivery trades (unlike Zerodha ₹0)',
      'Basic charting tools compared to TradingView pro terminals',
      'No advanced algorithmic trading API available for retail users'
    ],
    charges: {
      equityDelivery: '₹20 or 0.05% (whichever is lower)',
      equityIntraday: '₹20 or 0.05% (whichever is lower)',
      equityFutures: 'Flat ₹20 per executed order',
      equityOptions: 'Flat ₹20 per executed order',
      accountOpening: '₹0 (Completely Free)',
      dematAmc: '₹0 (Zero AMC for lifetime)',
      dpCharges: '₹13.50 + GST per company debit',
      callAndTrade: '₹50 per executed order'
    },
    ipoFeatures: [
      'Direct in-app UPI mandate verification and auto-approval prompts',
      'Pre-apply window available 24 hours before issue opening',
      'Instant allotment alerts via WhatsApp and push notifications',
      'Detailed financial summary and peer comparison for each IPO'
    ],
    platforms: ['Groww App (iOS & Android)', 'Groww Web Trading Terminal'],
    sebiRegNo: 'INZ000301838 / CDSL: IN-DP-417-2019',
    headquarters: 'Bengaluru, Karnataka'
  },
  {
    id: 'angel-one',
    name: 'Angel One',
    tagline: 'Tech-led financial powerhouse offering advisory, algos, and free delivery.',
    category: 'Full Service',
    rating: 4.6,
    activeClients: '6.2 Million+',
    equityDelivery: '₹0 (Free for 30 days)',
    intradayFo: '₹20 flat',
    accountOpening: '₹0 (Free)',
    amc: '₹0 for 1st year',
    ipoUpiRating: '99.4% (Pre-apply available)',
    highlights: ['Pre-apply for IPOs 2 days before bidding', 'ARQ Prime AI Robo-advisory', 'SmartAPI for automated trading', 'Speedy UPI ASBA verification'],
    bestFor: 'Advisory seekers, algorithmic traders & pre-IPO applicants',
    link: 'https://angelone.in',
    about: 'With over 25 years of market presence, Angel One transformed from a traditional full-service broker into a cutting-edge digital powerhouse. It offers AI-driven research, free API access, and institutional-grade trading platforms.',
    pros: [
      'Free account opening and ₹0 AMC for the first full financial year',
      'Pre-apply feature allows bidding up to 3 days before IPO opens',
      'ARQ Prime automated advisory engine recommending curated portfolios',
      'Free SmartAPI for python algorithmic trading and custom bots',
      'Extensive Pan-India research coverage across small-cap and mid-cap stocks'
    ],
    cons: [
      'Demat AMC of ₹20 + GST per month from the second year onwards',
      'Frequent promotional notification pushes inside mobile application'
    ],
    charges: {
      equityDelivery: '₹0 for first 30 days, then ₹20 or 0.1%',
      equityIntraday: 'Flat ₹20 or 0.25% per order',
      equityFutures: 'Flat ₹20 or 0.25% per order',
      equityOptions: 'Flat ₹20 per executed order',
      accountOpening: '₹0 (Free)',
      dematAmc: '₹0 1st year; ₹240 + GST/year thereafter',
      dpCharges: '₹20 + GST per debit transaction',
      callAndTrade: '₹20 per executed order'
    },
    ipoFeatures: [
      'Pre-IPO application queue before market open',
      'Multi-UPI handle compatibility with SMS reminders',
      'Fast UPI mandate processing via NPCI switch',
      'Analyst recommendation and fundamental review notes'
    ],
    platforms: ['Angel One Super App', 'Trade.AngelOne.in', 'SmartAPI Python/NodeJS SDK', 'SpeedPro Desktop Terminal'],
    sebiRegNo: 'INZ000161534 / CDSL: IN-DP-384-2018',
    headquarters: 'Mumbai, Maharashtra'
  },
  {
    id: 'upstox',
    name: 'Upstox',
    tagline: 'Ratan Tata-backed high performance broker for modern traders.',
    category: 'Discount',
    rating: 4.5,
    activeClients: '3.4 Million+',
    equityDelivery: '₹20 or 2.5%',
    intradayFo: '₹20 flat',
    accountOpening: '₹0 (Free)',
    amc: '₹150 / year',
    ipoUpiRating: '99.2%',
    highlights: ['3-in-1 account with partner banks', 'Pro Mode with TradingView charts', 'Instant withdrawal of IPO funds', 'Margin trading facility (MTF)'],
    bestFor: 'Chartists, technical traders & F&O scalpers',
    link: 'https://upstox.com',
    about: 'Backed by marquee investors including Ratan Tata and Tiger Global, Upstox focuses on high-speed execution, deep charting capabilities, and margin trading facilities for retail investors.',
    pros: [
      'Native TradingView charts with 100+ technical indicators',
      'Option Greeks, Strategy Builder, and Payoff diagrams integrated',
      'Margin Trading Facility (MTF) up to 4x leverage on 500+ stocks',
      'Zero account opening fee and paperless digital onboarding'
    ],
    cons: [
      'Charges ₹20 on delivery trades',
      'Demat AMC of ₹150 per year'
    ],
    charges: {
      equityDelivery: '₹20 or 2.5% (whichever is lower)',
      equityIntraday: '₹20 or 0.05% (whichever is lower)',
      equityFutures: 'Flat ₹20 per executed order',
      equityOptions: 'Flat ₹20 per executed order',
      accountOpening: '₹0 (Free)',
      dematAmc: '₹150 + GST / year',
      dpCharges: '₹18.50 + GST per debit transaction',
      callAndTrade: '₹50 per executed order'
    },
    ipoFeatures: [
      'Direct UPI mandate trigger with auto-status sync',
      'Pre-apply window for high-demand SME & Mainboard issues',
      'Integrated allotment check with registrar feeds'
    ],
    platforms: ['Upstox Pro Web', 'Upstox Pro Mobile App', 'Upstox Developer API'],
    sebiRegNo: 'INZ000185137 / CDSL: IN-DP-118-2015',
    headquarters: 'Mumbai, Maharashtra'
  },
  {
    id: 'dhan',
    name: 'Dhan',
    tagline: 'Built specifically for super-fast traders with deep TradingView integration.',
    category: 'Discount',
    rating: 4.7,
    activeClients: '1.2 Million+',
    equityDelivery: '₹0 (Free)',
    intradayFo: '₹20 flat',
    accountOpening: '₹0 (Free)',
    amc: '₹0 (Lifetime Free)',
    ipoUpiRating: '99.7%',
    highlights: ['Trade directly from TradingView.com', 'Dedicated IPO bids with fast auto-fill', 'Free APIs for retail algos', 'Instant payout facility'],
    bestFor: 'Power traders, TradingView loyalists & active derivatives desks',
    link: 'https://dhan.co',
    about: 'Dhan is an innovative fintech broking platform crafted by Raise Financial Services. It is celebrated for its deep native partnership with TradingView, enabling traders to place orders directly from chart screens.',
    pros: [
      'Trade directly from TradingView.com charts with Dhan connect',
      'Zero brokerage on Equity Delivery for lifetime',
      'Zero Demat AMC for lifetime',
      'Unlimited free webhooks and REST APIs for retail algorithmic traders',
      'Instant payout facility to bank account 24x7'
    ],
    cons: [
      'Relatively younger company compared to Zerodha or Angel One',
      'No physical branches for offline customer assistance'
    ],
    charges: {
      equityDelivery: '₹0 (Completely Free)',
      equityIntraday: '₹20 or 0.03% (whichever is lower)',
      equityFutures: 'Flat ₹20 per executed order',
      equityOptions: 'Flat ₹20 per executed order',
      accountOpening: '₹0 (Free)',
      dematAmc: '₹0 (Lifetime Zero AMC)',
      dpCharges: '₹12.50 + GST per company debit',
      callAndTrade: '₹50 per executed order'
    },
    ipoFeatures: [
      'Instant IPO bidding with 1-click UPI ID selection',
      'Live subscription tracking updated every 15 minutes',
      'Pre-apply capabilities for upcoming issues'
    ],
    platforms: ['Dhan Web', 'Dhan Mobile App', 'TradingView Console', 'DhanHQ Super APIs'],
    sebiRegNo: 'INZ000006031 / CDSL: IN-DP-672-2022',
    headquarters: 'Mumbai, Maharashtra'
  },
  {
    id: 'icici-direct',
    name: 'ICICI Direct',
    tagline: 'Premier 3-in-1 banking broker with comprehensive research and high limits.',
    category: 'Full Service',
    rating: 4.4,
    activeClients: '3.1 Million+',
    equityDelivery: '0.1% - 0.55%',
    intradayFo: '₹15 - ₹20',
    accountOpening: '₹0',
    amc: '₹300 - ₹700',
    ipoUpiRating: '99.9% (Native 3-in-1 ASBA)',
    highlights: ['3-in-1 account (Bank + Demat + Trading)', 'Native ASBA bidding without UPI limit bottlenecks', 'High Networth (HNI) high ticket sizes', 'In-depth institutional research reports'],
    bestFor: 'HNIs applying for >₹5L in IPOs & corporate accounts',
    link: 'https://icicidirect.com',
    about: 'ICICI Direct is the investment arm of ICICI Bank. It is legendary for pioneering online trading in India and offering the seamless 3-in-1 integrated banking, demat, and trading account.',
    pros: [
      'Seamless 3-in-1 account linking ICICI Bank savings directly to trading',
      'Native ASBA bidding allows applying for high value HNI bids (>₹5 Lakhs) without UPI limits',
      'Funds remain in bank account and earn savings interest until allotment',
      'Comprehensive institutional fundamental research reports and stock picks'
    ],
    cons: [
      'Higher brokerage charges compared to discount brokers unless on Prime plan',
      'Annual Demat AMC of ₹300-₹700'
    ],
    charges: {
      equityDelivery: '0.55% (Standard) or ₹0 (Prime/Neo plans)',
      equityIntraday: '₹15 - ₹20 per order on Neo plan',
      equityFutures: '₹0 on Neo plan / 0.05% Standard',
      equityOptions: '₹20 per order on Neo plan',
      accountOpening: '₹0',
      dematAmc: '₹300 to ₹700 / year (waived for ICICI Wealth)',
      dpCharges: '₹20 + GST per debit transaction',
      callAndTrade: '₹25 per order'
    },
    ipoFeatures: [
      'Native netbanking ASBA for bids up to ₹2 Crores',
      'No reliance on 3rd-party UPI apps for high ticket HNI investors',
      'Auto-block and auto-release of unallotted funds within 12 hours'
    ],
    platforms: ['ICICI Direct Markets App', 'ICICI Direct Web Portal', 'Trade Racer Desktop Terminal'],
    sebiRegNo: 'INZ000183631 / NSDL: IN-DP-NSDL-24-97',
    headquarters: 'Mumbai, Maharashtra'
  }
];

export function getAllBrokers(): BrokerItem[] {
  return BROKERS_DATA;
}

export function getBrokerById(id: string): BrokerItem | undefined {
  const normalized = decodeURIComponent(id).toLowerCase().trim();
  return BROKERS_DATA.find((b) => b.id.toLowerCase() === normalized || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized);
}
