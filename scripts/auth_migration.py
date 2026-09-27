"""
Neon PostgreSQL Database Migration for Auth.js / NextAuth
Creates users, accounts, sessions tables.
"""
import os
import psycopg2

def load_database_url():
    if "DATABASE_URL" in os.environ:
        return os.environ["DATABASE_URL"]
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for env_name in [".env.local", ".env"]:
        env_path = os.path.join(base_dir, env_name)
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        if k.strip() == "DATABASE_URL":
                            return v.strip().strip('"').strip("'")
    return None

def migrate_auth_tables():
    db_url = load_database_url()
    if not db_url:
        print("[Error] DATABASE_URL not found.")
        return

    print("Connecting to Neon PostgreSQL for Auth migration...")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute("""
    -- 1. Users table
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        phone VARCHAR(20),
        investor_category VARCHAR(50) DEFAULT 'RETAIL',
        demat_provider VARCHAR(50) DEFAULT 'Zerodha',
        image TEXT,
        email_verified TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    -- 2. Accounts table (for OAuth providers like Google)
    CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        provider_account_id VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        token_type VARCHAR(50),
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(provider, provider_account_id)
    );
    CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

    -- 3. Sessions table
    CREATE TABLE IF NOT EXISTS sessions (
        session_token VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMP WITH TIME ZONE NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    """)

    conn.commit()
    print("Auth tables (users, accounts, sessions) created successfully in Neon DB!")
    cur.close()
    conn.close()

if __name__ == '__main__':
    migrate_auth_tables()
