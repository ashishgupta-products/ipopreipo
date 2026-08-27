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
    IssueObject,
    IPOKpiDetail,
    SubscriptionDetail,
    PeerComparisonDetail,
    BrokerReviewSummary,
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

        # Find dedicated IPO company logo image
        img_tag = (
            soup.find("img", alt=lambda x: x and "ipo logo" in x.lower())
            or soup.find("img", title=lambda x: x and "ipo logo" in x.lower())
            or soup.find("img", class_=re.compile(r"img-thumbnail|company-logo", re.I))
        )
        if img_tag and img_tag.get("src"):
            src = img_tag["src"]
            if "chittorgarh-logo" not in src and not any(b in src.lower() for b in ["zerodha", "angel", "prostocks", "fyers", "upstox", "kotak", "paytm", "broker"]):
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

        # 4. Dates & Timetable Extraction (from ul.top-ratios & kv_pairs)
        timetable_dict: Dict[str, str] = {}
        for li in soup.find_all("li"):
            text = li.get_text(" ", strip=True).lower()
            if any(k in text for k in ["open", "close", "allotment", "refund", "credit", "listing"]):
                spans = li.find_all("span")
                if len(spans) >= 2:
                    k = spans[0].get_text(" ", strip=True).lower()
                    v = spans[1].get_text(" ", strip=True)
                    timetable_dict[k] = v

        raw_date_range = kv_pairs.get("ipo date", kv_pairs.get("issue date", ""))
        open_date, close_date = parse_date_range(raw_date_range)
        if not open_date:
            open_date = parse_date_str(timetable_dict.get("ipo open", timetable_dict.get("ipo open date", kv_pairs.get("ipo open date", kv_pairs.get("open date", "")))))
        if not close_date:
            close_date = parse_date_str(timetable_dict.get("ipo close", timetable_dict.get("ipo close date", kv_pairs.get("ipo close date", kv_pairs.get("close date", "")))))

        allotment_date = parse_date_str(timetable_dict.get("allotment", timetable_dict.get("tentative allotment", kv_pairs.get("basis of allotment", kv_pairs.get("allotment date", "")))))
        refund_date = parse_date_str(timetable_dict.get("refund", timetable_dict.get("initiation of refunds", kv_pairs.get("initiation of refunds", kv_pairs.get("refund date", "")))))
        demat_credit_date = parse_date_str(timetable_dict.get("credit of shares", timetable_dict.get("credit of shares to demat", kv_pairs.get("credit of shares to demat", kv_pairs.get("demat transfer", "")))))
        
        raw_listing_date = timetable_dict.get("listing", timetable_dict.get("tentative listing date", kv_pairs.get("listing date", ""))).replace(" T", "").strip()
        listing_date = parse_date_str(raw_listing_date)

        listing_price_val = int(parse_number(kv_pairs.get("listing price", kv_pairs.get("final issue price", "")))) or None
        listing_gain = parse_number(kv_pairs.get("listing gain", "")) or None

        # 5. Extract GMP if present in text/review
        gmp_val = 0
        gmp_percent = 0.0
        gmp_match = re.search(r'GMP\s*[:\-\u2013]?\s*₹?\s*(\d+)', soup.get_text(), re.IGNORECASE)
        if gmp_match:
            gmp_val = int(gmp_match.group(1))
            if price_max > 0:
                gmp_percent = round((gmp_val / price_max) * 100, 2)

        # 6. Registrar & Contact Info
        reg_name = "Check Website"
        reg_tag = soup.find("a", class_="registrar-name") or soup.find(lambda t: t.name in ["h2", "h3", "h4"] and "registrar" in t.get_text().lower())
        if reg_tag:
            if reg_tag.name == "a":
                reg_name = reg_tag.get_text(strip=True)
            else:
                p_next = reg_tag.find_next(["p", "a", "div"])
                if p_next:
                    reg_name = p_next.get_text(strip=True).split("\n")[0].strip()
        if reg_name == "Check Website":
            reg_name = kv_pairs.get("registrar", kv_pairs.get("registrar name", "Check Website"))

        # Map known registrar allotment portals & contact
        reg_website = ""
        reg_check_url = ""
        reg_lower = reg_name.lower()
        if "link" in reg_lower or "mufg" in reg_lower or "intime" in reg_lower:
            reg_website = "https://linkintime.co.in"
            reg_check_url = "https://linkintime.co.in/initial_offer/public-issues.html"
        elif "kfin" in reg_lower:
            reg_website = "https://kfintech.com"
            reg_check_url = "https://ris.kfintech.com/ipostatus/"
        elif "bigshare" in reg_lower:
            reg_website = "https://bigshareonline.com"
            reg_check_url = "https://www.bigshareonline.com/ipo_Allotment.html"
        elif "skyline" in reg_lower:
            reg_website = "https://www.skylinerta.com"
            reg_check_url = "https://www.skylinerta.com/ipo.php"
        elif "cameo" in reg_lower:
            reg_website = "https://cameoindia.com"
            reg_check_url = "https://ipo.cameoindia.com/"
        elif "purva" in reg_lower:
            reg_website = "https://purvashare.com"
            reg_check_url = "https://www.purvashare.com/queries/"
        elif "maashitla" in reg_lower:
            reg_website = "https://maashitla.com"
            reg_check_url = "https://maashitla.com/allotment-status/"

        reg_phone = kv_pairs.get("phone", None)
        reg_email = kv_pairs.get("email", None)

        # 7. Lead Managers
        lead_managers: List[str] = []
        lm_tag = soup.find(lambda t: t.name in ["h2", "h3", "h4"] and "lead manager" in t.get_text().lower())
        if lm_tag:
            ol = lm_tag.find_next(["ol", "ul"])
            if ol:
                lead_managers = [
                    li.get_text(strip=True) 
                    for li in ol.find_all("li") 
                    if li.get_text(strip=True) and "summary" not in li.get_text(strip=True).lower() and "tracker" not in li.get_text(strip=True).lower()
                ]

        # 8. Financials, KPIs, Valuations & Tables Extraction
        financials_list: List[FinancialMetric] = []
        lot_sizes_list: List[LotSizeDetail] = []
        reservations_list: List[IPOReservation] = []
        subscription_breakdown_list: List[SubscriptionDetail] = []
        peer_comparison_list: List[PeerComparisonDetail] = []
        objects_of_issue_list: List[IssueObject] = []
        kpis_obj: Optional[IPOKpiDetail] = None

        total_sub = 0.0
        qib_sub = 0.0
        nii_sub = 0.0
        retail_sub = 0.0

        for table in soup.find_all("table"):
            table_text = table.get_text().lower()
            
            # 8A. Financials Table
            if "period ended" in table_text and ("assets" in table_text or "revenue" in table_text or "total income" in table_text or "profit after tax" in table_text):
                rows = table.find_all("tr")
                if len(rows) > 1:
                    header_cols = [c.get_text(strip=True) for c in rows[0].find_all(["th", "td"])]
                    periods = header_cols[1:]
                    
                    data_dict: Dict[str, List[str]] = {}
                    for r in rows[1:]:
                        tds = [td.get_text(strip=True) for td in r.find_all(["td", "th"])]
                        if len(tds) > 1:
                            metric_name = tds[0].lower()
                            data_dict[metric_name] = tds[1:]

                    for idx, period in enumerate(periods):
                        if not period or idx >= len(periods) or "amount" in period.lower() or "standalone" in period.lower():
                            continue
                        
                        rev = pat = nw = 0.0
                        assets_val = reserves_val = debt_val = None

                        for k, vals in data_dict.items():
                            if idx < len(vals):
                                num_val = parse_number(vals[idx])
                                if "revenue" in k or "total income" in k:
                                    rev = num_val
                                elif "profit after tax" in k or "pat" in k or "net profit" in k:
                                    pat = num_val
                                elif "net worth" in k or "networth" in k or "shareholders" in k:
                                    nw = num_val
                                elif "asset" in k:
                                    assets_val = num_val
                                elif "reserve" in k:
                                    reserves_val = num_val
                                elif "borrowing" in k or "debt" in k:
                                    debt_val = num_val

                        if period not in [f.year for f in financials_list]:
                            financials_list.append(FinancialMetric(
                                year=period,
                                revenue=rev,
                                pat=pat,
                                netWorth=nw,
                                assets=assets_val,
                                reserves=reserves_val,
                                borrowing=debt_val,
                            ))

            # 8B. Lot Size Table
            if "application" in table_text and ("lots" in table_text or "shares" in table_text) and "amount" in table_text:
                for tr in table.find_all("tr")[1:]:
                    tds = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                    if len(tds) >= 4:
                        lot_sizes_list.append(LotSizeDetail(
                            applicationCategory=tds[0],
                            lots=int(parse_number(tds[1])) or 1,
                            shares=int(parse_number(tds[2])) or lot_size,
                            amount=int(parse_number(tds[3])),
                        ))

            # 8C. Reservations Table
            if "investor category" in table_text and "shares offered" in table_text:
                for tr in table.find_all("tr")[1:]:
                    tds = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                    if len(tds) >= 3 and tds[0]:
                        cat_clean = tds[0].replace("\u2212", "-").replace("−", "-").strip()
                        reservations_list.append(IPOReservation(
                            category=cat_clean,
                            sharesOffered=tds[1],
                            percentage=tds[2] if len(tds) > 2 else "",
                            amountCr=tds[3] if len(tds) > 3 else ""
                        ))

            # 8D. Subscription Details Table
            if "subscription" in table_text and ("qib" in table_text or "retail" in table_text or "total" in table_text):
                for tr in table.find_all("tr")[1:]:
                    tds = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                    if len(tds) >= 2:
                        cat_name = tds[0].strip()
                        sub_times = parse_number(tds[1])
                        if "total" in cat_name.lower():
                            total_sub = sub_times
                        elif "qib" in cat_name.lower():
                            qib_sub = sub_times
                        elif "nii" in cat_name.lower() or "hni" in cat_name.lower():
                            nii_sub = sub_times
                        elif "retail" in cat_name.lower():
                            retail_sub = sub_times
                        
                        if cat_name:
                            subscription_breakdown_list.append(SubscriptionDetail(
                                category=cat_name,
                                subscriptionTimes=sub_times,
                                sharesOffered=parse_number(tds[2]) if len(tds) > 2 else 0.0,
                                bidsReceived=parse_number(tds[3]) if len(tds) > 3 else 0.0,
                            ))

            # 8E. KPI Table
            if ("roe" in table_text or "roce" in table_text or "debt/equity" in table_text or "pat margin" in table_text) and "expense" not in table_text and "valuation metric" not in table_text:
                kpi_map: Dict[str, str] = {}
                for tr in table.find_all("tr"):
                    tds = [c.get_text(strip=True) for c in tr.find_all(["th", "td"])]
                    if len(tds) == 2:
                        kpi_map[tds[0].lower()] = tds[1]
                
                if kpi_map:
                    if not kpis_obj:
                        kpis_obj = IPOKpiDetail()
                    if "roe" in kpi_map: kpis_obj.roe = kpi_map.get("roe")
                    if "roce" in kpi_map: kpis_obj.roce = kpi_map.get("roce")
                    if "ronw" in kpi_map: kpis_obj.ronw = kpi_map.get("ronw")
                    if "debt/equity" in kpi_map or "debt to equity" in kpi_map:
                        kpis_obj.debtEquity = kpi_map.get("debt/equity", kpi_map.get("debt to equity"))
                    if "pat margin" in kpi_map: kpis_obj.patMargin = kpi_map.get("pat margin")
                    if "ebitda margin" in kpi_map: kpis_obj.ebitdaMargin = kpi_map.get("ebitda margin")
                    if "nav" in kpi_map: kpis_obj.nav = kpi_map.get("nav")
                    if "price to book value" in kpi_map or "p/bv" in kpi_map:
                        kpis_obj.priceToBookValue = kpi_map.get("price to book value", kpi_map.get("p/bv"))
                    if "eps (rs)" in kpi_map and not kpis_obj.preIpoEps:
                        kpis_obj.preIpoEps = kpi_map.get("eps (rs)")
                    if "p/e (x)" in kpi_map and not kpis_obj.preIpoPe:
                        kpis_obj.preIpoPe = kpi_map.get("p/e (x)")

            # 8F. Valuation Metrics Table (Pre IPO vs Post IPO)
            if "valuation metric" in table_text and ("pre ipo" in table_text or "post ipo" in table_text):
                for tr in table.find_all("tr"):
                    tds = [c.get_text(strip=True) for c in tr.find_all(["td", "th"])]
                    if len(tds) >= 3:
                        lbl = tds[0].lower()
                        pre_val = tds[1]
                        post_val = tds[2]
                        if not kpis_obj:
                            kpis_obj = IPOKpiDetail()
                        if "eps" in lbl:
                            kpis_obj.preIpoEps = pre_val
                            kpis_obj.postIpoEps = post_val
                        elif "p/e" in lbl or "pe" in lbl:
                            kpis_obj.preIpoPe = pre_val
                            kpis_obj.postIpoPe = post_val
                        elif "market cap" in lbl:
                            kpis_obj.marketCapUpperBand = post_val

            # 8G. Objects of the Issue Table
            if "issue objects" in table_text or "objects of the issue" in table_text or "object of the issue" in table_text:
                for tr in table.find_all("tr")[1:]:
                    tds = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                    if len(tds) >= 2:
                        purpose = tds[1] if len(tds) >= 3 else tds[0]
                        amt_str = tds[2] if len(tds) >= 3 else (tds[1] if len(tds) == 2 else "")
                        amt = parse_number(amt_str) if amt_str else None
                        if purpose and len(purpose) > 3 and not purpose.isdigit() and "total" not in purpose.lower():
                            objects_of_issue_list.append(IssueObject(
                                purpose=purpose,
                                amountCr=amt if amt and amt > 0 else None
                            ))

            # 8H. Peer Comparison Table
            if "pe ratio" in table_text and ("company" in table_text or "listing day" in table_text or "issue price" in table_text):
                for tr in table.find_all("tr")[1:]:
                    tds = [c.get_text(strip=True) for c in tr.find_all(["th", "td"])]
                    if len(tds) >= 4 and tds[0]:
                        peer_comparison_list.append(PeerComparisonDetail(
                            companyName=tds[0],
                            faceValue=10.0,
                            peRatio=parse_number(tds[4]) if len(tds) > 4 else parse_number(tds[3]),
                            ronw=None,
                            eps=None
                        ))

        # 8I. Broker & Member Recommendations Table
        broker_reviews: Optional[BrokerReviewSummary] = None
        member_reviews: Optional[BrokerReviewSummary] = None
        for table in soup.find_all("table"):
            table_text = table.get_text(" ", strip=True).lower()
            if "review by" in table_text and ("subscribe" in table_text or "apply" in table_text) and "avoid" in table_text:
                for tr in table.find_all("tr"):
                    tds = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
                    if len(tds) >= 5:
                        row_lbl = tds[0].lower()
                        if "broker" in row_lbl:
                            sub_c = int(parse_number(tds[1]))
                            may_c = int(parse_number(tds[2]))
                            neu_c = int(parse_number(tds[3]))
                            avo_c = int(parse_number(tds[4]))
                            broker_reviews = BrokerReviewSummary(
                                subscribe=sub_c,
                                mayApply=may_c,
                                neutral=neu_c,
                                avoid=avo_c
                            )
                        elif "member" in row_lbl:
                            sub_c = int(parse_number(tds[1]))
                            may_c = int(parse_number(tds[2]))
                            neu_c = int(parse_number(tds[3]))
                            avo_c = int(parse_number(tds[4]))
                            member_reviews = BrokerReviewSummary(
                                subscribe=sub_c,
                                mayApply=may_c,
                                neutral=neu_c,
                                avoid=avo_c
                            )

        # Auto-compute YoY growth and RoNW for financials
        for idx in range(len(financials_list)):
            if idx + 1 < len(financials_list):
                prior = financials_list[idx + 1]
                if prior.revenue > 0:
                    diff_rev = financials_list[idx].revenue - prior.revenue
                    financials_list[idx].revenueGrowthYoY = round((diff_rev / prior.revenue) * 100, 2)
                if prior.pat != 0:
                    diff_pat = financials_list[idx].pat - prior.pat
                    financials_list[idx].patGrowthYoY = round((diff_pat / abs(prior.pat)) * 100, 2)
            if financials_list[idx].netWorth > 0 and financials_list[idx].pat != 0 and financials_list[idx].ronw is None:
                financials_list[idx].ronw = round((financials_list[idx].pat / financials_list[idx].netWorth) * 100, 2)

        # 9. DRHP / Prospectus Links
        drhp_url = None
        prospectus_url = None
        for a in soup.find_all("a", href=True):
            href = a["href"]
            a_text = a.get_text().lower()
            if "drhp" in a_text or "drhp" in href.lower():
                drhp_url = urljoin(self.BASE_URL, href)
            elif "rhp" in a_text or "prospectus" in a_text or "rhp" in href.lower():
                prospectus_url = urljoin(self.BASE_URL, href)

        # 10. Highlights & Risks
        highlights: List[str] = []
        risks: List[str] = []
        for ul in soup.find_all("ul"):
            prev = ul.find_previous(["h2", "h3", "h4", "strong", "p"])
            if prev:
                prev_text = prev.get_text().lower()
                if "strength" in prev_text or "highlight" in prev_text or "object" in prev_text:
                    items = [li.get_text(strip=True) for li in ul.find_all("li") if len(li.get_text(strip=True)) > 5]
                    if items:
                        highlights.extend(items)
                elif "risk" in prev_text or "concern" in prev_text:
                    items = [li.get_text(strip=True) for li in ul.find_all("li") if len(li.get_text(strip=True)) > 5]
                    if items:
                        risks.extend(items)

        # 11. Compute Dynamic Composite Review Score (0-100) & Analyst Rating
        base_score = 65
        
        # GMP Factor (-20 to +20)
        if gmp_percent >= 50:
            base_score += 18
        elif gmp_percent >= 25:
            base_score += 12
        elif gmp_percent >= 10:
            base_score += 6
        elif gmp_percent < 0:
            base_score -= 15
            
        # Subscription Demand Factor (0 to +10)
        if total_sub >= 20:
            base_score += 10
        elif total_sub >= 5:
            base_score += 5
        elif total_sub >= 2:
            base_score += 2
            
        # Financial Performance Factor (-10 to +15)
        if financials_list and len(financials_list) > 0:
            latest_fin = financials_list[0]
            if latest_fin.patGrowthYoY and latest_fin.patGrowthYoY > 25:
                base_score += 6
            elif latest_fin.patGrowthYoY and latest_fin.patGrowthYoY < 0:
                base_score -= 6
                
            if latest_fin.revenueGrowthYoY and latest_fin.revenueGrowthYoY > 20:
                base_score += 5
            elif latest_fin.revenueGrowthYoY and latest_fin.revenueGrowthYoY < 0:
                base_score -= 4
                
            if latest_fin.ronw and latest_fin.ronw > 18:
                base_score += 4

        # Broker Recommendations Sentiment
        if broker_reviews and (broker_reviews.subscribe + broker_reviews.avoid + broker_reviews.mayApply) > 0:
            tot_b = broker_reviews.subscribe + broker_reviews.mayApply + broker_reviews.neutral + broker_reviews.avoid
            pos_ratio = (broker_reviews.subscribe + broker_reviews.mayApply * 0.5) / tot_b
            base_score += int((pos_ratio - 0.5) * 15)

        review_score = max(25, min(96, base_score))
        
        # Determine Recommendation & Rating
        if review_score >= 80:
            recommendation = "Apply for Long Term" if (financials_list and financials_list[0].pat > 0) else "Apply for Listing Gain"
            rating = round(4.0 + (review_score - 80) * 0.05, 1)
        elif review_score >= 68:
            recommendation = "Apply for Listing Gain" if gmp_percent > 15 else "May Apply"
            rating = round(3.5 + (review_score - 68) * 0.04, 1)
        elif review_score >= 55:
            recommendation = "May Apply"
            rating = round(3.0 + (review_score - 55) * 0.03, 1)
        elif review_score >= 45:
            recommendation = "Neutral"
            rating = round(2.5 + (review_score - 45) * 0.05, 1)
        else:
            recommendation = "Avoid"
            rating = round(1.5 + (review_score - 25) * 0.05, 1)
            
        rating = max(1.0, min(5.0, rating))

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
            totalSubscription=total_sub,
            qibSubscription=qib_sub,
            niiSubscription=nii_sub,
            retailSubscription=retail_sub,
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
            registrarCheckUrl=reg_check_url or reg_website,
            registrarPhone=reg_phone,
            registrarEmail=reg_email,
            leadManagers=lead_managers,
            recommendation=recommendation,
            rating=rating,
            reviewScore=review_score,
            brokerReviews=broker_reviews,
            memberReviews=member_reviews,
            highlights=highlights[:5],
            risks=risks[:5],
            financials=financials_list if financials_list else None,
            lotSizes=lot_sizes_list if lot_sizes_list else None,
            subscriptionBreakdown=subscription_breakdown_list if subscription_breakdown_list else None,
            peerComparison=peer_comparison_list if peer_comparison_list else None,
            reservations=reservations_list if reservations_list else None,
            kpis=kpis_obj,
            objectsOfIssue=objects_of_issue_list if objects_of_issue_list else None,
            drhpUrl=drhp_url,
            prospectusUrl=prospectus_url,
        )

    def enrich_performance_tracker(self, ipos: List[IPOData]) -> List[IPOData]:
        """Fetches listing gains and market performance from Chittorgarh Perf Tracker"""
        url = f"{self.BASE_URL}/ipo/ipo_perf_tracker.asp"
        logger.info(f"Enriching performance data from {url}...")
        soup = self.fetch_page(url)
        if not soup:
            return ipos

        tables = soup.find_all("table")
        if len(tables) > 1:
            t = tables[1]
            perf_map: Dict[str, float] = {}
            for row in t.find_all("tr")[1:]:
                cols = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
                if len(cols) >= 2:
                    c_name = re.sub(r"\s+(?:Ltd\.?|Limited)$", "", cols[0], flags=re.IGNORECASE).strip()
                    c_slug = slugify(c_name)
                    listing_gain = parse_number(cols[1])
                    perf_map[c_slug] = listing_gain

            for ipo in ipos:
                if ipo.listingGainPercent is None or ipo.listingGainPercent == 0:
                    clean_slug = ipo.slug.replace("-ltd", "").replace("-limited", "")
                    for p_slug, gain in perf_map.items():
                        if clean_slug in p_slug or p_slug in clean_slug:
                            ipo.listingGainPercent = gain
                            break
        return ipos

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
                    
        # Enrich performance metrics
        all_ipos = self.enrich_performance_tracker(all_ipos)

        logger.info(f"Total Chittorgarh IPOs successfully scraped: {len(all_ipos)}")
        return all_ipos
