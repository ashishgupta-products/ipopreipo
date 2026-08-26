import re
import logging
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from urllib.parse import urljoin
from datetime import date, datetime
from ..config import DEFAULT_HEADERS, REQUEST_TIMEOUT
from ..models import (
    IPOData,
    IPOCategory,
    IPOStatus,
    FinancialMetric,
    LotSizeDetail,
    IPOReservation,
    IPOKpiDetail,
    GMPTrend,
    slugify,
    parse_number,
    parse_date_str,
)

logger = logging.getLogger("chittorgarh_scraper")

def parse_date_range(range_str: str) -> tuple[str, str]:
    """Parses '01 - 03 Sep, 2026' or '1 to 3 Sep 2026' or '27 to 31 Aug, 2026' into (open_date, close_date) YYYY-MM-DD"""
    if not range_str:
        return "", ""
    range_str = range_str.strip()
    
    current_year = datetime.now().year
    # Match patterns like "1 to 3 Sep, 2026" or "27 to 31 Aug 2026" or "01 - 03 Sep"
    match = re.search(r'(\d{1,2})\s*(?:to|-)\s*(\d{1,2})\s+([A-Za-z]+)(?:[,\s]+(\d{4}))?', range_str)
    if match:
        start_day = int(match.group(1))
        end_day = int(match.group(2))
        month_str = match.group(3)[:3]
        year = int(match.group(4)) if match.group(4) else current_year
        try:
            m_num = datetime.strptime(month_str, "%b").month
            open_d = f"{year:04d}-{m_num:02d}-{start_day:02d}"
            close_d = f"{year:04d}-{m_num:02d}-{end_day:02d}"
            return open_d, close_d
        except Exception:
            pass
    return "", ""

def parse_crores_amount(val_str: str) -> float:
    """Extracts numeric crores value from strings like '52,30,000 shares (agg. up to ₹125.00 Cr)'"""
    if not val_str:
        return 0.0
    cr_match = re.search(r'(?:₹|rs\.?)\s*([\d,.]+)\s*(?:cr|crore)', val_str, re.IGNORECASE)
    if cr_match:
        return parse_number(cr_match.group(1))
    return parse_number(val_str)

