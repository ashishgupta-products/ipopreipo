"""
Neon PostgreSQL Database Migration and Seeder Script
Initializes schema and seeds IPOs, Analysts, and Metadata into Neon PostgreSQL.
"""
import os
import json
import psycopg2
from psycopg2.extras import Json

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

def init_database():
    database_url = load_database_url()
    if not database_url:
        print("[Error] DATABASE_URL environment variable not found. Please set it in .env or .env.local")
        return

    print("Connecting to Neon PostgreSQL...")
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()

    print("Creating tables and indexes in Neon DB...")
    
    # 1. IPOS table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS ipos (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        symbol VARCHAR(100),
        category VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        price_range_min NUMERIC,
        price_range_max NUMERIC,
        issue_size_cr NUMERIC,
        lot_size INTEGER,
        min_investment NUMERIC,
        open_date VARCHAR(50),
        close_date VARCHAR(50),
        allotment_date VARCHAR(50),
        listing_date VARCHAR(50),
        gmp NUMERIC DEFAULT 0,
        gmp_percent NUMERIC DEFAULT 0,
        gmp_trend VARCHAR(20) DEFAULT 'STABLE',
        fire_rating INTEGER DEFAULT 3,
        rating_count INTEGER DEFAULT 1,
        subscription_total NUMERIC DEFAULT 0,
        sector VARCHAR(100),
        tags JSONB DEFAULT '[]'::jsonb,
        logo_url TEXT,
        face_value NUMERIC,
        daily_gmp_change NUMERIC DEFAULT 0,
        gmp_daily_history JSONB DEFAULT '[]'::jsonb,
        multi_year_financials JSONB DEFAULT '[]'::jsonb,
        peers JSONB DEFAULT '[]'::jsonb,
        quota_reservation JSONB DEFAULT '{}'::jsonb,
        promoter_holding JSONB DEFAULT '{}'::jsonb,
        objects_of_issue JSONB DEFAULT '[]'::jsonb,
        anchor_details JSONB,
        lead_managers JSONB DEFAULT '[]'::jsonb,
        registered_office TEXT,
        year_incorporated INTEGER,
        rhp_url TEXT,
        drhp_url TEXT,
        strengths JSONB DEFAULT '[]'::jsonb,
        risks JSONB DEFAULT '[]'::jsonb,
        raw_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_ipos_status ON ipos(status);
    CREATE INDEX IF NOT EXISTS idx_ipos_category ON ipos(category);
    CREATE INDEX IF NOT EXISTS idx_ipos_symbol ON ipos(symbol);
    """)

    # 2. ANALYSTS and ANALYST_REVIEWS tables
    cur.execute("DROP TABLE IF EXISTS analyst_reviews CASCADE;")
    cur.execute("DROP TABLE IF EXISTS analysts CASCADE;")
    cur.execute("""
    CREATE TABLE IF NOT EXISTS analysts (
        slug VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rank INTEGER,
        profile_url TEXT,
        logo TEXT,
        is_sebi_registered BOOLEAN DEFAULT TRUE,
        reviews_1y INTEGER DEFAULT 0,
        score INTEGER DEFAULT 0,
        rating VARCHAR(100),
        sebi_reg_id VARCHAR(100),
        bio TEXT,
        website TEXT,
        mainboard_count VARCHAR(100),
        sme_count VARCHAR(100),
        stats JSONB DEFAULT '{}'::jsonb,
        pillars JSONB DEFAULT '{}'::jsonb,
        verdict_breakdown JSONB DEFAULT '{}'::jsonb,
        best_call JSONB,
        worst_call JSONB,
        raw_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_analysts_rank ON analysts(rank);
    """)

    # 3. ANALYST_REVIEWS table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS analyst_reviews (
        id SERIAL PRIMARY KEY,
        analyst_slug VARCHAR(100) REFERENCES analysts(slug) ON DELETE CASCADE,
        ipo_name VARCHAR(255) NOT NULL,
        verdict VARCHAR(50),
        listing_gain VARCHAR(50),
        total_gain VARCHAR(50),
        pdf_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_analyst_reviews_slug ON analyst_reviews(analyst_slug);
    CREATE INDEX IF NOT EXISTS idx_analyst_reviews_ipo ON analyst_reviews(ipo_name);
    """)

    # 4. MARKET_SYNC_METADATA table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS market_sync_metadata (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """)

    conn.commit()
    print("Schema initialized successfully.")

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Seed IPOs from src/data/live_ipos.json
    live_ipos_path = os.path.join(base_dir, 'src', 'data', 'live_ipos.json')
    if os.path.exists(live_ipos_path):
        with open(live_ipos_path, 'r', encoding='utf-8') as f:
            ipos_payload = json.load(f)
            ipos_list = ipos_payload.get('ipos', [])
            last_updated = ipos_payload.get('lastUpdated', '')

            print(f"Seeding {len(ipos_list)} IPOs into Neon DB...")
            upsert_query = """
            INSERT INTO ipos (
                id, name, symbol, category, status,
                price_range_min, price_range_max, issue_size_cr, lot_size, min_investment,
                open_date, close_date, allotment_date, listing_date,
                gmp, gmp_percent, gmp_trend, fire_rating, rating_count, subscription_total,
                sector, tags, logo_url, face_value, daily_gmp_change,
                gmp_daily_history, multi_year_financials, peers, quota_reservation,
                promoter_holding, objects_of_issue, anchor_details, lead_managers,
                registered_office, year_incorporated, rhp_url, drhp_url,
                strengths, risks, raw_data, updated_at
            ) VALUES (
                %(id)s, %(name)s, %(symbol)s, %(category)s, %(status)s,
                %(priceRangeMin)s, %(priceRangeMax)s, %(issueSizeCr)s, %(lotSize)s, %(minInvestment)s,
                %(openDate)s, %(closeDate)s, %(allotmentDate)s, %(listingDate)s,
                %(gmp)s, %(gmpPercent)s, %(gmpTrend)s, %(fireRating)s, %(ratingCount)s, %(subscriptionTotal)s,
                %(sector)s, %(tags)s, %(logoUrl)s, %(faceValue)s, %(dailyGmpChange)s,
                %(gmpDailyHistory)s, %(multiYearFinancials)s, %(peers)s, %(quotaReservation)s,
                %(promoterHolding)s, %(objectsOfIssue)s, %(anchorDetails)s, %(leadManagers)s,
                %(registeredOffice)s, %(yearIncorporated)s, %(rhpUrl)s, %(drhpUrl)s,
                %(strengths)s, %(risks)s, %(rawData)s, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                symbol = EXCLUDED.symbol,
                category = EXCLUDED.category,
                status = EXCLUDED.status,
                price_range_min = EXCLUDED.price_range_min,
                price_range_max = EXCLUDED.price_range_max,
                issue_size_cr = EXCLUDED.issue_size_cr,
                lot_size = EXCLUDED.lot_size,
                min_investment = EXCLUDED.min_investment,
                open_date = EXCLUDED.open_date,
                close_date = EXCLUDED.close_date,
                allotment_date = EXCLUDED.allotment_date,
                listing_date = EXCLUDED.listing_date,
                gmp = EXCLUDED.gmp,
                gmp_percent = EXCLUDED.gmp_percent,
                gmp_trend = EXCLUDED.gmp_trend,
                fire_rating = EXCLUDED.fire_rating,
                rating_count = EXCLUDED.rating_count,
                subscription_total = EXCLUDED.subscription_total,
                sector = EXCLUDED.sector,
                tags = EXCLUDED.tags,
                logo_url = EXCLUDED.logo_url,
                face_value = EXCLUDED.face_value,
                daily_gmp_change = EXCLUDED.daily_gmp_change,
                gmp_daily_history = EXCLUDED.gmp_daily_history,
                multi_year_financials = EXCLUDED.multi_year_financials,
                peers = EXCLUDED.peers,
                quota_reservation = EXCLUDED.quota_reservation,
                promoter_holding = EXCLUDED.promoter_holding,
                objects_of_issue = EXCLUDED.objects_of_issue,
                anchor_details = EXCLUDED.anchor_details,
                lead_managers = EXCLUDED.lead_managers,
                registered_office = EXCLUDED.registered_office,
                year_incorporated = EXCLUDED.year_incorporated,
                rhp_url = EXCLUDED.rhp_url,
                drhp_url = EXCLUDED.drhp_url,
                strengths = EXCLUDED.strengths,
                risks = EXCLUDED.risks,
                raw_data = EXCLUDED.raw_data,
                updated_at = NOW();
            """

            for item in ipos_list:
                item_dict = {
                    'id': item.get('id'),
                    'name': item.get('name', ''),
                    'symbol': item.get('symbol', ''),
                    'category': item.get('category', 'MAINBOARD'),
                    'status': item.get('status', 'ONGOING'),
                    'priceRangeMin': item.get('priceRangeMin', 0),
                    'priceRangeMax': item.get('priceRangeMax', 0),
                    'issueSizeCr': item.get('issueSizeCr', 0),
                    'lotSize': item.get('lotSize', 1),
                    'minInvestment': item.get('minInvestment', 0),
                    'openDate': item.get('openDate', ''),
                    'closeDate': item.get('closeDate', ''),
                    'allotmentDate': item.get('allotmentDate', ''),
                    'listingDate': item.get('listingDate', ''),
                    'gmp': item.get('gmp', 0),
                    'gmpPercent': item.get('gmpPercent', 0),
                    'gmpTrend': item.get('gmpTrend', 'STABLE'),
                    'fireRating': item.get('fireRating', 3),
                    'ratingCount': item.get('ratingCount', 1),
                    'subscriptionTotal': item.get('subscriptionTotal', 0),
                    'sector': item.get('sector', ''),
                    'tags': Json(item.get('tags', [])),
                    'logoUrl': item.get('logoUrl', ''),
                    'faceValue': item.get('faceValue', 10),
                    'dailyGmpChange': item.get('dailyGmpChange', 0),
                    'gmpDailyHistory': Json(item.get('gmpDailyHistory', [])),
                    'multiYearFinancials': Json(item.get('multiYearFinancials', [])),
                    'peers': Json(item.get('peers', [])),
                    'quotaReservation': Json(item.get('quotaReservation', {})),
                    'promoterHolding': Json(item.get('promoterHolding', {})),
                    'objectsOfIssue': Json(item.get('objectsOfIssue', [])),
                    'anchorDetails': Json(item.get('anchorDetails')) if item.get('anchorDetails') else None,
                    'leadManagers': Json(item.get('leadManagers', [])),
                    'registeredOffice': item.get('registeredOffice', ''),
                    'yearIncorporated': item.get('yearIncorporated', 2014),
                    'rhpUrl': item.get('rhpUrl', ''),
                    'drhpUrl': item.get('drhpUrl', ''),
                    'strengths': Json(item.get('strengths', [])),
                    'risks': Json(item.get('risks', [])),
                    'rawData': Json(item)
                }
                cur.execute(upsert_query, item_dict)

            # Record metadata
            cur.execute("""
            INSERT INTO market_sync_metadata (key, value, updated_at)
            VALUES ('last_ipos_sync', %s, NOW())
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
            """, (Json({'lastUpdated': last_updated, 'count': len(ipos_list)}),))

            conn.commit()
            print("IPOs successfully seeded.")

    # Seed Analysts from src/data/ipo_analysts.json
    analysts_path = os.path.join(base_dir, 'src', 'data', 'ipo_analysts.json')
    if os.path.exists(analysts_path):
        with open(analysts_path, 'r', encoding='utf-8') as f:
            analysts_list = json.load(f)
            if isinstance(analysts_list, list):
                print(f"Seeding {len(analysts_list)} Analysts into Neon DB...")
                upsert_analyst = """
                INSERT INTO analysts (
                    slug, name, rank, profile_url, logo, is_sebi_registered,
                    reviews_1y, score, rating, sebi_reg_id, bio, website,
                    mainboard_count, sme_count, stats, pillars, verdict_breakdown,
                    best_call, worst_call, raw_data, updated_at
                ) VALUES (
                    %(slug)s, %(name)s, %(rank)s, %(profileUrl)s, %(logo)s, %(isSebiRegistered)s,
                    %(reviews1Y)s, %(score)s, %(rating)s, %(sebiRegId)s, %(bio)s, %(website)s,
                    %(mainboardCount)s, %(smeCount)s, %(stats)s, %(pillars)s, %(verdictBreakdown)s,
                    %(bestCall)s, %(worstCall)s, %(rawData)s, NOW()
                )
                ON CONFLICT (slug) DO UPDATE SET
                    name = EXCLUDED.name,
                    rank = EXCLUDED.rank,
                    profile_url = EXCLUDED.profile_url,
                    logo = EXCLUDED.logo,
                    is_sebi_registered = EXCLUDED.is_sebi_registered,
                    reviews_1y = EXCLUDED.reviews_1y,
                    score = EXCLUDED.score,
                    rating = EXCLUDED.rating,
                    sebi_reg_id = EXCLUDED.sebi_reg_id,
                    bio = EXCLUDED.bio,
                    website = EXCLUDED.website,
                    mainboard_count = EXCLUDED.mainboard_count,
                    sme_count = EXCLUDED.sme_count,
                    stats = EXCLUDED.stats,
                    pillars = EXCLUDED.pillars,
                    verdict_breakdown = EXCLUDED.verdict_breakdown,
                    best_call = EXCLUDED.best_call,
                    worst_call = EXCLUDED.worst_call,
                    raw_data = EXCLUDED.raw_data,
                    updated_at = NOW();
                """

                # Collect all analyst and review items for batch insertion
                analyst_dicts = []
                all_reviews = []
                for a in analysts_list:
                    slug = a.get('slug', '')
                    if not slug:
                        continue
                    analyst_dicts.append({
                        'slug': slug,
                        'name': a.get('name', ''),
                        'rank': a.get('rank', 99),
                        'profileUrl': a.get('profileUrl', ''),
                        'logo': a.get('logo', ''),
                        'isSebiRegistered': a.get('isSebiRegistered', True),
                        'reviews1Y': a.get('reviews1Y', 0),
                        'score': a.get('score', 0),
                        'rating': a.get('rating', ''),
                        'sebiRegId': a.get('sebiRegId', ''),
                        'bio': a.get('bio', ''),
                        'website': a.get('website', ''),
                        'mainboardCount': a.get('mainboardCount', ''),
                        'smeCount': a.get('smeCount', ''),
                        'stats': Json(a.get('stats', {})),
                        'pillars': Json(a.get('pillars', {})),
                        'verdictBreakdown': Json(a.get('verdictBreakdown', {})),
                        'bestCall': Json(a.get('bestCall')) if a.get('bestCall') else None,
                        'worstCall': Json(a.get('worstCall')) if a.get('worstCall') else None,
                        'rawData': Json(a)
                    })

                    for r in a.get('reviewHistory', []):
                        all_reviews.append({
                            'analystSlug': slug,
                            'ipoName': r.get('ipoName', ''),
                            'verdict': r.get('verdict', 'Apply'),
                            'listingGain': r.get('listingGain'),
                            'totalGain': r.get('totalGain'),
                            'pdfUrl': r.get('pdfUrl')
                        })

                from psycopg2.extras import execute_batch

                # Clean previous reviews
                cur.execute("DELETE FROM analyst_reviews;")
                insert_review = """
                INSERT INTO analyst_reviews (
                    analyst_slug, ipo_name, verdict, listing_gain, total_gain, pdf_url
                ) VALUES (
                    %(analystSlug)s, %(ipoName)s, %(verdict)s, %(listingGain)s, %(totalGain)s, %(pdfUrl)s
                );
                """

                execute_batch(cur, upsert_analyst, analyst_dicts, page_size=100)
                execute_batch(cur, insert_review, all_reviews, page_size=500)
                total_reviews = len(all_reviews)

                # Record metadata
                cur.execute("""
                INSERT INTO market_sync_metadata (key, value, updated_at)
                VALUES ('last_analysts_sync', %s, NOW())
                ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
                """, (Json({'count': len(analysts_list), 'totalReviews': total_reviews}),))

                conn.commit()
                print(f"Analysts ({len(analysts_list)}) and Reviews ({total_reviews}) successfully seeded.")

    # Check counts
    cur.execute("SELECT COUNT(*) FROM ipos;")
    ipo_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM analysts;")
    analyst_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM analyst_reviews;")
    review_count = cur.fetchone()[0]

    print("\n--- Neon DB Seed Summary ---")
    print(f"IPOs in Neon DB: {ipo_count}")
    print(f"Analysts in Neon DB: {analyst_count}")
    print(f"Analyst Reviews in Neon DB: {review_count}")

    cur.close()
    conn.close()
    print("Database initialization completed successfully!")

if __name__ == '__main__':
    init_database()
