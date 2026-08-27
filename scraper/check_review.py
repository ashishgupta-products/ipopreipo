import requests
import bs4
import sys

sys.stdout.reconfigure(encoding='utf-8')

r = requests.get('https://www.chittorgarh.com/ipo/symbiotec-pharmalab-ipo/2260/', headers={'User-Agent': 'Mozilla/5.0'})
soup = bs4.BeautifulSoup(r.text, 'html.parser')

headers = [h for h in soup.find_all(['h2', 'h3', 'h4']) if any(k in h.get_text().lower() for k in ['review', 'recommendation', 'score', 'rating'])]
for h in headers:
    nxt = h.find_next(['div', 'table', 'p'])
    text = nxt.get_text('\n', strip=True) if nxt else 'None'
    print(f"=== HEADER: {h.get_text(strip=True)} ===")
    print(text[:500])
    print()
