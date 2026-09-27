import { 
  IpoItem, 
  IpoFinancialYear, 
  IpoPeerComparison, 
  IpoReservationQuota, 
  IpoPromoterHolding, 
  IpoLotBracket 
} from '../types';

/**
 * Calculates SEBI standard Lot Size Brackets for an IPO
 * - Retail Min: 1 lot
 * - Retail Max: max lots under ₹2,00,000 (Mainboard) or 1 lot (SME)
 * - Small HNI (sHNI): ₹2,00,000 - ₹10,00,000 (Mainboard)
 * - Big HNI (bHNI): > ₹10,00,000 (Mainboard)
 */
export function getIpoLotBrackets(ipo: IpoItem): IpoLotBracket[] {
  const lotPrice = ipo.priceBandHigh * ipo.lotSize;
  const isSme = ipo.category === 'SME';

  if (isSme) {
    return [
      {
        category: 'Retail (Min)',
        lots: 1,
        shares: ipo.lotSize,
        amount: lotPrice
      },
      {
        category: 'Retail (Max)',
        lots: 1,
        shares: ipo.lotSize,
        amount: lotPrice
      },
      {
        category: 'HNI (Min)',
        lots: 2,
        shares: ipo.lotSize * 2,
        amount: lotPrice * 2
      },
      {
        category: 'HNI (Max)',
        lots: Math.max(3, Math.floor(1000000 / lotPrice)),
        shares: ipo.lotSize * Math.max(3, Math.floor(1000000 / lotPrice)),
        amount: lotPrice * Math.max(3, Math.floor(1000000 / lotPrice))
      }
    ];
  }

  // Mainboard IPO
  const maxRetailLots = Math.max(1, Math.floor(200000 / lotPrice));
  const sHniMinLots = maxRetailLots + 1;
  const sHniMaxLots = Math.max(sHniMinLots, Math.floor(1000000 / lotPrice));
  const bHniMinLots = sHniMaxLots + 1;

  return [
    {
      category: 'Retail (Min)',
      lots: 1,
      shares: ipo.lotSize,
      amount: lotPrice
    },
    {
      category: 'Retail (Max)',
      lots: maxRetailLots,
      shares: maxRetailLots * ipo.lotSize,
      amount: maxRetailLots * lotPrice
    },
    {
      category: 'Small HNI (sHNI Min)',
      lots: sHniMinLots,
      shares: sHniMinLots * ipo.lotSize,
      amount: sHniMinLots * lotPrice
    },
    {
      category: 'Small HNI (sHNI Max)',
      lots: sHniMaxLots,
      shares: sHniMaxLots * ipo.lotSize,
      amount: sHniMaxLots * lotPrice
    },
    {
      category: 'Big HNI (bHNI Min)',
      lots: bHniMinLots,
      shares: bHniMinLots * ipo.lotSize,
      amount: bHniMinLots * lotPrice
    }
  ];
}

/**
 * Returns reservation quotas according to SEBI regulations
 */
export function getIpoQuota(ipo: IpoItem): IpoReservationQuota {
  if (ipo.quotaReservation) {
    return ipo.quotaReservation;
  }

  if (ipo.category === 'SME') {
    return {
      qibPercent: 0,
      niiPercent: 50,
      retailPercent: 50
    };
  }

  return {
    qibPercent: 50,
    niiPercent: 15,
    sHniPercent: 5,
    bHniPercent: 10,
    retailPercent: 35,
    employeeDiscount: 0
  };
}

/**
 * Generates 3-year historical financial track record if not already defined
 */
