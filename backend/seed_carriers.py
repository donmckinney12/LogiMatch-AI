import requests

BASE_URL = "http://localhost:5000/api"

def seed_carriers():
    carriers = [
        {"name": "Global Liner", "contact_info": "ops@globalliner.com", "compliance_score": 95},
        {"name": "Pacific Express", "contact_info": "hq@pacex.com", "compliance_score": 88},
        {"name": "EuroCarrier", "contact_info": "quotes@eurocarrier.eu", "compliance_score": 92}
    ]
    
    for c in carriers:
        res = requests.post(f"{BASE_URL}/carriers", json=c)
        if res.status_code == 201:
            print(f"✅ Created Carrier: {c['name']}")
        else:
            print(f"❌ Failed to create carrier {c['name']}: {res.text}")

if __name__ == "__main__":
    seed_carriers()
