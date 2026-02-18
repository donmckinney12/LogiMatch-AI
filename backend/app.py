from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()
from services.ocr_service import extract_text_from_pdf
from services.llm_service import extract_data_with_llm, generate_booking_email, generate_exception_email, generate_negotiation_email
from services.coordinator_agent import process_quote_fully
from services.simulation_service import SimulationService
# from services.pdf_service import generate_booking_pdf
from services.risk_service import analyze_risk
from services.email_service import send_email
from services.analytics_service import get_kpi_dashboard, get_analytics_trends
# from services.negotiation_agent import get_negotiation_response
from services.telematics_service import get_shipment_telemetry
from services.customs_service import classify_hs_code, estimate_duties, generate_customs_docs
# from services.claims_service import analyze_damage_photo, file_claim
# from services.messaging_service import create_thread, send_message, get_threads, get_messages, generate_ai_quick_replies

import secrets
from werkzeug.utils import secure_filename
from models import Carrier, Quote, ExchangeRate, db, AuditLog, UsageMeter, Feedback, Comment, Invoice, Tender, Bid, SKU, InventoryImpact, SurchargeReference

import stripe
from datetime import datetime

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Enable CORS for all routes
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://logimatch-app.vercel.app",
            "https://www.logimatch.online",
            "https://logimatch.online",
            "https://logimatch-ai-1.onrender.com"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Organization-ID"],
        "supports_credentials": True
    }
})
def log_audit(action, details=None, category="GENERAL", user_id=None):
    try:
        org_id = get_org_id()
        log = AuditLog(action=action, details=details, category=category, user_id=user_id, organization_id=org_id)
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print(f"Failed to log audit: {e}")

def seed_organization_data(org_id):
    """Clones demo data to a new organization context to prevent empty states."""
    if not org_id or org_id == 'org_demo_123':
        return
    
    # Check if already seeded by looking for any carriers
    if Carrier.query.filter_by(organization_id=org_id).first():
        return
        
    print(f"Seeding demo data for new organization: {org_id}")
    
    try:
        # 1. Clone Carriers (appending org_id to name to satisfy unique constraint)
        demo_carriers = Carrier.query.filter_by(organization_id='org_demo_123').all()
        carrier_map = {} 
        for c in demo_carriers:
            safe_name = f"{c.name} ({org_id[-6:]})"
            # Ensure we don't duplicate if it somehow exists
            existing = Carrier.query.filter_by(name=safe_name).first()
            if existing:
                carrier_map[c.id] = existing.id
                continue
                
            new_c = Carrier(
                name=safe_name,
                reliability_score=c.reliability_score,
                contact_info=c.contact_info,
                organization_id=org_id,
                is_verified=c.is_verified,
                tax_id=c.tax_id,
                compliance_score=c.compliance_score,
                onboarding_status=c.onboarding_status
            )
            db.session.add(new_c)
            db.session.flush() 
            carrier_map[c.id] = new_c.id
            
        # 2. Clone Quotes
        demo_quotes = Quote.query.filter_by(organization_id='org_demo_123').all()
        quote_map = {}
        for q in demo_quotes:
            new_q = Quote(
                filename=q.filename,
                organization_id=org_id,
                carrier_id=carrier_map.get(q.carrier_id),
                origin=q.origin,
                destination=q.destination,
                currency=q.currency,
                total_price=q.total_price,
                normalized_total_price_usd=q.normalized_total_price_usd,
                surcharges=q.surcharges,
                risk_flags=q.risk_flags,
                full_text_content=q.full_text_content,
                po_number=q.po_number,
                status=q.status,
                allocation_date=q.allocation_date,
                time_to_value_seconds=q.time_to_value_seconds,
                booking_ref=q.booking_ref,
                agent_insights=q.agent_insights,
                is_audited=q.is_audited,
                audited_by=q.audited_by,
                carbon_footprint_kg=q.carbon_footprint_kg,
                transit_time_days=q.transit_time_days,
                confidence_score=q.confidence_score,
                estimated_duties=q.estimated_duties,
                estimated_taxes=q.estimated_taxes,
                pdf_path=q.pdf_path
            )
            db.session.add(new_q)
            db.session.flush()
            quote_map[q.id] = new_q.id
            
        # 3. Clone Invoices
        demo_invoices = Invoice.query.filter_by(organization_id='org_demo_123').all()
        for i in demo_invoices:
            new_i = Invoice(
                filename=i.filename,
                invoice_date=i.invoice_date,
                organization_id=org_id,
                invoice_number=i.invoice_number,
                quote_id=quote_map.get(i.quote_id),
                total_amount=i.total_amount,
                normalized_total_amount_usd=i.normalized_total_amount_usd,
                currency=i.currency,
                status=i.status,
                discrepancy_details=i.discrepancy_details
            )
            db.session.add(new_i)
            
        # 4. Clone Tenders
        demo_tenders = Tender.query.filter_by(organization_id='org_demo_123').all()
        for t in demo_tenders:
            new_t = Tender(
                title=t.title,
                description=t.description,
                organization_id=org_id,
                created_at=t.created_at,
                deadline=t.deadline,
                status=t.status,
                estimated_volume=t.estimated_volume,
                lane_info=t.lane_info
            )
            db.session.add(new_t)
            
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding data for {org_id}: {e}")

def get_org_id():
    """Helper to extract organization_id from headers and ensure seeding."""
    org_id = request.headers.get('X-Organization-ID', 'org_demo_123')
    if org_id != 'org_demo_123':
        seed_organization_data(org_id)
    return org_id

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Allow CORS for development and production origins
CORS(app, resources={r"/api/*": {
    "origins": [
        "http://localhost:3000", 
        "http://localhost:3001", 
        "https://logimatch-app.vercel.app",
        "https://www.logimatch.online"
    ],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization", "X-Organization-ID"],
    "supports_credentials": True
}})

# Database Configuration
db_path = os.path.abspath(os.path.join(os.getcwd(), 'logimatch_v4.db'))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
# Fix for SQLite thread errors in dev
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "connect_args": {"check_same_thread": False}
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')

# Ensure upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db.init_app(app)

# Create tables on startup (for MVP simplicity)
with app.app_context():
    db.create_all()

@app.route('/api/audit-logs', methods=['GET'])
def get_audit_logs():
    try:
        org_id = get_org_id()
        category = request.args.get('category')
        query = AuditLog.query.filter_by(organization_id=org_id)
        if category:
            query = query.filter_by(category=category)
        
        logs = query.order_by(AuditLog.timestamp.desc()).limit(100).all()
        return jsonify([l.to_dict() for l in logs])
    except Exception as e:
        print(f"Error fetching audit logs: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "LogiMatch AI Backend"}), 200

# --- Stripe Checkout Endpoints ---
@app.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        data = request.json
        tier = data.get('tier')
        price = data.get('price')
        interval = data.get('interval', 'month')
        
        # Mapping tiers to Stripe Price IDs from .env
        PRICE_MAP = {
            'BASE': {
                'month': os.getenv('NEXT_PUBLIC_STRIPE_BASE_MONTHLY'),
                'year': os.getenv('NEXT_PUBLIC_STRIPE_BASE_YEARLY')
            },
            'PRO': {
                'month': os.getenv('NEXT_PUBLIC_STRIPE_PRO_MONTHLY'),
                'year': os.getenv('NEXT_PUBLIC_STRIPE_PRO_YEARLY')
            },
            'ENTERPRISE': {
                'month': os.getenv('NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY'),
                'year': os.getenv('NEXT_PUBLIC_STRIPE_ENTERPRISE_YEARLY')
            }
        }

        if tier not in PRICE_MAP:
            return jsonify({"error": "Invalid tier requested"}), 400

        price_id = PRICE_MAP[tier].get(interval)
        
        if not price_id:
             return jsonify({"error": f"Price ID not found for {tier} {interval}"}), 400

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            client_reference_id=data.get('user_id'), # Link to Clerk User ID
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{FRONTEND_URL}/settings/billing?success=true&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/settings/billing?canceled=true",
            metadata={
                "tier": tier,
                "interval": interval,
                "user_id": data.get('user_id'),
                "organization_id": request.headers.get('X-Organization-ID')
            }
        )

        return jsonify({'url': session.url})
    except Exception as e:
        print(f"Stripe Error: {e}")
        return jsonify({"error": str(e)}), 500

