import json
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from utils.normalization import convert_currency, convert_weight

def extract_data_with_llm(text):
    """
    Uses LangChain to extract structured data from text and applies normalization.
    """
    from models import SurchargeReference
    
    # Fetch dynamic surcharge dictionary
    # In a production app, cache this to avoid DB hits on every request
    surcharges = SurchargeReference.query.all()
    dynamic_surcharge_dict = {
        s.raw_name: {"normalized": s.normalized_name, "category": s.category} 
        for s in surcharges
    }
    
    # Fallback to defaults if empty (bootstrapping)
    if not dynamic_surcharge_dict:
        dynamic_surcharge_dict = {
            "BAF": {"normalized": "Bunker Adjustment Factor", "category": "Fuel"},
            "PSS": {"normalized": "Peak Season Surcharge", "category": "Seasonal"},
            "LSS": {"normalized": "Low Sulphur Surcharge", "category": "Fuel"},
            "THC": {"normalized": "Terminal Handling Charge", "category": "Handling"},
            "DOC": {"normalized": "Documentation Fee", "category": "Admin"}
        }

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"error": "OPENAI_API_KEY not found"}

    try:
        chat = ChatOpenAI(temperature=0, model_name="gpt-4o", openai_api_key=api_key)
        
        SYSTEM_PROMPT = f"""
You are a Senior Logistics Auditor. Extract the following from this text: Carrier, Origin, Destination, Total Price, Currency, and a list of all Surcharges.

Refer to this Surcharge Dictionary for normalization:
{json.dumps(dynamic_surcharge_dict, indent=2)}

Rules:
1. Extract the "raw_name" exactly as it appears in the text.
2. If the surcharge matches a key/alias in the dictionary, populate "normalized_name" and "category".
3. If not found, "normalized_name" should be null and "flagged" should be true.
4. Output Number values for amounts.

Output valid JSON:
{{
    "carrier": "string",
    "origin": "string",
    "destination": "string",
    "total_price": number,
    "currency": "string",
    "surcharges": [
        {{
            "raw_name": "string",
            "normalized_name": "string (or null)",
            "category": "string (or null)",
            "amount": number,
            "currency": "string",
            "flagged": boolean
        }}
    ]
}}
"""
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=text)
        ]
        response = chat.invoke(messages)
        content = response.content
        
        # Strip markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
            
        data = json.loads(content.strip())
        
        # Post-processing Normalization (Calculated Fields)
        # 1. Normalize Total Price to USD
        if "total_price" in data and "currency" in data:
            from models import ExchangeRate
            # Fetch dynamic rate
            currency_code = data["currency"].upper()
            exchange_rate_obj = ExchangeRate.query.filter_by(currency_code=currency_code).first()
            
            if exchange_rate_obj:
                 data["normalized_total_price_usd"] = data["total_price"] * exchange_rate_obj.rate_to_usd
            else:
                 # Fallback to hardcoded utility
                 data["normalized_total_price_usd"] = convert_currency(data["total_price"], data["currency"])
            
        return data

    except Exception as e:
        return {"error": f"LLM extraction failed: {str(e)}"}

def generate_booking_email(data):
    """
    Generates a booking confirmation email based on quote data.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"error": "OPENAI_API_KEY not found"}

    try:
        chat = ChatOpenAI(temperature=0.7, model_name="gpt-4o", openai_api_key=api_key)
        
        prompt = f"""
        You are a Logistics Manager. Write a professional, concise booking confirmation email to the carrier based on this quote:
        
        Carrier: {data.get('carrier', 'Carrier')}
        Origin: {data.get('origin', 'N/A')}
        Destination: {data.get('destination', 'N/A')}
        Price: {data.get('total_price', 'N/A')} {data.get('currency', '')}
        
        Subject Line: [Generate a professional subject line]
        Body: [Generate the email body]
        
        Output valid JSON:
        {{
            "subject": "string",
            "body": "string"
        }}
        """
        
        messages = [
            SystemMessage(content="You are a helpful logistics assistant."),
            HumanMessage(content=prompt)
        ]
        
        response = chat.invoke(messages)
        content = response.content
        
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
            
        return json.loads(content.strip())
    except Exception as e:
        return {"error": f"Email generation failed: {str(e)}"}

def generate_exception_email(po_number, reason):
    """
    Generates a context-aware exception email using OpenAI.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    # Graceful fallback for demo if no key
    if not api_key:
        return {
            "subject": f"URGENT: Issue with PO {po_number}",
            "body": f"Dear Team,\n\nPlease note there is a {reason} affecting PO {po_number}.\n\n(AI Key Missing - this is a template fallback)."
        }

    try:
        chat = ChatOpenAI(temperature=0.7, model_name="gpt-4o", openai_api_key=api_key)
        
        prompt = f"""
        You are a proactive Logistics Coordinator. Write an urgent but professional email to the Warehouse Receiving Team regarding a shipment delay.
        
        Context:
        - PO Number: {po_number}
        - Issue: {reason}
        
        Goal: Inform them of the change and ask them to hold the dock slot or reschedule.
        
        Output valid JSON:
        {{
            "subject": "string",
            "body": "string"
        }}
        """
        
        messages = [
            SystemMessage(content="You are a helpful logistics assistant."),
            HumanMessage(content=prompt)
        ]
        
        response = chat.invoke(messages)
        content = response.content
        
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
            
        return json.loads(content.strip())
    except Exception as e:
        return {"error": f"Exception email generation failed: {str(e)}"}

def generate_negotiation_email(data, challenges):
    """
    Generates a rate challenge/negotiation email based on flagged findings.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"error": "OPENAI_API_KEY not found"}

    try:
        chat = ChatOpenAI(temperature=0.7, model_name="gpt-4o", openai_api_key=api_key)
        
        prompt = f"""
        You are a tough but professional Freight Procurement Manager. Write an email to the carrier challenging specific fees/risks in their latest quote.
        
        Quote Context:
        {json.dumps(data)}
        
        Specific Challenges to address:
        {json.dumps(challenges)}
        
        Goal: Ask them to waive the unmapped fees or reduce the price based on these specific findings.
        
        Output valid JSON:
        {{
            "subject": "string",
            "body": "string"
        }}
        """
        
        messages = [
            SystemMessage(content="You are a professional logistics negotiator."),
            HumanMessage(content=prompt)
        ]
        
        response = chat.invoke(messages)
        content = response.content
        
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
            
        return json.loads(content.strip())
    except Exception as e:
        return {"error": f"Negotiation email generation failed: {str(e)}"}
