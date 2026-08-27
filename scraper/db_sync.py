import json
import logging
from typing import List
from .config import DATABASE_URL, OUTPUT_JSON_PUBLIC, OUTPUT_JSON_SRC
from .models import IPOData

logger = logging.getLogger("db_sync")

def save_to_json(ipos: List[IPOData]) -> None:
    """Saves IPO data to public and src JSON files for zero-cost static serving"""
    try:
        OUTPUT_JSON_PUBLIC.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_JSON_SRC.parent.mkdir(parents=True, exist_ok=True)

        data = [ipo.model_dump(by_alias=True) for ipo in ipos]
        json_content = json.dumps(data, indent=2, ensure_ascii=False)

        with open(OUTPUT_JSON_PUBLIC, "w", encoding="utf-8") as f:
            f.write(json_content)
        with open(OUTPUT_JSON_SRC, "w", encoding="utf-8") as f:
            f.write(json_content)

        logger.info(f"Successfully saved {len(ipos)} IPOs to {OUTPUT_JSON_PUBLIC} and {OUTPUT_JSON_SRC}")
    except Exception as e:
        logger.error(f"Failed saving JSON files: {e}")

def sync_to_postgres(ipos: List[IPOData]) -> bool:
    """Upserts IPO data into Neon / PostgreSQL database if DATABASE_URL is available"""
    if not DATABASE_URL:
        logger.info("DATABASE_URL not set - skipping PostgreSQL sync (JSON files updated)")
        return False

    try:
        import psycopg2
        import psycopg2.extras
    except ImportError:
        logger.warning("psycopg2 is not installed - skipping PostgreSQL sync")
        return False

    try:
        logger.info("Connecting to Neon PostgreSQL...")
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Ensure columns exist
        migration_sqls = [
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS company_address TEXT;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS company_phone VARCHAR(50);",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS company_email VARCHAR(100);",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS company_website VARCHAR(555);",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS gmp_trends JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS financials JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS lot_sizes JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS subscription_breakdown JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS peer_comparison JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS reservations JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS kpis JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS objects_of_issue JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS broker_reviews JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS member_reviews JSONB;",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS highlights TEXT[];",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS risks TEXT[];",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS drhp_url VARCHAR(1000);",
            "ALTER TABLE ipos ADD COLUMN IF NOT EXISTS prospectus_url VARCHAR(1000);",
        ]
        for m in migration_sqls:
            try:
                cursor.execute(m)
            except Exception:
                pass
        conn.commit()

        upsert_sql = """
        INSERT INTO ipos (
            id, slug, name, company_name, logo_url, category, status, exchange,
            price_band_min, price_band_max, issue_price, lot_size, min_investment,
            issue_size_total_cr, fresh_issue_cr, ofs_cr, face_value,
            gmp, gmp_percent, gmp_updated_time, expected_listing_price,
            total_subscription, qib_subscription, nii_subscription, retail_subscription,
            open_date, close_date, allotment_date, refund_date, demat_credit_date, listing_date,
            listing_price, listing_gain_percent, current_market_price,
            company_address, company_phone, company_email, company_website,
            registrar_name, registrar_website, registrar_check_url, registrar_phone, registrar_email,
            recommendation, rating, review_score, broker_reviews, member_reviews, highlights, risks, drhp_url, prospectus_url, gmp_trends,
            financials, lot_sizes, subscription_breakdown, peer_comparison, reservations, kpis, objects_of_issue, updated_at
        ) VALUES (
            %(id)s, %(slug)s, %(name)s, %(company_name)s, %(logo_url)s, %(category)s, %(status)s, %(exchange)s,
            %(price_band_min)s, %(price_band_max)s, %(issue_price)s, %(lot_size)s, %(min_investment)s,
            %(issue_size_total_cr)s, %(fresh_issue_cr)s, %(ofs_cr)s, %(face_value)s,
            %(gmp)s, %(gmp_percent)s, %(gmp_updated_time)s, %(expected_listing_price)s,
            %(total_subscription)s, %(qib_subscription)s, %(nii_subscription)s, %(retail_subscription)s,
            %(open_date)s, %(close_date)s, %(allotment_date)s, %(refund_date)s, %(demat_credit_date)s, %(listing_date)s,
            %(listing_price)s, %(listing_gain_percent)s, %(current_market_price)s,
            %(company_address)s, %(company_phone)s, %(company_email)s, %(company_website)s,
            %(registrar_name)s, %(registrar_website)s, %(registrar_check_url)s, %(registrar_phone)s, %(registrar_email)s,
            %(recommendation)s, %(rating)s, %(review_score)s, %(broker_reviews)s, %(member_reviews)s, %(highlights)s, %(risks)s, %(drhp_url)s, %(prospectus_url)s, %(gmp_trends)s,
            %(financials)s, %(lot_sizes)s, %(subscription_breakdown)s, %(peer_comparison)s, %(reservations)s, %(kpis)s, %(objects_of_issue)s, CURRENT_TIMESTAMP
        )
        ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            company_name = EXCLUDED.company_name,
            logo_url = COALESCE(EXCLUDED.logo_url, ipos.logo_url),
            category = EXCLUDED.category,
            status = EXCLUDED.status,
            exchange = EXCLUDED.exchange,
            price_band_min = EXCLUDED.price_band_min,
            price_band_max = EXCLUDED.price_band_max,
            issue_price = COALESCE(EXCLUDED.issue_price, ipos.issue_price),
            lot_size = EXCLUDED.lot_size,
            min_investment = EXCLUDED.min_investment,
            issue_size_total_cr = EXCLUDED.issue_size_total_cr,
            fresh_issue_cr = EXCLUDED.fresh_issue_cr,
            ofs_cr = EXCLUDED.ofs_cr,
            face_value = EXCLUDED.face_value,
            gmp = EXCLUDED.gmp,
            gmp_percent = EXCLUDED.gmp_percent,
            gmp_updated_time = EXCLUDED.gmp_updated_time,
            expected_listing_price = EXCLUDED.expected_listing_price,
            total_subscription = EXCLUDED.total_subscription,
            qib_subscription = EXCLUDED.qib_subscription,
            nii_subscription = EXCLUDED.nii_subscription,
            retail_subscription = EXCLUDED.retail_subscription,
            open_date = EXCLUDED.open_date,
            close_date = EXCLUDED.close_date,
            allotment_date = EXCLUDED.allotment_date,
            refund_date = EXCLUDED.refund_date,
            demat_credit_date = EXCLUDED.demat_credit_date,
            listing_date = EXCLUDED.listing_date,
            listing_price = COALESCE(EXCLUDED.listing_price, ipos.listing_price),
            listing_gain_percent = COALESCE(EXCLUDED.listing_gain_percent, ipos.listing_gain_percent),
            current_market_price = COALESCE(EXCLUDED.current_market_price, ipos.current_market_price),
            company_address = COALESCE(EXCLUDED.company_address, ipos.company_address),
            company_phone = COALESCE(EXCLUDED.company_phone, ipos.company_phone),
            company_email = COALESCE(EXCLUDED.company_email, ipos.company_email),
            company_website = COALESCE(EXCLUDED.company_website, ipos.company_website),
            registrar_name = EXCLUDED.registrar_name,
            registrar_website = EXCLUDED.registrar_website,
            registrar_check_url = EXCLUDED.registrar_check_url,
            registrar_phone = COALESCE(EXCLUDED.registrar_phone, ipos.registrar_phone),
            registrar_email = COALESCE(EXCLUDED.registrar_email, ipos.registrar_email),
            recommendation = EXCLUDED.recommendation,
            rating = EXCLUDED.rating,
            review_score = EXCLUDED.review_score,
            broker_reviews = EXCLUDED.broker_reviews,
            member_reviews = EXCLUDED.member_reviews,
            highlights = EXCLUDED.highlights,
            risks = EXCLUDED.risks,
            drhp_url = COALESCE(EXCLUDED.drhp_url, ipos.drhp_url),
            prospectus_url = COALESCE(EXCLUDED.prospectus_url, ipos.prospectus_url),
            gmp_trends = COALESCE(EXCLUDED.gmp_trends, ipos.gmp_trends),
            financials = COALESCE(EXCLUDED.financials, ipos.financials),
            lot_sizes = COALESCE(EXCLUDED.lot_sizes, ipos.lot_sizes),
            subscription_breakdown = COALESCE(EXCLUDED.subscription_breakdown, ipos.subscription_breakdown),
            peer_comparison = COALESCE(EXCLUDED.peer_comparison, ipos.peer_comparison),
            reservations = COALESCE(EXCLUDED.reservations, ipos.reservations),
            kpis = COALESCE(EXCLUDED.kpis, ipos.kpis),
            objects_of_issue = COALESCE(EXCLUDED.objects_of_issue, ipos.objects_of_issue),
            updated_at = CURRENT_TIMESTAMP;
        """

        for ipo in ipos:
            params = {
                "id": ipo.id,
                "slug": ipo.slug,
                "name": ipo.name,
                "company_name": ipo.companyName,
                "logo_url": ipo.logoUrl,
                "category": ipo.category,
                "status": ipo.status,
                "exchange": ipo.exchange,
                "price_band_min": ipo.priceBandMin,
                "price_band_max": ipo.priceBandMax,
                "issue_price": ipo.issuePrice,
                "lot_size": ipo.lotSize,
                "min_investment": ipo.minInvestment,
                "issue_size_total_cr": ipo.issueSizeTotalCr,
                "fresh_issue_cr": ipo.freshIssueCr,
                "ofs_cr": ipo.ofsCr,
                "face_value": ipo.faceValue,
                "gmp": ipo.gmp,
                "gmp_percent": ipo.gmpPercent,
                "gmp_updated_time": ipo.gmpUpdatedTime,
                "expected_listing_price": ipo.expectedListingPrice,
                "total_subscription": ipo.totalSubscription,
                "qib_subscription": ipo.qibSubscription,
                "nii_subscription": ipo.niiSubscription,
                "retail_subscription": ipo.retailSubscription,
                "open_date": ipo.openDate,
                "close_date": ipo.closeDate,
                "allotment_date": ipo.allotmentDate,
                "refund_date": ipo.refundDate,
                "demat_credit_date": ipo.dematCreditDate,
                "listing_date": ipo.listingDate,
                "listing_price": ipo.listingPrice,
                "listing_gain_percent": ipo.listingGainPercent,
                "current_market_price": ipo.currentMarketPrice,
                "company_address": getattr(ipo, "companyAddress", None),
                "company_phone": getattr(ipo, "companyPhone", None),
                "company_email": getattr(ipo, "companyEmail", None),
                "company_website": getattr(ipo, "companyWebsite", None),
                "registrar_name": ipo.registrarName,
                "registrar_website": ipo.registrarWebsite,
                "registrar_check_url": ipo.registrarCheckUrl,
                "registrar_phone": ipo.registrarPhone,
                "registrar_email": ipo.registrarEmail,
                "recommendation": ipo.recommendation,
                "rating": ipo.rating,
                "review_score": ipo.reviewScore,
                "broker_reviews": json.dumps(ipo.brokerReviews.model_dump() if hasattr(ipo.brokerReviews, "model_dump") else ipo.brokerReviews.dict()) if ipo.brokerReviews else None,
                "member_reviews": json.dumps(ipo.memberReviews.model_dump() if hasattr(ipo.memberReviews, "model_dump") else ipo.memberReviews.dict()) if ipo.memberReviews else None,
                "highlights": ipo.highlights,
                "risks": ipo.risks,
                "drhp_url": ipo.drhpUrl,
                "prospectus_url": ipo.prospectusUrl,
                "gmp_trends": json.dumps([t.model_dump() if hasattr(t, "model_dump") else t.dict() for t in ipo.gmpTrends]) if ipo.gmpTrends else None,
                "financials": json.dumps([f.model_dump() if hasattr(f, "model_dump") else f.dict() for f in ipo.financials]) if ipo.financials else None,
                "lot_sizes": json.dumps([l.model_dump() if hasattr(l, "model_dump") else l.dict() for l in ipo.lotSizes]) if ipo.lotSizes else None,
                "subscription_breakdown": json.dumps([s.model_dump() if hasattr(s, "model_dump") else s.dict() for s in ipo.subscriptionBreakdown]) if ipo.subscriptionBreakdown else None,
                "peer_comparison": json.dumps([p.model_dump() if hasattr(p, "model_dump") else p.dict() for p in ipo.peerComparison]) if ipo.peerComparison else None,
                "reservations": json.dumps([r.model_dump() if hasattr(r, "model_dump") else r.dict() for r in ipo.reservations]) if ipo.reservations else None,
                "kpis": json.dumps(ipo.kpis.model_dump() if hasattr(ipo.kpis, "model_dump") else ipo.kpis.dict()) if ipo.kpis else None,
                "objects_of_issue": json.dumps([o.model_dump() if hasattr(o, "model_dump") else o.dict() for o in ipo.objectsOfIssue]) if ipo.objectsOfIssue else None,
            }
            cursor.execute(upsert_sql, params)

        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"Successfully upserted {len(ipos)} IPOs to PostgreSQL")
        return True

    except Exception as e:
        logger.error(f"Error syncing to PostgreSQL: {e}")
        return False