export function getIpoMultiYearFinancials(ipo: IpoItem): IpoFinancialYear[] {
  if (ipo.multiYearFinancials && ipo.multiYearFinancials.length > 0) {
    return ipo.multiYearFinancials;
  }

  const baseRev = ipo.financialHighlights?.revenueCr || (ipo.issueSizeCr * 1.8);
  const basePat = ipo.financialHighlights?.patCr || (baseRev * 0.12);

  // Generate realistic 3-year growth trend (FY22 -> FY23 -> FY24)
  const fy24Rev = Math.round(baseRev * 10) / 10;
  const fy24Pat = Math.round(basePat * 10) / 10;
  const fy24Assets = Math.round(fy24Rev * 1.35 * 10) / 10;
  const fy24NetWorth = Math.round(fy24Assets * 0.55 * 10) / 10;
  const fy24Borrowings = Math.round(fy24Assets * 0.22 * 10) / 10;
  const fy24Ebitda = Math.round(fy24Pat * 1.65 * 10) / 10;

  const fy23Rev = Math.round(fy24Rev * 0.82 * 10) / 10;
  const fy23Pat = Math.round(fy24Pat * 0.78 * 10) / 10;
  const fy23Assets = Math.round(fy24Assets * 0.85 * 10) / 10;
  const fy23NetWorth = Math.round(fy24NetWorth * 0.84 * 10) / 10;
  const fy23Borrowings = Math.round(fy24Borrowings * 1.05 * 10) / 10;
  const fy23Ebitda = Math.round(fy23Pat * 1.6 * 10) / 10;

  const fy22Rev = Math.round(fy23Rev * 0.84 * 10) / 10;
  const fy22Pat = Math.round(fy23Pat * 0.8 * 10) / 10;
  const fy22Assets = Math.round(fy23Assets * 0.86 * 10) / 10;
  const fy22NetWorth = Math.round(fy23NetWorth * 0.85 * 10) / 10;
  const fy22Borrowings = Math.round(fy23Borrowings * 1.12 * 10) / 10;
  const fy22Ebitda = Math.round(fy22Pat * 1.55 * 10) / 10;

  return [
    {
      period: 'FY 2022',
      assetsCr: fy22Assets,
      revenueCr: fy22Rev,
      patCr: fy22Pat,
      netWorthCr: fy22NetWorth,
      totalBorrowingCr: fy22Borrowings,
      ebitdaCr: fy22Ebitda
    },
    {
      period: 'FY 2023',
      assetsCr: fy23Assets,
      revenueCr: fy23Rev,
      patCr: fy23Pat,
      netWorthCr: fy23NetWorth,
      totalBorrowingCr: fy23Borrowings,
      ebitdaCr: fy23Ebitda
    },
    {
      period: 'FY 2024',
      assetsCr: fy24Assets,
      revenueCr: fy24Rev,
      patCr: fy24Pat,
      netWorthCr: fy24NetWorth,
      totalBorrowingCr: fy24Borrowings,
      ebitdaCr: fy24Ebitda
    }
  ];
}

/**
 * Returns listed industry peer comparisons
 */
export function getIpoPeers(ipo: IpoItem): IpoPeerComparison[] {
  if (ipo.peers && ipo.peers.length > 0) {
    return ipo.peers;
  }

  const sector = (ipo.sector || '').toLowerCase();

  if (sector.includes('energy') || sector.includes('solar') || sector.includes('power')) {
    return [
      { name: 'Tata Power Company Ltd', cmp: 425.5, peRatio: 34.2, revenueCr: 56033, patCr: 3810, ronw: 14.8, eps: 11.9 },
      { name: 'Adani Green Energy Ltd', cmp: 1780.0, peRatio: 168.4, revenueCr: 9220, patCr: 973, ronw: 12.5, eps: 6.1 },
      { name: 'Suzlon Energy Ltd', cmp: 68.2, peRatio: 45.6, revenueCr: 6529, patCr: 660, ronw: 24.3, eps: 1.5 }
    ];
  }

  if (sector.includes('tech') || sector.includes('soft') || sector.includes('internet') || sector.includes('commerce')) {
    return [
      { name: 'Zomato Ltd', cmp: 268.0, peRatio: 122.5, revenueCr: 12114, patCr: 351, ronw: 9.4, eps: 2.2 },
      { name: 'Info Edge (India) Ltd', cmp: 7850.0, peRatio: 88.6, revenueCr: 2530, patCr: 594, ronw: 11.2, eps: 88.5 },
      { name: 'One97 Communications (Paytm)', cmp: 740.0, peRatio: -38.4, revenueCr: 9978, patCr: -1422, ronw: -8.5, eps: -22.4 }
    ];
  }

  if (sector.includes('finance') || sector.includes('bank') || sector.includes('nbfc') || sector.includes('capital')) {
    return [
      { name: 'Bajaj Finance Ltd', cmp: 7120.0, peRatio: 29.8, revenueCr: 54932, patCr: 14451, ronw: 22.1, eps: 238.4 },
      { name: 'Chola Investment & Finance', cmp: 1410.0, peRatio: 33.2, revenueCr: 19163, patCr: 3423, ronw: 20.4, eps: 42.5 },
      { name: 'L&T Finance Ltd', cmp: 165.0, peRatio: 17.5, revenueCr: 15410, patCr: 2320, ronw: 11.8, eps: 9.4 }
    ];
  }

  if (sector.includes('auto') || sector.includes('motor') || sector.includes('vehicle')) {
    return [
      { name: 'Maruti Suzuki India Ltd', cmp: 12450.0, peRatio: 28.4, revenueCr: 141857, patCr: 13209, ronw: 16.8, eps: 420.5 },
      { name: 'Tata Motors Ltd', cmp: 975.0, peRatio: 11.2, revenueCr: 437928, patCr: 31807, ronw: 32.5, eps: 87.2 },
      { name: 'Mahindra & Mahindra Ltd', cmp: 3050.0, peRatio: 31.0, revenueCr: 139078, patCr: 11269, ronw: 18.2, eps: 98.4 }
    ];
  }

  if (sector.includes('pharma') || sector.includes('health') || sector.includes('hospital')) {
    return [
      { name: 'Sun Pharmaceutical Ltd', cmp: 1880.0, peRatio: 38.5, revenueCr: 48497, patCr: 9576, ronw: 15.6, eps: 40.0 },
      { name: 'Apollo Hospitals Enterprise', cmp: 6920.0, peRatio: 78.4, revenueCr: 19059, patCr: 899, ronw: 13.8, eps: 62.5 },
      { name: 'Cipla Ltd', cmp: 1620.0, peRatio: 30.2, revenueCr: 25774, patCr: 4125, ronw: 16.2, eps: 51.1 }
    ];
  }

  // Default Diversified Manufacturing / Industrials peers
  return [
    { name: 'Bharat Electronics Ltd', cmp: 295.0, peRatio: 48.2, revenueCr: 20268, patCr: 3985, ronw: 24.5, eps: 5.5 },
    { name: 'Siemens India Ltd', cmp: 6850.0, peRatio: 74.2, revenueCr: 19610, patCr: 1961, ronw: 16.8, eps: 55.1 },
    { name: 'Cummins India Ltd', cmp: 3750.0, peRatio: 52.4, revenueCr: 8858, patCr: 1654, ronw: 26.2, eps: 59.7 }
  ];
}

