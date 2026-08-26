import re
import logging
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List, Optional
from ..config import DEFAULT_HEADERS, INVESTORGAIN_GMP_URL, REQUEST_TIMEOUT
from ..models import GMPTrend, slugify, parse_number

logger = logging.getLogger("investorgain_scraper")

class InvestorGainScraper:
    def __init__(self, session: Optional[requests.Session] = None):
        self.session = session or requests.Session()
        self.session.headers.update(DEFAULT_HEADERS)

    def fetch_gmp_table(self) -> Dict[str, Dict[str, Any]]:
        """
        Scrapes the live IPO GMP table from InvestorGain.
        Returns a dictionary keyed by normalized slug with GMP details and historical trends.
        """
        logger.info(f"Scraping live GMP data from {INVESTORGAIN_GMP_URL}...")
        gmp_map: Dict[str, Dict[str, Any]] = {}

        try:
            resp = self.session.get(INVESTORGAIN_GMP_URL, timeout=REQUEST_TIMEOUT)
            if resp.status_code != 200:
                logger.warning(f"InvestorGain returned HTTP {resp.status_code}")
                return gmp_map

            soup = BeautifulSoup(resp.text, "lxml")
            
            # Find GMP table
            tables = soup.find_all("table")
            target_table = None
            for table in tables:
                text = table.get_text().lower()
                if "gmp" in text and ("ipo" in text or "price" in text or "gain" in text):
                    target_table = table
                    break

            if not target_table:
                logger.warning("Could not find GMP table on InvestorGain")
                return gmp_map

            rows = target_table.find_all("tr")
            for row in rows:
                cols = row.find_all(["td", "th"])
                if len(cols) < 5:
                    continue

                row_text = [c.get_text(strip=True) for c in cols]
                name_tag = cols[0].find("a")
                raw_name = name_tag.get_text(strip=True) if name_tag else row_text[0]
                
                # Filter out header rows
                if "ipo name" in raw_name.lower() or "company" in raw_name.lower():
                    continue

                clean_name = re.sub(r"\s+IPO$", "", raw_name, flags=re.IGNORECASE).strip()
                slug = slugify(clean_name)

                # InvestorGain columns typically:
                # [0] IPO Name, [1] Price / Price Band, [2] GMP(Rs), [3] Est Listing / Est Gain %, [4] Kostak/Fire Rating, [5] Dates / Status
                
                price_str = row_text[1] if len(row_text) > 1 else ""
                gmp_str = row_text[2] if len(row_text) > 2 else "0"
                est_gain_str = row_text[3] if len(row_text) > 3 else ""
                updated_time_str = "Live"

                gmp_val = int(parse_number(gmp_str))
                price_val = int(parse_number(price_str))

                gmp_percent = 0.0
                if "%" in est_gain_str:
                    gmp_percent = parse_number(est_gain_str)
                elif price_val > 0 and gmp_val > 0:
                    gmp_percent = round((gmp_val / price_val) * 100, 2)

                expected_listing_price = price_val + gmp_val if (price_val > 0 and gmp_val != 0) else price_val

                # Check if there are historical daily GMP links
                trends: List[GMPTrend] = []
                detail_link = name_tag.get("href") if name_tag else None
                if detail_link:
                    # e.g. /ipo/company-ipo-gmp/123/
                    pass # We can optionally fetch trend logs if available

                from datetime import date
                today_str = date.today().strftime("%d-%b")
                trends.append(GMPTrend(
                    date=today_str,
                    gmp=f"₹{gmp_val}",
                    gain=f"{gmp_percent}%"
                ))

                gmp_map[slug] = {
                    "name": clean_name,
                    "slug": slug,
                    "gmp": gmp_val,
                    "gmpPercent": gmp_percent,
                    "expectedListingPrice": expected_listing_price,
                    "gmpUpdatedTime": updated_time_str,
                    "gmpTrends": [t.model_dump() if hasattr(t, "model_dump") else t.dict() for t in trends],
                }

            logger.info(f"Successfully parsed GMP for {len(gmp_map)} IPOs")

        except Exception as e:
            logger.error(f"Error scraping InvestorGain GMP: {e}")

        return gmp_map
