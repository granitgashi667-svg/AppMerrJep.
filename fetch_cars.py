import json

demo_cars = [
    {
        "id": "1",
        "make": "Hyundai",
        "model": "Tucson",
        "year": 2023,
        "mileage_km": 14200,
        "price_krw": 36500000,
        "fuel_type": "Gasoline",
        "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600"
    },
    {
        "id": "2",
        "make": "Kia",
        "model": "Sportage",
        "year": 2022,
        "mileage_km": 28400,
        "price_krw": 32700000,
        "fuel_type": "Hybrid",
        "image_url": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600"
    },
    {
        "id": "3",
        "make": "Genesis",
        "model": "G70",
        "year": 2021,
        "mileage_km": 42100,
        "price_krw": 43100000,
        "fuel_type": "Gasoline",
        "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600"
    },
    {
        "id": "4",
        "make": "BMW",
        "model": "M4 Competition",
        "year": 2023,
        "mileage_km": 8200,
        "price_krw": 134000000,
        "fuel_type": "Gasoline",
        "image_url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600"
    }
]

with open("cars.json", "w", encoding="utf-8") as f:
    json.dump(demo_cars, f, ensure_ascii=False, indent=2)

print(f"OK: {len(demo_cars)} makina u ruajtën.")