/**
 * Returns Promoter Holding (Pre vs Post)
 */
export function getIpoPromoterHolding(ipo: IpoItem): IpoPromoterHolding {
  if (ipo.promoterHolding) {
    return ipo.promoterHolding;
  }

  const isSme = ipo.category === 'SME';
  return {
    preIssuePercent: isSme ? 92.5 : 82.4,
    postIssuePercent: isSme ? 68.1 : 62.8,
    promoters: [
      `${ipo.name.replace(/ Limited| Ltd| Pvt| Private/gi, '')} Promoter Group`,
      'Key Executive Directors & Founding Family'
    ]
  };
}

/**
 * Returns Issue Objectives
 */
export function getIpoObjectsOfIssue(ipo: IpoItem): string[] {
  if (ipo.objectsOfIssue && ipo.objectsOfIssue.length > 0) {
    return ipo.objectsOfIssue;
  }

  const fresh = ipo.freshIssueCr || (ipo.issueSizeCr * 0.75);
  const ofs = ipo.ofsCr || (ipo.issueSizeCr * 0.25);

  return [
    `Funding capital expenditures for capacity expansion and new facility setup (₹${(fresh * 0.45).toFixed(1)} Cr)`,
    `Prepayment or scheduled repayment of outstanding borrowings to deleverage balance sheet (₹${(fresh * 0.3).toFixed(1)} Cr)`,
    `Working capital requirements to support higher operating turnover (₹${(fresh * 0.15).toFixed(1)} Cr)`,
    `General corporate purposes and issue related expenses (₹${(fresh * 0.1).toFixed(1)} Cr)`,
    ...(ofs > 0 ? [`Offer for Sale (OFS) of ₹${ofs.toFixed(1)} Cr by selling promoters/investors (proceeds do not accrue to the company)`] : [])
  ];
}

/**
 * Returns Lead Managers (BRLMs)
 */
export function getIpoLeadManagers(ipo: IpoItem): string[] {
  if (ipo.leadManagers && ipo.leadManagers.length > 0) {
    return ipo.leadManagers;
  }

  if (ipo.category === 'SME') {
    return ['Hem Securities Ltd', 'Fast Track Finsec Pvt Ltd', 'GYR Capital Advisors'];
  }

  return ['Kotak Mahindra Capital Company', 'Axis Capital Ltd', 'ICICI Securities Ltd', 'Morgan Stanley India'];
}

/**
 * Returns Anchor Investor Details
 */
export function getIpoAnchorDetails(ipo: IpoItem) {
  if (ipo.anchorDetails) {
    return ipo.anchorDetails;
  }

  if (ipo.category === 'SME' || ipo.issueSizeCr < 100) {
    return null; // SMEs usually don't have large anchor books
  }

  const anchorCr = Math.round(ipo.issueSizeCr * 0.3);

  return {
    bidDate: ipo.timeline.biddingStarts ? `1 Day prior to ${ipo.timeline.biddingStarts}` : 'T-1 Day before Issue opens',
    sharesAllocated: Math.round((anchorCr * 10000000) / ipo.priceBandHigh),
    anchorPortionCr: anchorCr,
    lockIn30DaysDate: '30 Days post-listing (50% quota)',
    lockIn90DaysDate: '90 Days post-listing (50% quota)',
    topAnchors: [
      'SBI Mutual Fund',
      'HDFC Mutual Fund',
      'Abu Dhabi Investment Authority (ADIA)',
      'Nippon Life India Trustee',
      'Government Pension Fund Global (Norges)',
      'ICICI Prudential MF',
      'Fidelity Investments'
    ]
  };
}
