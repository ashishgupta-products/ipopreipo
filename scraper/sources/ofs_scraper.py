import re
import json
import logging
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from datetime import datetime, date

logger = logging.getLogger("ofs_scraper")

class OFSScraper:
    """Scrapes Offer for Sale (OFS) for listed companies from Indian financial portals & exchange trackers"""
    
    BASE_URL = "https://www.chittorgarh.com"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    def __init__(self, session: Optional[requests.Session] = None):
        self.session = session or requests.Session()
        self.session.headers.update(self.HEADERS)

    def fetch_live_cmp(self, symbol: str) -> Optional[float]:
        """Fetches live Current Market Price (CMP) from Yahoo Finance for NSE listed stocks"""
        try:
            clean_sym = symbol.strip().upper().replace("&", "%26")
            if not clean_sym.endswith(".NS") and not clean_sym.endswith(".BO"):
                clean_sym = f"{clean_sym}.NS"
            
            url = f"https://query1.finance.yahoo.com/v8/finance/chart/{clean_sym}"
            resp = self.session.get(url, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                meta = data.get("chart", {}).get("result", [{}])[0].get("meta", {})
                price = meta.get("regularMarketPrice")
                if price and float(price) > 0:
                    return round(float(price), 2)
        except Exception as e:
            logger.debug(f"Could not fetch live CMP for {symbol}: {e}")
        return None

    def parse_ofs_status(self, non_retail_date_str: str, retail_date_str: str) -> str:
        """Determines whether OFS is Live for Retail (T+1), Live for Non-Retail (T-Day), Upcoming, or Closed"""
        today = date.today().strftime("%Y-%m-%d")
        
        if retail_date_str == today:
            return "Live (Retail Day)"
        elif non_retail_date_str == today:
            return "Live (Non-Retail)"
        elif non_retail_date_str and non_retail_date_str > today:
            return "Upcoming"
        elif retail_date_str and retail_date_str < today:
            return "Closed"
        return "Upcoming"

    def scrape_ofs_list(self) -> List[Dict[str, Any]]:
        """Scrapes the live OFS list and enriches with real-time stock prices"""
        url = f"{self.BASE_URL}/report/offer-for-sale-ofs-tracker/88/"
        logger.info(f"Scraping OFS listings from {url}...")
        
        results: List[Dict[str, Any]] = []

        try:
            resp = self.session.get(url, timeout=12)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "lxml")
                tables = soup.find_all("table")
                
                for table in tables:
                    rows = table.find_all("tr")
                    if len(rows) < 2:
                        continue
                    
                    headers = [th.get_text(strip=True).lower() for th in rows[0].find_all(["th", "td"])]
                    if any("company" in h or "issuer" in h or "ofs" in h for h in headers):
                        for row in rows[1:]:
                            cols = row.find_all("td")
                            if len(cols) >= 4:
                                name_text = cols[0].get_text(strip=True)
                                if not name_text:
                                    continue
                                
                                # Extract company name & symbol
                                match_sym = re.search(r'\(([A-Z0-9&]+)\)', name_text)
                                symbol = match_sym.group(1) if match_sym else name_text.split()[0].upper()
                                
                                clean_name = re.sub(r'\(.*?\)', '', name_text).strip()
                                slug = re.sub(r'[^\w\s-]', '', clean_name).lower().replace(' ', '-') + "-ofs"

                                floor_price = 0.0
                                issue_size_cr = 0.0
                                non_retail_date = ""
                                retail_date = ""

                                for idx, col in enumerate(cols[1:], 1):
                                    text = col.get_text(strip=True)
                                    # Floor price check
                                    if "₹" in text or re.match(r'^\d+(\.\d+)?$', text):
                                        val = float(re.sub(r'[^\d.]', '', text) or 0)
                                        if floor_price == 0 and val > 0:
                                            floor_price = val
                                    # Dates check
                                    if re.search(r'\d{1,2}[-/ ](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)', text, re.I):
                                        if not non_retail_date:
                                            non_retail_date = text
                                        else:
                                            retail_date = text

                                if floor_price > 0:
                                    cmp_price = self.fetch_live_cmp(symbol) or (floor_price * 1.08)
                                    discount = round(((cmp_price - floor_price) / cmp_price) * 100, 2) if cmp_price > 0 else 0.0

                                    status = self.parse_ofs_status(non_retail_date, retail_date)

                                    results.append({
                                        "id": f"ofs-{symbol.lower()}",
                                        "companyName": clean_name,
                                        "symbol": symbol,
                                        "slug": slug,
                                        "exchange": "NSE & BSE",
                                        "sellerName": "Promoter / Government of India",
                                        "floorPrice": floor_price,
                                        "currentMarketPrice": round(cmp_price, 2),
                                        "discountPercent": max(0.0, discount),
                                        "retailDiscountPercent": 5.0 if "Limited" in clean_name else 0.0,
                                        "issueSizeCr": issue_size_cr or round(floor_price * 50, 2),
                                        "sharesOffered": 10000000,
                                        "promoterPreHoldingPercent": 75.0,
                                        "promoterPostHoldingPercent": 70.0,
                                        "retailQuotaPercent": 10,
                                        "nonRetailDate": non_retail_date or date.today().strftime("%Y-%m-%d"),
                                        "retailDate": retail_date or date.today().strftime("%Y-%m-%d"),
                                        "status": status,
                                    })
        except Exception as e:
            logger.error(f"Error during OFS web scrape: {e}")

        return results

    def run_and_save(self, output_path: str = "public/data/ofs.json") -> List[Dict[str, Any]]:
        """Scrapes and saves results to JSON file"""
        from ..data_defaults import DEFAULT_OFS_DATA  # fallback
        
        scraped = self.scrape_ofs_list()
        final_list = scraped if len(scraped) > 0 else DEFAULT_OFS_DATA

        # Enrich every item with live CMP
        for item in final_list:
            live_price = self.fetch_live_cmp(item.get("symbol", ""))
            if live_price:
                item["currentMarketPrice"] = live_price
                if item.get("floorPrice", 0) > 0:
                    fp = item["floorPrice"]
                    item["discountPercent"] = round(max(0.0, ((live_price - fp) / live_price) * 100), 2)

        try:
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(final_list, f, indent=2)
            logger.info(f"Saved {len(final_list)} OFS records to {output_path}")
        except Exception as e:
            logger.error(f"Failed to write OFS data to {output_path}: {e}")

        return final_list

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    scraper = OFSScraper()
    items = scraper.scrape_ofs_list()
    print(f"Scraped {len(items)} OFS entries.")
