import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5000/api"

def seed_procurement():
    print("🚀 Seeding Procurement Data...")
    
    # 1. Create a Tender
    tender_data = {
        "title": "Q3 Trans-Pacific Ocean Freight",
        "description": "High-priority consumer electronics shipment. Requires Tier 1 carriers with guaranteed space allocation.",
        "lane_info": "Shanghai -> Long Beach (LA)",
        "estimated_volume": "1,200 TEU",
        "deadline": (datetime.now() + timedelta(days=7)).isoformat()
    }
    
    res = requests.post(f"{BASE_URL}/tenders", json=tender_data)
    if res.status_code == 201:
        tender = res.json()
        print(f"✅ Created Tender: {tender['title']} (ID: {tender['id']})")
        
        # 2. Get Carriers to bid
        c_res = requests.get(f"{BASE_URL}/carriers")
        carriers = c_res.json()
        
        if len(carriers) >= 3:
            # 3. Simulate 3 Bids
            bids = [
                {
                    "tender_id": tender['id'],
                    "carrier_id": carriers[0]['id'],
                    "offered_rate": 3200.0,
                    "transit_time_days": 18,
                    "carrier_notes": "Direct service, weekly sailing."
                },
                {
                    "tender_id": tender['id'],
                    "carrier_id": carriers[1]['id'],
                    "offered_rate": 2850.0,
                    "transit_time_days": 24,
                    "carrier_notes": "Economy route via Busan."
                },
                {
                    "tender_id": tender['id'],
                    "carrier_id": carriers[2]['id'],
                    "offered_rate": 3500.0,
                    "transit_time_days": 14,
                    "carrier_notes": "Express Premium service. Guaranteed load."
                }
            ]
            
            for bid in bids:
                b_res = requests.post(f"{BASE_URL}/tenders/bids/submit", json=bid)
                if b_res.status_code == 201:
                    print(f"✅ Submitted Bid for Carrier ID {bid['carrier_id']}: ${bid['offered_rate']}")
        else:
            print("⚠️ Not enough carriers to seed bids. Please seed carriers first.")
    else:
        print(f"❌ Failed to create tender: {res.text}")

if __name__ == "__main__":
    seed_procurement()
