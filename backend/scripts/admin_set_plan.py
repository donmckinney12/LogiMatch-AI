import sys
import os

# Add the parent directory to sys.path to import app and models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models import UsageMeter

def set_enterprise_plan(user_id):
    with app.app_context():
        meter = UsageMeter.query.filter_by(user_id=user_id).first()
        if not meter:
            print(f"UsageMeter not found for user {user_id}. Creating one...")
            meter = UsageMeter(user_id=user_id)
            db.session.add(meter)
        
        meter.subscription_tier = 'ENTERPRISE'
        meter.usage_limit = 1000000  # 1 Million credits
        
        db.session.commit()
        print(f"SUCCESS: {user_id} now has the UNLIMITED ENTERPRISE PLAN.")
        print(f"Tier: {meter.subscription_tier}")
        print(f"Limit: {meter.usage_limit} credits")

if __name__ == "__main__":
    target_user = sys.argv[1] if len(sys.argv) > 1 else "PilotUser_01"
    set_enterprise_plan(target_user)
