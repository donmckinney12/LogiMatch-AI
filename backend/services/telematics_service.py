import random
import math
from datetime import datetime, timedelta

# Mock Ports/Destinations
DESTINATIONS = {
    "LAX": {"lat": 33.9416, "lon": -118.4085, "name": "Port of Los Angeles / LAX"},
    "ROT": {"lat": 51.9225, "lon": 4.4791, "name": "Port of Rotterdam"},
    "SIN": {"lat": 1.3521, "lon": 103.8198, "name": "Port of Singapore"},
    "NYC": {"lat": 40.7128, "lon": -74.0060, "name": "Port of New York"}
}

def get_shipment_telemetry(shipment_id, destination_code="LAX"):
    """
    Generates mock telemetry for a shipment.
    In a real app, this would query an AIS or ADS-B API.
    """
    dest = DESTINATIONS.get(destination_code, DESTINATIONS["LAX"])
    
    # Deterministic seed for a specific shipment to make "live" tracking consistent
    random.seed(shipment_id)
    
    # Start slightly away from destination
    # We'll simulate a point that slowly moves towards the destination over time
    # Based on the current minute, we'll move the icon
    now = datetime.now()
    minutes_offset = now.minute + (now.hour * 60)
    
    # Start coordinates (e.g. out in the Pacific)
    start_lat = dest["lat"] - 5.0
    start_lon = dest["lon"] - 10.0
    
    # Move towards destination based on time (cycle every 60 mins for demo)
    progress = (minutes_offset % 60) / 60.0
    
    current_lat = start_lat + (dest["lat"] - start_lat) * progress
    current_lon = start_lon + (dest["lon"] - start_lon) * progress
    
    speed = random.uniform(15, 25) # Knots
    heading = 45 # Degrees
    
    # Calculate distance to destination in km (simple haversine approx)
    dist = calculate_distance(current_lat, current_lon, dest["lat"], dest["lon"])
    
    # ETA Drift calculation
    drift_hours = random.uniform(-2, 8) if progress < 0.8 else 0
    
    # Geofencing
    in_geofence = dist < 20 # 20km radius from port
    
    # Mock Delay Reason
    delay_reason = None
    if drift_hours > 12:
        delay_reason = random.choice(["Port Congestion", "Severe Weather (Pacific)", "Engine Maintenance", "Bunker Fuel Delay"])

    return {
        "shipment_id": shipment_id,
        "latitude": current_lat,
        "longitude": current_lon,
        "destination": dest["name"],
        "speed_knots": round(speed, 1),
        "heading": heading,
        "distance_remaining_km": round(dist, 1),
        "eta_drift_hours": round(drift_hours, 1),
        "delay_reason": delay_reason,
        "in_geofence": in_geofence,
        "last_update": now.isoformat(),
        "status": "IN_TRANSIT" if dist > 20 else "ARRIVED"
    }

def calculate_distance(lat1, lon1, lat2, lon2):
    """Haversine formula to calculate distance between two points on Earth."""
    R = 6371  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) * math.sin(d_lat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) * math.sin(d_lon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c