class ChittorgarhScraper:
    BASE_URL = "https://www.chittorgarh.com"

    def __init__(self, session: Optional[requests.Session] = None):
        self.session = session or requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })

    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        try:
            resp = self.session.get(url, timeout=REQUEST_TIMEOUT)
            if resp.status_code == 200:
                return BeautifulSoup(resp.text, "lxml")
            logger.warning(f"Failed to fetch {url}: Status {resp.status_code}")
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
        return None

    def determine_status(self, open_date: str, close_date: str, listing_date: str, listing_price: Optional[int]) -> IPOStatus:
        today = date.today().strftime("%Y-%m-%d")
        
        if listing_price and listing_price > 0:
            return "listed"
        if listing_date and listing_date <= today:
            return "listed"
        if close_date and close_date < today:
            return "closed"
        if open_date and open_date <= today:
            if not close_date or close_date >= today:
                return "live"
        return "upcoming"

    def discover_ipos(self, category: IPOCategory = "mainboard") -> List[Dict[str, Any]]:
        """Discovers IPOs from Chittorgarh Dashboard and Tracker"""
        url = f"{self.BASE_URL}/ipo/ipo_dashboard.asp" if category == "mainboard" else f"{self.BASE_URL}/ipo/ipo_dashboard.asp?a=sme"
        logger.info(f"Discovering {category} IPOs from {url}...")
        
        soup = self.fetch_page(url)
        if not soup:
            return []

        discovered: Dict[str, Dict[str, Any]] = {}

        # Look for IPO links in tables and page
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if "/ipo/" in href and (href.endswith("/") or re.search(r"/\d+/?$", href)):
                if any(x in href for x in ["dashboard", "perf_tracker", "discussions", "report", "subscription", "calendar", "faq"]):
                    continue

                raw_name = a.get_text(strip=True)
                if not raw_name or len(raw_name) < 2:
                    continue

                clean_name = re.sub(r"\s+IPO$", "", raw_name, flags=re.IGNORECASE).strip()
                slug = slugify(clean_name)
                if not slug:
                    continue

                full_url = urljoin(self.BASE_URL, href)
                if slug not in discovered:
                    discovered[slug] = {
                        "name": clean_name,
                        "slug": slug,
                        "category": category,
                        "detail_url": full_url,
                    }

        logger.info(f"Discovered {len(discovered)} {category} IPOs")
        return list(discovered.values())

    def scrape_ipo_detail(self, summary_item: Dict[str, Any]) -> Optional[IPOData]:
        """Scrapes deep details for a single IPO from its detail page"""
        url = summary_item.get("detail_url")
        if not url:
            return None

        soup = self.fetch_page(url)
        if not soup:
            return None

        category: IPOCategory = summary_item["category"]
        name = summary_item["name"]
        slug = summary_item["slug"]

        # 1. Company Name & Logo
        company_name = name
        logo_url = None
        h1 = soup.find("h1")
        if h1:
            raw_h1 = h1.get_text(strip=True)
            company_name = re.sub(r"\s+IPO.*$", "", raw_h1, flags=re.IGNORECASE).strip()

        img_tag = soup.find("img", class_=re.compile(r"img-thumbnail|company-logo", re.I))
        if img_tag and img_tag.get("src"):
            src = img_tag["src"]
            if "chittorgarh-logo" not in src:
                logo_url = urljoin(self.BASE_URL, src)

        # 2. Extract All 2-Column Key-Value Tables
        kv_pairs: Dict[str, str] = {}
        for tr in soup.find_all("tr"):
            tds = tr.find_all(["td", "th"])
            if len(tds) == 2:
                k = tds[0].get_text(" ", strip=True).lower()
                v = tds[1].get_text(" ", strip=True)
                kv_pairs[k] = v

        # 3. Parse Issue Pricing & Lot Size
        price_band_str = kv_pairs.get("price band", kv_pairs.get("issue price", kv_pairs.get("price", "")))
        price_min = 0
        price_max = 0
        issue_price = None

        if "to" in price_band_str.lower() or "-" in price_band_str:
            parts = re.split(r"to|-", price_band_str.lower())
            if len(parts) >= 2:
                price_min = int(parse_number(parts[0]))
                price_max = int(parse_number(parts[1]))
                issue_price = price_max
        elif price_band_str:
            num = int(parse_number(price_band_str))
            price_min = num
            price_max = num
            issue_price = num

        lot_size_str = kv_pairs.get("lot size", "1")
        lot_size = int(parse_number(lot_size_str)) or (1 if category == "mainboard" else 1000)
        min_investment = (price_max or price_min) * lot_size

        face_value = int(parse_number(kv_pairs.get("face value", "10"))) or 10
        total_issue_size = parse_crores_amount(kv_pairs.get("total issue size", kv_pairs.get("issue size", "0")))
        fresh_issue = parse_crores_amount(kv_pairs.get("fresh issue", "0"))
        ofs = parse_crores_amount(kv_pairs.get("offer for sale", "0"))

        exchange = kv_pairs.get("listing at", kv_pairs.get("exchange", "BSE, NSE"))
        if "bse" in exchange.lower() and "nse" in exchange.lower():
            exchange_formatted = "BSE & NSE"
        elif "sme" in exchange.lower():
            exchange_formatted = "BSE SME" if "bse" in exchange.lower() else "NSE Emerge"
        elif "bse" in exchange.lower():
            exchange_formatted = "BSE"
        elif "nse" in exchange.lower():
            exchange_formatted = "NSE"
        else:
            exchange_formatted = "BSE & NSE" if category == "mainboard" else "NSE Emerge"

        # 4. Dates
        raw_date_range = kv_pairs.get("ipo date", kv_pairs.get("issue date", ""))
        open_date, close_date = parse_date_range(raw_date_range)
        if not open_date:
            open_date = parse_date_str(kv_pairs.get("ipo open date", kv_pairs.get("open date", "")))
        if not close_date:
            close_date = parse_date_str(kv_pairs.get("ipo close date", kv_pairs.get("close date", "")))

        allotment_date = parse_date_str(kv_pairs.get("basis of allotment", kv_pairs.get("allotment date", "")))
        refund_date = parse_date_str(kv_pairs.get("initiation of refunds", kv_pairs.get("refund date", "")))
        demat_credit_date = parse_date_str(kv_pairs.get("credit of shares to demat", kv_pairs.get("demat transfer", "")))
        
        raw_listing_date = kv_pairs.get("listing date", "").replace(" T", "").strip()
        listing_date = parse_date_str(raw_listing_date)

        listing_price_val = int(parse_number(kv_pairs.get("listing price", ""))) or None
        listing_gain = parse_number(kv_pairs.get("listing gain", "")) or None

        # 5. Extract GMP if present in text/review
        gmp_val = 0
        gmp_percent = 0.0
        gmp_match = re.search(r'GMP\s*[:\-\u2013]?\s*₹?\s*(\d+)', soup.get_text(), re.IGNORECASE)
        if gmp_match:
            gmp_val = int(gmp_match.group(1))
            if price_max > 0:
                gmp_percent = round((gmp_val / price_max) * 100, 2)

        # 6. Registrar & Lead Managers
        reg_name = kv_pairs.get("registrar", kv_pairs.get("registrar name", "Check Website"))
        reg_phone = kv_pairs.get("phone", None)
        reg_email = kv_pairs.get("email", None)
        reg_website = kv_pairs.get("website", "")
        if not reg_website and reg_name:
            reg_lower = reg_name.lower()
            if "link" in reg_lower:
                reg_website = "https://linkintime.co.in"
            elif "kfin" in reg_lower:
                reg_website = "https://kfintech.com"
            elif "bigshare" in reg_lower:
                reg_website = "https://bigshareonline.com"
            elif "cameo" in reg_lower:
                reg_website = "https://cameoindia.com"
            elif "maashitla" in reg_lower:
                reg_website = "https://maashitla.com"

        # 7. Financials Table
        financials_list: List[FinancialMetric] = []
        lot_sizes_list: List[LotSizeDetail] = []

        for table in soup.find_all("table"):
            headers = [th.get_text(strip=True).lower() for th in table.find_all("th")]
            
            # Financials Table
            if any("period ended" in h or "financial" in h for h in headers) and any("assets" in h or "revenue" in h or "profit" in h or "pat" in h for h in headers):
                rows = table.find_all("tr")
                if len(rows) > 1:
                    header_cols = [c.get_text(strip=True) for c in rows[0].find_all(["th", "td"])]
                    periods = header_cols[1:]
                    
                    data_dict: Dict[str, List[float]] = {}
                    for r in rows[1:]:
                        tds = [td.get_text(strip=True) for td in r.find_all("td")]
                        if len(tds) > 1:
                            metric_name = tds[0].lower()
                            values = [parse_number(v) for v in tds[1:]]
                            data_dict[metric_name] = values

                    for idx, period in enumerate(periods):
                        if not period or idx >= len(periods):
                            continue
                        
                        rev = 0.0
                        for k, vals in data_dict.items():
                            if "revenue" in k or "total income" in k:
                                if idx < len(vals): rev = vals[idx]
                        
                        pat = 0.0
                        for k, vals in data_dict.items():
                            if "profit after tax" in k or "pat" in k:
                                if idx < len(vals): pat = vals[idx]

                        nw = 0.0
                        for k, vals in data_dict.items():
                            if "net worth" in k:
                                if idx < len(vals): nw = vals[idx]

                        financials_list.append(FinancialMetric(
                            year=period,
                            revenue=rev,
                            pat=pat,
                            netWorth=nw,
                        ))

            # Lot Size Table
            if any("application" in h for h in headers) and any("lots" in h for h in headers) and any("shares" in h for h in headers):
                for tr in table.find_all("tr")[1:]:
                    tds = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                    if len(tds) >= 4:
                        lot_sizes_list.append(LotSizeDetail(
                            applicationCategory=tds[0],
                            lots=int(parse_number(tds[1])) or 1,
                            shares=int(parse_number(tds[2])) or lot_size,
                            amount=int(parse_number(tds[3])),
                        ))

        # 8. DRHP / Prospectus Links
        drhp_url = None
        prospectus_url = None
        for a in soup.find_all("a", href=True):
            href = a["href"]
            a_text = a.get_text().lower()
            if "drhp" in a_text or "drhp" in href.lower():
                drhp_url = urljoin(self.BASE_URL, href)
            elif "rhp" in a_text or "prospectus" in a_text or "rhp" in href.lower():
                prospectus_url = urljoin(self.BASE_URL, href)

        # 9. Highlights & Risks
        highlights: List[str] = []
        risks: List[str] = []
        for ul in soup.find_all("ul"):
            prev = ul.find_previous(["h2", "h3", "h4", "strong", "p"])
            if prev:
                prev_text = prev.get_text().lower()
                if "strength" in prev_text or "highlight" in prev_text:
                    highlights = [li.get_text(strip=True) for li in ul.find_all("li")]
                elif "risk" in prev_text or "concern" in prev_text:
                    risks = [li.get_text(strip=True) for li in ul.find_all("li")]

        # Determine Status
        status = self.determine_status(open_date, close_date, listing_date, listing_price_val)
        expected_listing = (price_max or price_min) + gmp_val

        return IPOData(
            id=slug,
            slug=slug,
            name=name,
            companyName=company_name,
            logoUrl=logo_url,
            category=category,
            status=status,
            exchange=exchange_formatted,
            priceBandMin=price_min,
            priceBandMax=price_max,
            issuePrice=issue_price,
            lotSize=lot_size,
            minInvestment=min_investment,
            issueSizeTotalCr=total_issue_size,
            freshIssueCr=fresh_issue,
            ofsCr=ofs,
            faceValue=face_value,
            gmp=gmp_val,
            gmpPercent=gmp_percent,
            expectedListingPrice=expected_listing,
            openDate=open_date,
            closeDate=close_date,
            allotmentDate=allotment_date,
            refundDate=refund_date,
            dematCreditDate=demat_credit_date,
            listingDate=listing_date,
            listingPrice=listing_price_val,
            listingGainPercent=listing_gain,
            registrarName=reg_name,
            registrarWebsite=reg_website,
            registrarCheckUrl=reg_website,
            registrarPhone=reg_phone,
            registrarEmail=reg_email,
            highlights=highlights[:5],
            risks=risks[:5],
            financials=financials_list if financials_list else None,
            lotSizes=lot_sizes_list if lot_sizes_list else None,
            drhpUrl=drhp_url,
            prospectusUrl=prospectus_url,
        )

    def scrape_all(self, limit_per_category: int = 15) -> List[IPOData]:
        """Scrapes both Mainboard and SME IPOs with details"""
        all_ipos: List[IPOData] = []
        
        for category in ["mainboard", "sme"]:
            items = self.discover_ipos(category=category) # type: ignore
            count = 0
            for item in items:
                if count >= limit_per_category:
                    break
                try:
                    logger.info(f"Scraping details for {category.upper()}: {item['name']}...")
                    detail = self.scrape_ipo_detail(item)
                    if detail:
                        all_ipos.append(detail)
                        count += 1
                except Exception as e:
                    logger.error(f"Error scraping detail for {item['name']}: {e}")
                    
        logger.info(f"Total Chittorgarh IPOs successfully scraped: {len(all_ipos)}")
        return all_ipos
