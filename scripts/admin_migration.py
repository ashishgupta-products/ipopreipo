import os
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv('.env')

db_url = os.getenv('DATABASE_URL')
if not db_url:
    print("ERROR: DATABASE_URL not found.")
    exit(1)

print(f"Connecting to Neon PostgreSQL...")
conn = psycopg2.connect(db_url)
conn.autocommit = True
cur = conn.cursor()

try:
    print("1. Adding 'role' column to 'users' table if not exists...")
    cur.execute("""
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
    """)
    print("   -> 'role' column ready.")

    print("2. Creating 'pre_ipos' table if not exists...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS pre_ipos (
            id VARCHAR(255) PRIMARY KEY,
            company_name VARCHAR(255) NOT NULL,
            symbol VARCHAR(50),
            sector VARCHAR(100),
            price_per_share NUMERIC,
            lot_size INT DEFAULT 50,
            min_investment NUMERIC,
            status VARCHAR(50) DEFAULT 'AVAILABLE',
            description TEXT,
            logo_url TEXT,
            financials JSONB,
            raw_data JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    """)
    print("   -> 'pre_ipos' table ready.")

    print("3. Checking existing users...")
    cur.execute("SELECT id, name, email, role FROM users LIMIT 10;")
    users = cur.fetchall()
    print(f"   Found {len(users)} users in database:")
    for u in users:
        print(f"   - {u[1]} ({u[2]}): role={u[3]}")
    
    # If there are users, ensure at least the first user is promoted to admin
    if users:
        first_id = users[0][0]
        cur.execute("UPDATE users SET role = 'admin' WHERE id = %s;", (first_id,))
        print(f"   -> Promoted user {users[0][2]} to 'admin'.")

    # Seed sample pre-IPO shares if table is empty
    cur.execute("SELECT COUNT(*) FROM pre_ipos;")
    count = cur.fetchone()[0]
    if count == 0:
        print("4. Seeding initial Pre-IPO sample companies...")
        sample_pre_ipos = [
            (
                "national-stock-exchange",
                "National Stock Exchange (NSE)",
                "NSE",
                "Financial Services / Exchange",
                6450,
                25,
                161250,
                "AVAILABLE",
                "Leading stock exchange in India with massive trading volumes and robust profit margins.",
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80"
            ),
            (
                "boat-imagine-marketing",
                "boAt (Imagine Marketing)",
                "BOAT",
                "Consumer Electronics / D2C",
                920,
                50,
                46000,
                "AVAILABLE",
                "Market leader in wireless earphones and smartwatches preparing for mainboard listing.",
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=120&auto=format&fit=crop&q=80"
            ),
            (
                "swiggy-unlisted",
                "Swiggy Limited",
                "SWIGGY",
                "Food Tech / Quick Commerce",
                485,
                100,
                48500,
                "PRE_LISTED",
                "Pioneering on-demand delivery platform with Instamart quick commerce engine.",
                "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=120&auto=format&fit=crop&q=80"
            ),
            (
                "reliance-retail",
                "Reliance Retail Ventures",
                "RELRETAIL",
                "Retail & E-commerce",
                3150,
                20,
                63000,
                "AVAILABLE",
                "India's largest retailer across groceries, fashion, electronics, and digital commerce.",
                "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80"
            )
        ]
        for item in sample_pre_ipos:
            cur.execute("""
                INSERT INTO pre_ipos (id, company_name, symbol, sector, price_per_share, lot_size, min_investment, status, description, logo_url, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (id) DO NOTHING;
            """, item)
        print("   -> Seeded 4 premium Pre-IPO listings.")

    print("\nSUCCESS: Admin migration completed successfully!")

except Exception as e:
    print(f"Error during migration: {e}")
finally:
    cur.close()
    conn.close()
