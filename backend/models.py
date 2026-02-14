from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Carrier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    reliability_score = db.Column(db.Float, default=100.0)
    contact_info = db.Column(db.String(255), nullable=True)
    organization_id = db.Column(db.String(50), nullable=True, default="org_demo_123")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Onboarding & Compliance
    is_verified = db.Column(db.Boolean, default=False)
    tax_id = db.Column(db.String(50), nullable=True)
    compliance_score = db.Column(db.Float, default=0.0)
    onboarding_status = db.Column(db.String(20), default="PENDING") # PENDING, APPROVED, REJECTED

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "reliability_score": self.reliability_score,
            "contact_info": self.contact_info,
            "is_verified": self.is_verified,
            "tax_id": self.tax_id,
            "compliance_score": self.compliance_score,
            "onboarding_status": self.onboarding_status,
            "organization_id": self.organization_id
        }

class SurchargeReference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    raw_name = db.Column(db.String(100), nullable=False)
    normalized_name = db.Column(db.String(100), nullable=True)
    category = db.Column(db.String(50), nullable=True)
    is_approved = db.Column(db.Boolean, default=True)
    organization_id = db.Column(db.String(50), nullable=True, default="org_demo_123")

    def to_dict(self):
        return {
            "id": self.id,
            "raw_name": self.raw_name,
            "normalized_name": self.normalized_name,
            "category": self.category,
            "is_approved": self.is_approved,
            "organization_id": self.organization_id
        }

class ExchangeRate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    currency_code = db.Column(db.String(3), nullable=False, unique=True)
    rate_to_usd = db.Column(db.Float, nullable=False) # 1 Unit = X USD
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "currency_code": self.currency_code,
            "rate_to_usd": self.rate_to_usd,
            "last_updated": self.last_updated.isoformat()
        }

class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(50), nullable=False) # e.g. "QUOTE_UPLOAD"
    category = db.Column(db.String(30), default="GENERAL") # QUOTE, AUTH, SYSTEM, GENERAL
    details = db.Column(db.String(255), nullable=True) # e.g. "FILE_NAME"
    user_id = db.Column(db.String(50), nullable=True) # Clerk ID
    organization_id = db.Column(db.String(50), nullable=True, default="org_demo_123")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action,
            "category": self.category,
            "details": self.details,
            "user_id": self.user_id,
            "organization_id": self.organization_id,
            "timestamp": self.timestamp.isoformat()
        }

class Quote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.String(100), nullable=True) # Clerk ID
    organization_id = db.Column(db.String(50), nullable=True, default="org_demo_123")
    
    # Core Data
    carrier_id = db.Column(db.Integer, db.ForeignKey('carrier.id'), nullable=True)
    carrier = db.relationship('Carrier', backref=db.backref('quotes', lazy=True))
    
    origin = db.Column(db.String(100), nullable=True)
    destination = db.Column(db.String(100), nullable=True)
    
    # Financials
    currency = db.Column(db.String(10), nullable=True)
    total_price = db.Column(db.Float, nullable=True)
    normalized_total_price_usd = db.Column(db.Float, nullable=True)
    
    # Detailed Data (JSON Blob for flexibility)
    surcharges = db.Column(db.JSON, nullable=True)
    risk_flags = db.Column(db.JSON, nullable=True) # List of warning strings
    full_text_content = db.Column(db.Text, nullable=True)
    
    # Procurement Fields
    po_number = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), default="DRAFT") # DRAFT, ALLOCATED, BOOKED, DELIVERED
    allocation_date = db.Column(db.DateTime, nullable=True)
    time_to_value_seconds = db.Column(db.Integer, nullable=True) # Duration from Upload -> Allocation
    booking_ref = db.Column(db.String(50), nullable=True)
    agent_insights = db.Column(db.JSON, nullable=True) # JSON Audit log from Multi-Agent Team
    is_audited = db.Column(db.Boolean, default=False)
    audited_by = db.Column(db.String(100), nullable=True) # User ID who verified
    carbon_footprint_kg = db.Column(db.Float, nullable=True) # Estimated CO2 impact
    transit_time_days = db.Column(db.Integer, nullable=True) # Lead time in days
    
    # Reliability & Landed Cost (Phase 6)
    confidence_score = db.Column(db.Float, default=1.0) # 0.0 to 1.0 extraction confidence
    estimated_duties = db.Column(db.Float, default=0.0) # From Landed Cost Simulation
    estimated_taxes = db.Column(db.Float, default=0.0)
    pdf_path = db.Column(db.String(255), nullable=True) # Path to stored PDF

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "upload_date": self.upload_date.isoformat(),
            "carrier": self.carrier.name if self.carrier else "Unknown",
            "origin": self.origin,
            "destination": self.destination,
            "total_price": self.total_price,
            "currency": self.currency,
            "normalized_total_price_usd": self.normalized_total_price_usd,
            "surcharges": self.surcharges,
            "risk_flags": self.risk_flags or [],
            "po_number": self.po_number,
            "status": self.status,
            "booking_ref": self.booking_ref,
            "agent_insights": self.agent_insights,
            "is_audited": self.is_audited,
            "audited_by": self.audited_by,
            "carbon_footprint_kg": self.carbon_footprint_kg,
            "transit_time_days": self.transit_time_days,
            "confidence_score": self.confidence_score,
            "estimated_duties": self.estimated_duties,
            "estimated_taxes": self.estimated_taxes,
            "pdf_path": self.pdf_path,
            "allocation_date": self.allocation_date.isoformat() if self.allocation_date else None,
            "time_to_value_seconds": self.time_to_value_seconds,
            "organization_id": self.organization_id
        }

