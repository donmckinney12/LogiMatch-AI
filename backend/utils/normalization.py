def convert_currency(amount, currency, target_currency="USD"):
    """
    Converts currency to USD.
    Hardcoded rates for MVP. in future, connect to Forex API.
    """
    if currency == target_currency:
        return amount
    
    # Static rates as of late 2024/early 2025 (Approximations)
    rates = {
        "EUR": 1.08, # 1 EUR = 1.08 USD
        "GBP": 1.25, # 1 GBP = 1.25 USD
        "CNY": 0.14, # 1 CNY = 0.14 USD
        "JPY": 0.0065, # 1 JPY = 0.0065 USD
        "CAD": 0.74, # 1 CAD = 0.74 USD
        "AUD": 0.65  # 1 AUD = 0.65 USD
    }
    
    rate = rates.get(currency.upper())
    if rate:
        return amount * rate
    
    # If unknown currency, return original (or handle error)
    return amount

def convert_weight(value, unit):
    """
    Standardizes weight to Kilograms (KG).
    """
    unit_norm = unit.upper()
    
    if unit_norm in ["KG", "KGS", "KILOGRAMS"]:
        return value
    elif unit_norm in ["LB", "LBS", "POUNDS"]:
        return value * 0.453592
    elif unit_norm in ["MT", "METRIC TON"]:
        return value * 1000
    
    return value

def calculate_landed_cost(base_freight, surcharges):
    """
    Simple summation of base freight + surcharges.
    """
    total = base_freight
    for charge in surcharges:
        # Assuming surcharges are already converted to same currency if needed
        # In a real app, you'd ensure currency alignment here too.
        total += charge.get('amount', 0)
    return total
