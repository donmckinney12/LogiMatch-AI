def analyze_risk(quote_data):
    """
    Analyzes quote data for potential risks.
    Returns a list of warning strings.
    """
    flags = []
    
    # 1. Volatile Surcharge Detection
    # Keywords that suggest instability or extra unquoted costs
    RISK_KEYWORDS = [
        "WAR RISK", 
        "WAR", 
        "STRIKE", 
        "EMERGENCY", 
        "CONGESTION", 
        "GRI", 
        "GENERAL RATE INCREASE", 
        "PEAK SEASON",
        "PSS"
    ]
    
    surcharges = quote_data.get('surcharges', [])
    for s in surcharges:
        raw_name = s.get('raw_name', '').upper()
        for keyword in RISK_KEYWORDS:
            if keyword in raw_name:
                flags.append(f"High Volatility Surcharge: {s.get('raw_name')}")
                break # Avoid duplicate flags for same surcharge
    
    # 2. Missing Critical Data
    if not quote_data.get('validity_date') and not quote_data.get('expiry'):
        flags.append("Missing Validity Date (Risk of expiry)")
        
    if not quote_data.get('currency'):
        flags.append("Missing Currency (Ambiguous pricing)")

    # 3. Carrier Reliability (Placeholder Logic)
    # In real app, check DB for past performance
    if quote_data.get('carrier') == "Unknown":
        flags.append("Unknown Carrier Entity")

    return list(set(flags)) # Deduplicate
