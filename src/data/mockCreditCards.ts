import { CreditCardData } from "@/types/finance";

export const MOCK_CREDIT_CARDS: CreditCardData[] = [
  {
    id: "c1",
    slug: "hdfc-millennia",
    name: "HDFC Millennia Credit Card",
    issuer: "HDFC Bank",
    category: ["cashback", "rewards"],
    rating: 4.8,
    joiningFee: 1000,
    annualFee: 1000,
    annualFeeWaiverCondition: "Waived on ₹1.0 Lakh spend in a anniversary year",
    rewardRate: "1% to 5%",
    keyPrivileges: [
      "5% Cashback on top partner merchants (Amazon, Flipkart, Swiggy)",
      "1% Cashback on all other online & offline spends",
      "4 Complimentary domestic airport lounge visits per calendar year",
      "1% Fuel surcharge waiver across all fuel stations in India"
    ],
    minIncomePerMonth: 35000,
    recommendedCreditScore: 750,
    pros: [
      "Highest cashback rates on popular shopping & food ordering apps.",
      "Low annual fee with easy spend-based waiver.",
      "Complimentary domestic lounge access."
    ],
    cons: [
      "Cashback is credited as CashPoints which require manual redemption.",
      "Capped at ₹1,000 max cashback per month for partner category."
    ],
    applyUrl: "https://www.hdfcbank.com",
    isPopular: true,
    featuresAndBenefits: ["Welcome Bonus", "Travel", "Fuel", "Rewards", "Shopping", "Cashback", "Dining", "Insurance", "Interest"],
    overview: "The HDFC Millennia Credit Card is tailored for young professionals and digital shoppers who spend frequently on e-commerce, food delivery, and ride-hailing platforms. It turns everyday online spending into direct cashpoint rewards.",
    feeDetails: [
      { label: "Joining Fee", value: "₹1,000 + Applicable Taxes" },
      { label: "Annual Renewal Fee", value: "₹1,000 (Waived on spending ₹1,00,000 in previous year)" },
      { label: "Finance Charge (Interest Rate)", value: "3.60% per month (43.20% per annum)" },
      { label: "Foreign Currency Markup Fee", value: "3.50% of transaction value" },
      { label: "Cash Withdrawal Charges", value: "2.5% or ₹500 (whichever is higher)" }
    ],
    eligibility: [
      { label: "Age Limit", value: "21 to 60 Years (Salaried) / 21 to 65 Years (Self-Employed)" },
      { label: "Min Monthly Income", value: "₹35,000 Gross Income per month (Salaried)" },
      { label: "Required Credit Score", value: "750+ CIBIL or Experian" },
      { label: "KYC Documents Required", value: "PAN Card, Aadhaar Card, Salary Slip / Form 16 / ITR" }
    ],
    ratingBreakdown: [
      { category: "Cashback Value", score: 4.9 },
      { category: "Lounge Access & Travel", score: 4.5 },
      { category: "Annual Fee Waiver Ease", score: 4.8 },
      { category: "Customer Support", score: 4.7 }
    ],
    faqs: [
      {
        question: "How is the 5% cashback credited?",
        answer: "Cashback is credited as CashPoints into your credit card account at the end of every monthly statement cycle. You can redeem CashPoints via HDFC NetBanking against your statement balance."
      },
      {
        question: "What is the monthly capping on 5% cashback?",
        answer: "The 5% cashback category has an upper cap of 1,000 CashPoints per month."
      },
      {
        question: "Does HDFC Millennia offer free airport lounge access?",
        answer: "Yes, it provides 4 complimentary domestic airport lounge visits per calendar year (1 per quarter)."
      }
    ]
  },
  {
    id: "c2",
    slug: "amazon-pay-icici",
    name: "Amazon Pay ICICI Credit Card",
    issuer: "ICICI Bank",
    category: ["lifetime_free", "cashback"],
    rating: 4.9,
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: "Lifetime Free (₹0 Renewal Fee)",
    rewardRate: "1% to 5%",
    keyPrivileges: [
      "5% Unlimited Cashback on Amazon.in for Prime users (3% for Non-Prime)",
      "2% Cashback on digital payments (recharges, bill payments, Amazon Pay partner merchants)",
      "1% Unlimited Cashback on all other retail purchases",
      "No joining or annual maintenance fees ever"
    ],
    minIncomePerMonth: 25000,
    recommendedCreditScore: 730,
    pros: [
      "True Lifetime Free card with zero annual charges.",
      "Direct auto-credit of earnings to Amazon Pay balance every month.",
      "No upper capping on monthly cashback earnings."
    ],
    cons: [
      "Does not offer airport lounge access.",
      "Highest reward rate requires active Amazon Prime subscription."
    ],
    applyUrl: "https://www.icicibank.com",
    isPopular: true,
    featuresAndBenefits: ["Fuel", "Rewards", "Shopping", "Cashback"],
    overview: "Co-branded between ICICI Bank and Amazon India, this card is widely recognized as India's best lifetime-free cashback credit card. It features zero annual fees, automatic monthly cashback credit, and unlimited earnings on e-commerce purchases.",
    feeDetails: [
      { label: "Joining Fee", value: "₹0 (Lifetime Free)" },
      { label: "Annual Maintenance Fee", value: "₹0 (Zero Charges Forever)" },
      { label: "Finance Charge (Interest Rate)", value: "3.50% - 3.80% per month" },
      { label: "Foreign Currency Markup Fee", value: "3.50%" },
      { label: "Fuel Surcharge Waiver", value: "1% waiver on transactions between ₹400 and ₹4,000" }
    ],
    eligibility: [
      { label: "Age Limit", value: "18 to 60 Years" },
      { label: "Min Monthly Income", value: "₹25,000 for ICICI account holders / ₹35,000 for others" },
      { label: "Required Credit Score", value: "730+ CIBIL Score" },
      { label: "KYC Documents Required", value: "PAN, Aadhaar Video KYC, Proof of Income" }
    ],
    ratingBreakdown: [
      { category: "Cashback Value", score: 5.0 },
      { category: "Fee Structure", score: 5.0 },
      { category: "Auto-Redemption Ease", score: 5.0 },
      { category: "Travel Perks", score: 3.5 }
    ],
    faqs: [
      {
        question: "Is the Amazon Pay ICICI card really Lifetime Free?",
        answer: "Yes, there are zero joining fees and zero annual maintenance fees for life."
      },
      {
        question: "Is there any maximum cap on cashback earnings?",
        answer: "No, cashback is completely unlimited with no monthly cap."
      }
    ]
  },
  {
    id: "c3",
    slug: "sbi-simplyclick",
    name: "SBI SimplyCLICK Credit Card",
    issuer: "State Bank of India (SBI)",
    category: ["rewards", "cashback"],
    rating: 4.6,
    joiningFee: 499,
    annualFee: 499,
    annualFeeWaiverCondition: "Waived on annual spend of ₹1,00,000",
    rewardRate: "0.25% to 2.5%",
    keyPrivileges: [
      "10X Reward Points on Apollo 24x7, BookMyShow, Cleartrip, Domino's, Myntra, Yatra",
      "5X Reward Points on all other online shopping spends",
      "Welcome Amazon e-voucher worth ₹500 on fee payment",
      "Cleartrip e-voucher worth ₹2,000 on reaching ₹1 Lakh & ₹2 Lakh annual spends"
    ],
    minIncomePerMonth: 20000,
    recommendedCreditScore: 720,
    pros: [
      "Excellent online shopping reward multipliers.",
      "Low joining fee offset by welcome gift voucher.",
      "Wide acceptance backed by SBI Card network."
    ],
    cons: [
      "Reward points rate on offline transactions is basic (1X)."
    ],
    applyUrl: "https://www.sbicard.com",
    isPopular: false,
    featuresAndBenefits: ["Welcome Bonus", "Fuel", "Rewards", "Shopping", "Dining"],
    overview: "SBI SimplyCLICK is engineered for avid online shoppers looking for accelerated reward points on movie tickets, food delivery, flight bookings, and fashion e-commerce.",
    feeDetails: [
      { label: "Joining Fee", value: "₹499 + Taxes (Get ₹500 Amazon Gift Card)" },
      { label: "Annual Renewal Fee", value: "₹499 (Waived on ₹1.0 Lakh annual spend)" },
      { label: "Finance Charge", value: "3.50% per month (42% p.a.)" }
    ],
    eligibility: [
      { label: "Age Limit", value: "18 to 60 Years" },
      { label: "Min Monthly Income", value: "₹20,000 per month" },
      { label: "Required Credit Score", value: "720+ CIBIL" }
    ],
    ratingBreakdown: [
      { category: "Rewards Multiplier", score: 4.7 },
      { category: "Welcome Perks", score: 4.8 },
      { category: "Customer Portal", score: 4.4 }
    ],
    faqs: [
      {
        question: "How do I claim the welcome Amazon voucher?",
        answer: "The ₹500 Amazon gift voucher code is sent via SMS/email within 30 days of paying the joining fee."
      }
    ]
  },
  {
    id: "c4",
    slug: "axis-my-zone",
    name: "Axis Bank MY ZONE Credit Card",
    issuer: "Axis Bank",
    category: ["lifetime_free", "rewards"],
    rating: 4.5,
    joiningFee: 500,
    annualFee: 500,
    annualFeeWaiverCondition: "Waived on spend of ₹50,000/year (often issued Lifetime Free)",
    rewardRate: "0.4% to 4.0%",
    keyPrivileges: [
      "Buy-1-Get-1 free movie ticket on Paytm Movies (up to ₹200 off/month)",
      "Flat ₹120 off on Swiggy on minimum order of ₹500 (twice a month)",
      "Free SonyLIV Premium annual subscription worth ₹999 on first spend",
      "4 Complimentary lounge visits per year"
    ],
    minIncomePerMonth: 15000,
    recommendedCreditScore: 700,
    pros: [
      "Ideal entry-level card for movies, entertainment, and food delivery.",
      "Low income eligibility requirement.",
      "Free SonyLIV annual membership."
    ],
    cons: [
      "Low base reward point rate on routine offline spends."
    ],
    applyUrl: "https://www.axisbank.com",
    isPopular: false,
    featuresAndBenefits: ["Fuel", "Rewards", "Shopping"],
    overview: "The Axis Bank MY ZONE card offers instant entertainment perks including movie discounts, Swiggy food savings, and free SonyLIV OTT streaming access.",
    feeDetails: [
      { label: "Joining Fee", value: "₹500 + Taxes" },
      { label: "Annual Fee", value: "₹500 (Waived on ₹50,000 annual spend)" }
    ],
    eligibility: [
      { label: "Age Limit", value: "18 to 70 Years" },
      { label: "Min Monthly Income", value: "₹15,000 per month" }
    ],
    ratingBreakdown: [
      { category: "Entertainment Value", score: 4.8 },
      { category: "Food & Swiggy Discounts", score: 4.7 }
    ],
    faqs: [
      {
        question: "How do I activate my free SonyLIV subscription?",
        answer: "Upon completing your first transaction within 30 days of card issuance, a voucher code is delivered to your registered mobile number."
      }
    ]
  },
  {
    id: "c5",
    slug: "idfc-first-wealth",
    name: "IDFC FIRST Wealth Credit Card",
    issuer: "IDFC FIRST Bank",
    category: ["lifetime_free", "travel", "rewards"],
    rating: 4.8,
    joiningFee: 0,
    annualFee: 0,
    annualFeeWaiverCondition: "Lifetime Free (₹0 Forever)",
    rewardRate: "0.2% to 2.5%",
    keyPrivileges: [
      "Complimentary domestic & international airport & railway lounge access (4/quarter)",
      "Reward points that never expire and can be redeemed directly for cash",
      "Interest-free cash withdrawal at ATMs worldwide for up to 48 days",
      "Low foreign currency markup fee of only 1.5%"
    ],
    minIncomePerMonth: 100000,
    recommendedCreditScore: 760,
    pros: [
      "Premium travel perks on a Lifetime Free card.",
      "Reward points never expire.",
      "Lowest Forex markup fee (1.5%) in the market."
    ],
    cons: [
      "Higher income eligibility benchmark (₹1.0 Lakh/month)."
    ],
    applyUrl: "https://www.idfcfirstbank.com",
    isPopular: true,
    featuresAndBenefits: ["Welcome Bonus", "Travel", "Rewards", "Shopping"],
    overview: "Designed for high-earning professionals and frequent international travelers, IDFC FIRST Wealth provides premium airport lounge privileges, non-expiring rewards, and a ultra-low 1.5% Forex fee.",
    feeDetails: [
      { label: "Joining Fee", value: "₹0 (Lifetime Free)" },
      { label: "Annual Maintenance Fee", value: "₹0 (Zero Charges Forever)" },
      { label: "Forex Markup Fee", value: "1.5% (Lowest in class)" },
      { label: "ATM Cash Withdrawal Fee", value: "₹250 per transaction (0% Interest up to 48 days)" }
    ],
    eligibility: [
      { label: "Age Limit", value: "21 to 65 Years" },
      { label: "Min Monthly Income", value: "₹1,00,000 Gross Income per month" },
      { label: "Required Credit Score", value: "760+ CIBIL Score" }
    ],
    ratingBreakdown: [
      { category: "Travel & Lounge Perks", score: 5.0 },
      { category: "Forex & Global Use", score: 5.0 },
      { category: "Reward Expiry Policy", score: 5.0 }
    ],
    faqs: [
      {
        question: "Do reward points on IDFC credit cards expire?",
        answer: "No, IDFC FIRST credit card reward points never expire and can be converted to cash statement credit."
      }
    ]
  },
  {
    id: "c6",
    slug: "sbi-cashback-credit-card",
    name: "SBI Cashback Credit Card",
    issuer: "SBI Card",
    logoUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80",
    category: ["cashback", "rewards"],
    rating: 4.8,
    joiningFee: 999,
    annualFee: 999,
    annualFeeWaiverCondition: "Waived on ₹2,00,000 spend in an annual cycle",
    rewardRate: "5% Direct Cashback on All Online Purchases (No Merchant Restrictions)",
    keyPrivileges: [
      "5% Unlimited Cashback on online purchases without merchant restrictions",
      "1% Cashback on offline retail purchases",
      "1% Fuel Surcharge waiver across petrol pumps in India (₹500-₹3,000 spend)",
      "Auto-credit of cashback directly into credit card statement account within 2 days"
    ],
    minIncomePerMonth: 30000,
    recommendedCreditScore: 740,
    pros: [
      "Cashback is automatically added to your account within 2 days after statement generation.",
      "Enjoy 5% flat cashback on all online purchases with no merchant restrictions.",
      "Use contactless Visa PayWave feature for quick, safe payments.",
      "Accepted at over 24 million merchant outlets worldwide.",
      "The ₹999 renewal fee is waived if you spend ₹2 Lakh or more in an annual cycle."
    ],
    cons: [
      "No complimentary airport lounge access.",
      "Cashback excluded on Education, Fuel, Jewelry, Insurance, Rent, Utilities, and Wallets.",
      "No welcome bonus or introductory joining gift."
    ],
    applyUrl: "https://www.sbicard.com",
    isPopular: true,
    overview: "Love shopping online? With the SBI Cashback Credit Card, you earn 5% cashback on all online purchases with no merchant restrictions and 1% on offline shopping. The card has an annual fee of ₹999 (waived on ₹2L annual spends), auto-credits earnings directly into your card statement within 2 days, and is accepted worldwide.",
    feeDetails: [
      { label: "Joining Fee", value: "₹999 + GST", category: "Core & Renewal", description: "One-time initial fee assessed on card setup" },
      { label: "Annual Renewal Fee", value: "₹999 + GST (Waived on ₹2 Lakh spend)", category: "Core & Renewal", description: "Annual maintenance charge, waived if annual spend >= ₹2.0 Lakhs" },
      { label: "Add-on Card Fee", value: "₹0 (Free)", category: "Core & Renewal", description: "No charge for additional cards for spouse, parents, or children" },
      { label: "Finance Charge (APR)", value: "3.75% per month (45.0% p.a.)", category: "Interest & Penalties", description: "Interest charged on revolving balance or overdue payments" },
      { label: "Minimum Repayment Amount", value: "5% of Total Balance", category: "Interest & Penalties", description: "Minimum amount required to prevent credit report default tags" },
      { label: "Foreign Currency Markup Fee", value: "3.50%", category: "Transactions & Foreign Use", description: "Fee charged on transactions in non-INR currencies" },
      { label: "Cash Withdrawal Charge", value: "2.5% or ₹500 (whichever is higher)", category: "Transactions & Foreign Use", description: "Fee for withdrawing cash from ATMs worldwide" },
      { label: "Cash Advance Limit", value: "80% of Credit Limit", category: "Transactions & Foreign Use", description: "Maximum percentage of credit limit allowed for cash withdrawal" },
      { label: "Fuel Transaction Surcharge", value: "1% Waiver (Spends ₹500-₹3,000)", category: "Transactions & Foreign Use", description: "Max ₹100 surcharge waiver per statement cycle" },
      { label: "Over-Limit Penalty", value: "2.5% or ₹600 (whichever is higher)", category: "Interest & Penalties", description: "Assessed when total spend exceeds approved credit limit" },
      { label: "Card Replacement Fee", value: "₹100 (Max ₹250)", category: "Core & Renewal", description: "Fee for issuing a replacement physical card" }
    ],
    latePaymentFees: [
      { balanceRange: "₹0 to ₹500", charge: "₹0" },
      { balanceRange: "₹501 to ₹1,000", charge: "₹400" },
      { balanceRange: "₹1,001 to ₹10,000", charge: "₹750" },
      { balanceRange: "₹10,001 to ₹25,000", charge: "₹950" },
      { balanceRange: "₹25,001 to ₹50,000", charge: "₹1,100" },
      { balanceRange: "More than ₹50,000", charge: "₹1,300" }
    ],
    eligibility: [
      { label: "Age Limit", value: "20 to 70 Years (Salaried / Self-Employed)" },
      { label: "Min Monthly Income", value: "Stable & Regular Source of Income" },
      { label: "Required Credit Score", value: "750+ CIBIL or Experian" },
      { label: "Employment Type", value: "Salaried Employees & Self-Employed Business Owners" }
    ],
    ratingBreakdown: [
      { category: "Charges & Annual Fee", score: 3.5 },
      { category: "Rewards & Cashback", score: 5.0 },
      { category: "Customer Service", score: 3.5 }
    ],
    whoShouldGet: [
      "Beginners looking for a straightforward cashback card with no complicated rewards system.",
      "Frequent online shoppers who want to earn 5% cashback on all online purchases.",
      "Those who make regular offline purchases and want to earn 1% cashback.",
      "Individuals seeking fuel savings with a 1% surcharge waiver at petrol pumps.",
      "People who want to enjoy premium credit card benefits at low cost."
    ],
    mccExclusions: [
      { category: "Petrol Pumps or Service Stations", mccCodes: "5172, 5541, 5542, 5983", explanation: "Any fuel purchase at petrol pumps or fuel outlets" },
      { category: "E-Wallet Loading", mccCodes: "6540, 6541", explanation: "Adding money to e-wallets like Paytm, Mobikwik, or Google Pay" },
      { category: "Rent & Property Management", mccCodes: "6513, 7349", explanation: "Payments for house rent or property management platforms" },
      { category: "Jewellery Purchases", mccCodes: "5051, 5094, 7631, 5944", explanation: "Buying gold, silver, or precious jewelry" },
      { category: "School & Educational Services", mccCodes: "5111, 5192, 5942, 8211, 8220, 8241, 8244, 8249, 8299, 8351", explanation: "Tuition fees for schools, colleges, or coaching institutes" },
      { category: "Utility Bills", mccCodes: "4900, 4814, 4816, 4899, 9399", explanation: "Bills for electricity, water, landline, mobile, or internet" },
      { category: "Insurance Payments", mccCodes: "5960, 6300, 6381", explanation: "Paying for life, health, or motor insurance policies" },
      { category: "Railway Ticket Purchases", mccCodes: "4011, 4112", explanation: "Buying train tickets via IRCTC or railway counters" },
      { category: "Card / Gift / Novelty Shops", mccCodes: "5947", explanation: "Purchases made at novelty or gift shops" },
      { category: "Member Financial Institutions", mccCodes: "6011, 6012, 6051", explanation: "Transactions at financial institutions, cash equivalents" },
      { category: "Balance Transfer & Flexipay EMI", mccCodes: "N/A", explanation: "Converting purchases to EMIs or moving balances between cards" }
    ],
    applicationSteps: [
      {
        mode: "Online Application",
        steps: [
          "Visit the official SBI Card website or click 'Apply Online' on this page.",
          "Select the SBI Cashback Credit Card and click 'Apply Now'.",
          "Fill out the application form with your personal, employment, and contact details.",
          "Complete online KYC verification via Aadhaar OTP & Video KYC.",
          "Upon approval, your physical card will be delivered to your address within 3-5 business days."
        ]
      },
      {
        mode: "Offline Application",
        steps: [
          "Visit your nearest SBI Bank branch and request an SBI Cashback Credit Card application form.",
          "Discuss benefits with bank executives and complete the physical form.",
          "Attach self-attested copies of PAN Card, Aadhaar Card, Income Proof, and Bank Statements.",
          "Submit the application package to the branch manager for verification."
        ]
      }
    ],
    requiredDocuments: [
      {
        category: "Proof of Identity",
        documents: ["PAN Card", "Aadhaar Card", "Driver's License", "Passport", "Voter ID", "NREGA Job Card"]
      },
      {
        category: "Proof of Address",
        documents: ["Aadhaar Card", "Utility Bill (< 3 months old)", "Passport", "Ration Card", "Property Registration Document", "Bank Statement"]
      },
      {
        category: "Proof of Income",
        documents: ["Salary Slips (Last 3 Months)", "Form 16 / ITR Copy", "Bank Account Statement (Last 6 Months)"]
      }
    ],
    detailedReview: "If you like retail therapy or pay most of your bills online, the SBI Cashback Credit Card is made for you. From ordering food and booking flights to grabbing fashion deals, this card ensures 5% cashback on almost everything you buy without the hassle of redeeming reward points. The ₹5,000 monthly cashback cap means you can save up to ₹60,000 per year directly on your card statement.",
    faqs: [
      {
        question: "How is the cashback credited for SBI Cashback Card?",
        answer: "The cashback earned is automatically credited to your SBI Card statement account within 2 days of statement generation. You do not need to manually redeem reward points."
      },
      {
        question: "Is there any brand restriction for the 5% cashback?",
        answer: "No, 5% cashback is valid on online purchases across almost all major e-commerce platforms, food delivery apps, travel bookings, and digital services."
      },
      {
        question: "How can I waive the annual fee of ₹999?",
        answer: "The annual renewal fee of ₹999 is completely waived if your total spends exceed ₹2,00,000 in the preceding year of card issuance."
      },
      {
        question: "What categories are excluded from cashback?",
        answer: "Fuel, Rent, Utilities, Education, Wallet Loads, Jewelry, Insurance, and Merchant EMIs are excluded from cashback."
      }
    ]
  }
];

