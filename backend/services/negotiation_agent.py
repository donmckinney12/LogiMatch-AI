import os
import json
from openai import OpenAI

# Mocking OpenAI if API key is missing
def get_negotiation_response(tender_title, carrier_name, current_rate, counter_offer, history):
    """
    Simulates a carrier's response to a counter-offer using GPT-4 logic.
    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "mock_key"))
    
    prompt = f"""
    You are representing a freight carrier '{carrier_name}' negotiating for the tender '{tender_title}'.
    The current rate offered is ${current_rate}.
    The customer just counter-offered ${counter_offer}.
    
    Session History:
    {json.dumps(history, indent=2)}
    
    Your goal is to stay profitable but win the business. 
    1. If the counter-offer is within 5% of the current rate, you might accept.
    2. If it's 10-20% lower, you should push back with a counter-offer in the middle.
    3. If it's more than 20% lower, reject or ask for volume guarantees.
    
    Respond in JSON format:
    {{
        "response_text": "Your message to the customer",
        "new_offered_rate": number,
        "status": "ACCEPTED" | "COUNTER" | "REJECTED",
        "rationale": "Internal reasoning"
    }}
    """
    
    if os.getenv("OPENAI_API_KEY") == "mock_key":
        # Rule-based mock
        diff = (current_rate - counter_offer) / current_rate
        if diff < 0.05:
            return {
                "response_text": f"We accept your offer of ${counter_offer}. We are looking forward to the business.",
                "new_offered_rate": counter_offer,
                "status": "ACCEPTED",
                "rationale": "Offer is within 5% margin."
            }
        elif diff < 0.15:
            middle = (current_rate + counter_offer) / 2
            return {
                "response_text": f"We can't quite hit ${counter_offer}, but we can meet you at ${middle}. Does that work?",
                "new_offered_rate": middle,
                "status": "COUNTER",
                "rationale": "Split the difference."
            }
        else:
            return {
                "response_text": f"The price of ${counter_offer} is significantly below our operating costs for this lane. We can lower our rate to ${current_rate * 0.95}, but no further.",
                "new_offered_rate": current_rate * 0.95,
                "status": "REJECTED",
                "rationale": "Offered price too low."
            }

    try:
        completion = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "system", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"LLM Error: {e}")
        return {
            "response_text": "I'll need to check with my manager regarding this rate.",
            "status": "COUNTER",
            "new_offered_rate": current_rate
        }
