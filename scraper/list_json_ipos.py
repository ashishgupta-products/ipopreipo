import json

with open("src/data/ipos.json", "r", encoding="utf-8") as f:
    ipos = json.load(f)

print(f"Total IPOs in JSON: {len(ipos)}")
for i, ipo in enumerate(ipos[:15]):
    print(f"{i+1}. {ipo.get('name')} | Category: {ipo.get('category')} | Status: {ipo.get('status')} | PriceMax: {ipo.get('priceBandMax')} | GMP: {ipo.get('gmp')} | Sub: {ipo.get('totalSubscription')}")
