import requests
from bs4 import BeautifulSoup
import json

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# 1. Test InvestorGain
ig_url = "https://www.investorgain.com/report/live-ipo-gmp/331/"
try:
    r = requests.get(ig_url, headers=headers, timeout=10)
    print(f"InvestorGain status: {r.status_code}, length: {len(r.text)}")
    soup = BeautifulSoup(r.text, "lxml")
    tables = soup.find_all("table")
    print(f"InvestorGain tables found: {len(tables)}")
    for i, t in enumerate(tables):
        rows = t.find_all("tr")
        print(f"Table {i}: {len(rows)} rows. Header sample: {[th.get_text(strip=True) for th in rows[0].find_all(['th','td'])][:5]}")
except Exception as e:
    print(f"InvestorGain error: {e}")

# 2. Test Chittorgarh GMP
cg_url = "https://www.chittorgarh.com/report/ipo-grey-market-premium-gmp/104/"
try:
    r = requests.get(cg_url, headers=headers, timeout=10)
    print(f"Chittorgarh GMP status: {r.status_code}, length: {len(r.text)}")
    soup = BeautifulSoup(r.text, "lxml")
    tables = soup.find_all("table")
    print(f"Chittorgarh tables found: {len(tables)}")
    for i, t in enumerate(tables):
        rows = t.find_all("tr")
        print(f"Table {i}: {len(rows)} rows. Header sample: {[th.get_text(strip=True) for th in rows[0].find_all(['th','td'])][:5]}")
except Exception as e:
    print(f"Chittorgarh GMP error: {e}")