class UsageMeter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=True, unique=True)
    quotes_processed = db.Column(db.Integer, default=0)
    subscription_tier = db.Column(db.String(20), default="BASE") # BASE ($99), PRO ($499)
    usage_limit = db.Column(db.Integer, default=50) # 50 for Base, 500 for Pro
    billing_cycle_start = db.Column(db.DateTime, default=datetime.utcnow)
    organization_id = db.Column(db.String(50), nullable=True, default="org_demo_123")
    last_processed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "quotes_processed": self.quotes_processed,
            "subscription_tier": self.subscription_tier,
            "usage_limit": self.usage_limit,
            "billing_cycle_start": self.billing_cycle_start.isoformat(),
            "organization_id": self.organization_id,
            "last_processed_at": self.last_processed_at.isoformat()
        }

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=True) # Clerk ID
    category = db.Column(db.String(50), nullable=False) # BUG, FEATURE, OTHER
    message = db.Column(db.Text, nullable=False)
    page_url = db.Column(db.String(255), nullable=True)
    organization_id = db.Column(db.String(50), nullable=True, default="org_demo_123")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="NEW") # NEW, REVIEWED, RESOLVED

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category": self.category,
            "message": self.message,
            "page_url": self.page_url,
            "organization_id": self.organization_id,
            "timestamp": self.timestamp.isoformat(),
            "status": self.status
        }

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quote_id = db.Column(db.Integer, db.ForeignKey('quote.id'), nullable=False)
    user_id = db.Column(db.String(100), nullable=False)
    organization_id = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    quote = db.relationship('Quote', backref=db.backref('comments', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "quote_id": self.quote_id,
            "user_id": self.user_id,
            "organization_id": self.organization_id,
            "content": self.content,
            "timestamp": self.timestamp.isoformat()
        }

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    invoice_date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.String(100), nullable=True) # Clerk ID
    organization_id = db.Column(db.String(50), nullable=True, default="org_demo_123")
    
    invoice_number = db.Column(db.String(50), nullable=True)
    quote_id = db.Column(db.Integer, db.ForeignKey('quote.id'), nullable=True)
    
    total_amount = db.Column(db.Float, nullable=True)
    normalized_total_amount_usd = db.Column(db.Float, nullable=True)
    currency = db.Column(db.String(10), nullable=True)
    
    status = db.Column(db.String(20), default="PENDING") # PENDING, MATCHED, DISCREPANCY, APPROVED, DISPUTED
    discrepancy_details = db.Column(db.JSON, nullable=True) # { "quote_price": 100, "diff": 20, "reason": "Unmapped Surcharge" }
    
    quote = db.relationship('Quote', backref=db.backref('invoices', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "invoice_date": self.invoice_date.isoformat(),
            "invoice_number": self.invoice_number,
            "quote_id": self.quote_id,
            "total_amount": self.total_amount,
            "normalized_total_amount_usd": self.normalized_total_amount_usd,
            "currency": self.currency,
            "status": self.status,
            "discrepancy_details": self.discrepancy_details,
            "organization_id": self.organization_id,
            "quote_data": self.quote.to_dict() if self.quote else None
        }
class Tender(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    organization_id = db.Column(db.String(50), nullable=True, default="org_demo_123")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    deadline = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default="OPEN") # DRAFT, OPEN, CLOSED, AWARDED
    
    estimated_volume = db.Column(db.String(100), nullable=True)
    lane_info = db.Column(db.String(255), nullable=True) # e.g. "Shanghai -> LA"

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "organization_id": self.organization_id,
            "created_at": self.created_at.isoformat(),
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "status": self.status,
            "estimated_volume": self.estimated_volume,
            "lane_info": self.lane_info,
            "bid_count": len(self.bids)
        }

