import { BrokerData } from "@/types/ipo";

export const MOCK_BROKERS: BrokerData[] = [
  {
    id: "b1",
    slug: "zerodha",
    name: "Zerodha (Kite)",
    logoUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80",
    type: "Discount Broker",
    equityDeliveryFee: "₹0 (Free Lifetime)",
    equityIntradayFee: "0.03% or ₹20/order",
    fnOFee: "Flat ₹20 per executed order",
    dematAnualFee: "₹300 / year",
    accountOpeningFee: "₹200 (Equity) + ₹100 (Commodity)",
    ipoApplicationMethod: "UPI 2.0 via Kite App / Web Portal",
    rating: 4.9,
    activeClientsNse: "7.5 Million+",
    pros: [
      "Pioneer of zero-brokerage equity delivery investing in India.",
      "Ultra-fast, reliable Kite trading platform.",
      "Free financial education via Varsity & Coin mutual fund platform."
    ],
    cons: [
      "No relationship manager or tip calls.",
      "Account opening fee of ₹200."
    ],
    openAccountUrl: "https://zerodha.com",
    overview: "Zerodha is India's largest retail stockbroker by active client count. Known for pioneering flat-fee discount brokerage, Zerodha offers free equity delivery investments and the market-leading Kite trading platform.",
    feeDetails: [
      { label: "Equity Delivery Brokerage", value: "₹0 (Free)" },
      { label: "Equity Intraday Brokerage", value: "0.03% or ₹20/order (whichever is lower)" },
      { label: "Futures & Options Brokerage", value: "Flat ₹20 per executed order" },
      { label: "Account Opening Fee", value: "₹200 (Equity) / ₹300 (Equity + Commodity)" },
      { label: "Demat Maintenance Charge (AMC)", value: "₹300 / year (billed quarterly)" }
    ],
    faqs: [
      {
        question: "Is Zerodha safe for long-term equity delivery?",
        answer: "Yes, shares bought through Zerodha are stored directly in your CDSL Demat account under your PAN, independent of Zerodha."
      },
      {
        question: "Can I apply for IPOs using Zerodha Kite?",
        answer: "Yes, you can apply for Mainboard and SME IPOs seamlessly via UPI 2.0 on the Kite app."
      }
    ]
  },
  {
    id: "b2",
    slug: "groww",
    name: "Groww",
    logoUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80",
    type: "Discount Broker",
    equityDeliveryFee: "0.05% or ₹20/order",
    equityIntradayFee: "0.05% or ₹20/order",
    fnOFee: "Flat ₹20 per executed order",
    dematAnualFee: "₹0 (Lifetime Free AMC)",
    accountOpeningFee: "₹0 (Free Account Opening)",
    ipoApplicationMethod: "Instant 1-Click UPI Application",
    rating: 4.8,
    activeClientsNse: "8.2 Million+",
    pros: [
      "100% paperless digital onboarding in under 5 minutes.",
      "Zero account opening fee and zero AMC charges forever.",
      "Cleanest beginner-friendly mobile interface for stocks, mutual funds & IPOs."
    ],
    cons: [
      "Equity delivery is not 100% free (charged 0.05% or max ₹20)."
    ],
    openAccountUrl: "https://groww.in",
    overview: "Groww is India's fastest-growing fintech investing platform, popular among millennials and first-time retail investors for its zero-AMC fee structure, direct mutual funds, and simple 1-click IPO application interface.",
    feeDetails: [
      { label: "Equity Delivery Brokerage", value: "0.05% or ₹20/order (whichever is lower)" },
      { label: "Equity Intraday Brokerage", value: "0.05% or ₹20/order" },
      { label: "F&O Brokerage", value: "Flat ₹20 per executed order" },
      { label: "Account Opening Fee", value: "₹0 (Free)" },
      { label: "Demat Maintenance Charge (AMC)", value: "₹0 (Zero AMC Forever)" }
    ],
    faqs: [
      {
        question: "Does Groww charge any annual maintenance fees?",
        answer: "No, Groww offers 100% zero AMC on Demat accounts."
      },
      {
        question: "How fast can I apply for an IPO on Groww?",
        answer: "IPO applications take under 30 seconds via pre-saved UPI IDs on the Groww app."
      }
    ]
  },
  {
    id: "b3",
    slug: "angel-one",
    name: "Angel One (Angel Broking)",
    type: "Full-Service Broker",
    equityDeliveryFee: "₹0 (Free Lifetime)",
    equityIntradayFee: "0.05% or ₹20/order",
    fnOFee: "Flat ₹20 per executed order",
    dematAnualFee: "₹240/year (1st Year Free)",
    accountOpeningFee: "₹0 (Free)",
    ipoApplicationMethod: "ARQ AI Recommendation + UPI",
    rating: 4.7,
    activeClientsNse: "5.5 Million+",
    pros: [
      "AI-driven ARQ Prime automated stock advisory & research reports.",
      "Free equity delivery brokerage.",
      "Full-service advisory support combined with discount broker pricing."
    ],
    cons: [
      "Demat AMC of ₹20/month applies from year 2 onwards."
    ],
    openAccountUrl: "https://angelone.in",
    overview: "Angel One (formerly Angel Broking) combines full-service advisory research with discount pricing. Investors get free equity delivery, smart robo-advisory tools, and advanced charting options.",
    feeDetails: [
      { label: "Equity Delivery Brokerage", value: "₹0 (Free)" },
      { label: "Intraday & F&O Brokerage", value: "Flat ₹20 per order" },
      { label: "Demat Maintenance AMC", value: "First year free, then ₹20 + GST per month" }
    ],
    faqs: [
      {
        question: "Does Angel One provide stock recommendations?",
        answer: "Yes, Angel One provides advisory research reports and ARQ AI stock recommendations."
      }
    ]
  },
  {
    id: "b4",
    slug: "prostocks",
    name: "ProStocks",
    type: "Discount Broker",
    equityDeliveryFee: "Flat ₹15/order or Unlimited Monthly Plan",
    equityIntradayFee: "Flat ₹15/order",
    fnOFee: "Flat ₹15/order",
    dematAnualFee: "₹0 (Refundable Deposit Plan)",
    accountOpeningFee: "₹0 (Free)",
    ipoApplicationMethod: "ASBA via NetBanking / UPI",
    rating: 4.5,
    activeClientsNse: "100k+",
    pros: [
      "Lowest flat fee (₹15/order) or ₹899 unlimited trading plan.",
      "Zero AMC options with refundable deposit.",
      "Stamp duty savings via Gujarat IFSC jurisdiction."
    ],
    cons: [
      "Mobile app interface is basic compared to Kite or Groww."
    ],
    openAccountUrl: "https://prostocks.com",
    overview: "ProStocks is a specialized discount broker offering flat ₹15 per order execution or monthly unlimited trading subscription plans tailored for high-volume traders.",
    feeDetails: [
      { label: "Flat Order Fee", value: "Flat ₹15 per executed order" },
      { label: "Unlimited Monthly Pass", value: "₹899 / month for unlimited trading" }
    ],
    faqs: [
      {
        question: "What is the ProStocks unlimited monthly plan?",
        answer: "For ₹899/month, you can execute unlimited equity intraday, delivery, and derivative trades without per-order brokerage fees."
      }
    ]
  }
];
