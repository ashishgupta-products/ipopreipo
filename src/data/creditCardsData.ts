export interface RewardRateBreakdown {
  onlineShopping: string;
  offlineSpends: string;
  upiSpends: string;
  utilities: string;
  fuel: string;
}

export interface CreditCardItem {
  id: string;
  name: string;
  bank: string;
  network: string;
  category: 'Cashback' | 'UPI RuPay' | 'Travel & Rewards' | 'Lifetime Free';
  joiningFee: string;
  annualFee: string;
  annualWaiverSpend: string;
  rewardRate: string;
  loungeAccess: string;
  highlights: string[];
  bestFor: string;
  link: string;
  about: string;
  pros: string[];
  cons: string[];
  rewardBreakdown: RewardRateBreakdown;
  eligibility: {
    minAge: string;
    minIncomeSalaried: string;
    minCreditScore: string;
  };
  loungeDetails: string[];
  headquarters: string;
}

export const CREDIT_CARDS_DATA: CreditCardItem[] = [
  {
    id: 'sbi-cashback',
    name: 'SBI Cashback Card',
    bank: 'State Bank of India (SBICARD)',
    network: 'Visa Signature',
    category: 'Cashback',
    joiningFee: '₹999 + GST',
    annualFee: '₹999 + GST',
    annualWaiverSpend: '₹2,00,000 annual spend',
    rewardRate: '5% Flat Online Cashback',
    loungeAccess: 'Not Included',
    highlights: ['5% flat cashback on all online spends without merchant restrictions', '1% cashback on offline utility spends', 'Auto-credited directly to monthly statement', 'No complicated reward points conversion'],
    bestFor: 'Universal 5% cashback on all ecommerce & online orders',
    link: 'https://sbicard.com',
    about: 'The SBI Cashback Credit Card revolutionized the Indian credit card market by offering a simple, unconditional 5% cashback on virtually every online merchant in India without requiring gift vouchers or merchant-specific portals. Cashback is automatically deducted from your next monthly credit card statement as real cash.',
    pros: [
      '5% flat cashback on Amazon, Flipkart, Myntra, Swiggy, Zomato, BookMyShow, and all online stores',
      'No merchant category restrictions or exclusions like most competing cards',
      'Cashback automatically credited directly to statement within 2 days of bill generation',
      'High monthly cashback cap of ₹5,000 (translating to ₹1,00,000 monthly spend)',
      '1% fuel surcharge waiver across all petrol pumps in India'
    ],
    cons: [
      'No complimentary domestic or international airport lounge access',
      'Excludes rent, wallet loads, school fees, and government transactions from 5% cashback'
    ],
    rewardBreakdown: {
      onlineShopping: '5% Flat Cashback (Monthly cap: ₹5,000)',
      offlineSpends: '1% Cashback (No upper limit)',
      upiSpends: '1% (via third-party POS QR)',
      utilities: '1% Cashback',
      fuel: '1% Surcharge waiver (₹500 - ₹3,000)'
    },
    eligibility: {
      minAge: '21 to 65 years',
      minIncomeSalaried: '₹30,000 / month',
      minCreditScore: '730+ CIBIL'
    },
    loungeDetails: ['No lounge visits included. Optimized purely as a high-yield cashback tool.'],
    headquarters: 'Gurugram, Haryana'
  },
  {
    id: 'tata-neu-infinity',
    name: 'Tata Neu Infinity HDFC Card',
    bank: 'HDFC Bank',
    network: 'RuPay / Visa',
    category: 'UPI RuPay',
    joiningFee: '₹1,499 + GST',
    annualFee: '₹1,499 + GST',
    annualWaiverSpend: '₹3,00,000 annual spend',
    rewardRate: '10% on Tata Neu / 1.5% UPI',
    loungeAccess: '8 Domestic + 4 International / year',
    highlights: ['1.5% NeuCoins on all UPI scan-and-pay transactions', '10% NeuCoins on BigBasket, 1mg, Croma, Air India, Tata CLiQ', 'Complimentary domestic & international airport lounge visits', 'Low 1.5% forex markup fee'],
    bestFor: 'Everyday UPI payments on RuPay & Tata ecosystem shopping',
    link: 'https://hdfcbank.com',
    about: 'Co-branded between Tata Group and HDFC Bank, the Tata Neu Infinity is India’s undisputed flagship card for the RuPay UPI payment revolution. Linking directly to PhonePe, Google Pay, or Paytm, it gives 1.5% rewards on everyday merchant QR scans plus access to domestic and international airport lounges.',
    pros: [
      '1.5% NeuCoins on all UPI payments (1 NeuCoin = ₹1 on Tata Neu app)',
      '10% total NeuCoins on BigBasket groceries, 1mg medicines, Croma electronics, and Air India flights',
      '8 Complimentary domestic airport lounge visits per year (2 per quarter)',
      '4 Complimentary international lounge visits per calendar year via Priority Pass',
      'Ultra-low foreign currency markup of only 1.5% (ideal for foreign trips)'
    ],
    cons: [
      'Rewards are credited as NeuCoins (spendable across Tata brands: Croma, BigBasket, Westside, Air India)',
      'Requires meeting quarterly spend criteria for certain lounge visits'
    ],
    rewardBreakdown: {
      onlineShopping: '10% NeuCoins on Tata Neu ecosystem / 1.5% Non-Tata online',
      offlineSpends: '1.5% NeuCoins',
      upiSpends: '1.5% NeuCoins on all merchant UPI QR code scans (RuPay variant)',
      utilities: '1.5% NeuCoins',
      fuel: '1% Fuel Surcharge waiver'
    },
    eligibility: {
      minAge: '21 to 60 years',
      minIncomeSalaried: '₹1,00,000 / month (or existing HDFC limit >₹1.5L)',
      minCreditScore: '750+ CIBIL'
    },
    loungeDetails: [
      '8 Domestic airport lounge accesses per year (2 per calendar quarter)',
      '4 International airport lounge accesses per year via complimentary Priority Pass membership',
      'Includes access at Delhi (T3 Encalm), Mumbai (Adani Lounge), Bengaluru (080 Lounge), and more'
    ],
    headquarters: 'Mumbai, Maharashtra'
  },
  {
    id: 'amazon-pay-icici',
    name: 'Amazon Pay ICICI Card',
    bank: 'ICICI Bank',
    network: 'Visa Platinum',
    category: 'Lifetime Free',
    joiningFee: '₹0 (Lifetime Free)',
    annualFee: '₹0 (Zero annual charges forever)',
    annualWaiverSpend: 'No spend threshold (Forever Free)',
    rewardRate: '5% Unlimited Cashback (Prime)',
    loungeAccess: 'Not Included',
    highlights: ['Lifetime free with zero joining or annual fees', '5% unlimited cashback for Amazon Prime members', '3% unlimited for non-Prime members', '2% on 100+ partner merchants (Swiggy, Uber, etc.)'],
    bestFor: 'Amazon loyalists wanting zero maintenance credit card',
    link: 'https://icicibank.com',
    about: 'With over 5 million cardholders, the Amazon Pay ICICI Bank Credit Card is one of India’s most popular financial products. Issued with zero joining fee and zero annual maintenance fee for lifetime, it provides uncapped 5% cashback on all Amazon.in purchases.',
    pros: [
      '100% Lifetime Free forever with absolutely zero conditions or minimum spend clauses',
      'Uncapped 5% cashback on all Amazon.in orders for Prime subscribers (3% for non-Prime)',
      '2% unlimited cashback on 100+ partner brands including Swiggy, Uber, Zomato, and BookMyShow',
      '1% unlimited cashback on all other dining, retail, and utility spends',
      'Direct monthly credit to Amazon Pay balance which never expires'
    ],
    cons: [
      'No airport lounge access',
      'Cashback is credited as Amazon Pay balance rather than direct bank statement deduction'
    ],
    rewardBreakdown: {
      onlineShopping: '5% Unlimited for Prime / 3% for Non-Prime on Amazon.in',
      offlineSpends: '1% Unlimited Cashback',
      upiSpends: '1% via partner gateways',
      utilities: '2% on bill payments through Amazon Pay',
      fuel: '1% Fuel Surcharge waiver'
    },
    eligibility: {
      minAge: '18 to 60 years',
      minIncomeSalaried: '₹25,000 / month (or existing ICICI relationship)',
      minCreditScore: '720+ CIBIL'
    },
    loungeDetails: ['No lounge access included.'],
    headquarters: 'Mumbai, Maharashtra'
  },
  {
    id: 'hdfc-millennia',
    name: 'HDFC Millennia Credit Card',
    bank: 'HDFC Bank',
    network: 'Mastercard / Visa',
    category: 'Cashback',
    joiningFee: '₹1,000 + GST',
    annualFee: '₹1,000 + GST',
    annualWaiverSpend: '₹1,00,000 annual spend',
    rewardRate: '5% Cashback on Top 10 Apps',
    loungeAccess: '4 Domestic Lounges / year',
    highlights: ['5% cashback on Amazon, Flipkart, Swiggy, Zomato, Myntra, Uber, Tata CLiQ', '1% on all other spends and wallet loads', '1,000 CashPoints on card activation', 'Milestone vouchers worth ₹1,000 every quarter'],
    bestFor: 'Young professionals spending on lifestyle and food delivery',
    link: 'https://hdfcbank.com',
    about: 'Tailored for young working professionals and lifestyle spenders, HDFC Millennia offers 5% cashback across India’s 10 biggest online apps: Amazon, Flipkart, Swiggy, Zomato, Myntra, Uber, Tata CLiQ, Cult.fit, Sony LIV, and BookMyShow.',
    pros: [
      '5% cashback on top lifestyle apps (monthly cap of ₹1,000)',
      '1% cashback on all offline spends, wallet reloads, and other websites',
      '4 complimentary domestic airport lounge visits per calendar year (1 per quarter)',
      '1,000 CashPoints welcome gift on fee payment',
      '₹1,000 gift voucher every calendar quarter on spending ₹1 Lakh'
    ],
    cons: [
      'Annual fee waiver requires ₹1,00,000 spend in a calendar year',
      'Requires manual redemption of CashPoints via Netbanking (1 CP = ₹1 cash)'
    ],
    rewardBreakdown: {
      onlineShopping: '5% Cashback on 10 Top Apps (Amazon, Flipkart, Swiggy, etc.)',
      offlineSpends: '1% Cashback',
      upiSpends: '1% Cashback',
      utilities: '1% Cashback',
      fuel: '1% Fuel Surcharge waiver'
    },
    eligibility: {
      minAge: '21 to 40 years',
      minIncomeSalaried: '₹35,000 / month',
      minCreditScore: '740+ CIBIL'
    },
    loungeDetails: [
      '4 Domestic Airport Lounge access per year (1 per calendar quarter)',
      'Access available at primary Indian airports: Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata'
    ],
    headquarters: 'Mumbai, Maharashtra'
  },
  {
    id: 'airtel-axis',
    name: 'Airtel Axis Bank Credit Card',
    bank: 'Axis Bank',
    network: 'Mastercard / Visa',
    category: 'Cashback',
    joiningFee: '₹500 + GST',
    annualFee: '₹500 + GST',
    annualWaiverSpend: '₹2,00,000 annual spend',
    rewardRate: '25% on Airtel / 10% Utilities',
    loungeAccess: '4 Domestic Lounges / year',
    highlights: ['25% cashback on Airtel mobile, broadband, DTH recharges', '10% cashback on electricity, gas, water bill payments via Airtel Thanks', '10% cashback on Swiggy, Zomato, and BigBasket', '₹500 Amazon voucher on 1st transaction'],
    bestFor: 'Highest utility bills and broadband recharges savings',
    link: 'https://axisbank.com',
    about: 'The Airtel Axis Bank Credit Card offers industry-leading cashback rates for household recurring expenses. Delivering an astronomical 25% cashback on Airtel bills and 10% cashback on electricity, gas, water, Swiggy, Zomato, and BigBasket, it can easily save an average household over ₹12,000 annually.',
    pros: [
      '25% cashback on Airtel Mobile, Wi-Fi broadband, and DTH recharges (Monthly cap: ₹250)',
      '10% cashback on electricity, gas piped supply, water utility bills paid via Airtel Thanks app (Cap: ₹250)',
      '10% cashback on Swiggy, Zomato, and BigBasket (Monthly cap: ₹500)',
      '4 complimentary domestic airport lounge visits per calendar year',
      'Low annual fee of just ₹500 + GST, recoverable in the first month alone'
    ],
    cons: [
      'Requires Airtel Thanks app for paying utility bills to earn the 10% cashback',
      'Category monthly cashback caps mean high spenders will max out quickly'
    ],
    rewardBreakdown: {
      onlineShopping: '10% on Swiggy, Zomato, BigBasket / 1% other online',
      offlineSpends: '1% Unlimited Cashback',
      upiSpends: '1% Cashback',
      utilities: '10% on Electricity, Water, Gas via Airtel Thanks app',
      fuel: '1% Fuel Surcharge waiver'
    },
    eligibility: {
      minAge: '21 to 70 years',
      minIncomeSalaried: '₹25,000 / month',
      minCreditScore: '730+ CIBIL'
    },
    loungeDetails: [
      '4 Complimentary domestic airport lounge visits per calendar year',
      'Available across major domestic airport terminals'
    ],
    headquarters: 'Mumbai, Maharashtra'
  },
  {
    id: 'axis-atlas',
    name: 'Axis Bank Atlas Credit Card',
    bank: 'Axis Bank',
    network: 'Visa Infinite',
    category: 'Travel & Rewards',
    joiningFee: '₹5,000 + GST',
    annualFee: '₹5,000 + GST (Includes 2,500 Edge Miles)',
    annualWaiverSpend: 'Includes 2,500 renewal Edge Miles',
    rewardRate: '5 Edge Miles per ₹100 Travel',
    loungeAccess: 'Up to 18 Domestic + 8 International',
    highlights: ['1 Edge Mile = 2 Partner Airline Miles / Hotel Points (1:2 ratio)', 'Direct transfer to Singapore Airlines, Qatar Airways, Accor Hotels', 'Tier upgrades to Silver, Gold, Platinum based on annual spends', 'Extensive domestic and international lounge visits'],
    bestFor: 'Frequent flyers, international vacations, and luxury hotel stays',
    link: 'https://axisbank.com',
    about: 'Axis Atlas is widely considered by credit card connoisseurs to be India’s premier mid-tier travel credit card. Offering EDGE Miles that transfer at a lucrative 1:2 ratio to international airlines and luxury hotel chains (including Accor, Singapore KrisFlyer, and Qatar Privilege Club), it unlocks business class travel and 5-star hotel stays at a fraction of retail prices.',
    pros: [
      '1 EDGE Mile converts to 2 Airline Miles or Hotel Reward Points (1:2 ratio)',
      '5 EDGE Miles per ₹100 spent on flight bookings, hotels, and airline websites (effective 10% return)',
      '2 EDGE Miles per ₹100 spent on all general retail transactions (effective 4% return)',
      'Up to 18 domestic and 8 international lounge accesses depending on tier level',
      'Annual renewal bonus of 2,500 EDGE Miles, largely offsetting the renewal fee'
    ],
    cons: [
      'High joining and annual fee of ₹5,000 + GST',
      'Best suited for individuals who travel frequently and understand points redemption'
    ],
    rewardBreakdown: {
      onlineShopping: '2 Edge Miles per ₹100 (4% value)',
      offlineSpends: '2 Edge Miles per ₹100 (4% value)',
      upiSpends: '2 Edge Miles per ₹100',
      utilities: 'Excluded from edge miles',
      fuel: '1% Fuel Surcharge waiver'
    },
    eligibility: {
      minAge: '21 to 70 years',
      minIncomeSalaried: '₹1,50,000 / month',
      minCreditScore: '760+ CIBIL'
    },
    loungeDetails: [
      'Silver Tier: 8 Domestic + 4 International lounge visits / year',
      'Gold Tier: 12 Domestic + 6 International lounge visits / year',
      'Platinum Tier: 18 Domestic + 8 International lounge visits / year',
      'Guest access allowed using available lounge quota'
    ],
    headquarters: 'Mumbai, Maharashtra'
  }
];

export function getAllCreditCards(): CreditCardItem[] {
  return CREDIT_CARDS_DATA;
}

export function getCreditCardById(id: string): CreditCardItem | undefined {
  const normalized = decodeURIComponent(id).toLowerCase().trim();
  return CREDIT_CARDS_DATA.find((c) => c.id.toLowerCase() === normalized || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized);
}
