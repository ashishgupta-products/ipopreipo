CREATE TABLE IF NOT EXISTS ipos (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(1000),
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    exchange VARCHAR(100) NOT NULL,
    price_band_min INT NOT NULL DEFAULT 0,
    price_band_max INT NOT NULL DEFAULT 0,
    issue_price INT,
    lot_size INT NOT NULL DEFAULT 1,
    min_investment INT NOT NULL DEFAULT 0,
    issue_size_total_cr NUMERIC(10, 2),
    fresh_issue_cr NUMERIC(10, 2),
    ofs_cr NUMERIC(10, 2),
    face_value INT NOT NULL DEFAULT 10,
    gmp INT NOT NULL DEFAULT 0,
    gmp_percent NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    gmp_updated_time VARCHAR(100),
    expected_listing_price INT NOT NULL DEFAULT 0,
    total_subscription NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    qib_subscription NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    nii_subscription NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    retail_subscription NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    open_date VARCHAR(50),
    close_date VARCHAR(50),
    allotment_date VARCHAR(50),
    refund_date VARCHAR(50),
    demat_credit_date VARCHAR(50),
    listing_date VARCHAR(50),
    listing_price INT,
    listing_gain_percent NUMERIC(6, 2),
    current_market_price INT,
    registrar_name VARCHAR(255),
    registrar_website VARCHAR(555),
    registrar_check_url VARCHAR(555),
    registrar_phone VARCHAR(50),
    registrar_email VARCHAR(100),
    recommendation VARCHAR(100),
    rating NUMERIC(3, 1),
    review_score INT,
    broker_reviews JSONB,
    member_reviews JSONB,
    highlights TEXT[],
    risks TEXT[],
    drhp_url VARCHAR(1000),
    prospectus_url VARCHAR(1000),
    gmp_trends JSONB,
    financials JSONB,
    lot_sizes JSONB,
    subscription_breakdown JSONB,
    peer_comparison JSONB,
    reservations JSONB,
    kpis JSONB,
    objects_of_issue JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ipos_slug ON ipos(slug);
CREATE INDEX IF NOT EXISTS idx_ipos_category ON ipos(category);
CREATE INDEX IF NOT EXISTS idx_ipos_status ON ipos(status);

CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    published_date VARCHAR(100),
    reading_time_mins INT NOT NULL DEFAULT 5,
    views INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Draft',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    featured_image VARCHAR(1000),
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(100) NOT NULL,
    author_avatar VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1000),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    investor_type VARCHAR(50) NOT NULL DEFAULT 'Retail',
    phone VARCHAR(50),
    pan_masked VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS user_watchlists (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ipo_id VARCHAR(100) NOT NULL,
    ipo_slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, ipo_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_watchlists_user_id ON user_watchlists(user_id);

CREATE TABLE IF NOT EXISTS user_applications (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ipo_id VARCHAR(100) NOT NULL,
    ipo_slug VARCHAR(255) NOT NULL,
    ipo_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Retail',
    lots_applied INT NOT NULL DEFAULT 1,
    lot_size INT NOT NULL DEFAULT 1,
    bid_price INT NOT NULL DEFAULT 0,
    total_amount INT NOT NULL DEFAULT 0,
    pan_masked VARCHAR(50),
    application_number VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'Applied',
    allotted_lots INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_applications_user_id ON user_applications(user_id);

