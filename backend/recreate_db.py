
from app import app, db

with app.app_context():
    try:
        db.drop_all()
        db.create_all()
        print("Database schema reset successfully using drop_all().")
    except Exception as e:
        print(f"Error resetting database: {e}")
