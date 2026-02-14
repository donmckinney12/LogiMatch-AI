from models import Quote, db
from sqlalchemy import func

def get_kpi_dashboard(organization_id=None):
    """
    Aggregates core KPIs for the admin dashboard.
    """
    try:
        base_query = Quote.query
        if organization_id:
            base_query = base_query.filter_by(organization_id=organization_id)
            
        # 1. Total Quotes
        total_quotes = base_query.count()
        
        # 2. Allocated Quotes (Activation Rate)
        allocated_quotes = base_query.filter(Quote.status == 'ALLOCATED').count()
        conversion_rate = (allocated_quotes / total_quotes * 100) if total_quotes > 0 else 0
        
        # 3. Time-to-Value (Average seconds from Upload -> Allocation)
        avg_ttv_query = db.session.query(func.avg(Quote.time_to_value_seconds))\
                    .filter(Quote.time_to_value_seconds.isnot(None))
        
        if organization_id:
            avg_ttv_query = avg_ttv_query.filter(Quote.organization_id == organization_id)
            
        avg_ttv = avg_ttv_query.scalar()
        
        avg_ttv_minutes = round(avg_ttv / 60, 1) if avg_ttv else 0
        
        # 4. Active Users (Users who have allocated at least one quote)
        active_users_query = db.session.query(func.count(func.distinct(Quote.user_id)))\
                         .filter(Quote.status == 'ALLOCATED')\
                         .filter(Quote.user_id.isnot(None))
        
        if organization_id:
            active_users_query = active_users_query.filter(Quote.organization_id == organization_id)
            
        active_users = active_users_query.scalar()
        
        return {
            "total_quotes": total_quotes,
            "allocated_quotes": allocated_quotes,
            "conversion_rate": round(conversion_rate, 1),
            "avg_time_to_value_minutes": avg_ttv_minutes,
            "active_users": active_users or 0
        }
    except Exception as e:
        print(f"Analytics Error: {e}")
        return {
            "error": str(e),
            "total_quotes": 0,
            "allocated_quotes": 0,
            "conversion_rate": 0,
            "avg_time_to_value_minutes": 0
        }
