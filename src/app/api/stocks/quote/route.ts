import { NextResponse } from 'next/server';
import { StockQuote } from '@/types';

// In-memory quote cache with 60s TTL to prevent rate limits
interface CacheEntry {
  data: StockQuote;
  timestamp: number;
}

const quoteCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Custom symbol mapping for Indian dual-listed or special instruments
const SYMBOL_MAP: Record<string, string> = {
  'MAKEMYTRIP': 'MMYT',
  'MMYT': 'MMYT',
  'JIO': 'RELIANCE.NS',
  'JIO-PLATFORMS': 'RELIANCE.NS',
  'ZOMATO': 'ETERNAL.NS', // Zomato renamed entity or ZOMATO.BO
  'SWIGGY': 'SWIGGY.NS',
  'BSE': 'BSE.NS',
  'BAJAJHFL': 'BAJAJHFL.NS',
  'HYUNDAI': 'HYUNDAI.NS',
  'PAYTM': 'PAYTM.NS',
  'NYKAA': 'NYKAA.NS',
  'OLAELEC': 'OLAELEC.NS',
};

async function fetchSingleQuote(rawSymbol: string): Promise<StockQuote | null> {
  const cleanSym = rawSymbol.trim().toUpperCase();
  if (!cleanSym) return null;

  // Check cache
  const cached = quoteCache.get(cleanSym);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Handle special simulated unlisted markets (e.g. NSE pre-IPO)
  if (cleanSym === 'NSE') {
    const nseQuote: StockQuote = {
      symbol: 'NSE',
      currentPrice: 1810.0,
      previousClose: 1785.0,
      change: 25.0,
      changePercent: 1.4,
      currency: 'INR',
      lastUpdated: new Date().toISOString()
    };
    quoteCache.set(cleanSym, { data: nseQuote, timestamp: Date.now() });
    return nseQuote;
  }

  // Determine Yahoo Ticker
  let ticker = SYMBOL_MAP[cleanSym];
  if (!ticker) {
    if (cleanSym.endsWith('.NS') || cleanSym.endsWith('.BO')) {
      ticker = cleanSym;
    } else {
      ticker = `${cleanSym}.NS`;
    }
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      // If .NS failed and it's not a mapped symbol, try .BO (BSE)
      if (ticker.endsWith('.NS')) {
        const bseTicker = ticker.replace('.NS', '.BO');
        const bseRes = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${bseTicker}?interval=1d&range=1d`, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          next: { revalidate: 60 }
        });
        if (bseRes.ok) {
          const bseData = await bseRes.json();
          const meta = bseData.chart?.result?.[0]?.meta;
          if (meta && meta.regularMarketPrice) {
            return processMeta(cleanSym, meta);
          }
        }
      }
      return null;
    }

    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta || !meta.regularMarketPrice) {
      return null;
    }

    return processMeta(cleanSym, meta);
  } catch (err) {
    console.error(`Error fetching quote for ${cleanSym}:`, err);
    return null;
  }
}

function processMeta(symbol: string, meta: any): StockQuote {
  const currentPrice = meta.regularMarketPrice;
  const previousClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
  const change = currentPrice - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;

  const quote: StockQuote = {
    symbol,
    currentPrice: Math.round(currentPrice * 100) / 100,
    previousClose: Math.round(previousClose * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    dayHigh: meta.regularMarketDayHigh ? Math.round(meta.regularMarketDayHigh * 100) / 100 : undefined,
    dayLow: meta.regularMarketDayLow ? Math.round(meta.regularMarketDayLow * 100) / 100 : undefined,
    currency: meta.currency || 'INR',
    lastUpdated: new Date().toISOString()
  };

  quoteCache.set(symbol, { data: quote, timestamp: Date.now() });
  return quote;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const symbolsParam = searchParams.get('symbols');

  // Single symbol lookup
  if (symbol) {
    const quote = await fetchSingleQuote(symbol);
    if (!quote) {
      return NextResponse.json({ success: false, error: `Quote not found for ${symbol}` }, { status: 404 });
    }
    return NextResponse.json({ success: true, quote });
  }

  // Batch symbols lookup
  if (symbolsParam) {
    const rawSymbols = symbolsParam.split(',').map(s => s.trim()).filter(Boolean);
    const uniqueSymbols = Array.from(new Set(rawSymbols)).slice(0, 40); // Cap batch at 40 symbols

    const quotes: Record<string, StockQuote> = {};
    const results = await Promise.allSettled(
      uniqueSymbols.map(async (sym) => {
        const q = await fetchSingleQuote(sym);
        if (q) {
          quotes[sym] = q;
        }
      })
    );

    return NextResponse.json({
      success: true,
      count: Object.keys(quotes).length,
      quotes
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  }

  return NextResponse.json({ success: false, error: 'Provide ?symbol= or ?symbols=' }, { status: 400 });
}

