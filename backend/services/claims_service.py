import os
import json
import random
from datetime import datetime
from openai import OpenAI

# Damage categories for AI labeling
DAMAGE_CATEGORIES = {
    "STRUCTURAL": "Severe damage to pallet or container structure.",
    "WATER": "Moisture ingress or liquid damage.",
    "CRUSHED": "Compression damage to carton or packaging.",
    "PUNCTURE": "Hole or puncture in external packaging.",
    "OPENED": "Evidence of tampering or security seal breach."
}

def analyze_damage_photo(description_from_ui, image_url=None):
    """
    Uses GPT-4 Vision (or mock) to analyze cargo damage.
    In a real app, 'image_url' would be a path to a cloud storage bucket.
    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "mock_key"))
    
    prompt = f"""
    You are a Freight Damage Specialist. 
    Analyze this incident report: {description_from_ui}
    
    Respond in JSON:
    {{
        "damage_detected": true/false,
        "type": "STRUCTURAL/WATER/CRUSHED/PUNCTURE/OPENED",
        "severity": "LOW/MEDIUM/HIGH/CRITICAL",
        "estimate_repair_cost": integer,
        "assessment": "Detailed technical assessment of the damage."
    }}
    """
    
    if os.getenv("OPENAI_API_KEY") == "mock_key":
        # Rule-based mock analysis based on key terms in description
        desc_lower = description_from_ui.lower()
        if "crack" in desc_lower or "structural" in desc_lower:
            return {
                "damage_detected": True,
                "type": "STRUCTURAL",
                "severity": "HIGH",
                "estimate_repair_cost": 450,
                "assessment": "Structural integrity compromised. Pallet base cracked."
            }
        elif "wet" in desc_lower or "water" in desc_lower:
            return {
                "damage_detected": True,
                "type": "WATER",
                "severity": "MEDIUM",
                "estimate_repair_cost": 200,
                "assessment": "Liquid stains detected on primary packaging."
            }
        else:
            return {
                "damage_detected": True,
                "type": "CRUSHED",
                "severity": "LOW",
                "estimate_repair_cost": 50,
                "assessment": "Minor cosmetic crushing of corner boxes."
            }

    try:
        # In production, we'd pass the actual image to the vision model
        # For this implementation, we use the text-based description to drive the "AI" logic
        completion = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "system", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Damage Analysis Error: {e}")
        return {"error": str(e)}

def file_claim(shipment_id, damage_data, reporter_org_id):
    """
    Simulates the formal filing of a claim.
    """
    claim_id = f"CLM-{shipment_id}-{random.randint(1000, 9999)}"
    return {
        "claim_id": claim_id,
        "shipment_id": shipment_id,
        "organization_id": reporter_org_id,
        "status": "SUBMITTED",
        "date_filed": datetime.now().isoformat(),
        "damage_report": damage_data,
        "payout_estimate": round(damage_data.get('estimate_repair_cost', 0) * 0.9, 2), # 10% deductible
        "next_steps": ["Adjuster Review", "Carrier Liability Verification", "Payment Reconciliation"]
    }
