from app import app, db
from models import Carrier, Quote, Invoice, Tender

with app.app_context():
    print("--- DB Verification ---")
    demo_org = 'org_demo_123'
    
    carriers = Carrier.query.filter_by(organization_id=demo_org).count()
    quotes = Quote.query.filter_by(organization_id=demo_org).count()
    invoices = Invoice.query.filter_by(organization_id=demo_org).count()
    tenders = Tender.query.filter_by(organization_id=demo_org).count()
    
    print(f"Demo Carriers: {carriers}")
    print(f"Demo Quotes: {quotes}")
    print(f"Demo Invoices: {invoices}")
    print(f"Demo Tenders: {tenders}")
    
    # Check if there's any other org
    all_carriers = Carrier.query.all()
    orgs = set(c.organization_id for c in all_carriers)
    print(f"Total organizations in Carrier table: {len(orgs)}")
    print(f"Organization IDs: {orgs}")
