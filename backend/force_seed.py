from app import app, db
from models import Carrier, Quote, Invoice, Tender, Bid
from datetime import datetime, timedelta

def force_seed():
    with app.app_context():
        print("--- Force Seeding org_demo_123 ---")
        demo_org = 'org_demo_123'
        
        # 1. Ensure Carriers
        carriers = Carrier.query.filter_by(organization_id=demo_org).all()
        if not carriers:
            c1 = Carrier(name="Global Liner", organization_id=demo_org, reliability_score=95.0)
            c2 = Carrier(name="Pacific Express", organization_id=demo_org, reliability_score=88.0)
            c3 = Carrier(name="EuroCarrier", organization_id=demo_org, reliability_score=92.0)
            db.session.add_all([c1, c2, c3])
            db.session.flush()
            carriers = [c1, c2, c3]
        
        # 2. Add Quotes
        if not Quote.query.filter_by(organization_id=demo_org).first():
            q1 = Quote(
                filename="quote_sha_la_001.pdf",
                organization_id=demo_org,
                carrier_id=carriers[0].id,
                origin="Shanghai",
                destination="Los Angeles",
                currency="USD",
                total_price=3500.0,
                normalized_total_price_usd=3500.0,
                status="ALLOCATED",
                transit_time_days=15
            )
            q2 = Quote(
                filename="quote_sha_la_002.pdf",
                organization_id=demo_org,
                carrier_id=carriers[1].id,
                origin="Shanghai",
                destination="Los Angeles",
                currency="USD",
                total_price=3200.0,
                normalized_total_price_usd=3200.0,
                status="PENDING",
                transit_time_days=20
            )
            db.session.add_all([q1, q2])
            
        # 3. Add Tenders
        if not Tender.query.filter_by(organization_id=demo_org).first():
            t1 = Tender(
                title="Q3 Trans-Pacific RFQ",
                organization_id=demo_org,
                status="OPEN",
                lane_info="Shanghai -> LA",
                estimated_volume="500 TEU",
                deadline=datetime.utcnow() + timedelta(days=14)
            )
            db.session.add(t1)
            
        db.session.commit()
        print("SUCCESS: org_demo_123 is now populated.")

if __name__ == "__main__":
    force_seed()
