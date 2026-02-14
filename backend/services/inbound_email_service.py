import base64
import os
import json
from services.coordinator_agent import process_quote_fully
from models import db, Quote, Carrier
from datetime import datetime
import pdfplumber
import io

def process_inbound_email(payload):
    """
    Processes a mock JSON payload from an inbound email provider (SendGrid/Postmark).
    Expected structure:
    {
        "from": "user@example.com",
        "subject": "Quote Forwarded",
        "attachments": [
            {"filename": "quote.pdf", "content": "base64_string", "type": "application/pdf"}
        ]
    }
    """
    attachments = payload.get('attachments', [])
    processed_quotes = []

    for attachment in attachments:
        if attachment.get('type') == 'application/pdf':
            filename = attachment.get('filename')
            content_base64 = attachment.get('content')
            
            try:
                # 1. Decode PDF
                pdf_bytes = base64.b64decode(content_base64)
                
                # 2. Extract Text (Reusable OCR logic)
                text = ""
                with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                
                if not text:
                    print(f"No text extracted from {filename}")
                    continue

                # 3. Multi-Agent Audit
                extracted_data = process_quote_fully(text)
                if "error" in extracted_data:
                    print(f"Audit Error for {filename}: {extracted_data['error']}")
                    continue

                # 4. Save to Database
                carrier_name = extracted_data.get('carrier', 'Unknown')
                carrier = Carrier.query.filter_by(name=carrier_name).first()
                if not carrier:
                    carrier = Carrier(name=carrier_name)
                    db.session.add(carrier)
                    db.session.commit()

                new_quote = Quote(
                    filename=f"[Email] {filename}",
                    user_id=payload.get('from'), # Using email as user_id for inbound
                    carrier=carrier,
                    origin=extracted_data.get('origin'),
                    destination=extracted_data.get('destination'),
                    total_price=extracted_data.get('total_price'),
                    currency=extracted_data.get('currency'),
                    normalized_total_price_usd=extracted_data.get('normalized_total_price_usd'),
                    surcharges=extracted_data.get('surcharges', []),
                    risk_flags=extracted_data.get('risk_flags', []),
                    agent_insights=extracted_data.get('agent_insights', []),
                    carbon_footprint_kg=extracted_data.get('carbon_footprint_kg'),
                    status='PENDING',
                    full_text_content=text
                )
                
                db.session.add(new_quote)
                db.session.commit()
                processed_quotes.append(new_quote.to_dict())
                
            except Exception as e:
                print(f"Failed to process inbound attachment {filename}: {e}")

    return processed_quotes
