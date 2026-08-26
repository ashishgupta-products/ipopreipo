import sys
import argparse
import logging
from typing import List, Dict, Any
from .models import IPOData, slugify
from .sources.chittorgarh import ChittorgarhScraper
from .sources.investorgain import InvestorGainScraper
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

def merge_gmp_data(ipos: List[IPOData], gmp_map: Dict[str, Dict[str, Any]]) -> List[IPOData]:
    """Merges live GMP figures and trends into the master IPO list"""
    for ipo in ipos:
        slug = ipo.slug
        gmp_info = None

        # 1. Exact slug match
        if slug in gmp_map:
            gmp_info = gmp_map[slug]
        else:
            # 2. Fuzzy matching (e.g. check if first word or key tokens match)
            ipo_clean = slug.replace("-ltd", "").replace("-limited", "")
            for gmp_slug, info in gmp_map.items():
                gmp_clean = gmp_slug.replace("-ltd", "").replace("-limited", "")
                if ipo_clean in gmp_clean or gmp_clean in ipo_clean:
                    gmp_info = info
                    break

        if gmp_info:
            ipo.gmp = gmp_info.get("gmp", 0)
            ipo.gmpPercent = gmp_info.get("gmpPercent", 0.0)
            ipo.expectedListingPrice = gmp_info.get("expectedListingPrice", (ipo.issuePrice or ipo.priceBandMax) + ipo.gmp)
            ipo.gmpUpdatedTime = gmp_info.get("gmpUpdatedTime", "Live")
            if gmp_info.get("gmpTrends"):
                ipo.gmpTrends = gmp_info["gmpTrends"]

    return ipos

def run_scraper(limit_per_category: int = 30, test_mode: bool = False, gmp_only: bool = False):
    logger.info("=== Starting IPO Scraping Pipeline ===")
    
    investorgain = InvestorGainScraper()
    gmp_map = investorgain.fetch_gmp_table()

    if gmp_only:
        # Load existing JSON and update GMP
        import json
        from .config import OUTPUT_JSON_SRC
        if OUTPUT_JSON_SRC.exists():
            with open(OUTPUT_JSON_SRC, "r", encoding="utf-8") as f:
                data = json.load(f)
            ipos = [IPOData(**item) for item in data]
            ipos = merge_gmp_data(ipos, gmp_map)
            if not test_mode:
                save_to_json(ipos)
                sync_to_postgres(ipos)
            logger.info("=== Quick GMP Sync Finished ===")
            return ipos

    chittorgarh = ChittorgarhScraper()
    ipos = chittorgarh.scrape_all(limit_per_category=limit_per_category)

    # Merge GMP
    ipos = merge_gmp_data(ipos, gmp_map)

    if test_mode:
        logger.info(f"Test Mode: Scraped {len(ipos)} IPOs successfully. Sample:")
        if ipos:
            sample = ipos[0]
            print(f"Sample IPO: {sample.name} | Category: {sample.category} | Status: {sample.status} | Price: {sample.priceBandMin}-{sample.priceBandMax} | GMP: ₹{sample.gmp} ({sample.gmpPercent}%)")
        return ipos

    # Save to JSON and sync to PostgreSQL
    save_to_json(ipos)
    sync_to_postgres(ipos)
    logger.info("=== Scraping Pipeline Completed Successfully ===")
    return ipos

def main():
    parser = argparse.ArgumentParser(description="Indian IPO Scraping & Sync Engine")
    parser.add_argument("--all", action="store_true", help="Run complete scrape of Mainboard, SME & GMP")
    parser.add_argument("--gmp", action="store_true", help="Run fast GMP-only update")
    parser.add_argument("--test", action="store_true", help="Run without persisting to DB or JSON")
    parser.add_argument("--limit", type=int, default=25, help="Max IPOs per category (default 25)")
    args = parser.parse_args()

    run_scraper(
        limit_per_category=args.limit,
        test_mode=args.test,
        gmp_only=args.gmp,
    )

if __name__ == "__main__":
    main()