# --- Stripe Webhook Endpoint ---
@app.route('/api/webhooks/stripe', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('STRIPE_SIGNATURE')
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session.get('client_reference_id')
        metadata = session.get('metadata', {})
        tier = metadata.get('tier', 'BASE')
        
        try:
            # Update UsageMeter for the user
            meter = UsageMeter.query.filter_by(user_id=user_id).first()
            if not meter:
                meter = UsageMeter(user_id=user_id)
                db.session.add(meter)
            
            # Use metadata tier for precise updates
            meter.subscription_tier = tier
            if tier == 'PRO':
                meter.usage_limit = 500
            elif tier == 'ENTERPRISE':
                meter.usage_limit = 10000
            else:
                meter.usage_limit = 50
            
            meter.billing_cycle_start = datetime.utcnow()
            meter.last_processed_at = datetime.utcnow()
            
            db.session.commit()
            log_audit("SUBSCRIPTION_UPGRADED", f"User {user_id} upgraded to {meter.subscription_tier}", "BILLING", user_id)
            print(f"Successfully upgraded user {user_id} to {meter.subscription_tier}")
        except Exception as e:
            print(f"Error updating subscription: {e}")
            return jsonify({"error": "Failed to update subscription"}), 500

    return jsonify({"status": "success"}), 200

# --- Surcharge Endpoints ---
@app.route('/api/surcharges', methods=['GET', 'POST'])
def handle_surcharges():
    try:
        if request.method == 'GET':
            surcharges = SurchargeReference.query.all()
            return jsonify([s.to_dict() for s in surcharges])
        
        if request.method == 'POST':
            data = request.json
            new_surcharge = SurchargeReference(
                raw_name=data.get('raw_name'),
                normalized_name=data.get('normalized_name'),
                category=data.get('category'),
                is_approved=data.get('is_approved', True)
            )
            db.session.add(new_surcharge)
            db.session.commit()
            log_audit("SURCHARGE_UPDATED", f"Added/Updated: {new_surcharge.raw_name}", category="SYSTEM")
            return jsonify(new_surcharge.to_dict()), 201
    except Exception as e:
        print(f"Error in surcharges: {e}")
        return jsonify({"error": str(e)}), 500

# --- Exchange Rate Endpoints ---
@app.route('/api/rates', methods=['GET', 'POST'])
def handle_rates():
    try:
        if request.method == 'GET':
            rates = ExchangeRate.query.all()
            return jsonify([r.to_dict() for r in rates])
        
        if request.method == 'POST':
            data = request.json
            code = data.get('currency_code').upper()
            rate_val = float(data.get('rate_to_usd'))
            
            rate = ExchangeRate.query.filter_by(currency_code=code).first()
            if rate:
                rate.rate_to_usd = rate_val
                rate.last_updated = datetime.utcnow()
                log_audit("RATE_UPDATED", f"Updated {code} to {rate_val}")
            else:
                rate = ExchangeRate(currency_code=code, rate_to_usd=rate_val)
                db.session.add(rate)
                log_audit("RATE_CREATED", f"Set {code} to {rate_val}", category="SYSTEM")
            
            db.session.commit()
            return jsonify(rate.to_dict()), 201
    except Exception as e:
        print(f"Error in rates: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/rates/sync', methods=['POST'])
def sync_forex_rates():
    """
    Forex Intelligence Agent: Simulates fetching real-time market data
    and flagging high-volatility currencies.
    """
    try:
        org_id = get_org_id()
        # Mock volatility check
        rates = ExchangeRate.query.all()
        updates = []
        for rate in rates:
            # Simulate a small drift
            import random
            drift = 1.0 + (random.uniform(-0.02, 0.02))
            rate.rate_to_usd *= drift
            rate.last_updated = datetime.utcnow()
            updates.append(rate.currency_code)
        
        db.session.commit()
        log_audit("FOREX_RATE_SYNC", f"Synced {len(updates)} currencies", category="SYSTEM")
        
        return jsonify({
            "status": "success",
            "message": f"Synchronized {len(updates)} rates via Market Intelligence Agent.",
            "volatility_alert": "CNY exhibiting high variance (>2.5%)",
            "impacted": updates
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ...

# --- Agentic/AI Endpoints ---

@app.route('/api/search/global', methods=['GET'])
def global_search():
    """
    Global Search & Intelligence Endpoint.
    Searches Quotes, Carriers, and Lanes based on a query string.
    """
    query = request.args.get('query', '').lower()
    if not query or len(query) < 2:
        return jsonify([])

    results = []
    
    try:
        org_id = get_org_id()
        
        # 1. Search Carriers
        carriers = Carrier.query.filter(Carrier.name.ilike(f'%{query}%')).limit(5).all()
        for c in carriers:
            results.append({
                "id": f"carrier-{c.id}",
                "type": "CARRIER",
                "title": c.name,
                "subtitle": "Global Logistics Partner",
                "score": c.compliance_score or 0,
                "action": f"/carriers/{c.id}"
            })
            
        # 2. Search Quotes (ID, Origin, Destination)
        from sqlalchemy import or_
        quotes = Quote.query.filter(
            Quote.organization_id == org_id,
            or_(
                Quote.id.cast(db.String).ilike(f'%{query}%'),
                Quote.origin.ilike(f'%{query}%'),
                Quote.destination.ilike(f'%{query}%'),
                Quote.carrier_id.in_([c.id for c in carriers]) # Also show quotes from matched carriers
            )
        ).limit(10).all()
        
        for q in quotes:
            results.append({
                "id": f"quote-{q.id}",
                "type": "QUOTE",
                "title": f"{q.origin} -> {q.destination}",
                "subtitle": f"Quote #{q.id} • {q.carrier.name}",
                "value": f"${q.normalized_total_price_usd:.2f}" if q.normalized_total_price_usd else "N/A",
                "action": f"/quotes/{q.id}"
            })

        # 3. Smart Actions (Intelligence Layer)
        if "analy" in query or "report" in query:
            results.append({
                "id": "action-analytics",
                "type": "ACTION",
                "title": "Open Analytics Dashboard",
                "subtitle": "View market trends and KPI reports",
                "icon": "BarChart",
                "action": "/analytics"
            })
            
        if "new" in query or "create" in query or "quote" in query:
             results.append({
                "id": "action-create-quote",
                "type": "ACTION",
                "title": "Create New Quote",
                "subtitle": "Launch the automated bid portal",
                "icon": "Plus",
                "action": "/procurement/tenders"
            })

        # 4. Resource Indexing (Docs, Blog, API)
        if any(k in query for k in ["docs", "help", "guide", "quick"]):
            results.append({
                "id": "resource-docs",
                "type": "ACTION",
                "title": "Documentation Hub",
                "subtitle": "Guides, Tutorials, and Technical Resources",
                "icon": "FileText",
                "action": "/docs"
            })
            results.append({
                "id": "resource-quick",
                "type": "ACTION",
                "title": "Technical Quick Start",
                "subtitle": "Engineering guide for rapid integration",
                "icon": "Zap",
                "action": "/docs/quick-start"
            })

        if any(k in query for k in ["api", "ref", "dev"]):
            results.append({
                "id": "resource-api",
                "type": "ACTION",
                "title": "API Reference",
                "subtitle": "REST endpoints and SDK specifications",
                "icon": "Code",
                "action": "/api-reference"
            })

        if any(k in query for k in ["blog", "news", "insight"]):
            results.append({
                "id": "resource-blog",
                "type": "ACTION",
                "title": "Engineering Blog",
                "subtitle": "Latest updates and logistics intelligence",
                "icon": "BarChart",
                "action": "/blog"
            })
            
        if any(k in query for k in ["case", "success", "study"]):
            results.append({
                "id": "resource-case",
                "type": "ACTION",
                "title": "Enterprise Case Studies",
                "subtitle": "Measurable ROI and success stories",
                "icon": "FileText",
                "action": "/case-studies"
            })
            
        return jsonify(results)

    except Exception as e:
        print(f"Search Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """
    AI Sidekick Chat Endpoint.
    Context-aware assistant for navigation, summarization, and drafting.
    """
    data = request.json
    message = data.get('message', '').lower()
    context = data.get('context', {}) # e.g. {"page": "/dashboard", "data": ...}
    
    response_text = ""
    actions = []
    
    try:
        # 1. Intent: Navigation / "Go to"
        if "go to" in message or "open" in message:
            if "dashboard" in message:
                response_text = "Navigating to Mission Control..."
                actions.append({"type": "NAVIGATE", "payload": "/"})
            elif "settings" in message:
                response_text = "Opening Settings..."
                actions.append({"type": "NAVIGATE", "payload": "/settings"})
            elif "quotes" in message:
                response_text = "Taking you to the Quote Manager..."
                actions.append({"type": "NAVIGATE", "payload": "/procurement/tenders"})
            else:
                response_text = "I'm not sure which page you mean. Try 'Dashboard' or 'Settings'."

        # 2. Intent: Draft Email / Content Gen
        elif "draft" in message or "email" in message:
            response_text = "I've drafted a negotiation email for you. You can review it below."
            actions.append({
                "type": "DRAFT_EMAIL",
                "payload": {
                    "subject": "Urgent: Rate Review Request - [Carrier Name]",
                    "body": "Dear [Carrier],\n\nWe noticed a discrepancy in the recent invoice regarding the fuel surcharge. Please clarify..."
                }
            })

        # 3. Intent: Summary / Insights
        elif "summary" in message or "how many" in message or "status" in message:
            # Mock data fetch (real app would query DB)
            org_id = get_org_id()
            count = Quote.query.filter_by(organization_id=org_id).count()
            response_text = f"You currently have {count} active quotes in the system. 12 are pending approval, and 3 are flagged for risk."
            actions.append({"type": "SHOW_CHART", "payload": "quote_volume"})

        # 4. Default / Chit-Chat
        else:
            response_text = "I can help you navigate the app, summarize your data, or draft emails to carriers. Try asking: 'Show me active quotes' or 'Draft an email to Maersk'."

        return jsonify({
            "message": response_text,
            "actions": actions
        })

    except Exception as e:
        print(f"AI Chat Error: {e}")
        return jsonify({"error": str(e)}), 500

# ...

@app.route('/api/generate-booking-pdf', methods=['POST'])
def generate_pdf():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        filepath = generate_booking_pdf(data)
        log_audit("BOOKING_GENERATED", f"PDF for {data.get('carrier')}", category="QUOTE")
        
        return send_file(filepath, as_attachment=True, download_name=os.path.basename(filepath))
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-email', methods=['POST'])
def generate_email():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        email_content = generate_booking_email(data)
        log_audit("BOOKING_DRAFTED", f"For Carrier: {data.get('carrier')}", category="QUOTE")
        return jsonify(email_content)
    except Exception as e:
        print(f"Error generating email: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/extract', methods=['POST'])
def extract_pdf():
    org_id = get_org_id()
    # ... file checks ...
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        try:
            # 1. Save and OCR
            filename = secure_filename(file.filename)
            unique_filename = f"{secrets.token_hex(4)}_{filename}"
            pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            # Use original bytes for extraction then save
            pdf_bytes = file.read()
            with open(pdf_path, 'wb') as f:
                f.write(pdf_bytes)

            text = extract_text_from_pdf(pdf_bytes)
            
            if not text:
                 return jsonify({"error": "Failed to extract text from PDF"}), 500

            # Increment Usage Meter
            user_id = request.form.get('user_id') or 'PilotUser_01'
            usage = UsageMeter.query.filter_by(user_id=user_id).first()
            if not usage:
                usage = UsageMeter(user_id=user_id, quotes_processed=1)
                db.session.add(usage)
            else:
                usage.quotes_processed += 1
                usage.last_processed_at = datetime.utcnow()
            
            # 2. Multi-Agent Audit (Replaces linear LLM + Risk)
            extracted_data = process_quote_fully(text)
            
            if "error" in extracted_data:
                return jsonify({"error": extracted_data["error"]}), 500
            
            risk_flags = extracted_data.get('risk_flags', [])
            agent_insights = extracted_data.get('agent_insights', [])
            
            # ... Save to DB ...
            carrier_name = extracted_data.get('carrier', 'Unknown')
            # ... carrier creation logic ...
            carrier = Carrier.query.filter_by(name=carrier_name, organization_id=org_id).first()
            if not carrier:
                carrier = Carrier(name=carrier_name, organization_id=org_id)
                db.session.add(carrier)
                db.session.commit()
            
            user_id = request.form.get('user_id') # Get Clerk ID from frontend
            
            new_quote = Quote(
                filename=file.filename,
                organization_id=org_id,
                user_id=user_id,
                carrier=carrier,
                origin=extracted_data.get('origin'),
                destination=extracted_data.get('destination'),
                total_price=extracted_data.get('total_price'),
                currency=extracted_data.get('currency'),
                normalized_total_price_usd=extracted_data.get('normalized_total_price_usd'),
                surcharges=extracted_data.get('surcharges'), # Store list
                risk_flags=risk_flags,
                agent_insights=agent_insights, # New field
                carbon_footprint_kg=extracted_data.get('carbon_footprint_kg'),
                confidence_score=extracted_data.get('confidence_score', 1.0),
                pdf_path=unique_filename,
                transit_time_days=extracted_data.get('transit_time_days', 14), # Default for demo
                status='DRAFT',
                full_text_content=text
            )
            db.session.add(new_quote)
            db.session.commit()
            
            log_audit("QUOTE_UPLOAD", f"Processed {file.filename} ({carrier_name})", category="QUOTE", user_id=user_id)

            # Return with ID for frontend reference
            response_data = new_quote.to_dict()

            return jsonify({
                "text_preview": text[:500] + "..." if len(text) > 500 else text,
                "data": response_data
            })
        except Exception as e:
            print(f"Error extracting PDF: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/api/quotes/<int:quote_id>/simulate', methods=['POST'])
def simulate_landed_cost(quote_id):
    data = request.json
    hs_code = data.get('hs_code')
    
    if not hs_code:
        return jsonify({"error": "HS Code is required"}), 400
        
    org_id = get_org_id()
    quote = Quote.query.filter_by(id=quote_id, organization_id=org_id).first()
    if not quote:
        return jsonify({"error": "Quote not found or access denied"}), 404
        
    try:
        # Use normalized price for simulation (mock assumes USD base)
        base_price = quote.normalized_total_price_usd or quote.total_price
        
        sim_result = SimulationService.calculate_landed_cost(base_price, hs_code)
        
        # Save to quote
        quote.estimated_duties = sim_result["estimated_duties"]
        quote.estimated_taxes = sim_result["estimated_taxes"]
        db.session.commit()
        
        return jsonify({
            "quote_id": quote_id,
            "simulation": sim_result,
            "updated_quote": quote.to_dict()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/usage', methods=['GET'])
def get_usage():
    user_id = request.args.get('user_id') or 'PilotUser_01'
    usage = UsageMeter.query.filter_by(user_id=user_id).first()
    if not usage:
        # Create default for demo
        usage = UsageMeter(user_id=user_id, subscription_tier="BASE", usage_limit=50)
        db.session.add(usage)
        db.session.commit()
    
    overage = max(0, usage.quotes_processed - usage.usage_limit)
    overage_fees = overage * 1.0 # $1.00 per overage quote
    
    data = usage.to_dict()
    data["overage"] = overage
    data["overage_fees"] = overage_fees
    data["monthly_base"] = 99.0 if usage.subscription_tier == "BASE" else 499.0
    
    return jsonify(data)

@app.route('/api/billing/tier', methods=['POST'])
def update_billing_tier():
    data = request.json
    user_id = data.get('user_id') or 'PilotUser_01'
    tier = data.get('tier') # BASE or PRO
    
    usage = UsageMeter.query.filter_by(user_id=user_id).first()
    if usage:
        usage.subscription_tier = tier
        usage.usage_limit = 50 if tier == "BASE" else 500
        db.session.commit()
    return jsonify({"success": True, "tier": tier})

@app.route('/api/org/members', methods=['GET'])
def get_org_members():
    # Mock role management
    return jsonify([
        {"id": 1, "name": "Sarah Jensen", "email": "sarah@logistics-corp.com", "role": "ADMIN"},
        {"id": 2, "name": "Mike Chen", "email": "mike@logistics-corp.com", "role": "OPS_MANAGER"},
        {"id": 3, "name": "Pilot User", "email": "pilot@demo.com", "role": "OPS_MANAGER"}
    ])

@app.route('/api/ingest/email', methods=['POST'])
def ingest_email_quote():
    """
    Simulates a webhook from a mail provider.
    Expects JSON with 'from_email' and a base64 or path to file.
    """
    data = request.json
    sender = data.get('from', 'carrier@global-freight.com')
    
    # In a real scenario, we'd extract the attachment and call extract_pdf logic.
    # For the demo, we'll create a mock successfully processed quote.
    log_audit("EMAIL_INGESTION", f"Mock ingestion from {sender}")
    
    # Mock data for the demonstration
    return jsonify({
        "status": "received",
        "message": f"Quote ingestion triggered for {sender}. It will appear on the dashboard shortly.",
        "job_id": secrets.token_hex(8)
    })

# --- Vendor Onboarding Endpoints ---
@app.route('/api/vendors/onboarding', methods=['POST'])
def vendor_onboarding():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    required_fields = ['company_name', 'email', 'tax_id']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
        
    try:
        # Check if carrier exists
        if Carrier.query.filter_by(name=data['company_name']).first():
            return jsonify({"error": "Carrier already registered"}), 409
            
        new_carrier = Carrier(
            name=data['company_name'],
            contact_info=data['email'],
            tax_id=data['tax_id'],
            onboarding_status="PENDING",
            is_verified=False,
            # Simple mock compliance score logic
            compliance_score=85.0 if len(data.get('tax_id', '')) > 5 else 40.0
        )
        
        db.session.add(new_carrier)
        db.session.commit()
        
        log_audit("NEW_VENDOR_APPLICATION", f"Application received from {new_carrier.name}", category="SYSTEM")
        
        return jsonify({
            "message": "Application submitted successfully", 
            "carrier_id": new_carrier.id
        }), 201
    except Exception as e:
        print(f"Error onboarding vendor: {e}")
        return jsonify({"error": str(e)}), 500

# --- Direct Quote Submission ---
@app.route('/api/quotes/direct', methods=['POST'])
def direct_quote_submission():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    required = ['carrier', 'origin', 'destination', 'total_price', 'currency']
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400
        
    try:
        # 1. Normalize/Prepare Data
        carrier_name = data['carrier']
        carrier = Carrier.query.filter_by(name=carrier_name).first()
        if not carrier:
            carrier = Carrier(name=carrier_name, is_verified=False)
            db.session.add(carrier)
            db.session.commit()
            
        # 2. Risk Analysis
        risk_flags = analyze_risk(data)
        
        # 3. Currency Normalization (if USD rate exists)
        normalized_price = None
        if data['currency'] == 'USD':
            normalized_price = float(data['total_price'])
        else:
            # Try to find rate
            rate_obj = ExchangeRate.query.filter_by(currency_code=data['currency']).first()
            if rate_obj:
                normalized_price = float(data['total_price']) * rate_obj.rate_to_usd
        
        # 4. Create Quote
        new_quote = Quote(
            filename=f"Direct_Submission_{datetime.now().strftime('%Y%m%d')}",
            carrier=carrier,
            origin=data['origin'],
            destination=data['destination'],
            total_price=float(data['total_price']),
            currency=data['currency'],
            normalized_total_price_usd=normalized_price,
            surcharges=data.get('surcharges', []),
            risk_flags=risk_flags,
            full_text_content=f"Direct Submission via Portal\nValid until: {data.get('validity_date', 'N/A')}"
        )
        
        db.session.add(new_quote)
        db.session.commit()
        
        log_audit("DIRECT_QUOTE_SUBMISSION", f"Carrier: {carrier_name} - {len(risk_flags)} Risks", category="QUOTE")
        
        return jsonify(new_quote.to_dict()), 201
        
    except Exception as e:
        print(f"Error direct quote: {e}")
        return jsonify({"error": str(e)}), 500

# --- Procurement Endpoints ---
@app.route('/api/quotes/<int:quote_id>/allocate', methods=['POST'])
def allocate_quote(quote_id):
    data = request.json
    po_number = data.get('po_number')
    
    if not po_number:
        return jsonify({"error": "PO Number required"}), 400
        
    try:
        org_id = get_org_id()
        quote = Quote.query.filter_by(id=quote_id, organization_id=org_id).first()
        if not quote:
            return jsonify({"error": "Quote not found"}), 404
            
        quote.po_number = po_number
        quote.status = "ALLOCATED"
        
        # Calculate Time-to-Value
        now = datetime.utcnow()
        quote.allocation_date = now
        if quote.upload_date:
            delta = now - quote.upload_date
            quote.time_to_value_seconds = int(delta.total_seconds())
            
        db.session.commit()
        
        log_audit("PO_ALLOCATED", f"Quote {quote_id} -> {po_number}", category="QUOTE")
        if quote.time_to_value_seconds:
            log_audit("KPI_TIME_TO_VALUE", f"{quote.time_to_value_seconds} seconds", category="SYSTEM")
        
        return jsonify(quote.to_dict()), 200
    except Exception as e:
        print(f"Error allocating quote: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/shipments/exception', methods=['POST'])
def report_exception():
    data = request.json
    po_number = data.get('po_number')
    reason = data.get('reason', 'Unspecified Delay')
    
    if not po_number:
        return jsonify({"error": "PO Number required"}), 400
        
    try:
        # Real AI Drafting
        email_content = generate_exception_email(po_number, reason)
        
        # Log the "Agent Action"
        log_audit("AGENT_EXCEPTION_HANDLING", f"Drafted email for {po_number}: {reason}", category="QUOTE")
        
        return jsonify({
            "po_number": po_number,
            "reason": reason,
            "action": "Email Drafted",
            "draft_subject": email_content.get('subject', 'Urgent Update'),
            "draft_body": email_content.get('body', 'Content generation failed.')
        })
    except Exception as e:
        print(f"Error reporting exception: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/email/send', methods=['POST'])
def send_email_endpoint():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    to_email = data.get('to', 'warehouse@logimatch-demo.com') # Default for demo
    subject = data.get('subject')
    body = data.get('body')
    
    if not subject or not body:
        return jsonify({"error": "Subject and Body required"}), 400
        
    try:
        result = send_email(to_email, subject, body)
        log_audit("EMAIL_SENT", f"Subject: {subject}", category="SYSTEM")
        return jsonify(result), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/analytics', methods=['GET'])
def get_admin_analytics():
    org_id = get_org_id()
    data = get_kpi_dashboard(organization_id=org_id)
    return jsonify(data)

@app.route('/api/analytics/market', methods=['GET'])
def get_market_trends():
    """
    Returns time-series data for market freight rates.
    Simulated for demo purposes.
    """
    import random
    months = ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26"]
    base_rate = 1450
    trends = []
    
    for i, month in enumerate(months):
        # Create a rising trend with some noise
        base_rate += random.randint(20, 100)
        trends.append({
            "month": month,
            "market_avg": base_rate,
            "high_estimate": base_rate * 1.15,
            "low_estimate": base_rate * 0.9
        })
        
    return jsonify({
        "current_market_avg": base_rate,
        "trends": trends,
        "forecast": "RISING",
        "advisory": "Freight indices show a 12% increase in trans-pacific lanes. Recommended booking window: Within 7 days."
    })


@app.route('/api/analytics/lanes', methods=['GET'])
def get_lane_analytics():
    """Aggregates all quotes into unique lane pairings."""
    try:
        org_id = get_org_id()
        quotes = Quote.query.filter_by(organization_id=org_id).all()
        
        lanes = {}
        for q in quotes:
            origin = q.origin or "Unknown"
            destination = q.destination or "Unknown"
            lane_key = f"{origin} to {destination}"
            
            if lane_key not in lanes:
                lanes[lane_key] = {
                    "origin": origin,
                    "destination": destination,
                    "quote_count": 0,
                    "avg_price": 0,
                    "total_price": 0
                }
            
            price = q.normalized_total_price_usd or 0
            lanes[lane_key]["quote_count"] += 1
            lanes[lane_key]["total_price"] += price
            
        # Calculate averages and format
        results = []
        for key, val in lanes.items():
            if val["quote_count"] > 0:
                val["avg_price"] = round(val["total_price"] / val["quote_count"], 2)
            results.append(val)
            
        return jsonify(results)
    except Exception as e:
        print(f"Lanes Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analytics/forecast', methods=['GET'])
def get_lane_forecast():
    """Returns predictive rate forecast for a specific lane."""
    origin = request.args.get('origin', 'Shanghai')
    destination = request.args.get('destination', 'Los Angeles')
    
    import random
    from datetime import timedelta
    
    # Generate 8 weeks of data (4 past, 4 future)
    base_rate = 1580.0
    data = []
    
    for i in range(-4, 5):
        date = (datetime.utcnow() + timedelta(weeks=i)).strftime("%Y-%m-%d")
        # Add random volatility
        variation = random.uniform(-50, 50)
        rate = base_rate + (i * 15) + variation # Slight upward trend
        
        data.append({
            "date": date,
            "rate": round(rate, 2),
            "type": "ACTUAL" if i <= 0 else "PREDICTED"
        })
        
    return jsonify({
        "lane": f"{origin} -> {destination}",
        "forecast_data": data,
        "market_sentiment": "STABLE" if origin == "Shanghai" else "VOLATILE",
        "advisory": f"Market capacity on {origin} lane is tightening. Expect 5% increase in spot rates by next month."
    })

@app.route('/api/analytics/dominance', methods=['GET'])
def get_carrier_dominance():
    """Ranks carriers by historical volume and price success on a lane."""
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    
    # Mock dominance logic based on existing carriers
    carriers = Carrier.query.all()
    results = []
    
    import random
    for c in carriers:
        # Randomly assign "strength" to carriers for this lane
        share = random.randint(5, 30)
        reliability = c.reliability_score or 85
        
        results.append({
            "carrier_name": c.name,
            "market_share": share,
            "avg_transit_days": random.randint(14, 28),
            "reliability_score": reliability,
            "is_preferred": share > 20
        })
        
    return jsonify(sorted(results, key=lambda x: x["market_share"], reverse=True))

@app.route('/api/risk/disruptions', methods=['GET'])
def get_risk_disruptions():
    """Returns a feed of active global logistics disruptions."""
    disruptions = [
        {
            "id": "DIS-001",
            "type": "STRIKE",
            "severity": "CRITICAL",
            "location": "Port of Long Beach",
            "description": "Labor strike initiating at Terminal A. Expect 5-7 day delays.",
            "status": "ACTIVE",
            "timestamp": datetime.utcnow().isoformat()
        },
        {
            "id": "DIS-002",
            "type": "WEATHER",
            "severity": "HIGH",
            "location": "South China Sea",
            "description": "Tropical Storm Mulan approaching. All small vessel traffic suspended.",
            "status": "MONITORING",
            "timestamp": datetime.utcnow().isoformat()
        },
        {
            "id": "DIS-003",
            "type": "CONGESTION",
            "severity": "MEDIUM",
            "location": "Rotterdam",
            "description": "System failure in automated gate system causing truck backlog.",
            "status": "RECOVERING",
            "timestamp": datetime.utcnow().isoformat()
        }
    ]
    return jsonify(disruptions)

@app.route('/api/risk/impact-analysis', methods=['POST'])
def analyze_risk_impact():
    """Identifies which quotes/shipments are at risk based on active disruptions."""
    org_id = get_org_id()
    try:
        # Fetch active disruptions (real world: would be from a live DB/API)
        # Mocking for demo
        at_risk_lanes = ["Shanghai to Los Angeles", "Ningbo to Rotterdam"]
        
        quotes = Quote.query.filter_by(organization_id=org_id).all()
        impacted_quotes = []
        
        for q in quotes:
            lane = f"{q.origin} to {q.destination}"
            if lane in at_risk_lanes:
                impacted_quotes.append({
                    "quote_id": q.id,
                    "carrier": q.carrier.name if q.carrier else "Unknown",
                    "lane": lane,
                    "status": q.status,
                    "impact_score": 85 if q.status == 'ALLOCATED' else 45,
                    "threat_type": "PORT_STRIKE" if "Los Angeles" in lane else "WEATHER"
                })
        
        return jsonify({
            "total_at_risk": len(impacted_quotes),
            "impact_assessment": impacted_quotes,
            "financial_exposure_usd": sum(q.get('impact_score', 0) * 10 or 0 for q in impacted_quotes) # Mock calculation
        })
    except Exception as e:
        print(f"Risk Impact Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/risk/mitigation', methods=['GET'])
def get_mitigation_strategy():
    """Generates AI-driven mitigation steps for a specific disruption."""
    type = request.args.get('type', 'STRIKE')
    location = request.args.get('location', 'Global')
    
    strategies = {
        "STRIKE": [
            "Divert Shanghai -> LAX shipments to Port of Oakland.",
            "Prioritize LCL cargo for air-freight conversion.",
            "Extend warehouse storage contracts in origin ports."
        ],
        "WEATHER": [
            "Monitor vessel rerouting around Storm Mulan.",
            "Notify end-customers of 48h 'force majeure' delay.",
            "Check temperature-sensitive cargo battery levels."
        ],
        "CONGESTION": [
            "Switch to night-gate appointments for truck drayage.",
            "Utilize secondary rail-heads for inland distribution.",
            "Verify demurrage/detention clocks with carriers."
        ]
    }
    
    return jsonify({
        "location": location,
        "primary_threat": type,
        "recommendations": strategies.get(type, ["Standard monitoring protocol initiated."]),
        "confidence_level": "88%",
        "agent": "Resilience-Coordinator-Agent"
    })

@app.route('/api/analytics/executive', methods=['GET'])
def get_executive_analytics():
    """
    Strategic Intelligence: Aggregates Year-to-Date data for leadership.
    """
    try:
        org_id = get_org_id()
        quotes = Quote.query.filter_by(organization_id=org_id).all()
        # Filter for logic
        allocated = [q for q in quotes if q.status == 'ALLOCATED']
        
        # Calculate YTD Spend (mocked as total of all allocated)
        total_spend = sum(q.normalized_total_price_usd or 0 for q in allocated)
        
        # Savings Calculation (Mock Logic: Avg of high quotes in each lane - actual spend)
        # In a real app we'd group by lane
        theoretical_unoptimized = total_spend * 1.18 # Mock 18% savings success estimate
        savings = theoretical_unoptimized - total_spend
        
        # Carrier Performance Matrix (Carrier, Price, Transit)
        performance = {}
        for q in quotes:
            if not q.carrier: continue
            carrier_name = q.carrier.name
            if carrier_name not in performance:
                performance[carrier_name] = {"prices": [], "transits": []}
            if q.normalized_total_price_usd:
                performance[carrier_name]["prices"].append(q.normalized_total_price_usd)
            if q.transit_time_days:
                performance[carrier_name]["transits"].append(q.transit_time_days)
        
        matrix = []
        for carrier, data in performance.items():
            if not data["prices"]: continue
            avg_p = sum(data["prices"])/len(data["prices"])
            avg_t = sum(data["transits"])/len(data["transits"]) if data["transits"] else 0
            matrix.append({
                "carrier": carrier,
                "avg_price": round(avg_p, 2),
                "avg_transit": round(avg_t, 1),
                "volume": len(data["prices"])
            })

        return jsonify({
            "total_spend_ytd": round(total_spend, 2),
            "total_savings_ytd": round(savings, 2),
            "savings_percent": 15.2, # Mocked achievement
            "carrier_matrix": matrix,
            "monthly_trends": [
                {"month": "Jan", "spend": round(total_spend * 0.8, 2)},
                {"month": "Feb", "spend": round(total_spend * 0.9, 2)},
                {"month": "Mar", "spend": round(total_spend, 2)}
            ]
        })
    except Exception as e:
        print(f"Exec Analytics Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports/generate', methods=['POST'])
def generate_report():
    """
    Simulates generating a downloadable intelligence report.
    """
    try:
        data = request.json
        report_type = data.get('type', 'EXECUTIVE_SUMMARY')
        log_audit("REPORT_GENERATED", f"Generated {report_type}", category="SYSTEM")
        return jsonify({
            "status": "success",
            "report_id": f"REP-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "download_url": "#",
            "message": "Report generation initiated by Multi-Agent Reporting Service"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/quotes/<int:quote_id>/comments', methods=['GET', 'POST'])
def manage_comments(quote_id):
    org_id = get_org_id()
    try:
        quote = Quote.query.filter_by(id=quote_id, organization_id=org_id).first()
        if not quote:
            return jsonify({"error": "Quote not found or access denied"}), 404
            
        if request.method == 'GET':
            comments = Comment.query.filter_by(quote_id=quote_id).order_by(Comment.timestamp.asc()).all()
            return jsonify([c.to_dict() for c in comments])
            
        if request.method == 'POST':
            data = request.json
            content = data.get('content')
            user_id = data.get('user_id', 'Unknown')
            
            if not content:
                return jsonify({"error": "Content required"}), 400
                
            comment = Comment(
                quote_id=quote_id,
                user_id=user_id,
                organization_id=org_id,
                content=content
            )
            db.session.add(comment)
            db.session.commit()
            
            log_audit("COMMENT_ADDED", f"On Quote: {quote_id} by {user_id}", category="QUOTE")
            return jsonify(comment.to_dict()), 201
            
    except Exception as e:
        print(f"Comments Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/erp/sync', methods=['POST'])
def sync_to_erp():
    data = request.json
    quote_id = data.get('quote_id')
    
    if not quote_id:
        return jsonify({"error": "Quote ID required"}), 400
        
    org_id = get_org_id()
    quote = Quote.query.filter_by(id=quote_id, organization_id=org_id).first()
    if not quote:
        return jsonify({"error": "Quote not found"}), 404
        
    if not quote.is_audited:
        return jsonify({"error": "Only VERIFIED quotes can be synchronized with ERP."}), 400
        
    # Mock transmission delay
    import time
    time.sleep(1) 
    
    log_audit("ERP_SYNC_SUCCESS", f"Quote {quote_id} pushed to Financial Gateway")
    
    return jsonify({
        "status": "success",
        "erp_reference": f"SAP-LOG-{secrets.token_hex(4).upper()}",
        "synced_at": datetime.utcnow().isoformat(),
        "details": "Data transmitted to Oracle Financials Cloud"
    })

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    try:
        new_feedback = Feedback(
            user_id=data.get('user_id'),
            category=data.get('category', 'OTHER'),
            message=data.get('message'),
            page_url=data.get('page_url')
        )
        db.session.add(new_feedback)
        db.session.commit()
        
        # Notify Admin via Email
        subject = f"New Feedback: {data.get('category')} from {data.get('user_id', 'Guest')}"
        body = f"""
        <p><strong>Category:</strong> {data.get('category')}</p>
        <p><strong>User:</strong> {data.get('user_id')}</p>
        <p><strong>Page:</strong> {data.get('page_url')}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px;">{data.get('message')}</blockquote>
        """
        # Fire and forget (don't block response on email)
        try:
            admin_email = os.getenv("ADMIN_EMAIL", "admin@logimatch.ai")
            send_email(admin_email, subject, body)
        except Exception as e:
            print(f"Failed to email feedback: {e}")

        return jsonify({"message": "Feedback received"}), 201
    except Exception as e:
        print(f"Feedback Error: {e}")
        return jsonify({"error": str(e)}), 500

        return jsonify({"error": str(e)}), 500

@app.route('/api/inbound/email-webhook', methods=['POST'])
def inbound_email_webhook():
    """
    Endpoint for Inbound Email providers to POST parsed JSON.
    """
    from services.inbound_email_service import process_inbound_email
    data = request.json
    if not data:
        return jsonify({"error": "No payload"}), 400
        
    try:
        results = process_inbound_email(data)
        log_audit("INBOUND_EMAIL_RECEIVED", f"From: {data.get('from')} - Quotes: {len(results)}", category="QUOTE")
        return jsonify({
            "status": "success",
            "processed_count": len(results),
            "quotes": results
        }), 201
    except Exception as e:
        print(f"Webhook Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/quotes', methods=['GET'])
def get_quotes():
    try:
        org_id = get_org_id()
        quotes = Quote.query.filter_by(organization_id=org_id).order_by(Quote.upload_date.desc()).all()
        # Inject market delta für Phase 9
        market_avg = 1650.0 
        results = []
        for q in quotes:
            d = q.to_dict()
            price = q.normalized_total_price_usd or 0
            if price > 0:
                delta = ((price - market_avg) / market_avg) * 100
                d["market_delta"] = round(delta, 1)
            else:
                d["market_delta"] = 0
            
            # Count comments
            d["comment_count"] = Comment.query.filter_by(quote_id=q.id).count()
            results.append(d)
        return jsonify(results)
    except Exception as e:
        print(f"Error fetching quotes: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/quotes/<int:quote_id>/approve-audit', methods=['POST'])
def approve_audit(quote_id):
    data = request.json
    try:
        org_id = get_org_id()
        print(f"[AUDIT] Attempting to approve quote {quote_id} for org {org_id}")
        
        quote = Quote.query.filter_by(id=quote_id, organization_id=org_id).first()
        if not quote:
            # Robust Fallback Logic for Debugging
            raw_quote = Quote.query.get(quote_id)
            if raw_quote:
                print(f"[AUDIT] FAIL: Quote {quote_id} exists but belongs to org {raw_quote.organization_id} (Requested: {org_id})")
                return jsonify({"error": f"Quote {quote_id} is associated with a different organization. Please re-upload or check your context."}), 403
            
            print(f"[AUDIT] FAIL: Quote {quote_id} does not exist in the database.")
            return jsonify({"error": "Quote not found"}), 404
        
        quote.is_audited = True
        quote.audited_by = data.get('user_id', 'Unknown')
        
        log_audit("AUDIT_APPROVED", f"Quote ID: {quote_id} by {quote.audited_by}", category="QUOTE", user_id=quote.audited_by)
        db.session.commit()
        
        return jsonify({"message": "Audit approved", "quote": quote.to_dict()})
    except Exception as e:
        print(f"[AUDIT] CRITICAL ERROR: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/reconcile/upload', methods=['POST'])
def upload_invoice():
    """Specialized OCR endpoint for Invoices."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    org_id = get_org_id()
    user_id = request.form.get('user_id', 'Unknown')
    
    try:
        # Save file
        filename = secure_filename(file.filename)
        upload_dir = os.path.join(os.getcwd(), 'uploads', 'invoices')
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, filename)
        file.save(file_path)
        
        # Mock OCR Extraction
        import random
        from datetime import timedelta
        
        # Generate mock invoice data
        invoice_num = f"INV-{random.randint(10000, 99999)}"
        amount = random.uniform(1500, 2500)
        
        # Try to find a matching Quote (mock logic: find an 'ALLOCATED' quote)
        quote = Quote.query.filter_by(organization_id=org_id, status='ALLOCATED').first()
        
        status = "PENDING"
        discrepancy = None
        quote_id = None
        
        if quote:
            quote_id = quote.id
            quote_price = quote.normalized_total_price_usd or 0
            # Force a discrepancy 50% of the time for demo
            if random.random() > 0.5:
                # Discrepancy
                overcharge = random.choice([150.0, 225.0, 75.0])
                amount = quote_price + overcharge
                status = "DISCREPANCY"
                discrepancy = {
                    "quote_price": round(quote_price, 2),
                    "invoice_price": round(amount, 2),
                    "diff": round(overcharge, 2),
                    "reason": "Unexpected Fuel Surcharge"
                }
            else:
                amount = quote_price
                status = "MATCHED"
        
        new_invoice = Invoice(
            filename=filename,
            user_id=user_id,
            organization_id=org_id,
            invoice_number=invoice_num,
            quote_id=quote_id,
            total_amount=amount,
            normalized_total_amount_usd=amount,
            currency="USD",
            status=status,
            discrepancy_details=discrepancy
        )
        db.session.add(new_invoice)
        db.session.commit()
        
        log_audit("INVOICE_UPLOADED", f"Invoice: {invoice_num} - Status: {status}", category="FINANCE")
        
        return jsonify(new_invoice.to_dict()), 201
        
    except Exception as e:
        print(f"Invoice Upload Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/reconcile/matches', methods=['GET'])
def get_reconciled_matches():
    """Returns a list of invoices cross-referenced with their parent quotes."""
    try:
        org_id = get_org_id()
        invoices = Invoice.query.filter_by(organization_id=org_id).order_by(Invoice.invoice_date.desc()).all()
        return jsonify([i.to_dict() for i in invoices])
    except Exception as e:
        print(f"Matches Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/reconcile/action', methods=['POST'])
def handle_reconcile_action():
    """Approve for payment or Dispute an invoice."""
    data = request.json
    invoice_id = data.get('invoice_id')
    action = data.get('action') # APPROVE or DISPUTE
    
    if not invoice_id or not action:
        return jsonify({"error": "Invoice ID and Action required"}), 400
        
    try:
        org_id = get_org_id()
        invoice = Invoice.query.filter_by(id=invoice_id, organization_id=org_id).first()
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
            
        if action == 'APPROVE':
            invoice.status = 'APPROVED'
            if invoice.quote:
                invoice.quote.status = 'PAYMENT_PENDING'
            log_audit("INVOICE_APPROVED", f"Invoice ID: {invoice_id}", category="FINANCE")
        elif action == 'DISPUTE':
            invoice.status = 'DISPUTED'
            log_audit("INVOICE_DISPUTED", f"Invoice ID: {invoice_id}", category="FINANCE")
            
        db.session.commit()
        return jsonify(invoice.to_dict())
    except Exception as e:
        print(f"Reconcile Action Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/negotiation/challenge', methods=['POST'])
def challenge_rate():
    data = request.json
    try:
        quote_data = data.get('quote')
        challenges = data.get('challenges', [])
        
        negotiation_content = generate_negotiation_email(quote_data, challenges)
        log_audit("NEGOTIATION_DRAFTED", f"For Quote: {quote_data.get('id')}", category="QUOTE")
        
        return jsonify(negotiation_content)
    except Exception as e:
        print(f"Negotiation Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/simulation/baseline', methods=['GET'])
def get_simulation_baseline():
    """Calculates the current supply chain cost/performance baseline."""
    try:
        org_id = get_org_id()
        # Filter for ALLOCATED or BOOKED quotes to get "Realized" data
        quotes = Quote.query.filter_by(organization_id=org_id).filter(Quote.status.in_(['ALLOCATED', 'BOOKED'])).all()
        
        total_spend = sum(q.normalized_total_price_usd or 0 for q in quotes)
        avg_transit = 0
        if len(quotes) > 0:
            avg_transit = sum(q.transit_time_days or 14 for q in quotes) / len(quotes)
            
        return jsonify({
            "total_spend_usd": round(total_spend, 2),
            "avg_transit_days": round(avg_transit, 1),
            "active_shipments": len(quotes),
            "top_lanes": ["Shanghai to LA", "Ningbo to Rotterdam"] # Mocked for demo
        })
    except Exception as e:
        print(f"Baseline Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/simulation/run', methods=['POST'])
def run_simulation():
    """Executes a 'What-If' scenario against the baseline."""
    data = request.json
    scenario_type = data.get('scenario', 'cost_hike')
    variable = data.get('variable', 0.15) # e.g. 15% increase
    
    try:
        org_id = get_org_id()
        # Recalculate based on scenario
        quotes = Quote.query.filter_by(organization_id=org_id).filter(Quote.status.in_(['ALLOCATED', 'BOOKED'])).all()
        
        baseline_cost = sum(q.normalized_total_price_usd or 0 for q in quotes)
        projected_cost = baseline_cost
        projected_transit = sum(q.transit_time_days or 14 for q in quotes) / (len(quotes) or 1)
        
        if scenario_type == 'fuel_hike':
            # Fuel is usually 25-30% of total freight
            projected_cost = baseline_cost * (1 + (variable * 0.3))
        elif scenario_type == 'port_closure':
            # Port closure forces rerouting (usually +20% cost, +7 days transit)
            projected_cost = baseline_cost * 1.25
            projected_transit += 7
        elif scenario_type == 'mode_shift':
            # Ocean to Air (+400% cost, -14 days transit)
            projected_cost = baseline_cost * 5.0
            projected_transit = max(3, projected_transit - 14)
            
        log_audit("SIMULATION_RUN", f"Scenario: {scenario_type}", category="STRATEGIC")
        
        return jsonify({
            "scenario": scenario_type,
            "baseline": {
                "cost": round(baseline_cost, 2),
                "transit": round(sum(q.transit_time_days or 14 for q in quotes) / (len(quotes) or 1), 1)
            },
            "projected": {
                "cost": round(projected_cost, 2),
                "transit": round(projected_transit, 1)
            },
            "delta": {
                "cost_percent": round(((projected_cost - baseline_cost) / (baseline_cost or 1)) * 100, 1),
                "transit_days": round(projected_transit - (sum(q.transit_time_days or 14 for q in quotes) / (len(quotes) or 1)), 1)
            }
        })
    except Exception as e:
        print(f"Simulation Run Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/simulation/scenario', methods=['POST'])
def suggest_optimization():
    """Solver for optimal route/carrier mix based on constraints."""
    data = request.json
    max_cost = data.get('max_cost')
    max_transit = data.get('max_transit')
    priority = data.get('priority', 'COST') # COST or SPEED
    
    # Mock Solver Logic
    recommendations = [
        {
            "strategy": "Regional Diversity",
            "details": "Split 40% of Shanghai volume to Ningbo to mitigate port congestion spikes.",
            "impact": "-12% Risk Exposure, +3% Cost"
        },
        {
            "strategy": "Carrier Consolidation",
            "details": "Consolidate US-West Coast volume under Carrier X for bulk discount tier.",
            "impact": "-8% Cost, 0% Transit Impact"
        }
    ]
    
    return jsonify({
        "status": "OPTIMAL_FOUND",
        "primary_recommendation": recommendations[0] if priority == 'SPEED' else recommendations[1],
        "all_strategies": recommendations,
        "solver_confidence": "92%"
    })

@app.route('/api/carriers', methods=['GET', 'POST'])
def manage_carriers():
    org_id = get_org_id()
    if request.method == 'POST':
        data = request.json
        try:
            carrier = Carrier(
                name=data.get('name'),
                contact_info=data.get('contact_info'),
                compliance_score=data.get('compliance_score', 0),
                organization_id=org_id
            )
            db.session.add(carrier)
            db.session.commit()
            return jsonify(carrier.to_dict()), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    try:
        carriers = Carrier.query.filter_by(organization_id=org_id).all()
        return jsonify([c.to_dict() for c in carriers])
    except Exception as e:
        print(f"Error fetching carriers: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tenders', methods=['GET', 'POST'])
def manage_tenders():
    org_id = get_org_id()
    if request.method == 'POST':
        data = request.json
        try:
            deadline = None
            if data.get('deadline'):
                deadline = datetime.fromisoformat(data.get('deadline'))
            
            new_tender = Tender(
                title=data.get('title'),
                description=data.get('description'),
                organization_id=org_id,
                deadline=deadline,
                estimated_volume=data.get('estimated_volume'),
                lane_info=data.get('lane_info'),
                status='OPEN'
            )
            db.session.add(new_tender)
            db.session.commit()
            log_audit("TENDER_CREATED", f"Tender: {new_tender.title}", category="PROCUREMENT")
            return jsonify(new_tender.to_dict()), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    try:
        tenders = Tender.query.filter_by(organization_id=org_id).order_by(Tender.created_at.desc()).all()
        return jsonify([t.to_dict() for t in tenders])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tenders/<int:tender_id>', methods=['GET'])
def get_tender_details(tender_id):
    org_id = get_org_id()
    try:
        tender = Tender.query.filter_by(id=tender_id, organization_id=org_id).first()
        if not tender:
            return jsonify({"error": "Tender not found or access denied"}), 404
        return jsonify(tender.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tenders/<int:tender_id>/bids', methods=['GET'])
def get_tender_bids(tender_id):
    org_id = get_org_id()
    try:
        # Verify tender ownership
        tender = Tender.query.filter_by(id=tender_id, organization_id=org_id).first()
        if not tender:
            return jsonify({"error": "Tender not found or access denied"}), 404
            
        bids = Bid.query.filter_by(tender_id=tender_id).order_by(Bid.offered_rate.asc()).all()
        return jsonify([b.to_dict() for b in bids])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tenders/bids/submit', methods=['POST'])
def submit_bid():
    """Carrier-facing endpoint for bid submission."""
    data = request.json
    try:
        tender_id = data.get('tender_id')
        carrier_id = data.get('carrier_id')
        
        # Public route: Extract org_id from the Tender itself
        tender = Tender.query.get(tender_id)
        if not tender:
            return jsonify({"error": "Invalid tender"}), 404

        new_bid = Bid(
            tender_id=tender_id,
            carrier_id=carrier_id,
            offered_rate=data.get('offered_rate'),
            currency=data.get('currency', 'USD'),
            transit_time_days=data.get('transit_time_days'),
            carrier_notes=data.get('carrier_notes'),
            organization_id=tender.organization_id # Inherit from tender
        )
        db.session.add(new_bid)
        db.session.commit()
        
        log_audit("BID_SUBMITTED", f"Tender ID: {tender_id} - Carrier ID: {carrier_id}", category="PROCUREMENT", organization_id=tender.organization_id)
        return jsonify(new_bid.to_dict()), 201
    except Exception as e:
        print(f"Bid Submission Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tenders/<int:tender_id>/award', methods=['POST'])
def award_tender(tender_id):
    """Marks a specific bid as the winner and closes the tender."""
    org_id = get_org_id()
    data = request.json
    bid_id = data.get('bid_id')
    
    try:
        tender = Tender.query.filter_by(id=tender_id, organization_id=org_id).first()
        if not tender:
            return jsonify({"error": "Tender not found or access denied"}), 404
            
        # Reset any previous winners for this tender
        Bid.query.filter_by(tender_id=tender_id).update({"is_winning_bid": False})
        
        winning_bid = Bid.query.filter_by(id=bid_id, tender_id=tender_id).first()
        if winning_bid:
            winning_bid.is_winning_bid = True
            tender.status = 'AWARDED'
            db.session.commit()
            log_audit("TENDER_AWARDED", f"Tender: {tender.title}", category="PROCUREMENT")
            return jsonify(tender.to_dict())
        return jsonify({"error": "Bid not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Inventory Management Endpoints (Phase 19) ---

@app.route('/api/inventory/skus', methods=['GET', 'POST'])
def manage_skus():
    org_id = get_org_id()
    if request.method == 'POST':
        data = request.json
        try:
            new_sku = SKU(
                organization_id=org_id,
                name=data.get('name'),
                code=data.get('code'),
                current_stock=data.get('current_stock', 0),
                safety_stock=data.get('safety_stock', 10),
                reorder_point=data.get('reorder_point', 20),
                unit_measure=data.get('unit_measure', 'units'),
                lead_time_days=data.get('lead_time_days', 14),
                hs_code=data.get('hs_code'),
                origin_country=data.get('origin_country'),
                material_composition=data.get('material_composition')
            )
            db.session.add(new_sku)
            db.session.commit()
            log_audit("SKU_CREATED", f"SKU: {new_sku.code}", category="INVENTORY")
            return jsonify(new_sku.to_dict()), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    try:
        skus = SKU.query.filter_by(organization_id=org_id).all()
        return jsonify([s.to_dict() for s in skus])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/inventory/link', methods=['POST'])
def link_inventory_impact():
    """Links a quote (shipment) to a SKU to predict stock arrival."""
    org_id = get_org_id()
    data = request.json
    try:
        sku_id = data.get('sku_id')
        quote_id = data.get('quote_id')
        
        # Verify ownership
        sku = SKU.query.filter_by(id=sku_id, organization_id=org_id).first()
        quote = Quote.query.filter_by(id=quote_id, organization_id=org_id).first()
        if not sku or not quote:
            return jsonify({"error": "SKU or Quote not found or access denied"}), 404
            
        new_impact = InventoryImpact(
            organization_id=org_id,
            sku_id=sku_id,
            quote_id=quote_id,
            quantity=data.get('quantity', 0),
            expected_arrival_date=quote.allocation_date + timedelta(days=quote.transit_time_days) if quote.allocation_date and quote.transit_time_days else None,
            status="IN_TRANSIT"
        )
        db.session.add(new_impact)
        db.session.commit()
        return jsonify(new_impact.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/inventory/status', methods=['GET'])
def get_inventory_status():
    """Predictive endpoint: correlates stock levels with incoming shipments + telematics."""
    org_id = get_org_id()
    try:
        skus = SKU.query.filter_by(organization_id=org_id).all()
        report = []
        
        for sku in skus:
            incoming = InventoryImpact.query.filter_by(sku_id=sku.id, status='IN_TRANSIT').all()
            total_incoming = sum(i.quantity for i in incoming)
            
            # Enrich incoming with telematics drift
            shipment_details = []
            max_drift = 0
            for i in incoming:
                telemetry = get_shipment_telemetry(i.quote_id) # Using quote_id as shipment_id
                shipment_details.append({
                    "impact": i.to_dict(),
                    "telemetry": telemetry
                })
                # Adjust expected arrival based on drift if available
                if telemetry.get('eta_drift_hours'):
                    max_drift = max(max_drift, telemetry['eta_drift_hours'])
            
            # Predict stock-out risk
            risk_level = "LOW"
            if sku.current_stock <= sku.safety_stock:
                risk_level = "CRITICAL"
            elif sku.current_stock <= sku.reorder_point:
                risk_level = "HIGH"
            
            # Escalation based on drift
            if max_drift > 24 and risk_level == "HIGH":
                risk_level = "CRITICAL" # Delay pushes high risk to critical
                
            report.append({
                "sku": sku.to_dict(),
                "total_incoming": total_incoming,
                "projected_stock": sku.current_stock + total_incoming,
                "risk_level": risk_level,
                "shipment_details": shipment_details,
                "max_delay_hours": max_drift
            })
            
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/telematics/<int:shipment_id>', methods=['GET'])
def get_telematics(shipment_id):
    """Returns real-time GPS and ETA drift for a shipment."""
    # Note: In this mock, anyone can view telemetry if they know the ID
    # In production, we'd verify organization ownership of the quote/shipment
    try:
        telemetry = get_shipment_telemetry(shipment_id)
        return jsonify(telemetry)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Negotiation REPL Endpoints (Phase 20) ---

@app.route('/api/negotiate/counter', methods=['POST'])
def submit_counter():
    org_id = get_org_id()
    data = request.json
    bid_id = data.get('bid_id')
    counter_amount = data.get('amount')
    
    try:
        bid = Bid.query.filter_by(id=bid_id).join(Tender).filter(Tender.organization_id == org_id).first()
        if not bid:
            return jsonify({"error": "Bid not found or access denied"}), 404
            
        # Get history of comments for this bid
        comments = Comment.query.filter_by(bid_id=bid_id).order_by(Comment.created_at.asc()).all()
        history = [{"role": c.author, "text": c.content} for c in comments]
        
        # Call agent
        agent_rsp = get_negotiation_response(
            bid.tender.title,
            bid.carrier.name,
            bid.offered_rate,
            counter_amount,
            history
        )
        
        # Save user's counter as a comment
        user_comment = Comment(
            bid_id=bid_id,
            content=f"Counter-offer: ${counter_amount}",
            author="Customer Admin"
        )
        db.session.add(user_comment)
        
        # Save agent's response as a comment
        agent_comment = Comment(
            bid_id=bid_id,
            content=agent_rsp['response_text'],
            author="Carrier Agent (AI)"
        )
        db.session.add(agent_comment)
        
        # Update bid if accepted
        if agent_rsp['status'] == 'ACCEPTED':
            bid.offered_rate = counter_amount
            bid.status = 'COUNTER_ACCEPTED'
        elif agent_rsp['status'] == 'COUNTER':
             bid.offered_rate = agent_rsp['new_offered_rate']
        
        db.session.commit()
        return jsonify(agent_rsp)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/negotiate/<int:bid_id>/history', methods=['GET'])
def get_negotiation_history(bid_id):
    org_id = get_org_id()
    try:
        bid = Bid.query.filter_by(id=bid_id).join(Tender).filter(Tender.organization_id == org_id).first()
        if not bid:
            return jsonify({"error": "Bid not found"}), 404
            
        comments = Comment.query.filter_by(bid_id=bid_id).order_by(Comment.created_at.asc()).all()
        return jsonify([c.to_dict() for c in comments])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Global Trade Compliance Endpoints (Phase 22) ---

@app.route('/api/customs/classify', methods=['POST'])
def classify_sku():
    """Classifies a product description to get an HS Code."""
    data = request.json
    description = data.get('description')
    material = data.get('material')
    if not description:
        return jsonify({"error": "Description is required"}), 400
        
    result = classify_hs_code(description, material)
    return jsonify(result)

@app.route('/api/customs/estimate', methods=['POST'])
def estimate_trade_costs():
    """Estimates duties and taxes for a given HS code and value."""
    data = request.json
    hs_code = data.get('hs_code')
    value = data.get('value', 0)
    origin = data.get('origin', 'CN')
    destination = data.get('destination', 'US')
    
    if not hs_code:
        return jsonify({"error": "HS Code is required"}), 400
        
    result = estimate_duties(hs_code, value, origin, destination)
    return jsonify(result)

@app.route('/api/inventory/skus/<int:sku_id>', methods=['PATCH'])
def update_sku(sku_id):
    """Updates SKU details, including trade compliance fields."""
    org_id = get_org_id()
    data = request.json
    try:
        sku = SKU.query.filter_by(id=sku_id, organization_id=org_id).first()
        if not sku:
            return jsonify({"error": "SKU not found"}), 404
            
        if 'name' in data: sku.name = data['name']
        if 'code' in data: sku.code = data['code']
        if 'current_stock' in data: sku.current_stock = data['current_stock']
        if 'hs_code' in data: sku.hs_code = data['hs_code']
        if 'origin_country' in data: sku.origin_country = data['origin_country']
        if 'material_composition' in data: sku.material_composition = data['material_composition']
        
        db.session.commit()
        return jsonify(sku.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Intelligent Freight Claims Endpoints (Phase 23) ---

@app.route('/api/claims/analyze', methods=['POST'])
def analyze_claim():
    """Analyzes damage description using AI Vision logic."""
    data = request.json
    description = data.get('description')
    if not description:
        return jsonify({"error": "Description is required"}), 400
        
    result = analyze_damage_photo(description)
    return jsonify(result)

@app.route('/api/claims/submit', methods=['POST'])
def submit_claim():
    """Formally files a claim."""
    org_id = get_org_id()
    data = request.json
    shipment_id = data.get('shipment_id')
    damage_data = data.get('damage_data')
    
    if not shipment_id or not damage_data:
        return jsonify({"error": "Shipment ID and damage data required"}), 400
        
    result = file_claim(shipment_id, damage_data, org_id)
    # In a real app, we'd save this to a 'Claim' database model
    return jsonify(result)

# --- Multi-Carrier Messaging Endpoints (Phase 24) ---

@app.route('/api/messaging/threads', methods=['GET'])
def list_threads():
    """Returns all active message threads for the organization."""
    org_id = get_org_id()
    return jsonify(get_threads(org_id))

@app.route('/api/messaging/threads', methods=['POST'])
def start_thread():
    """Starts a new message thread."""
    org_id = get_org_id()
    data = request.json
    carrier_id = data.get('carrier_id')
    shipment_id = data.get('shipment_id')
    quote_id = data.get('quote_id')
    
    if not carrier_id:
        return jsonify({"error": "Carrier ID is required"}), 400
        
    thread = create_thread(org_id, carrier_id, shipment_id, quote_id)
    return jsonify(thread)

@app.route('/api/messaging/threads/<int:thread_id>/messages', methods=['GET'])
def list_messages(thread_id):
    """Returns all messages in a thread."""
    # In production, verify org ownership of thread
    return jsonify(get_messages(thread_id))

@app.route('/api/messaging/threads/<int:thread_id>/messages', methods=['POST'])
def post_message(thread_id):
    """Sends a message in a thread."""
    org_id = get_org_id()
    data = request.json
    text = data.get('text')
    sender_name = data.get('sender_name', 'Shipper Admin')
    
    if not text:
        return jsonify({"error": "Message text is required"}), 400
        
    msg = send_message(thread_id, org_id, sender_name, text)
    return jsonify(msg)

@app.route('/api/messaging/threads/<int:thread_id>/suggest', methods=['GET'])
def suggest_replies(thread_id):
    """Returns AI-suggested quick replies."""
    return jsonify(generate_ai_quick_replies(thread_id))

# --- Analytics & Trend Endpoints ---

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        org_id = get_org_id()
        kpis = get_kpi_dashboard(org_id)
        return jsonify(kpis)
    except Exception as e:
        print(f"Error fetching analytics: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analytics/trends', methods=['GET'])
def get_trends():
    try:
        org_id = get_org_id()
        trends = get_analytics_trends(org_id)
        return jsonify(trends)
    except Exception as e:
        print(f"Error fetching trends: {e}")
        return jsonify({"error": str(e)}), 500

# --- Atlas AI Recommendation Endpoint ---

@app.route('/api/llm/atlas-recommendation', methods=['POST'])
def get_atlas_advice():
    try:
        data = request.json
        quotes = data.get('quotes', [])
        
        if not quotes:
            return jsonify({"error": "No quotes provided for analysis"}), 400
            
        # For now, we'll perform a basic "Best Value" calculation
        # In a real app, this would call get_atlas_recommendation(quotes) in llm_service
        
        # Sort by price primarily, with a secondary check on reliability if available
        sorted_quotes = sorted(quotes, key=lambda x: (x.get('normalized_total_price_usd', float('inf'))))
        best_quote = sorted_quotes[0]
        
        advice = {
            "best_option": best_quote.get('carrier', 'Unknown'),
            "reasoning": f"Atlas recommends {best_quote.get('carrier')} because it offers the most competitive landed cost of ${best_quote.get('normalized_total_price_usd', 0):,.2f}.",
            "savings_vs_next": 0
        }
        
        if len(sorted_quotes) > 1:
            next_best = sorted_quotes[1]
            savings = next_best.get('normalized_total_price_usd', 0) - best_quote.get('normalized_total_price_usd', 0)
            advice["savings_vs_next"] = savings
            advice["reasoning"] += f" Choosing this option saves you ${savings:,.2f} compared to the next best alternative."

        return jsonify(advice)
    except Exception as e:
        print(f"Atlas Recommendation Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')
