import json
import time
import requests

APIFY_TOKEN = "apify_api_dXRtOHDtzneErD7mHMeTHXxMvCw6OD0Phrde"
ACTOR_ID = "piotrv1001~encar-listings-scraper"

BRANDS = {
    "현대": "Hyundai", "기아": "Kia", "제네시스": "Genesis",
    "BMW": "BMW", "벤츠": "Mercedes-Benz", "메르세데스-벤츠": "Mercedes-Benz",
    "아우디": "Audi", "폭스바겐": "Volkswagen", "쉐보레": "Chevrolet",
    "르노": "Renault", "르노코리아": "Renault Korea", "쌍용": "SsangYong",
    "KG모빌리티": "KGM", "포르쉐": "Porsche", "볼보": "Volvo",
    "도요타": "Toyota", "렉서스": "Lexus", "혼다": "Honda",
    "닛산": "Nissan", "포드": "Ford", "지프": "Jeep",
    "랜드로버": "Land Rover", "재규어": "Jaguar", "미니": "Mini",
    "푸조": "Peugeot", "시트로엥": "Citroen", "피아트": "Fiat",
    "크라이슬러": "Chrysler", "캐딜락": "Cadillac", "링컨": "Lincoln",
    "테슬라": "Tesla", "마세라티": "Maserati", "벤틀리": "Bentley",
}

FUELS = {
    "가솔린": "Benzinë", "디젤": "Dizel", "하이브리드": "Hibrid",
    "전기": "Elektrik", "LPG": "LPG", "수소": "Hidrogjen",
    "가솔린+전기": "Hibrid", "디젤+전기": "Hibrid Dizel",
}

TRANS = {
    "오토": "Automatik", "수동": "Manual", "CVT": "CVT", "DCT": "DCT",
}

print("Duke nisur Apify actor...")
url = f"https://api.apify.com/v2/acts/{ACTOR_ID}/runs?token={APIFY_TOKEN}"
payload = {"carType": "domestic", "maxItems": 20, "scrapeFullDetails": False}
r = requests.post(url, json=payload)
r.raise_for_status()
run_data = r.json()["data"]
run_id = run_data["id"]
print(f"Actor nisur. Run ID: {run_id}")

print("Duke pritur përfundimin...")
status = "RUNNING"
for _ in range(60):
    time.sleep(5)
    s = requests.get(f"https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_TOKEN}").json()["data"]
    status = s["status"]
    print(f"Statusi: {status}")
    if status in ["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"]:
        break

if status != "SUCCEEDED":
    raise Exception(f"Actor dështoi: {status}")

print("Duke marrë rezultatet...")
dataset_id = run_data["defaultDatasetId"]
items = requests.get(f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_TOKEN}").json()
print(f"U morën {len(items)} makina.")

normalized = []
for c in items:
    year_raw = c.get("year") or 0
    year = int(str(year_raw)[:4]) if year_raw else 0

    brand_kr = c.get("manufacturer") or ""
    brand = BRANDS.get(brand_kr, brand_kr)

    fuel_kr = c.get("fuelType") or ""
    fuel = FUELS.get(fuel_kr, fuel_kr)

    trans_kr = c.get("transmission") or ""
    trans = TRANS.get(trans_kr, trans_kr)

    img = c.get("mainPhotoUrl") or ""
    if img and not img.startswith("http"):
        img = "https:" + img if img.startswith("//") else img

    normalized.append({
        "id": str(c.get("id") or ""),
        "make": brand,
        "model": c.get("model") or "",
        "badge": c.get("badge") or "",
        "year": year,
        "mileage_km": c.get("mileage") or 0,
        "price_krw": c.get("price") or 0,
        "fuel_type": fuel,
        "transmission": trans,
        "image_url": img,
        "encar_url": c.get("url") or "",
    })

with open("cars.json", "w", encoding="utf-8") as f:
    json.dump(normalized, f, ensure_ascii=False, indent=2)

print(f"OK: {len(normalized)} makina u ruajtën në cars.json")
print("Shembull:")
print(json.dumps(normalized[0], ensure_ascii=False, indent=2))
