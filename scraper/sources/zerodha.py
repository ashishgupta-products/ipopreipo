import re
import logging
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, date

from ..config import DEFAULT_HEADERS, ZERODHA_IPO_URL, REQUEST_TIMEOUT
from ..models import (
    IPOData,
    IPOCategory,
    IPOStatus,
    SubscriptionDetail,
    LotSizeDetail,
    IssueObject,
    slugify,
    parse_number,
    parse_date_str,
)

logger = logging.getLogger("zerodha_scraper")

class ZerodhaScraper:
    def __init__(self, session: Optional[requests.Session] = None):
        self.session = session or requests.Session()
        self.session.headers.update(DEFAULT_HEADERS)

    def _parse_date_text(self, text: str) -> str:
        if not text:
            return ""
        
        # 1. Hidden ISO date inside span e.g. 2026-09-03
        iso_match = re.search(r"(\d{4}-\d{2}-\d{2})", text)
        if iso_match:
            return iso_match.group(1)
        
        # 2. Date like "03 Sep 2026" or "27 Aug 2026"
        d_match = re.search(r"(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})", text)
        if d_match:
            try:
                dt = datetime.strptime(f"{d_match.group(1)} {d_match.group(2)[:3]} {d_match.group(3)}", "%d %b %Y")
                return dt.strftime("%Y-%m-%d")
            except Exception:
                pass

        # 3. Use standard parser
        return parse_date_str(text)

    def _parse_price_range(self, price_str: str) -> tuple[int, int, Optional[int]]:
        """Parses price strings like '₹78 – ₹82', '₹408', '–', or '₹100'"""
        if not price_str or "–" == price_str.strip() or "-" == price_str.strip():
            return 0, 0, None
        
        cleaned = price_str.replace("₹", "").replace(",", "").strip()
        parts = [p.strip() for p in re.split(r"[–-]", cleaned) if p.strip()]
        
        nums = []
        for p in parts:
            try:
                num = int(float(p))
                nums.append(num)
            except ValueError:
                pass
        
        if len(nums) >= 2:
            return nums[0], nums[1], nums[1]
        elif len(nums) == 1:
            return nums[0], nums[0], nums[0]
        return 0, 0, None

    def fetch_ipo_detail(self, detail_url: str) -> Dict[str, Any]:
        """Fetches and parses an individual Zerodha IPO detail page."""
        if not detail_url:
            return {}
        if not detail_url.startswith("http"):
            detail_url = f"https://zerodha.com{detail_url}"
        
        try:
            resp = self.session.get(detail_url, timeout=REQUEST_TIMEOUT)
            if resp.status_code != 200:
                logger.warning(f"Failed to fetch detail {detail_url}: HTTP {resp.status_code}")
                return {}
            
            soup = BeautifulSoup(resp.text, "html.parser")
            data: Dict[str, Any] = {}

            # 1. Prospectus PDF Link
            pdf_link = soup.find(
                "a",
                href=lambda h: h and (".pdf" in h.lower() or "sebi.gov.in" in h.lower() or "prospectus" in h.lower() or "filings" in h.lower())
            )
            if pdf_link:
                data["prospectusUrl"] = pdf_link["href"]

            # 2. Lot size in header / quick details
            details_text = soup.get_text()
            lot_match = re.search(r"lot\s*size\s*[:\s]*(\d+)", details_text, re.IGNORECASE)
            if lot_match:
                data["lotSize"] = int(lot_match.group(1))

            # 3. Parse tables on detail page
            tables = soup.find_all("table")
            for t in tables:
                rows = t.find_all("tr")
                t_text = t.get_text().lower()

                # Schedule Table
                if "issue open date" in t_text or "allotment finalization" in t_text or "listing date" in t_text:
                    for r in rows:
                        cols = [c.get_text(strip=True) for c in r.find_all(["td", "th"])]
                        if len(cols) >= 2:
                            k, v = cols[0].lower(), cols[1]
                            parsed_date = self._parse_date_text(v)
                            if parsed_date:
                                if "issue open" in k:
                                    data["openDate"] = parsed_date
                                elif "issue close" in k:
                                    data["closeDate"] = parsed_date
                                elif "allotment" in k:
                                    data["allotmentDate"] = parsed_date
                                elif "refund" in k:
                                    data["refundDate"] = parsed_date
                                elif "share credit" in k or "demat" in k:
                                    data["dematCreditDate"] = parsed_date
                                elif "listing date" in k:
                                    data["listingDate"] = parsed_date

                # Issue Size Table
                elif "funds raised" in t_text or "fresh issue" in t_text or "total issue size" in t_text:
                    for r in rows:
                        cols = [c.get_text(strip=True) for c in r.find_all(["td", "th"])]
                        if len(cols) >= 2:
                            k, v = cols[0].lower(), parse_number(cols[1])
                            if "total issue" in k:
                                data["issueSizeTotalCr"] = v
                            elif "fresh issue" in k:
                                data["freshIssueCr"] = v
                            elif "offer for sale" in k:
                                data["ofsCr"] = v

                # Purpose / Objects of Issue Table
                elif "purpose" in t_text and ("inr" in t_text or "crore" in t_text or "%" in t_text):
                    objects: List[IssueObject] = []
                    for r in rows[1:]:
                        cols = [c.get_text(strip=True) for c in r.find_all(["td", "th"])]
                        if len(cols) >= 2:
                            purpose = cols[0]
                            amt_cr = parse_number(cols[1])
                            objects.append(IssueObject(purpose=purpose, amountCr=amt_cr if amt_cr > 0 else None))
                    if objects:
                        data["objectsOfIssue"] = objects

                # Live Subscription Breakdown Table
                elif "reserved" in t_text and "applied" in t_text and "subscription" in t_text:
                    subs: List[SubscriptionDetail] = []
                    for r in rows[1:]:
                        cols = [c.get_text(strip=True) for c in r.find_all(["td", "th"])]
                        if len(cols) >= 4:
                            cat_name = cols[0]
                            reserved = parse_number(cols[1])
                            applied = parse_number(cols[2])
                            times = parse_number(cols[3])
                            subs.append(SubscriptionDetail(
                                category=cat_name,
                                sharesOffered=reserved,
                                bidsReceived=applied,
                                subscriptionTimes=times
                            ))
                            cat_lower = cat_name.lower()
                            if "total" in cat_lower:
                                data["totalSubscription"] = times
                            elif "retail" in cat_lower:
                                data["retailSubscription"] = times
                            elif "qib" in cat_lower or "institutional" in cat_lower:
                                data["qibSubscription"] = times
                            elif "nii" in cat_lower:
                                data["niiSubscription"] = times
                    if subs:
                        data["subscriptionBreakdown"] = subs

            # 4. Extract Strengths, Risks, and Company Highlights
            for h in soup.find_all(["h2", "h3"]):
                h_title = h.get_text(strip=True).lower()
                if "about" in h_title:
                    p = h.find_next_sibling("p")
                    if p:
                        data["companyDescription"] = p.get_text(strip=True)
                elif "strength" in h_title:
                    ul = h.find_next_sibling("ul")
                    if ul:
                        data["highlights"] = [li.get_text(strip=True) for li in ul.find_all("li") if li.get_text(strip=True)]
                elif "risk" in h_title:
                    ul = h.find_next_sibling("ul")
                    if ul:
                        data["risks"] = [li.get_text(strip=True) for li in ul.find_all("li") if li.get_text(strip=True)]

            return data
        except Exception as e:
            logger.error(f"Error scraping detail page {detail_url}: {e}")
            return {}

    def scrape_all(self, limit_per_category: int = 50) -> List[IPOData]:
        """
        Scrapes all IPOs (Live, Upcoming, Closed) from Zerodha's IPO portal.
        Enriches each IPO with full details, schedules, issue sizes, subscriptions, strengths, and risks.
        """
        logger.info(f"Connecting to Zerodha IPO portal at {ZERODHA_IPO_URL}...")
        try:
            resp = self.session.get(ZERODHA_IPO_URL, timeout=REQUEST_TIMEOUT)
            if resp.status_code != 200:
                logger.error(f"Failed to fetch Zerodha IPO page: HTTP {resp.status_code}")
                return []
            
            soup = BeautifulSoup(resp.text, "html.parser")
        except Exception as e:
            logger.error(f"Network error fetching Zerodha: {e}")
            return []

        section_configs = [
            ("live-ipo", "live"),
            ("upcoming-ipo", "upcoming"),
            ("closed-ipo", "closed"),
        ]

        raw_ipos: List[Dict[str, Any]] = []

        for section_id, default_status in section_configs:
            sec = soup.find(id=section_id)
            if not sec:
                continue

            table = sec.find("table")
            if not table:
                continue

            tbody = table.find("tbody") or table
            rows = tbody.find_all("tr")
            logger.info(f"Found {len(rows)} IPOs in Zerodha '{section_id}' section")

            count = 0
            for r in rows:
                if count >= limit_per_category:
                    break

                # Extract Logo
                logo_td = r.find("td", class_="ipo-logo")
                logo_url = None
                if logo_td and logo_td.find("img"):
                    logo_url = logo_td.find("img").get("src")

                # Extract Name, Symbol, Type, Detail Link
                name_td = r.find("td", class_="name")
                if not name_td:
                    continue

                link_tag = name_td.find("a")
                detail_href = link_tag.get("href") if link_tag else None

                symbol_span = name_td.find("span", class_="ipo-symbol")
                symbol = ""
                if symbol_span:
                    # Take text before child tags like <span class="ipo-type">
                    symbol = symbol_span.contents[0].strip() if symbol_span.contents else symbol_span.get_text(strip=True)

                type_span = name_td.find("span", class_="ipo-type")
                raw_type = type_span.get_text(strip=True).lower() if type_span else "mainboard"
                category: IPOCategory = "sme" if "sme" in raw_type else "mainboard"

                name_span = name_td.find("span", class_="ipo-name")
                company_name = name_span.get_text(strip=True) if name_span else (link_tag.get_text(strip=True) if link_tag else symbol)
                if not company_name:
                    continue

                # Extract Dates from row
                date_tds = r.find_all("td", class_="date")
                ipo_dates_str = date_tds[0].get_text(" ", strip=True) if len(date_tds) > 0 else ""
                listing_date_str = date_tds[1].get_text(" ", strip=True) if len(date_tds) > 1 else ""

                # Extract Price Range
                price_td = r.find("td", class_="text-right")
                price_str = price_td.get_text(strip=True) if price_td else ""
                p_min, p_max, issue_p = self._parse_price_range(price_str)

                # Determine dates
                open_date = ""
                close_date = ""
                if ipo_dates_str:
                    # e.g. "2026-09-03 27th – 31st Aug 2026" or "28th Aug 2026 – 01st Sep 2026"
                    iso_matches = re.findall(r"\d{4}-\d{2}-\d{2}", ipo_dates_str)
                    if len(iso_matches) >= 2:
                        open_date, close_date = iso_matches[0], iso_matches[1]
                    elif len(iso_matches) == 1:
                        close_date = iso_matches[0]

                listing_date = self._parse_date_text(listing_date_str)

                # Slug & ID
                clean_name = re.sub(r"\s+IPO$", "", company_name, flags=re.IGNORECASE).strip()
                slug = slugify(clean_name)
                ipo_id = slug

                # Determine accurate status
                status: IPOStatus = default_status
                today_str = date.today().strftime("%Y-%m-%d")
                if listing_date and listing_date <= today_str:
                    status = "listed"

                raw_ipos.append({
                    "id": ipo_id,
                    "slug": slug,
                    "name": clean_name,
                    "companyName": company_name,
                    "logoUrl": logo_url,
                    "category": category,
                    "status": status,
                    "exchange": "BSE & NSE" if category == "mainboard" else "NSE Emerge",
                    "priceBandMin": p_min,
                    "priceBandMax": p_max,
                    "issuePrice": issue_p,
                    "openDate": open_date,
                    "closeDate": close_date,
                    "listingDate": listing_date,
                    "detailHref": detail_href,
                    "symbol": symbol,
                })
                count += 1

        logger.info(f"Extracted {len(raw_ipos)} base IPO records from Zerodha list. Now enriching details concurrently...")

        # Concurrently enrich details for all IPOs
        enriched_ipos: List[IPOData] = []
        with ThreadPoolExecutor(max_workers=8) as executor:
            future_to_ipo = {
                executor.submit(self.fetch_ipo_detail, item["detailHref"]): item
                for item in raw_ipos
            }

            for future in as_completed(future_to_ipo):
                base_item = future_to_ipo[future]
                try:
                    detail_data = future.result()
                except Exception as e:
                    logger.warning(f"Error fetching detail for {base_item['name']}: {e}")
                    detail_data = {}

                # Merge detail data into IPOData
                lot_size = detail_data.get("lotSize", 1)
                p_max = base_item["priceBandMax"]
                min_investment = lot_size * (p_max if p_max > 0 else base_item["priceBandMin"])

                # Lot size detail item
                lot_sizes = [
                    LotSizeDetail(
                        applicationCategory="Retail (Min)",
                        lots=1,
                        shares=lot_size,
                        amount=min_investment
                    )
                ] if lot_size > 1 and min_investment > 0 else None

                # Dates hierarchy: prefer detail page if found
                open_date = detail_data.get("openDate") or base_item["openDate"]
                close_date = detail_data.get("closeDate") or base_item["closeDate"]
                listing_date = detail_data.get("listingDate") or base_item["listingDate"]
                allotment_date = detail_data.get("allotmentDate", "")
                refund_date = detail_data.get("refundDate", "")
                demat_credit_date = detail_data.get("dematCreditDate", "")

                status = base_item["status"]
                today_str = date.today().strftime("%Y-%m-%d")
                if listing_date and listing_date <= today_str:
                    status = "listed"
                elif allotment_date and allotment_date <= today_str:
                    status = "allotment_out"

                highlights = detail_data.get("highlights", [])
                if not highlights and detail_data.get("companyDescription"):
                    highlights = [detail_data["companyDescription"]]

                ipo = IPOData(
                    id=base_item["id"],
                    slug=base_item["slug"],
                    name=base_item["name"],
                    companyName=base_item["companyName"],
                    logoUrl=base_item["logoUrl"],
                    category=base_item["category"],
                    status=status,
                    exchange=base_item["exchange"],
                    priceBandMin=base_item["priceBandMin"],
                    priceBandMax=base_item["priceBandMax"],
                    issuePrice=base_item["issuePrice"],
                    lotSize=lot_size,
                    minInvestment=min_investment,
                    issueSizeTotalCr=detail_data.get("issueSizeTotalCr", 0.0),
                    freshIssueCr=detail_data.get("freshIssueCr", 0.0),
                    ofsCr=detail_data.get("ofsCr", 0.0),
                    openDate=open_date,
                    closeDate=close_date,
                    allotmentDate=allotment_date,
                    refundDate=refund_date,
                    dematCreditDate=demat_credit_date,
                    listingDate=listing_date,
                    totalSubscription=detail_data.get("totalSubscription", 0.0),
                    qibSubscription=detail_data.get("qibSubscription", 0.0),
                    niiSubscription=detail_data.get("niiSubscription", 0.0),
                    retailSubscription=detail_data.get("retailSubscription", 0.0),
                    highlights=highlights,
                    risks=detail_data.get("risks", []),
                    objectsOfIssue=detail_data.get("objectsOfIssue"),
                    subscriptionBreakdown=detail_data.get("subscriptionBreakdown"),
                    lotSizes=lot_sizes,
                    prospectusUrl=detail_data.get("prospectusUrl"),
                    leadManagers=[],
                )
                enriched_ipos.append(ipo)

        # Sort IPOs: Live first, then Upcoming, then Closed/Listed
        status_order = {"live": 0, "upcoming": 1, "allotment_out": 2, "closed": 3, "listed": 4}
        enriched_ipos.sort(key=lambda x: (status_order.get(x.status, 5), x.openDate or "9999", x.name))

        logger.info(f"Successfully scraped and enriched {len(enriched_ipos)} IPOs exclusively from Zerodha!")
        return enriched_ipos
