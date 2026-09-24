import json
import time
import requests

# ⚠️ Token i përkohshëm — revokoje pas testit!
APIFY_TOKEN = "apify_api_dXRtOHDtzneErD7mHMeTHXxMvCw6OD0Phrde"
ACTOR_ID = "piotrv1001/encar-listings-scraper"

# 1. Nis aktorin
print("Duke nisur Apify actor...")
url = f"https://api.apify.com/v2/acts/{ACTOR_ID}/runs?token={APIFY_TOKEN}"
payload = {
    "carType": "domestic",
    "maxItems": 20,
    "scrapeFullDetails": False
}
r = requests.post(url, json=payload)
r.raise_for_status()
run_data = r.json()["data"]
run_id = run_data["id"]
print(f"Actor nisur. Run ID: {run_id}")

# 2. Prit deri sa të përfundojë
print("Duke pritur përfundimin...")
status = "RUNNING"
for _ in range(60):  # max 5 minuta
    time.sleep(5)
    status_url = f"https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_TOKEN}"
    status_resp = requests.get(status_url).json()["data"]
    status = status_resp["status"]
    print(f"Statusi: {status}")
    if status in ["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"]:
        break

if status != "SUCCEEDED":
    raise Exception(f"Actor dështoi me statusin: {status}")

# 3. Merr rezultatet
print("Duke marrë rezultatet...")
dataset_id = run_data["defaultDatasetId"]
items_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_TOKEN}"
items = requests.get(items_url).json()
print(f"U morën {len(items)} makina.")

# 4. Printo çelësat e një makinë për debugging
if items:
    print("Fushat e një makine:")
    print(list(items[0].keys()))

# 5. Normalizo fushat (me disa alternativa emrash)
normalized = []
for c in items:
    normalized.append({
        "id": c.get("id") or c.get("carId") or c.get("listingId") or "",
        "make": c.get("make") or c.get("brand") or c.get("manufacturer") or "",
        "model": c.get("model") or "",
        "year": c.get("year") or 0,
        "mileage_km": c.get("mileage") or c.get("mileageKm") or c.get("mileage_km") or 0,
        "price_krw": c.get("price") or c.get("priceKrw") or c.get("price_krw") or 0,
        "fuel_type": c.get("fuelType") or c.get("fuel") or c.get("fuel_type") or "",
        "image_url": c.get("image") or c.get("mainImage") or c.get("photo") or c.get("imageUrl") or "",
    })

# 6. Ruaj
with open("cars.json", "w", encoding="utf-8") as f:
    json.dump(normalized, f, ensure_ascii=False, indent=2)

print(f"OK: {len(normalized)} makina u ruajtën në cars.json")
