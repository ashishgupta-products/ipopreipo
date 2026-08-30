import sys
import re
import argparse
import logging
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

from .models import IPOData, slugify
from .sources.zerodha import ZerodhaScraper
from .sources.ipoguru import IPOGuruScraper
from .sources.investorgain import InvestorGainScraper
from .sources.chittorgarh import ChittorgarhScraper
from .db_sync import save_to_json, sync_to_postgres

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ipo_scraper_main")

def re_clean_tokens(text: str) -> List[str]:
    return re.sub(r"[^\w\s]", "", text.lower()).split()

def find_matching_source_data(ipo_slug: str, ipo_name: str, source_map: Dict[str, Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Fuzzy matches an IPO against a source data map by exact slug or key name tokens."""
    # 1. Exact slug match
    if ipo_slug in source_map:
        return source_map[ipo_slug]

    # 2. Match without trailing words (ltd, limited, etc.)
    clean_target = ipo_slug.replace("-ltd", "").replace("-limited", "").replace("-sme", "").replace("-ipo", "")
    for src_slug, data in source_map.items():
        clean_src = src_slug.replace("-ltd", "").replace("-limited", "").replace("-sme", "").replace("-ipo", "")
        if clean_target and clean_src and (clean_target in clean_src or clean_src in clean_target):
            return data

    # 3. Match by name tokens
    target_tokens = set([t for t in re_clean_tokens(ipo_name) if len(t) > 2 and t not in ["limited", "ltd", "india", "technologies", "services", "industries", "solutions"]])
    for src_slug, data in source_map.items():
        src_name = data.get("name", src_slug)
        src_tokens = set([t for t in re_clean_tokens(src_name) if len(t) > 2 and t not in ["limited", "ltd", "india", "technologies", "services", "industries", "solutions"]])
        if target_tokens and src_tokens and len(target_tokens.intersection(src_tokens)) >= 1:
            return data

    return None

def enrich_from_ipoguru(ipos: List[IPOData], ipoguru_map: Dict[str, Dict[str, Any]]) -> List[IPOData]:
    """Enriches IPO list with IPOGuru GMP, 3-year Financials, KPIs, Lot Sizes, and Trends."""
    logger.info(f"Enriching IPOs with IPOGuru data ({len(ipoguru_map)} items available)...")
    enriched_count = 0

    for ipo in ipos:
        matched = find_matching_source_data(ipo.slug, ipo.name, ipoguru_map)
        if not matched:
            continue

        enriched_count += 1
        # 1. GMP & Trends
        if matched.get("gmp") is not None and matched.get("gmp") > 0:
            ipo.gmp = matched["gmp"]
            ipo.gmpPercent = matched.get("gmpPercent", 0.0)
            ipo.expectedListingPrice = (ipo.issuePrice or ipo.priceBandMax) + ipo.gmp
            ipo.gmpUpdatedTime = "Live"

        if matched.get("gmpTrends"):
            ipo.gmpTrends = matched["gmpTrends"]

        # 2. Financials (3 Years)
        if matched.get("financials") and not ipo.financials:
            ipo.financials = matched["financials"]

        # 3. KPIs
        if matched.get("kpis") and not ipo.kpis:
            ipo.kpis = matched["kpis"]

        # 4. Expanded Lot Sizes
        if matched.get("lotSizes"):
            ipo.lotSizes = matched["lotSizes"]

        # 5. Reservations
        if matched.get("reservations") and not ipo.reservations:
            ipo.reservations = matched["reservations"]

    logger.info(f"Successfully enriched {enriched_count} IPOs from IPOGuru")
    return ipos

def enrich_from_investorgain(ipos: List[IPOData], investorgain_map: Dict[str, Dict[str, Any]]) -> List[IPOData]:
    """Enriches remaining IPOs with InvestorGain GMP and Listing Estimates."""
    logger.info(f"Enriching remaining IPOs with InvestorGain data ({len(investorgain_map)} items available)...")
    enriched_count = 0

    for ipo in ipos:
        matched = find_matching_source_data(ipo.slug, ipo.name, investorgain_map)
        if not matched:
            continue

        # Only fill if GMP not already populated
        if ipo.gmp == 0 and matched.get("gmp") is not None and matched.get("gmp") != 0:
            enriched_count += 1
            ipo.gmp = matched["gmp"]
            ipo.gmpPercent = matched.get("gmpPercent", 0.0)
            ipo.expectedListingPrice = matched.get("expectedListingPrice", (ipo.issuePrice or ipo.priceBandMax) + ipo.gmp)
            ipo.gmpUpdatedTime = matched.get("gmpUpdatedTime", "Live")
            if not ipo.gmpTrends and matched.get("gmpTrends"):
                ipo.gmpTrends = matched["gmpTrends"]

    logger.info(f"Successfully enriched {enriched_count} IPOs from InvestorGain")
    return ipos

def enrich_from_chittorgarh(ipos: List[IPOData], chittorgarh: ChittorgarhScraper, max_workers: int = 6) -> List[IPOData]:
    """Enriches IPO list with Chittorgarh Registrars, Lead Managers, Peer Comparisons, and Reviews."""
    logger.info("Discovering IPOs on Chittorgarh...")
    try:
        discovered = chittorgarh.discover_ipos("mainboard") + chittorgarh.discover_ipos("sme")
    except Exception as e:
        logger.error(f"Error discovering Chittorgarh IPOs: {e}")
        return ipos

    chitto_map = {item["slug"]: item for item in discovered}
    logger.info(f"Discovered {len(chitto_map)} IPOs on Chittorgarh. Enriching matched IPO details concurrently...")

    matched_pairs = []
    for ipo in ipos:
        matched = find_matching_source_data(ipo.slug, ipo.name, chitto_map)
        if matched:
            matched_pairs.append((ipo, matched))

    enriched_count = 0
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_pair = {
            executor.submit(chittorgarh.scrape_ipo_detail, summary_item): (ipo, summary_item)
            for (ipo, summary_item) in matched_pairs
        }

        for future in as_completed(future_to_pair):
            ipo, summary_item = future_to_pair[future]
            try:
                detail = future.result()
                if detail:
                    enriched_count += 1
                    # 1. Registrar
                    if detail.registrarName and detail.registrarName != "Check Website":
                        ipo.registrarName = detail.registrarName
                        ipo.registrarWebsite = detail.registrarWebsite
                        ipo.registrarCheckUrl = detail.registrarCheckUrl
                        ipo.registrarPhone = detail.registrarPhone
                        ipo.registrarEmail = detail.registrarEmail

                    # 2. Lead Managers
                    if detail.leadManagers and not ipo.leadManagers:
                        ipo.leadManagers = detail.leadManagers

                    # 3. Peer Comparison
                    if detail.peerComparison and not ipo.peerComparison:
                        ipo.peerComparison = detail.peerComparison

                    # 4. Broker / Member Reviews & Recommendation
                    if detail.brokerReviews and not ipo.brokerReviews:
                        ipo.brokerReviews = detail.brokerReviews
                    if detail.memberReviews and not ipo.memberReviews:
                        ipo.memberReviews = detail.memberReviews
                    if detail.reviewScore:
                        ipo.reviewScore = detail.reviewScore

                    # 5. Financials fallback
                    if detail.financials and not ipo.financials:
                        ipo.financials = detail.financials

                    # 6. Contact Information
                    if getattr(detail, "companyAddress", None):
                        ipo.companyAddress = detail.companyAddress
                    if getattr(detail, "companyWebsite", None):
                        ipo.companyWebsite = detail.companyWebsite
                    if getattr(detail, "companyPhone", None):
                        ipo.companyPhone = detail.companyPhone
                    if getattr(detail, "companyEmail", None):
                        ipo.companyEmail = detail.companyEmail

            except Exception as e:
                logger.warning(f"Error enriching Chittorgarh detail for {ipo.name}: {e}")

    logger.info(f"Successfully enriched {enriched_count} IPOs from Chittorgarh")
    return ipos

def run_scraper(limit_per_category: int = 50, test_mode: bool = False):
    logger.info("=== Starting Multi-Tier IPO Scraping Pipeline ===")
    logger.info("Pipeline Order: 1. Zerodha -> 2. IPOGuru -> 3. InvestorGain -> 4. Chittorgarh")

    # 1. Primary Master: Zerodha
    zerodha = ZerodhaScraper()
    ipos = zerodha.scrape_all(limit_per_category=limit_per_category)

    if not ipos:
        logger.warning("No IPOs returned from Zerodha.")
        return []

    logger.info(f"Step 1 Complete: Scraped {len(ipos)} baseline IPOs from Zerodha")

    # 2. First Enrichment: IPOGuru (Financials, GMP, KPIs, Lot Sizes, Trends)
    try:
        ipoguru = IPOGuruScraper()
        ipoguru_map = ipoguru.fetch_all()
        ipos = enrich_from_ipoguru(ipos, ipoguru_map)
    except Exception as e:
        logger.error(f"Error during IPOGuru enrichment step: {e}")

    # 3. Second Enrichment / Fallback: InvestorGain
    try:
        investorgain = InvestorGainScraper()
        investorgain_map = investorgain.fetch_gmp_table()
        ipos = enrich_from_investorgain(ipos, investorgain_map)
    except Exception as e:
        logger.error(f"Error during InvestorGain enrichment step: {e}")

    # 4. Third Enrichment: Chittorgarh (Registrars, Lead Managers, Peer Comparison, Reviews)
    try:
        chittorgarh = ChittorgarhScraper()
        ipos = enrich_from_chittorgarh(ipos, chittorgarh)
    except Exception as e:
        logger.error(f"Error during Chittorgarh enrichment step: {e}")

    if test_mode:
        logger.info(f"Test Mode Active: Pipeline finished. Showing enriched sample:")
        for idx, sample in enumerate(ipos[:5], 1):
            fin_str = f"{len(sample.financials)} years" if sample.financials else "None"
            peers_str = f"{len(sample.peerComparison)} peers" if sample.peerComparison else "None"
            print(f"[{idx}] {sample.name} | GMP: ₹{sample.gmp} ({sample.gmpPercent}%) | Registrar: {sample.registrarName} | Peers: {peers_str} | Lead Managers: {len(sample.leadManagers)} | Fin: {fin_str}")
        return ipos

    # Save to JSON and sync to PostgreSQL
    save_to_json(ipos)
    sync_to_postgres(ipos)
    logger.info("=== Multi-Tier IPO Scraping Pipeline Completed Successfully ===")
    return ipos

def main():
    parser = argparse.ArgumentParser(description="Multi-Tier IPO Scraping Engine (Zerodha -> IPOGuru -> InvestorGain -> Chittorgarh)")
    parser.add_argument("--all", action="store_true", help="Run complete scrape and sync")
    parser.add_argument("--test", action="store_true", help="Run without persisting to DB or JSON")
    parser.add_argument("--limit", type=int, default=50, help="Max IPOs per category (default 50)")
    args = parser.parse_args()

    run_scraper(
        limit_per_category=args.limit,
        test_mode=args.test,
    )

if __name__ == "__main__":
    main()
