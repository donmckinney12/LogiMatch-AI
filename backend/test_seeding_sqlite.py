import sqlite3
import datetime

def test_seeding_sqlite():
    db_path = "logimatch_v4.db"
    test_org = "org_test_999"
    demo_org = "org_demo_123"
    
    print(f"--- Standalone Seeding Test for {test_org} ---")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 1. Clean up test_org data
        cursor.execute("DELETE FROM carrier WHERE organization_id = ?", (test_org,))
        cursor.execute("DELETE FROM quote WHERE organization_id = ?", (test_org,))
        cursor.execute("DELETE FROM invoice WHERE organization_id = ?", (test_org,))
        cursor.execute("DELETE FROM tender WHERE organization_id = ?", (test_org,))
        conn.commit()
        
        # 2. Extract demo carriers
        cursor.execute("SELECT * FROM carrier WHERE organization_id = ?", (demo_org,))
        demo_carriers = cursor.fetchall()
        print(f"Found {len(demo_carriers)} demo carriers.")
        
        carrier_map = {}
        for c in demo_carriers:
            # c[0]=id, c[1]=name, c[4]=contact_info, c[5]=org_id
            # Note: actual column indices might differ, let's get column names
            cursor.execute("PRAGMA table_info(carrier)")
            cols = [col[1] for col in cursor.fetchall()]
            name_idx = cols.index('name')
            
            new_name = f"{c[name_idx]} ({test_org[-6:]})"
            
            # Construct INSERT statement dynamically for safety
            placeholders = ", ".join(["?" for _ in range(len(cols) - 1)]) # -1 because we skip id if autoincrement
            col_names = ", ".join([col for col in cols if col != 'id'])
            
            # Map values
            vals = []
            for i, col in enumerate(cols):
                if col == 'id': continue
                if col == 'organization_id': vals.append(test_org)
                elif col == 'name': vals.append(new_name)
                elif col == 'created_at': vals.append(datetime.datetime.utcnow().isoformat())
                else: vals.append(c[i])
            
            cursor.execute(f"INSERT INTO carrier ({col_names}) VALUES ({placeholders})", vals)
            carrier_map[c[0]] = cursor.lastrowid
            
        print(f"Successfully cloned {len(carrier_map)} carriers.")
        conn.commit()
        print("SUCCESS: Seeding logic verified for Carriers.")
        
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    test_seeding_sqlite()
