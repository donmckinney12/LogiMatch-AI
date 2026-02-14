import random

class SimulationService:
    """
    Simulates Landed Cost (Duties, Taxes, Port Fees) based on HS Codes.
    In a production app, this would query an external API like Zonos or Avalara.
    """
    
    # Mock HS Code data for common logistics items
    HS_CODE_REGISTRY = {
        "8471.30": {"name": "Laptops", "duty_rate": 0.0, "tax_rate": 0.05}, # IT equipment often duty-free
        "6109.10": {"name": "Cotton T-shirts", "duty_rate": 0.16, "tax_rate": 0.20}, # Textiles have high duties
        "8517.13": {"name": "Smartphones", "duty_rate": 0.0, "tax_rate": 0.08},
        "9403.60": {"name": "Wooden Furniture", "duty_rate": 0.06, "tax_rate": 0.15},
    }

    @staticmethod
    def calculate_landed_cost(base_price_usd, hs_code):
        """
        Calculates estimated duties and taxes.
        """
        config = SimulationService.HS_CODE_REGISTRY.get(hs_code)
        
        if not config:
            # Fallback for unknown codes: Generic 5% duty, 10% tax
            duty_rate = 0.05
            tax_rate = 0.10
        else:
            duty_rate = config["duty_rate"]
            tax_rate = config["tax_rate"]
            
        duties = base_price_usd * duty_rate
        taxes = (base_price_usd + duties) * tax_rate
        
        return {
            "estimated_duties": round(duties, 2),
            "estimated_taxes": round(taxes, 2),
            "total_landed_cost": round(base_price_usd + duties + taxes, 2),
            "hs_description": config["name"] if config else "Unclassified Goods"
        }
