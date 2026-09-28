import os
import json
import psycopg2
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv('.env')

db_url = os.getenv('DATABASE_URL')
if not db_url:
    print("ERROR: DATABASE_URL not found.")
    exit(1)

print("Connecting to Neon PostgreSQL...")
conn = psycopg2.connect(db_url)
conn.autocommit = True
cur = conn.cursor()

try:
    print("1. Creating 'payment_apps' table if not exists...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS payment_apps (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            developer VARCHAR(255),
            market_share VARCHAR(100),
            rating NUMERIC(3, 1) DEFAULT 4.5,
            ipo_mandate_success VARCHAR(100),
            upi_limit VARCHAR(255),
            rupay_cc_support BOOLEAN DEFAULT true,
            upi_lite_support BOOLEAN DEFAULT true,
            highlights JSONB DEFAULT '[]'::jsonb,
            best_for TEXT,
            link TEXT,
            about TEXT,
            pros JSONB DEFAULT '[]'::jsonb,
            cons JSONB DEFAULT '[]'::jsonb,
            upi_limits_breakdown JSONB,
            ipo_mandate_steps JSONB DEFAULT '[]'::jsonb,
            security_features JSONB DEFAULT '[]'::jsonb,
            headquarters VARCHAR(255),
            raw_data JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    """)
    print("   -> 'payment_apps' table ready.")

    # Check count
    cur.execute("SELECT COUNT(*) FROM payment_apps;")
    count = cur.fetchone()[0]
    print(f"Current count in 'payment_apps': {count}")

    if count == 0:
        print("2. Seeding initial Payment Apps from static dataset...")
        sample_apps = [
            {
                "id": "phonepe",
                "name": "PhonePe",
                "developer": "PhonePe Pvt Ltd (Walmart Group)",
                "marketShare": "48.5% (Market Leader)",
                "rating": 4.8,
                "ipoMandateSuccess": "99.6% (Fastest Approval)",
                "upiLimit": "₹5,00,000 for IPOs / ₹1,00,000 P2P",
                "rupayCcSupport": True,
                "upiLiteSupport": True,
                "highlights": ["Instant IPO ASBA mandate notifications", "Zero-pin UPI Lite up to ₹500", "Extensive RuPay credit card linkability", "In-app wealth & mutual fund desk"],
                "bestFor": "High reliability for IPO mandates & daily retail payments",
                "link": "https://phonepe.com",
                "about": "PhonePe is India's undisputed leader in digital payments, processing nearly half of all UPI transactions nationwide. Backed by Walmart, PhonePe has optimized its connection to the NPCI switch to deliver near-zero latency for high-value banking operations including SEBI IPO ASBA block mandates.",
                "pros": [
                    "Fastest push notification delivery for IPO mandate requests from brokers",
                    "Supports high-value UPI 2.0 IPO blocks up to ₹5,00,000 per application",
                    "UPI Lite feature enables PIN-free payments up to ₹500 with 100% server uptime",
                    "Link any RuPay credit card to pay merchant QR codes with zero surcharge",
                    "Extensive financial ecosystem: Insurance, Gold, Mutual Funds, and Tax Filing"
                ],
                "cons": [
                    "Frequent in-app promotional banners for insurance and loans",
                    "App size has grown heavier with added super-app features"
                ],
                "upiLimitsBreakdown": {
                    "p2pDaily": "₹1,00,000 (standard bank limit)",
                    "p2mDaily": "₹2,00,000 to ₹5,00,000 depending on merchant category",
                    "ipoDaily": "₹5,00,000 per IPO application (SEBI/NPCI approved)",
                    "perTransaction": "₹1,00,000 (Standard) / ₹5,00,000 (IPO ASBA)"
                },
                "ipoMandateSteps": [
                    "Apply for the IPO on Zerodha, Groww, Angel One, or your chosen broker and enter your PhonePe UPI ID (e.g. yournumber@ybl, yournumber@ibl, or yournumber@axl).",
                    "Open the PhonePe app or tap the push notification banner: 'Autopay Request Received'.",
                    "Navigate to Profile > Autopay & Mandates > Pending Requests.",
                    "Verify the IPO Company Name, Issue Price, and Total Block Amount.",
                    "Enter your UPI PIN to approve the mandate. Funds are safely frozen in your bank account until allotment."
                ],
                "securityFeatures": [
                    "NPCI certified 2-factor authentication (MPIN)",
                    "Device binding and SIM verification protocol",
                    "End-to-end 256-bit SSL encryption on transaction payloads",
                    "Biometric fingerprint / FaceID lock screen authentication"
                ],
                "headquarters": "Bengaluru, Karnataka"
            },
            {
                "id": "google-pay",
                "name": "Google Pay (GPay)",
                "developer": "Google LLC",
                "marketShare": "37.2% (Top 2)",
                "rating": 4.7,
                "ipoMandateSuccess": "99.3% (Very High)",
                "upiLimit": "₹5,00,000 for IPOs / ₹1,00,000 P2P",
                "rupayCcSupport": True,
                "upiLiteSupport": True,
                "highlights": ["Direct bank grade security & tokenization", "Clean minimal interface without spam", "Fast mandate revocation on allotment closure", "Instant merchant cashback rewards"],
                "bestFor": "Clean user experience & seamless Google ecosystem integration",
                "link": "https://pay.google.com",
                "about": "Google Pay leverages Google's world-class infrastructure and clean material design to deliver a clutter-free, secure UPI experience. It connects to multiple banking partners (@okaxis, @okhdfcbank, @okicici, @oksbi) ensuring automatic fallback if one bank server experiences congestion.",
                "pros": [
                    "Minimalist, ad-free interface without annoying spam popups",
                    "Multi-bank UPI handle routing (@okaxis, @okhdfcbank, @okicici, @oksbi)",
                    "Automated unblocking of funds if IPO shares are not allotted",
                    "Credit card tokenization for contactless NFC payments on POS machines",
                    "Direct integration with Google Contacts and Gmail bill discovery"
                ],
                "cons": [
                    "Scratch card rewards are often small discount coupons rather than direct cashback",
                    "Occasional delay in SMS OTP delivery on older network operators"
                ],
                "upiLimitsBreakdown": {
                    "p2pDaily": "₹1,00,000 / 20 transactions per day",
                    "p2mDaily": "₹2,00,000",
                    "ipoDaily": "₹5,00,000 per IPO bid",
                    "perTransaction": "₹1,00,000 P2P / ₹5,00,000 for IPOs"
                },
                "ipoMandateSteps": [
                    "Submit your Google Pay UPI handle on your broker (e.g. username@okhdfcbank).",
                    "Google Pay will send an instant alert: 'Mandate request received from [Company Name] / Registrar'.",
                    "Tap on your Profile icon (top-right) and select 'Autopay'.",
                    "Select the active IPO mandate under 'Pending Requests' and click 'Authorize'.",
                    "Enter your 4 or 6-digit UPI PIN to confirm the bank block."
                ],
                "securityFeatures": [
                    "Google SafetyNet hardware attestation and tamper detection",
                    "Card tokenization preventing storage of real card numbers",
                    "Multi-factor machine learning fraud detection algorithms",
                    "Biometric lock integration"
                ],
                "headquarters": "Mountain View, California (India HQ: Bengaluru)"
            },
            {
                "id": "bhim",
                "name": "BHIM UPI",
                "developer": "National Payments Corporation of India (NPCI)",
                "marketShare": "Official Govt / NPCI Gateway",
                "rating": 4.6,
                "ipoMandateSuccess": "99.5% (Direct NPCI Switch)",
                "upiLimit": "₹5,00,000 for IPOs / ₹1,00,000 P2P",
                "rupayCcSupport": True,
                "upiLiteSupport": True,
                "highlights": ["Direct connection to NPCI central switch", "Zero 3rd-party commercial advertising", "Highest protocol security and privacy", "Priority bank server routing"],
                "bestFor": "Investors seeking direct NPCI server speed without 3rd-party ads",
                "link": "https://bhimupi.org.in",
                "about": "Bharat Interface for Money (BHIM) is developed directly by the National Payments Corporation of India (NPCI) under the Government of India Digital India initiative. Because it interfaces directly with the central UPI switch without intermediate servers, it delivers outstanding reliability for high-stake transactions like IPO ASBA bids.",
                "pros": [
                    "Operated directly by NPCI — 100% data sovereignty and zero commercial monetization",
                    "Zero commercial advertisements, marketing pushes, or product sales",
                    "Direct priority routing through the central NPCI clearing network",
                    "Supports 20+ official Indian regional languages",
                    "Instant UPI mandate cancellation if you withdraw your IPO application before closing"
                ],
                "cons": [
                    "Basic UI compared to modern fintech apps like PhonePe or CRED",
                    "No cashback or reward programs"
                ],
                "upiLimitsBreakdown": {
                    "p2pDaily": "₹1,00,000",
                    "p2mDaily": "₹2,00,000",
                    "ipoDaily": "₹5,00,000 (Native support for all primary market issues)",
                    "perTransaction": "₹1,00,000 P2P / ₹5,00,000 for IPO"
                },
                "ipoMandateSteps": [
                    "Provide your BHIM UPI handle (e.g. mobilenumber@upi) during IPO bidding.",
                    "Open the BHIM app and enter your app passcode.",
                    "Tap on the 'Mandates' section on the home screen.",
                    "Check the request under 'Pending', verify the details, and select 'Proceed'.",
                    "Enter UPI PIN to freeze funds until allotment finalization."
                ],
                "securityFeatures": [
                    "Official NPCI cryptographic protocols",
                    "Zero 3rd-party data analytics or trackers",
                    "Hardened device binding against SIM-swap attacks"
                ],
                "headquarters": "Mumbai, Maharashtra (NPCI HQ)"
            },
            {
                "id": "paytm",
                "name": "Paytm UPI",
                "developer": "One97 Communications Ltd",
                "marketShare": "7.8%",
                "rating": 4.4,
                "ipoMandateSuccess": "98.8%",
                "upiLimit": "₹5,00,000 for IPOs / ₹1,00,000 P2P",
                "rupayCcSupport": True,
                "upiLiteSupport": True,
                "highlights": ["Multi-bank UPI handles (@ptsbi, @ptaxis)", "FASTag, bill utility & transit integration", "Instant wallet & bank account switching", "Soundbox and merchant ecosystem"],
                "bestFor": "Utility payments, transit, and multi-bank account managers",
                "link": "https://paytm.com",
                "about": "Paytm was one of India's earliest mobile payment pioneers. Operating through its certified multi-bank model with State Bank of India, Axis Bank, HDFC Bank, and YES Bank, Paytm provides comprehensive UPI bill payments, FASTag, metro tickets, and IPO ASBA support.",
                "pros": [
                    "Seamless multi-bank routing handles across SBI, Axis, and HDFC",
                    "Instant bill utility, flight, movie, and recharge integrations",
                    "Full support for RuPay credit cards on UPI",
                    "Integrated Paytm Money investment platform for direct IPO and stock tracking"
                ],
                "cons": [
                    "Occasional interface clutter with numerous competing financial banners",
                    "Mandate approval occasionally requires manual navigation to the Autopay menu"
                ],
                "upiLimitsBreakdown": {
                    "p2pDaily": "₹1,00,000",
                    "p2mDaily": "₹2,00,000",
                    "ipoDaily": "₹5,00,000 per application",
                    "perTransaction": "₹1,00,000 standard / ₹5,00,000 IPO"
                },
                "ipoMandateSteps": [
                    "Enter your Paytm UPI ID (e.g. mobilenumber@ptsbi or mobilenumber@ptaxis) in your IPO bid form.",
                    "Open Paytm and tap on 'Balance & History' or search 'Automatic Payments'.",
                    "Click on the pending IPO mandate from the registrar.",
                    "Review details and tap 'Authorize'.",
                    "Enter your UPI PIN to approve the mandate."
                ],
                "securityFeatures": [
                    "Multi-bank server tokenization",
                    "PCI-DSS Level 1 certified security infrastructure",
                    "Face ID / Biometric authentication"
                ],
                "headquarters": "Noida, Uttar Pradesh"
            },
            {
                "id": "cred",
                "name": "CRED Pay (UPI)",
                "developer": "Dreamplug Technologies",
                "marketShare": "Exclusive Premium Cohort",
                "rating": 4.7,
                "ipoMandateSuccess": "99.2%",
                "upiLimit": "₹5,00,000 for IPOs",
                "rupayCcSupport": True,
                "upiLiteSupport": False,
                "highlights": ["Curated for credit scores above 750", "High cashback coins on utility payments", "Sleek luxury dark design terminal", "Credit card bill tracking with Smart Statements"],
                "bestFor": "Credit card enthusiasts & premium cashbacks",
                "link": "https://cred.club",
                "about": "CRED is an exclusive members-only fintech platform for individuals with high credit scores (750+). CRED Pay offers a hyper-premium UPI experience, high-tier cashback rewards, automated credit card bill tracking, and priority customer service.",
                "pros": [
                    "Top-tier rewards and cashbacks on everyday UPI scan & pay transactions",
                    "Clean, luxury user interface with fluid micro-interactions",
                    "Automated hidden charge detector for credit card statements",
                    "Smooth support for SEBI IPO mandates via @cred handles"
                ],
                "cons": [
                    "Requires minimum Experian/CRIF credit score of 750 for membership access",
                    "Does not support UPI Lite (PIN-free mini transactions) yet"
                ],
                "upiLimitsBreakdown": {
                    "p2pDaily": "₹1,00,000",
                    "p2mDaily": "₹2,00,000",
                    "ipoDaily": "₹5,00,000",
                    "perTransaction": "₹1,00,000 P2P / ₹5,00,000 IPO"
                },
                "ipoMandateSteps": [
                    "Enter your CRED UPI handle (e.g. username@cred) in your broker's IPO bidding terminal.",
                    "Open the CRED app and check the high-priority alert on your dashboard.",
                    "Tap on 'Review Mandate', verify the Registrar and IPO company name.",
                    "Authorize with your bank UPI PIN."
                ],
                "securityFeatures": [
                    "Bank grade hardware tokenization",
                    "Encrypted cloud statement parser",
                    "Biometric security guard"
                ],
                "headquarters": "Bengaluru, Karnataka"
            },
            {
                "id": "amazon-pay",
                "name": "Amazon Pay UPI",
                "developer": "Amazon India",
                "marketShare": "E-commerce Integrated",
                "rating": 4.5,
                "ipoMandateSuccess": "98.9%",
                "upiLimit": "₹5,00,000 for IPOs / ₹1,00,000 P2P",
                "rupayCcSupport": True,
                "upiLiteSupport": True,
                "highlights": ["Flat cashback directly into Amazon Pay balance", "Seamless Amazon Prime checkout", "Full integration with Amazon Pay ICICI Card", "Gift card and flight bookings"],
                "bestFor": "Frequent Amazon shoppers & cashback stackers",
                "link": "https://amazon.in/pay",
                "about": "Amazon Pay is Amazon's trusted payment ecosystem in India. Linking directly to ICICI Bank and Axis Bank handles (@apl, @rapl), it enables instant 1-click checkout on Amazon.in, bill payments, and SEBI-compliant IPO ASBA bidding.",
                "pros": [
                    "Cashbacks are credited directly to Amazon Pay balance without expiry",
                    "One-click integration with Amazon Pay ICICI credit card",
                    "Full support for all major Indian banks on UPI",
                    "Reliable customer service through Amazon 24x7 helpdesk"
                ],
                "cons": [
                    "Embedded inside the main Amazon ecommerce shopping app",
                    "Navigating to the Autopay menu takes an extra tap compared to standalone UPI apps"
                ],
                "upiLimitsBreakdown": {
                    "p2pDaily": "₹1,00,000",
                    "p2mDaily": "₹2,00,000",
                    "ipoDaily": "₹5,00,000",
                    "perTransaction": "₹1,00,000 standard / ₹5,00,000 IPO"
                },
                "ipoMandateSteps": [
                    "Enter your Amazon Pay UPI ID (e.g. mobilenumber@apl) during your IPO application.",
                    "Open the Amazon app > Amazon Pay > Manage UPI.",
                    "Click on 'Automatic Payments / Mandates'.",
                    "Review the pending request and confirm with your UPI PIN."
                ],
                "securityFeatures": [
                    "Amazon Fraud Prevention Engine",
                    "NPCI certified UPI rails",
                    "Two-step verification"
                ],
                "headquarters": "Seattle, Washington (India HQ: Bengaluru)"
            }
        ]

        for item in sample_apps:
            cur.execute("""
                INSERT INTO payment_apps (
                    id, name, developer, market_share, rating, ipo_mandate_success, 
                    upi_limit, rupay_cc_support, upi_lite_support, highlights, 
                    best_for, link, about, pros, cons, upi_limits_breakdown, 
                    ipo_mandate_steps, security_features, headquarters, raw_data, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW()
                )
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    developer = EXCLUDED.developer,
                    market_share = EXCLUDED.market_share,
                    rating = EXCLUDED.rating,
                    ipo_mandate_success = EXCLUDED.ipo_mandate_success,
                    upi_limit = EXCLUDED.upi_limit,
                    rupay_cc_support = EXCLUDED.rupay_cc_support,
                    upi_lite_support = EXCLUDED.upi_lite_support,
                    highlights = EXCLUDED.highlights,
                    best_for = EXCLUDED.best_for,
                    link = EXCLUDED.link,
                    about = EXCLUDED.about,
                    pros = EXCLUDED.pros,
                    cons = EXCLUDED.cons,
                    upi_limits_breakdown = EXCLUDED.upi_limits_breakdown,
                    ipo_mandate_steps = EXCLUDED.ipo_mandate_steps,
                    security_features = EXCLUDED.security_features,
                    headquarters = EXCLUDED.headquarters,
                    raw_data = EXCLUDED.raw_data,
                    updated_at = NOW();
            """, (
                item["id"],
                item["name"],
                item["developer"],
                item["marketShare"],
                item["rating"],
                item["ipoMandateSuccess"],
                item["upiLimit"],
                item["rupayCcSupport"],
                item["upiLiteSupport"],
                json.dumps(item["highlights"]),
                item["bestFor"],
                item["link"],
                item["about"],
                json.dumps(item["pros"]),
                json.dumps(item["cons"]),
                json.dumps(item["upiLimitsBreakdown"]),
                json.dumps(item["ipoMandateSteps"]),
                json.dumps(item["securityFeatures"]),
                item["headquarters"],
                json.dumps(item)
            ))
            print(f"   + Seeded payment app: {item['name']}")
        print(f"   -> Successfully seeded {len(sample_apps)} payment apps.")

    cur.close()
    conn.close()
    print("\nSUCCESS: Payment apps migration completed!")

except Exception as e:
    print(f"\nERROR: Migration failed: {e}")
    if 'conn' in locals() and conn:
        conn.close()
    exit(1)
