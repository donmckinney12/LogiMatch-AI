import os
import json
from openai import OpenAI

# Mock Duty Rates by Category (First 2 digits of HS Code)
DUTY_RATES = {
    "85": {"name": "Electronics", "rate": 0.05, "vat": 0.20}, # 5% Duty, 20% VAT
    "61": {"name": "Apparel", "rate": 0.12, "vat": 0.15},    # 12% Duty, 15% VAT
    "94": {"name": "Furniture", "rate": 0.08, "vat": 0.19},  # 8% Duty, 19% VAT
    "default": {"name": "General Goods", "rate": 0.03, "vat": 0.10}
}

def classify_hs_code(description, material=None):
    """
    Uses GPT-4 to suggest an HS Code based on product description and material.
    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "mock_key"))
    
    prompt = f"""
    You are a Global Trade Compliance expert. 
    Classify the following product for international shipping:
    Product: {description}
    Material: {material or "Not specified"}
    
    Respond in JSON:
    {{
        "hs_code": "6-10 digit string",
        "category": "Broad category name",
        "confidence": 0.0-1.0,
        "rationale": "Why this code was chosen"
    }}
    """
    
    if os.getenv("OPENAI_API_KEY") == "mock_key":
        # Rule-based mock classification
        desc_lower = description.lower()
        if "phone" in desc_lower or "computer" in desc_lower or "electronic" in desc_lower:
            return {
                "hs_code": "8517.13.00",
                "category": "Electronics",
                "confidence": 0.95,
                "rationale": "Classified as telecommunication apparatus based on description."
            }
        elif "shirt" in desc_lower or "pants" in desc_lower or "cotton" in desc_lower:
            return {
                "hs_code": "6109.10.00",
                "category": "Apparel",
                "confidence": 0.88,
                "rationale": "Classified as knitted/crocheted apparel."
            }
        else:
            return {
                "hs_code": "0000.00.00",
                "category": "General Goods",
                "confidence": 0.5,
                "rationale": "Default classification due to non-specific description."
            }

    try:
        completion = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "system", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Classification Error: {e}")
        return {"error": str(e)}

def estimate_duties(hs_code, value, origin="CN", destination="US"):
    """
    Calculates estimated duties and taxes for a shipment.
    """
    prefix = hs_code[:2]
    rules = DUTY_RATES.get(prefix, DUTY_RATES["default"])
    
    # Mock Section 301 (China to US) additional duty
    additional_duty_rate = 0
    if origin == "CN" and destination == "US":
        additional_duty_rate = 0.25 # 25% extra duty
        
    duty_amount = value * (rules["rate"] + additional_duty_rate)
    vat_amount = (value + duty_amount) * rules["vat"]
    
    return {
        "hs_code": hs_code,
        "base_value": value,
        "duty_rate": rules["rate"],
        "additional_duty_rate": additional_duty_rate,
        "vat_rate": rules["vat"],
        "duty_amount": round(duty_amount, 2),
        "vat_amount": round(vat_amount, 2),
        "total_estimated_landed_cost": round(value + duty_amount + vat_amount, 2),
        "currency": "USD"
    }

def generate_customs_docs(shipment_id, items):
    """
    Generates a structured mock for a Commercial Invoice.
    """
    return {
        "document_type": "COMMERCIAL_INVOICE",
        "shipment_id": shipment_id,
        "invoice_number": f"INV-{shipment_id}-{random.randint(1000, 9999)}",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "exporter": "LogiMatch Global Logistics",
        "importer": "Customer Organization Placeholder",
        "items": items, # Array of {description, hs_code, qty, unit_price, total_price}
        "status": "DRAFT"
    }
