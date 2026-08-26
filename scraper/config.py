import os
from pathlib import Path
from dotenv import load_dotenv

# Root directory of the repository
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env and .env.local if present
load_dotenv(BASE_DIR / ".env.local")
load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "")

# Output data paths for 100% free repo serving
PUBLIC_DATA_DIR = BASE_DIR / "public" / "data"
SRC_DATA_DIR = BASE_DIR / "src" / "data"
OUTPUT_JSON_PUBLIC = PUBLIC_DATA_DIR / "ipos.json"
OUTPUT_JSON_SRC = SRC_DATA_DIR / "ipos.json"

# Scraping settings & Browser headers
DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Cache-Control": "max-age=0",
}

CHITTORGARH_MAINBOARD_URL = "https://www.chittorgarh.com/ipo/ipo_list.asp?a=mainboard"
CHITTORGARH_SME_URL = "https://www.chittorgarh.com/ipo/ipo_list.asp?a=sme"
INVESTORGAIN_GMP_URL = "https://www.investorgain.com/report/live-ipo-gmp/331/"

REQUEST_TIMEOUT = 25
RETRY_COUNT = 3
RETRY_BACKOFF_FACTOR = 1.5
