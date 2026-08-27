import requests
from bs4 import BeautifulSoup
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# 1. Investorgain inspection
r = requests.get("https://www.investorgain.com/report/live-ipo-gmp/331/", headers=headers, timeout=10)
soup = BeautifulSoup(r.text, "lxml")

# Look for table or div containers with gmp
gmp_elements = soup.find_all(lambda tag: tag.name in ['table', 'div'] and tag.get('class') and any('table' in c or 'gmp' in c or 'report' in c for c in tag.get('class')))
print("InvestorGain candidate containers:")
for el in gmp_elements[:10]:
    print(el.name, el.get('class'), el.get('id'), len(el.get_text()))

# Search for common IPO names in text
matches = re.findall(r'([A-Za-z0-9\s&.-]+IPO)\s*.*?₹?\s*(\d+)\s*.*?₹?\s*([+-]?\d+)\s*.*?(?:%|\()', r.text)
print(f"InvestorGain text regex matches: {len(matches)}")
for m in matches[:5]:
    print(m)

# 2. Chittorgarh subscription inspection
r_sub = requests.get("https://www.chittorgarh.com/report/ipo-subscription-status-live-bidding-data-bse-nse/21/", headers=headers, timeout=10)
print(f"\nChittorgarh subscription status: {r_sub.status_code}, len: {len(r_sub.text)}")
soup_sub = BeautifulSoup(r_sub.text, "lxml")
sub_tables = soup_sub.find_all("table")
print(f"Chittorgarh subscription tables: {len(sub_tables)}")
if sub_tables:
    for row in sub_tables[0].find_all("tr")[:5]:
        print([c.get_text(strip=True) for c in row.find_all(["td","th"])])