class Bid(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tender_id = db.Column(db.Integer, db.ForeignKey('tender.id'), nullable=False)
    carrier_id = db.Column(db.Integer, db.ForeignKey('carrier.id'), nullable=False)
    
    offered_rate = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default="USD")
    transit_time_days = db.Column(db.Integer, nullable=True)
    
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_winning_bid = db.Column(db.Boolean, default=False)
    carrier_notes = db.Column(db.Text, nullable=True)
    organization_id = db.Column(db.String(50), nullable=True, default="org_demo_123")

    tender = db.relationship('Tender', backref=db.backref('bids', lazy=True))
    carrier = db.relationship('Carrier', backref=db.backref('bids', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "tender_id": self.tender_id,
            "carrier_id": self.carrier_id,
            "carrier_name": self.carrier.name if self.carrier else "Unknown",
            "offered_rate": self.offered_rate,
            "currency": self.currency,
            "transit_time_days": self.transit_time_days,
            "submitted_at": self.submitted_at.isoformat(),
            "is_winning_bid": self.is_winning_bid,
            "carrier_notes": self.carrier_notes,
            "organization_id": self.organization_id
        }

class SKU(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(50), nullable=False) # SKU/Part Number
    current_stock = db.Column(db.Integer, default=0)
    safety_stock = db.Column(db.Integer, default=10)
    reorder_point = db.Column(db.Integer, default=20)
    unit_measure = db.Column(db.String(20), default="units")
    lead_time_days = db.Column(db.Integer, default=14)
    
    # Trade Compliance Fields (Phase 22)
    hs_code = db.Column(db.String(20), nullable=True) # Harmonized System Code
    origin_country = db.Column(db.String(50), nullable=True)
    material_composition = db.Column(db.String(255), nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "organization_id": self.organization_id,
            "name": self.name,
            "code": self.code,
            "current_stock": self.current_stock,
            "safety_stock": self.safety_stock,
            "reorder_point": self.reorder_point,
            "unit_measure": self.unit_measure,
            "lead_time_days": self.lead_time_days,
            "hs_code": self.hs_code,
            "origin_country": self.origin_country,
            "material_composition": self.material_composition
        }

class InventoryImpact(db.Model):
    """Links a Quote/Shipment to SKU volumes for stock prediction."""
    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.String(50), nullable=False)
    sku_id = db.Column(db.Integer, db.ForeignKey('sku.id'), nullable=False)
    quote_id = db.Column(db.Integer, db.ForeignKey('quote.id'), nullable=True)
    
    quantity = db.Column(db.Integer, nullable=False)
    expected_arrival_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default="IN_TRANSIT") # IN_TRANSIT, RECEIVED, CANCELLED

    sku = db.relationship('SKU', backref=db.backref('impacts', lazy=True))
    quote = db.relationship('Quote', backref=db.backref('inventory_links', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "sku_id": self.sku_id,
            "sku_name": self.sku.name if self.sku else "Unknown",
            "quote_id": self.quote_id,
            "quantity": self.quantity,
            "expected_arrival_date": self.expected_arrival_date.isoformat() if self.expected_arrival_date else None,
            "status": self.status
        }
