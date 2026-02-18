from app import app, db, seed_organization_data
from models import Carrier, Quote, Invoice, Tender

def test_seeding():
    with app.app_context():
        test_org = "org_test_67890"
        print(f"--- Simulating Seeding for {test_org} ---")
        
        # Ensure clean state for test_org
        Carrier.query.filter_by(organization_id=test_org).delete()
        Quote.query.filter_by(organization_id=test_org).delete()
        Invoice.query.filter_by(organization_id=test_org).delete()
        Tender.query.filter_by(organization_id=test_org).delete()
        db.session.commit()
        
        # Trigger Seeding
        seed_organization_data(test_org)
        
        # Verify
        carriers = Carrier.query.filter_by(organization_id=test_org).count()
        quotes = Quote.query.filter_by(organization_id=test_org).count()
        invoices = Invoice.query.filter_by(organization_id=test_org).count()
        tenders = Tender.query.filter_by(organization_id=test_org).count()
        
        print(f"Results for {test_org}:")
        print(f"  Carriers: {carriers}")
        print(f"  Quotes: {quotes}")
        print(f"  Invoices: {invoices}")
        print(f"  Tenders: {tenders}")
        
        if carriers > 0:
            print("SUCCESS: Data seeded successfully.")
        else:
            print("FAILURE: No data seeded.")

if __name__ == "__main__":
    test_seeding()
