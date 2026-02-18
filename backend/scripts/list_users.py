import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models import UsageMeter

def get_users():
    with app.app_context():
        meters = UsageMeter.query.all()
        print("--- USERS IN DATABASE ---")
        for m in meters:
            print(f"ID: {m.user_id} | Tier: {m.subscription_tier}")
        print("--- END OF LIST ---")

if __name__ == "__main__":
    get_users()
