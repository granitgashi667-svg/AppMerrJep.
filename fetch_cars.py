import json
import requests

# Encar API publik (i njëjti që përdor encar.com)
URL = "https://api.encar.com/search/car/list/general"

# Parametrat e kërkimit
params = {
    "count": "true",
    "q": "(And.Hidden.N._.CarType.Y._.(C.CarType.N._.Manufacturer.현대.))",
    "sr": "|ModifiedDate|0|20",
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
    "Referer": "http://www.encar.com/",
}

try:
    r = requests.get(URL, params=params, headers=headers, timeout=30)
    r.raise_for_status()
    data = r.json()
    
    cars = data.get("SearchResults", [])
    
    # Normalizo fushat
    normalized = []
    for c in cars:
        normalized.append({
            "id": c.get("Id"),
            "make": c.get("Manufacturer"),
            "model": c.get("Model"),
            "year": c.get("Year"),
            "mileage_km": c.get("Mileage"),
            "price_krw": c.get("Price"),
            "fuel_type": c.get("FuelType"),
            "image_url": c.get("Photo") or "",
            "region": c.get("OfficeCityState"),
        })
    
    with open("cars.json", "w", encoding="utf-8") as f:
        json.dump(normalized, f, ensure_ascii=False, indent=2)
    
    print(f"OK: {len(normalized)} makina u ruajtën.")
    
except Exception as e:
    print(f"ERROR: {e}")
    # Krijo një skedar bosh për të mos dështuar
    with open("cars.json", "w", encoding="utf-8") as f:
        json.dump([], f)
    raise
