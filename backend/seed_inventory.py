from app import app, db
from models import SKU

SKUS = [
    {
        "name": "Industrial Smartphone X1",
        "code": "SKU-IPH-001",
        "current_stock": 450,
        "safety_stock": 50,
        "reorder_point": 100,
        "unit_measure": "units",
        "lead_time_days": 10,
        "hs_code": "8517.13.00",
        "origin_country": "CN",
        "material_composition": "Aluminum, Glass, Electronics"
    },
    {
        "name": "Heavy Duty Laptop Pro",
        "code": "SKU-LTP-002",
        "current_stock": 120,
        "safety_stock": 20,
        "reorder_point": 40,
        "unit_measure": "units",
        "lead_time_days": 15,
        "hs_code": "8471.30.01",
        "origin_country": "TW",
        "material_composition": "Carbon Fiber, Silicon"
    }
]

with app.app_context():
    for sku_data in SKUS:
        sku = SKU(
            organization_id="org_demo_123",
            **sku_data
        )
        db.session.add(sku)
    db.session.commit()
    print("✅ Seeded Inventory Data (SKUs)")
