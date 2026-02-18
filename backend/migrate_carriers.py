from app import app, db
from models import Carrier, Quote
import os

def migrate():
    with app.app_context():
        print("Starting carrier table migration...")
        
        # 1. Backup existing carriers
        carriers = Carrier.query.all()
        carrier_data = []
        for c in carriers:
            carrier_data.append({
                "id": c.id,
                "name": c.name,
                "reliability_score": c.reliability_score,
                "contact_info": c.contact_info,
                "organization_id": c.organization_id,
                "is_verified": c.is_verified,
                "tax_id": c.tax_id,
                "compliance_score": c.compliance_score,
                "onboarding_status": c.onboarding_status,
                "created_at": c.created_at
            })
        print(f"Backed up {len(carrier_data)} carriers.")

        # 2. Backup quotes (since they depend on carrier_id)
        quotes = Quote.query.all()
        quote_data = []
        for q in quotes:
            quote_data.append({
                "id": q.id,
                "carrier_id": q.carrier_id,
                # ... other fields are less critical for this specific link, 
                # but we need to restore the whole object or just keep the ID mapping
            })
        
        # 3. Drop and recreate
        # Note: SQLite doesn't support ALTER TABLE DROP CONSTRAINT easily.
        # We drop the table and let SQLAlchemy recreate it with the new UniqueConstraint.
        print("Dropping carrier table...")
        Carrier.__table__.drop(db.engine)
        print("Recreating carrier table with new schema...")
        Carrier.__table__.create(db.engine)

        # 4. Restore carriers
        print("Restoring carrier data...")
        for data in carrier_data:
            # We bypass the constructor to keep IDs consistent if possible, 
            # or just create new ones. Using existing IDs is safer for Quote links.
            new_c = Carrier(**data)
            db.session.add(new_c)
        
        try:
            db.session.commit()
            print("Migration successful: Carrier table is now multi-tenant aware.")
        except Exception as e:
            db.session.rollback()
            print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
