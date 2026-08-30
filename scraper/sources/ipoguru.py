import re
import logging
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

from ..config import DEFAULT_HEADERS, REQUEST_TIMEOUT
from ..models import (
    FinancialMetric,
    LotSizeDetail,
    IPOReservation,
    IPOKpiDetail,
    GMPTrend,
    IssueObject,
    slugify,
    parse_number,
)

logger = logging.getLogger("ipoguru_scraper")
IPOGURU_GMP_URL = "https://www.ipoguru.in/ipo-gmp"

class IPOGuruScraper:
    def __init__(self, session: Optional[requests.Session] = None):
        self.session = session or requests.Session()
        self.session.headers.update(DEFAULT_HEADERS)

    def _clean_company_name(self, raw_name: str) -> str:
        name = re.sub(r"(Mainboard|SME).*$", "", raw_name, flags=re.IGNORECASE).strip()
        name = re.sub(r"\s+IPO$", "", name, flags=re.IGNORECASE).strip()
        return name

    def fetch_ipo_detail(self, detail_url: str) -> Dict[str, Any]:
        """Fetches 3-year Financials, KPIs, Lot Sizes, and Reservations from IPOGuru."""
        if not detail_url:
            return {}
        if not detail_url.startswith("http"):
            detail_url = f"https://www.ipoguru.in{detail_url}"

        try:
            resp = self.session.get(detail_url, timeout=REQUEST_TIMEOUT)
            if resp.status_code != 200:
                return {}

            soup = BeautifulSoup(resp.text, "html.parser")
            data: Dict[str, Any] = {}

            # 1. Parse Financials Table (3 Years)
            for t in soup.find_all("table"):
                t_text = t.get_text().lower()
                if "metric" in t_text and ("assets" in t_text or "total income" in t_text or "profit" in t_text):
                    rows = t.find_all("tr")
                    if rows:
                        headers_row = [c.get_text(strip=True) for c in rows[0].find_all(["th", "td"])]
                        years = headers_row[1:]

                        fin_by_year: Dict[str, Dict[str, float]] = {y: {} for y in years}
                        for r in rows[1:]:
                            cols = [c.get_text(strip=True) for c in r.find_all(["th", "td"])]
                            if len(cols) >= len(headers_row):
                                m_name = cols[0].lower()
                                for idx, y in enumerate(years):
                                    val = parse_number(cols[idx + 1])
                                    if "asset" in m_name:
                                        fin_by_year[y]["assets"] = val
                                    elif "income" in m_name or "revenue" in m_name:
                                        fin_by_year[y]["revenue"] = val
                                    elif "profit" in m_name or "pat" in m_name:
                                        fin_by_year[y]["pat"] = val
                                    elif "ebitda" in m_name:
                                        fin_by_year[y]["ebitda"] = val
                                    elif "net worth" in m_name:
                                        fin_by_year[y]["netWorth"] = val
                                    elif "reserve" in m_name:
                                        fin_by_year[y]["reserves"] = val
                                    elif "borrowing" in m_name or "debt" in m_name:
                                        fin_by_year[y]["borrowing"] = val

                        financials: List[FinancialMetric] = []
                        for y, d in fin_by_year.items():
                            if d.get("revenue", 0.0) > 0 or d.get("pat", 0.0) != 0 or d.get("assets", 0.0) > 0:
                                financials.append(FinancialMetric(
                                    year=y,
                                    revenue=d.get("revenue", 0.0),
                                    pat=d.get("pat", 0.0),
                                    netWorth=d.get("netWorth", 0.0),
                                    assets=d.get("assets"),
                                    reserves=d.get("reserves"),
                                    borrowing=d.get("borrowing"),
                                    ebitda=d.get("ebitda"),
                                ))
                        if financials:
                            data["financials"] = financials
                        break

            # 2. Parse KPIs
            for h in soup.find_all(["h2", "h3", "h4"]):
                if "kpi" in h.get_text().lower() or "performance" in h.get_text().lower():
                    parent = h.find_parent("div") or soup
                    text = parent.get_text()
                    pe_m = re.search(r"Pe\s*[:\s]*([\d\.]+)", text, re.I)
                    eps_m = re.search(r"Eps\s*[:\s]*([\d\.]+)", text, re.I)
                    roce_m = re.search(r"Roce\s*[:\s]*([\d\.]+)%?", text, re.I)
                    ronw_m = re.search(r"Ronw\s*[:\s]*([\d\.]+)%?", text, re.I)
                    patm_m = re.search(r"Pat\s*margin\s*[:\s]*([\d\.]+)%?", text, re.I)

                    kpis = IPOKpiDetail()
                    if pe_m: kpis.postIpoPe = pe_m.group(1)
                    if eps_m: kpis.postIpoEps = eps_m.group(1)
                    if roce_m: kpis.roce = f"{roce_m.group(1)}%"
                    if ronw_m: kpis.ronw = f"{ronw_m.group(1)}%"
                    if patm_m: kpis.patMargin = f"{patm_m.group(1)}%"
                    data["kpis"] = kpis
                    break

            # 3. Parse Lot Sizes
            for t in soup.find_all("table"):
                t_text = t.get_text().lower()
                if "application" in t_text and "lots" in t_text and "shares" in t_text:
                    lot_list: List[LotSizeDetail] = []
                    for r in t.find_all("tr")[1:]:
                        cols = [c.get_text(strip=True) for c in r.find_all(["th", "td"])]
                        if len(cols) >= 4:
                            cat = cols[0]
                            lots = int(parse_number(cols[1]))
                            shares = int(parse_number(cols[2]))
                            amt = int(parse_number(cols[3]))
                            lot_list.append(LotSizeDetail(
                                applicationCategory=cat,
                                lots=lots,
                                shares=shares,
                                amount=amt,
                            ))
                    if lot_list:
                        data["lotSizes"] = lot_list
                    break

            # 4. Parse Reservations
            for t in soup.find_all("table"):
                t_text = t.get_text().lower()
                if "investor category" in t_text and "reservation" in t_text:
                    reservations: List[IPOReservation] = []
                    for r in t.find_all("tr")[1:]:
                        cols = [c.get_text(strip=True) for c in r.find_all(["th", "td"])]
                        if len(cols) >= 2:
                            reservations.append(IPOReservation(
                                category=cols[0],
                                percentage=cols[1],
                            ))
                    if reservations:
                        data["reservations"] = reservations
                    break

            return data
        except Exception as e:
            logger.warning(f"Error fetching IPOGuru detail {detail_url}: {e}")
            return {}

    def fetch_gmp_trends(self, trend_url: str) -> List[GMPTrend]:
        """Fetches historical day-by-day GMP trend log from IPOGuru."""
        if not trend_url:
            return []
        if not trend_url.startswith("http"):
            trend_url = f"https://www.ipoguru.in{trend_url}"

        try:
            resp = self.session.get(trend_url, timeout=REQUEST_TIMEOUT)
            if resp.status_code != 200:
                return []

            soup = BeautifulSoup(resp.text, "html.parser")
            trends: List[GMPTrend] = []

            for t in soup.find_all("table"):
                t_text = t.get_text().lower()
                if "date" in t_text and "gmp" in t_text and ("sub" in t_text or "kostak" in t_text or "%" in t_text):
                    for r in t.find_all("tr")[1:10]:
                        cols = [c.get_text(strip=True) for c in r.find_all(["th", "td"])]
                        if len(cols) >= 3:
                            gain_val = cols[3] if len(cols) > 3 and "%" in cols[3] else cols[2]
                            trends.append(GMPTrend(
                                date=cols[0],
                                gmp=cols[1] if "₹" in cols[1] else f"₹ {cols[1]}",
                                gain=gain_val if "%" in gain_val else f"{gain_val}%"
                            ))
                    break
            return trends
        except Exception as e:
            logger.warning(f"Error fetching IPOGuru trend {trend_url}: {e}")
            return []

    def fetch_all(self) -> Dict[str, Dict[str, Any]]:
        """
        Scrapes IPOGuru live GMP and enriches with 3-year Financials, KPIs, Lot Sizes, and Day-by-Day Trends.
        Returns a dictionary keyed by normalized slug.
        """
        logger.info(f"Connecting to IPOGuru at {IPOGURU_GMP_URL}...")
        try:
            resp = self.session.get(IPOGURU_GMP_URL, timeout=REQUEST_TIMEOUT)
            if resp.status_code != 200:
                logger.warning(f"IPOGuru returned HTTP {resp.status_code}")
                return {}

            soup = BeautifulSoup(resp.text, "html.parser")
        except Exception as e:
            logger.error(f"Error fetching IPOGuru: {e}")
            return {}

        table = soup.find("table")
        if not table:
            logger.warning("No GMP table found on IPOGuru")
            return {}

        rows = table.find("tbody").find_all("tr") if table.find("tbody") else table.find_all("tr")
        raw_items: List[Dict[str, Any]] = []

        for r in rows:
            cols = r.find_all(["td", "th"])
            if len(cols) < 4:
                continue

            company_cell = cols[0]
            name_tag = company_cell.find("a")
            raw_name = name_tag.get_text(strip=True) if name_tag else company_cell.get_text(strip=True)
            clean_name = self._clean_company_name(raw_name)
            if not clean_name:
                continue

            slug = slugify(clean_name)

            detail_link = None
            trend_link = None
            for a in r.find_all("a", href=True):
                href = a["href"]
                if "/ipo-gmp/" in href:
                    trend_link = href
                elif "/ipo/" in href:
                    detail_link = href

            price_val = parse_number(cols[1].get_text())
            gmp_val = int(parse_number(cols[2].get_text()))
            gmp_percent = parse_number(cols[3].get_text())

            raw_items.append({
                "name": clean_name,
                "slug": slug,
                "price": price_val,
                "gmp": gmp_val,
                "gmpPercent": gmp_percent,
                "detailLink": detail_link,
                "trendLink": trend_link,
            })

        logger.info(f"Found {len(raw_items)} IPOs on IPOGuru. Enriching financials and trends concurrently...")

        ipoguru_map: Dict[str, Dict[str, Any]] = {}

        with ThreadPoolExecutor(max_workers=6) as executor:
            future_to_item = {
                executor.submit(self._enrich_single_ipo, item): item
                for item in raw_items
            }

            for future in as_completed(future_to_item):
                item = future_to_item[future]
                try:
                    enriched = future.result()
                    ipoguru_map[item["slug"]] = enriched
                except Exception as e:
                    logger.warning(f"Error enriching {item['name']}: {e}")
                    ipoguru_map[item["slug"]] = item

        logger.info(f"Successfully processed {len(ipoguru_map)} IPOs from IPOGuru")
        return ipoguru_map

    def _enrich_single_ipo(self, item: Dict[str, Any]) -> Dict[str, Any]:
        result = dict(item)

        # 1. Fetch details (financials, kpis, lot sizes, reservations)
        if item.get("detailLink"):
            details = self.fetch_ipo_detail(item["detailLink"])
            result.update(details)

        # 2. Fetch trends
        if item.get("trendLink"):
            trends = self.fetch_gmp_trends(item["trendLink"])
            if trends:
                result["gmpTrends"] = trends

        return result
