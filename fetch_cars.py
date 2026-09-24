# fetch_cars.py
import json
from encar import CarapisClient

# Pa API key — Free Tier mode (1,000 makinat e fundit)
client = CarapisClient()

# Merr 20 makinat e fundit
vehicles = client.list_vehicles(limit=20, min_year=2020)

# Ruaj në cars.json
with open("cars.json", "w", encoding="utf-8") as f:
    json.dump(vehicles["results"], f, ensure_ascii=False, indent=2)

print(f"U ruajtën {len(vehicles['results'])} makina.")
