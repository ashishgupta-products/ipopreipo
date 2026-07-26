import { PaymentAppData } from "@/types/finance";

export const MOCK_PAYMENT_APPS: PaymentAppData[] = [
  {
    id: "p1",
    slug: "phonepe",
    name: "PhonePe UPI & Payments",
    developer: "PhonePe India Pvt. Ltd.",
    downloadsTier: "500M+ Downloads",
    playStoreRating: 4.6,
    appStoreRating: 4.7,
    upiLiteSupport: true,
    ruPayUpiSupport: true,
    creditScoreCheckFree: true,
    cashbackPolicy: "Scratch cards, brand discount vouchers, and merchant cashbacks.",
    cashbackRewardsReality: [
      { type: "right", text: "Advertised rewards consist of scratch cards and instant merchant cashbacks." },
      { type: "wrong", text: "In reality, direct cashbacks are extremely rare; rewards are mostly third-party discount vouchers (e.g. Ajio, Dominos)." },
      { type: "wrong", text: "Platform convenience fees of ₹1 to ₹3 are now charged for mobile recharges and bill payments." }
    ],
    keyFeatures: [
      "UPI payments & instant bank transfers",
      "RuPay Credit Card linking for merchant UPI payments",
      "UPI Lite for PIN-less micro-payments up to ₹500",
      "Mutual Fund & Insurance distribution platform",
      "FASTag recharges, electricity & mobile bill payments"
    ],
    pros: [
      "Highest UPI transaction success rate in India.",
      "Extensive offline merchant QR acceptance everywhere.",
      "Clean, responsive user interface."
    ],
    cons: [
      "Direct wallet cashbacks replaced largely by merchant vouchers."
    ],
    downloadUrl: "https://www.phonepe.com",
    overview: "PhonePe is India's leading UPI payments app processing billions of transactions monthly. It supports PIN-less UPI Lite payments, RuPay credit card linking, FASTag management, and mutual fund investments.",
    feeDetails: [
      { label: "UPI Bank Transfers", value: "₹0 (Free)" },
      { label: "UPI Lite Transactions", value: "₹0 (Free)" },
      { label: "Mobile Recharges Platform Fee", value: "₹1 to ₹3 per recharge" },
      { label: "Credit Card Bill Payments Fee", value: "₹0 (Free)" }
    ],
    eligibility: [
      { label: "Requirements", value: "Indian Mobile Number linked with Bank Account" },
      { label: "Debit Card Needed?", value: "Yes, required for 1st time UPI PIN setup (or Aadhaar OTP)" }
    ],
    faqs: [
      {
        question: "How do I setup UPI Lite on PhonePe?",
        answer: "Go to Profile > UPI Lite > Add Funds (up to ₹2,000) from your bank account to enable instant PIN-less payments up to ₹500."
      }
    ]
  },
  {
    id: "p2",
    slug: "google-pay",
    name: "Google Pay (GPay)",
    developer: "Google LLC",
    downloadsTier: "500M+ Downloads",
    playStoreRating: 4.5,
    appStoreRating: 4.6,
    upiLiteSupport: true,
    ruPayUpiSupport: true,
    creditScoreCheckFree: true,
    cashbackPolicy: "Direct bank transfer cashbacks and rewards cards.",
    cashbackRewardsReality: [
      { type: "right", text: "Offers cashbacks directly deposited into linked bank accounts via scratch cards." },
      { type: "wrong", text: "Most transactions now return brand coupons with high minimum spend limits rather than real cash." },
      { type: "wrong", text: "Direct cashbacks are mostly restricted to seasonal gamified campaigns (e.g., festival card collections)." }
    ],
    keyFeatures: [
      "NPCI-backed secure UPI 2.0 transaction engine",
      "RuPay credit card on UPI integration",
      "Free credit score tracking report",
      "Split bills with friends and group expense tracking",
      "Tap & Pay NFC payments on supported smartphones"
    ],
    pros: [
      "Direct-to-bank cashback credits.",
      "Seamless integration with Android & Google account security.",
      "No pop-up ads or clutter."
    ],
    cons: [
      "Occasional bank server timeout errors during peak hours."
    ],
    downloadUrl: "https://pay.google.com",
    overview: "Google Pay (GPay) utilizes Google's secure infrastructure to deliver fast, direct-to-bank UPI transfers, split-bill tracking, and zero-clutter digital payments across India.",
    feeDetails: [
      { label: "UPI Payments", value: "₹0 (Free)" },
      { label: "Bill Payments", value: "₹0 (Free)" }
    ],
    faqs: [
      {
        question: "Where is Google Pay cashback credited?",
        answer: "Cashback earned on Google Pay scratch cards is credited directly into your linked primary bank account within 24 hours."
      }
    ]
  },
  {
    id: "p3",
    slug: "cred",
    name: "CRED: Credit Card & UPI",
    developer: "Dreamplug Technologies",
    downloadsTier: "50M+ Downloads",
    playStoreRating: 4.7,
    appStoreRating: 4.8,
    upiLiteSupport: false,
    ruPayUpiSupport: true,
    creditScoreCheckFree: true,
    cashbackPolicy: "CRED coins, cashback on credit card bill payments, and luxury rewards.",
    cashbackRewardsReality: [
      { type: "right", text: "Earn 1 CRED coin for every ₹1 of card bill paid." },
      { type: "wrong", text: "Accumulating coins is easy, but redemption value is extremely low (typically ₹1 to ₹5 cashback on jackpots)." },
      { type: "wrong", text: "Premium brand vouchers listed on the store often require co-paying additional cash." }
    ],
    keyFeatures: [
      "Credit card bill management & hidden charge alert detector",
      "CRED Pay UPI with high cashback rewards for high-credit users",
      "FREE CIBIL & Experian credit score monitor",
      "CRED Cash low-interest personal pre-approved credit line",
      "Curated shopping & travel deals"
    ],
    pros: [
      "Premium interface designed for creditworthy users (750+ score).",
      "Timely bill reminders & hidden bank fee alerts.",
      "High reward value on credit card bill payments."
    ],
    cons: [
      "Requires credit score of 750+ to join platform."
    ],
    downloadUrl: "https://cred.club",
    overview: "CRED is an exclusive financial platform for high-credit individuals offering credit card bill management, rewards, free credit score analysis, and CRED Pay UPI.",
    feeDetails: [
      { label: "UPI Transactions", value: "₹0 (Free)" },
      { label: "Credit Card Bill Payments", value: "₹0 (Free)" }
    ],
    faqs: [
      {
        question: "What credit score is required to join CRED?",
        answer: "A CIBIL score of 750 or higher is required to get access to CRED."
      }
    ]
  },
  {
    id: "p4",
    slug: "paytm",
    name: "Paytm: UPI, Bills & Fastag",
    developer: "One97 Communications",
    downloadsTier: "500M+ Downloads",
    playStoreRating: 4.4,
    appStoreRating: 4.5,
    upiLiteSupport: true,
    ruPayUpiSupport: true,
    creditScoreCheckFree: true,
    cashbackPolicy: "Paytm points, travel discounts, and cashback vouchers.",
    cashbackRewardsReality: [
      { type: "right", text: "Earn Paytm points to redeem for subscription gift cards and wallet balances." },
      { type: "wrong", text: "Points redemption rates are very high (e.g. 10,000 points needed for a basic ₹100 voucher)." },
      { type: "right", text: "Provides useful travel booking discounts, though basic transaction cashbacks are minimal." }
    ],
    keyFeatures: [
      "Multi-bank UPI handle integration",
      "FASTag management & NCMC transit cards",
      "Movie & flight booking ticketing ecosystem",
      "Free credit report analysis"
    ],
    pros: [
      "All-in-one super app for travel, movies, and utility bills.",
      "Widespread soundbox merchant network."
    ],
    cons: [
      "App home screen can feel slightly crowded."
    ],
    downloadUrl: "https://paytm.com",
    overview: "Paytm is India's pioneer digital payment app, offering comprehensive UPI transfers, utility bill payments, movie tickets, and transit cards.",
    feeDetails: [
      { label: "UPI Bank Money Transfers", value: "₹0 (Free)" }
    ],
    faqs: [
      {
        question: "How do I link my RuPay Credit Card on Paytm UPI?",
        answer: "Go to Profile > Add Credit Card > Select your bank issuing the RuPay credit card > Generate UPI PIN."
      }
    ]
  }
];
