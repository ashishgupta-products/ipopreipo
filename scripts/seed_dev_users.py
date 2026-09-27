import os
import bcrypt
import psycopg2
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv('.env')

db_url = os.getenv('DATABASE_URL')
if not db_url:
    print("ERROR: DATABASE_URL not found.")
    exit(1)

print("Connecting to Neon PostgreSQL to seed dev shortcut users...")
conn = psycopg2.connect(db_url)
conn.autocommit = True
cur = conn.cursor()

try:
    # 1. Admin account: admin@ipopreipo.com / admin123
    admin_email = "admin@ipopreipo.com"
    admin_pw = "admin123"
    admin_hash = bcrypt.hashpw(admin_pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    cur.execute("""
        INSERT INTO users (id, name, email, password_hash, role, investor_category, demat_provider, updated_at)
        VALUES ('dev-admin-user', 'System Administrator', %s, %s, 'admin', 'bHNI', 'Zerodha', NOW())
        ON CONFLICT (email) DO UPDATE SET
            password_hash = EXCLUDED.password_hash,
            role = 'admin',
            updated_at = NOW();
    """, (admin_email, admin_hash))
    print(" -> Seeded/Updated dev admin user: admin@ipopreipo.com / admin123 (role=admin)")

    # 2. Investor account: investor@ipopreipo.com / investor123
    user_email = "investor@ipopreipo.com"
    user_pw = "investor123"
    user_hash = bcrypt.hashpw(user_pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    cur.execute("""
        INSERT INTO users (id, name, email, password_hash, role, investor_category, demat_provider, updated_at)
        VALUES ('dev-investor-user', 'Rajesh Sharma', %s, %s, 'user', 'Retail', 'Groww', NOW())
        ON CONFLICT (email) DO UPDATE SET
            password_hash = EXCLUDED.password_hash,
            role = 'user',
            updated_at = NOW();
    """, (user_email, user_hash))
    print(" -> Seeded/Updated dev investor user: investor@ipopreipo.com / investor123 (role=user)")

    # 3. Verify users
    cur.execute("SELECT id, name, email, role, investor_category FROM users WHERE email IN (%s, %s);", (admin_email, user_email))
    rows = cur.fetchall()
    print("Verified users in database:")
    for r in rows:
        print(f" - {r[1]} ({r[2]}) -> role: {r[3]}, category: {r[4]}")

    print("\nSUCCESS: Dev shortcut users seeded successfully!")

except Exception as e:
    print(f"Error seeding dev users: {e}")
finally:
    cur.close()
    conn.close()
