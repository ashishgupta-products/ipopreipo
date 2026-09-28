import { neon } from '@neondatabase/serverless';
import { IpoItem } from '../types';
import { IpoAnalyst } from '../types/analyst';
import { PaymentAppItem, getAllPaymentApps, getPaymentAppById } from '../data/paymentAppsData';

const DATABASE_URL = process.env.DATABASE_URL;

// Initialize Neon Serverless SQL Client (null-safe)
export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

/**
 * Fetch all IPOs directly from Neon PostgreSQL
 */
export async function getAllIposFromDb(): Promise<IpoItem[] | null> {
  if (!sql) return null;
  try {
    const rows = await sql.query(`
      SELECT raw_data FROM ipos
      ORDER BY 
        CASE status 
          WHEN 'ONGOING' THEN 1 
          WHEN 'UPCOMING' THEN 2 
          WHEN 'CLOSED' THEN 3 
          ELSE 4 
        END,
        gmp DESC;
    `);

    if (!rows || rows.length === 0) return null;
    return rows.map((r: any) => r.raw_data as IpoItem);
  } catch (error) {
    console.error('Neon DB fetch error (falling back to local cache):', error);
    return null;
  }
}

/**
 * Fetch a single IPO by ID or Symbol from Neon DB
 */
export async function getIpoByIdFromDb(idOrSymbol: string): Promise<IpoItem | null> {
  if (!sql) return null;
  try {
    const normalized = decodeURIComponent(idOrSymbol).toLowerCase().trim();
    const rows = await sql.query(
      `SELECT raw_data FROM ipos WHERE LOWER(id) = $1 OR LOWER(symbol) = $1 LIMIT 1;`,
      [normalized]
    );

    if (rows && rows.length > 0) {
      return rows[0].raw_data as IpoItem;
    }
    return null;
  } catch (error) {
    console.error(`Neon DB error fetching IPO ${idOrSymbol}:`, error);
    return null;
  }
}

/**
 * Fetch all Analysts and their ranks from Neon DB
 */
export async function getAllAnalystsFromDb(): Promise<IpoAnalyst[] | null> {
  if (!sql) return null;
  try {
    const rows = await sql.query(`
      SELECT raw_data FROM analysts ORDER BY rank ASC;
    `);

    if (!rows || rows.length === 0) return null;
    return rows.map((r: any) => r.raw_data as IpoAnalyst);
  } catch (error) {
    console.error('Neon DB error fetching analysts:', error);
    return null;
  }
}

/**
 * Fetch Analyst with reviews from Neon DB
 */
export async function getAnalystBySlugFromDb(slug: string): Promise<IpoAnalyst | null> {
  if (!sql) return null;
  try {
    const rows = await sql.query(
      `SELECT raw_data FROM analysts WHERE slug = $1 LIMIT 1;`,
      [slug]
    );

    if (!rows || rows.length === 0) return null;
    return rows[0].raw_data as IpoAnalyst;
  } catch (error) {
    console.error(`Neon DB error fetching analyst ${slug}:`, error);
    return null;
  }
}

/**
 * Get sync metadata timestamp from Neon DB
 */
export async function getLastSyncFromDb(): Promise<string | null> {
  if (!sql) return null;
  try {
    const rows = await sql.query(
      `SELECT value FROM market_sync_metadata WHERE key = 'last_ipos_sync' LIMIT 1;`
    );
    if (rows && rows.length > 0 && rows[0].value?.lastUpdated) {
      return rows[0].value.lastUpdated;
    }
    return null;
  } catch {
    return null;
  }
}

export interface DbUser {
  id: string;
  name: string | null;
  email: string;
  password_hash: string | null;
  phone: string | null;
  investor_category: string;
  demat_provider: string | null;
  image: string | null;
  role: string;
  email_verified?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Find user by email in Neon DB
 */
export async function findUserByEmail(email: string): Promise<DbUser | null> {
  if (!sql) return null;
  try {
    const rows = await sql.query(
      `SELECT id, name, email, password_hash, phone, investor_category, demat_provider, image, role, created_at, updated_at 
       FROM users 
       WHERE LOWER(email) = LOWER($1) 
       LIMIT 1;`,
      [email.trim()]
    );
    if (rows && rows.length > 0) {
      return rows[0] as DbUser;
    }
    return null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

/**
 * Find user by ID in Neon DB
 */
export async function findUserById(id: string): Promise<DbUser | null> {
  if (!sql) return null;
  try {
    const rows = await sql.query(
      `SELECT id, name, email, phone, investor_category, demat_provider, image, role, created_at, updated_at 
       FROM users 
       WHERE id = $1 
       LIMIT 1;`,
      [id]
    );
    if (rows && rows.length > 0) {
      return rows[0] as DbUser;
    }
    return null;
  } catch (error) {
    console.error('Error finding user by id:', error);
    return null;
  }
}

/**
 * Create a new user with credentials in Neon DB
 */
export async function createUser(data: {
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  investorCategory?: string;
  dematProvider?: string;
  role?: string;
}): Promise<DbUser | null> {
  if (!sql) return null;
  try {
    const userId = crypto.randomUUID();
    // Check if any admin exists. If no users exist, automatically make the first user admin.
    let assignedRole = data.role || 'user';
    try {
      const countRes = await sql.query(`SELECT COUNT(*) as count FROM users;`);
      if (parseInt(countRes[0]?.count || '0', 10) === 0) {
        assignedRole = 'admin';
      }
    } catch {}

    const rows = await sql.query(
      `INSERT INTO users (id, name, email, password_hash, phone, investor_category, demat_provider, role, updated_at)
       VALUES ($1, $2, LOWER($3), $4, $5, $6, $7, $8, NOW())
       RETURNING id, name, email, phone, investor_category, demat_provider, role, created_at;`,
      [
        userId,
        data.name.trim(),
        data.email.trim(),
        data.passwordHash || null,
        data.phone?.trim() || null,
        data.investorCategory || 'RETAIL',
        data.dematProvider || 'Zerodha',
        assignedRole
      ]
    );
    if (rows && rows.length > 0) {
      return rows[0] as DbUser;
    }
    return null;
  } catch (error) {
    console.error('Error creating user in Neon DB:', error);
    throw error;
  }
}

/**
 * Upsert OAuth User (e.g. Google Login)
 */
export async function upsertOAuthUser(data: {
  id?: string;
  name: string;
  email: string;
  image?: string;
}): Promise<DbUser | null> {
  if (!sql) return null;
  try {
    const userId = data.id || crypto.randomUUID();
    // If first user, give admin role
    let defaultRole = 'user';
    try {
      const countRes = await sql.query(`SELECT COUNT(*) as count FROM users;`);
      if (parseInt(countRes[0]?.count || '0', 10) === 0) {
        defaultRole = 'admin';
      }
    } catch {}

    const rows = await sql.query(
      `INSERT INTO users (id, name, email, image, role, updated_at)
       VALUES ($1, $2, LOWER($3), $4, $5, NOW())
       ON CONFLICT (email) DO UPDATE SET
         name = COALESCE(users.name, EXCLUDED.name),
         image = COALESCE(EXCLUDED.image, users.image),
         updated_at = NOW()
       RETURNING id, name, email, phone, investor_category, demat_provider, image, role;`,
      [userId, data.name, data.email.trim(), data.image || null, defaultRole]
    );
    if (rows && rows.length > 0) {
      return rows[0] as DbUser;
    }
    return null;
  } catch (error) {
    console.error('Error upserting OAuth user in Neon DB:', error);
    return null;
  }
}

/**
 * Update user profile details in Neon DB
 */
export async function updateUserProfile(
  id: string,
  data: {
    name?: string;
    phone?: string;
    investorCategory?: string;
    dematProvider?: string;
  }
): Promise<DbUser | null> {
  if (!sql) return null;
  try {
    const rows = await sql.query(
      `UPDATE users
       SET 
         name = COALESCE($2, name),
         phone = COALESCE($3, phone),
         investor_category = COALESCE($4, investor_category),
         demat_provider = COALESCE($5, demat_provider),
         updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, email, phone, investor_category, demat_provider, image, role, updated_at;`,
      [
        id,
        data.name?.trim() || null,
        data.phone?.trim() || null,
        data.investorCategory || null,
        data.dematProvider || null
      ]
    );
    if (rows && rows.length > 0) {
      return rows[0] as DbUser;
    }
    return null;
  } catch (error) {
    console.error('Error updating user profile in Neon DB:', error);
    throw error;
  }
}

/* =========================================================================
 * ADMIN DATA & MANAGEMENT APIs
 * ========================================================================= */

/**
 * Get all users for admin table
 */
export async function getAllUsersForAdmin(): Promise<DbUser[]> {
  if (!sql) return [];
  try {
    const rows = await sql.query(`
      SELECT id, name, email, phone, investor_category, demat_provider, image, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC;
    `);
    return (rows || []) as DbUser[];
  } catch (err) {
    console.error('Error fetching admin users:', err);
    return [];
  }
}

/**
 * Change user role (e.g. promote to admin or demote to user)
 */
export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<DbUser | null> {
  if (!sql) return null;
  try {
    const rows = await sql.query(
      `UPDATE users SET role = $2, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, role, updated_at;`,
      [userId, role]
    );
    if (rows && rows.length > 0) return rows[0] as DbUser;
    return null;
  } catch (err) {
    console.error('Error updating user role:', err);
    throw err;
  }
}

/**
 * Delete user by admin
 */
export async function deleteUser(userId: string): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql.query(`DELETE FROM users WHERE id = $1;`, [userId]);
    return true;
  } catch (err) {
    console.error('Error deleting user:', err);
    throw err;
  }
}

/**
 * Claim admin role if no admin exists
 */
export async function claimAdminIfNoAdmin(userId: string): Promise<boolean> {
  if (!sql) return false;
  try {
    const adminCheck = await sql.query(`SELECT COUNT(*) as count FROM users WHERE role = 'admin';`);
    const adminCount = parseInt(adminCheck[0]?.count || '0', 10);
    if (adminCount === 0) {
      await sql.query(`UPDATE users SET role = 'admin' WHERE id = $1;`, [userId]);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error in claimAdminIfNoAdmin:', err);
    return false;
  }
}

/**
 * Get comprehensive platform metrics for Admin Dashboard
 */
export async function getAdminMetrics() {
  if (!sql) {
    return {
      users: { total: 0, retail: 0, sHni: 0, bHni: 0, admins: 0 },
      ipos: { total: 0, ongoing: 0, upcoming: 0, closed: 0, listed: 0 },
      preIpos: { total: 0 },
      analysts: { total: 0 },
      lastSync: null,
      dbStatus: 'Disconnected'
    };
  }

  try {
    // 1. Users metrics
    const userStats = await sql.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE UPPER(investor_category) = 'RETAIL') as retail,
        COUNT(*) FILTER (WHERE UPPER(investor_category) = 'SHNI') as shni,
        COUNT(*) FILTER (WHERE UPPER(investor_category) = 'BHNI') as bhni,
        COUNT(*) FILTER (WHERE role = 'admin') as admins
      FROM users;
    `);

    // 2. IPOs metrics
    const ipoStats = await sql.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'ONGOING') as ongoing,
        COUNT(*) FILTER (WHERE status = 'UPCOMING') as upcoming,
        COUNT(*) FILTER (WHERE status = 'CLOSED') as closed,
        COUNT(*) FILTER (WHERE status = 'LISTED') as listed
      FROM ipos;
    `);

    // 3. Pre-IPOs metrics
    const preIpoStats = await sql.query(`
      SELECT COUNT(*) as total FROM pre_ipos;
    `);

    // 4. Analysts metrics
    const analystStats = await sql.query(`
      SELECT COUNT(*) as total FROM analysts;
    `);

    // 5. Payment Apps metrics
    const paymentAppStats = await sql.query(`
      SELECT COUNT(*) as total FROM payment_apps;
    `);

    // 6. Last sync
    const lastSync = await getLastSyncFromDb();

    return {
      users: {
        total: parseInt(userStats[0]?.total || '0', 10),
        retail: parseInt(userStats[0]?.retail || '0', 10),
        sHni: parseInt(userStats[0]?.shni || '0', 10),
        bHni: parseInt(userStats[0]?.bhni || '0', 10),
        admins: parseInt(userStats[0]?.admins || '0', 10),
      },
      ipos: {
        total: parseInt(ipoStats[0]?.total || '0', 10),
        ongoing: parseInt(ipoStats[0]?.ongoing || '0', 10),
        upcoming: parseInt(ipoStats[0]?.upcoming || '0', 10),
        closed: parseInt(ipoStats[0]?.closed || '0', 10),
        listed: parseInt(ipoStats[0]?.listed || '0', 10),
      },
      preIpos: {
        total: parseInt(preIpoStats[0]?.total || '0', 10),
      },
      paymentApps: {
        total: parseInt(paymentAppStats[0]?.total || '0', 10),
      },
      analysts: {
        total: parseInt(analystStats[0]?.total || '0', 10),
      },
      lastSync,
      dbStatus: 'Connected (Neon Serverless PostgreSQL)'
    };
  } catch (err) {
    console.error('Error fetching admin metrics:', err);
    return {
      users: { total: 0, retail: 0, sHni: 0, bHni: 0, admins: 0 },
      ipos: { total: 0, ongoing: 0, upcoming: 0, closed: 0, listed: 0 },
      preIpos: { total: 0 },
      paymentApps: { total: 0 },
      analysts: { total: 0 },
      lastSync: null,
      dbStatus: 'Error'
    };
  }
}

/* =========================================================================
 * PRE-IPO MANAGEMENT APIs
 * ========================================================================= */

export interface DbPreIpo {
  id: string;
  company_name: string;
  symbol: string | null;
  sector: string | null;
  price_per_share: number;
  lot_size: number;
  min_investment: number;
  status: string;
  description: string | null;
  logo_url: string | null;
  financials?: any;
  raw_data?: any;
  created_at?: string;
  updated_at?: string;
}

export async function getAllPreIposFromDb(): Promise<DbPreIpo[]> {
  if (!sql) return [];
  try {
    const rows = await sql.query(`
      SELECT id, company_name, symbol, sector, price_per_share, lot_size, min_investment, status, description, logo_url, created_at, updated_at
      FROM pre_ipos
      ORDER BY price_per_share DESC;
    `);
    return (rows || []) as DbPreIpo[];
  } catch (err) {
    console.error('Error fetching pre_ipos from Neon DB:', err);
    return [];
  }
}

export async function createPreIpoInDb(data: {
  id?: string;
  companyName: string;
  symbol?: string;
  sector?: string;
  pricePerShare: number;
  lotSize?: number;
  status?: string;
  description?: string;
  logoUrl?: string;
}): Promise<DbPreIpo | null> {
  if (!sql) return null;
  try {
    const id = data.id || data.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const lotSize = data.lotSize || 50;
    const minInvestment = Number(data.pricePerShare) * lotSize;

    const rows = await sql.query(`
      INSERT INTO pre_ipos (id, company_name, symbol, sector, price_per_share, lot_size, min_investment, status, description, logo_url, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING id, company_name, symbol, sector, price_per_share, lot_size, min_investment, status, description, logo_url, created_at;
    `, [
      id,
      data.companyName.trim(),
      data.symbol?.trim() || null,
      data.sector?.trim() || 'Unlisted Equities',
      data.pricePerShare,
      lotSize,
      minInvestment,
      data.status || 'AVAILABLE',
      data.description?.trim() || null,
      data.logoUrl?.trim() || null
    ]);

    if (rows && rows.length > 0) return rows[0] as DbPreIpo;
    return null;
  } catch (err) {
    console.error('Error creating pre-IPO in Neon DB:', err);
    throw err;
  }
}

export async function updatePreIpoInDb(id: string, data: Partial<{
  companyName: string;
  symbol: string;
  sector: string;
  pricePerShare: number;
  lotSize: number;
  status: string;
  description: string;
  logoUrl: string;
}>): Promise<DbPreIpo | null> {
  if (!sql) return null;
  try {
    const existing = await sql.query(`SELECT * FROM pre_ipos WHERE id = $1 LIMIT 1;`, [id]);
    if (!existing || existing.length === 0) return null;
    const curr = existing[0];

    const price = data.pricePerShare !== undefined ? data.pricePerShare : curr.price_per_share;
    const lot = data.lotSize !== undefined ? data.lotSize : curr.lot_size;
    const minInv = Number(price) * Number(lot);

    const rows = await sql.query(`
      UPDATE pre_ipos
      SET 
        company_name = COALESCE($2, company_name),
        symbol = COALESCE($3, symbol),
        sector = COALESCE($4, sector),
        price_per_share = COALESCE($5, price_per_share),
        lot_size = COALESCE($6, lot_size),
        min_investment = $7,
        status = COALESCE($8, status),
        description = COALESCE($9, description),
        logo_url = COALESCE($10, logo_url),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, company_name, symbol, sector, price_per_share, lot_size, min_investment, status, description, logo_url, updated_at;
    `, [
      id,
      data.companyName?.trim() || null,
      data.symbol?.trim() || null,
      data.sector?.trim() || null,
      data.pricePerShare !== undefined ? data.pricePerShare : null,
      data.lotSize !== undefined ? data.lotSize : null,
      minInv,
      data.status || null,
      data.description !== undefined ? data.description : null,
      data.logoUrl !== undefined ? data.logoUrl : null
    ]);

    if (rows && rows.length > 0) return rows[0] as DbPreIpo;
    return null;
  } catch (err) {
    console.error('Error updating pre-IPO in Neon DB:', err);
    throw err;
  }
}

export async function deletePreIpoFromDb(id: string): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql.query(`DELETE FROM pre_ipos WHERE id = $1;`, [id]);
    return true;
  } catch (err) {
    console.error('Error deleting pre-IPO:', err);
    throw err;
  }
}

/* =========================================================================
 * IPO ADMIN MANAGEMENT APIs
 * ========================================================================= */

export async function createIpoInDb(ipo: Partial<IpoItem>): Promise<IpoItem | null> {
  if (!sql) return null;
  try {
    const id = ipo.id || ipo.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `ipo-${Date.now()}`;
    const name = ipo.name || 'New IPO';
    const symbol = ipo.symbol || name.substring(0, 8).toUpperCase();
    const category = ipo.category || 'MAINBOARD';
    const status = ipo.status || 'UPCOMING';
    const priceBandLow = ipo.priceBandLow || 100;
    const priceBandHigh = ipo.priceBandHigh || 108;
    const lotSize = ipo.lotSize || 100;
    const issueSizeCr = ipo.issueSizeCr || 500;
    const gmp = ipo.gmp || 0;
    const gmpPercent = priceBandHigh > 0 ? (gmp / priceBandHigh) * 100 : 0;
    const minInvestment = priceBandHigh * lotSize;
    const fireRating = ipo.fireRating || 3;
    const sector = ipo.sector || 'Diversified';

    const fullIpo: IpoItem = {
      ...ipo,
      id,
      name,
      symbol,
      category,
      status,
      priceBandLow,
      priceBandHigh,
      lotSize,
      issueSizeCr,
      gmp,
      dailyGmpChange: ipo.dailyGmpChange || 0,
      gmpUpdatedDate: ipo.gmpUpdatedDate || new Date().toISOString().split('T')[0],
      gmpTrend: ipo.gmpTrend || 'STABLE',
      fireRating,
      exchange: ipo.exchange || 'NSE & BSE',
      registrar: ipo.registrar || 'Link Intime India Pvt Ltd',
      registrarUrl: ipo.registrarUrl || 'https://linkintime.co.in/initial_offer/public-issues.html',
      timeline: {
        biddingStarts: 'TBA',
        biddingEnds: 'TBA',
        allotmentFinalization: 'TBA',
        refundInitiation: 'TBA',
        creditOfShares: 'TBA',
        listingDate: 'TBA',
        ...(ipo.timeline || {})
      },
      sector,
      about: ipo.about || `${name} public offering.`,
      tags: ipo.tags || [category, sector],
      ...(ipo.logoUrl ? { logoUrl: ipo.logoUrl } : {})
    };

    await sql.query(`
      INSERT INTO ipos (
        id, name, symbol, category, status, price_range_min, price_range_max, 
        issue_size_cr, lot_size, min_investment, open_date, close_date, 
        allotment_date, listing_date, gmp, gmp_percent, fire_rating, sector, 
        raw_data, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW()
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
        gmp = EXCLUDED.gmp,
        gmp_percent = EXCLUDED.gmp_percent,
        fire_rating = EXCLUDED.fire_rating,
        sector = EXCLUDED.sector,
        raw_data = EXCLUDED.raw_data,
        updated_at = NOW();
    `, [
      id,
      name,
      symbol,
      category,
      status,
      priceBandLow,
      priceBandHigh,
      issueSizeCr,
      lotSize,
      minInvestment,
      fullIpo.timeline.biddingStarts,
      fullIpo.timeline.biddingEnds,
      fullIpo.timeline.allotmentFinalization,
      fullIpo.timeline.listingDate,
      gmp,
      gmpPercent,
      fireRating,
      sector,
      JSON.stringify(fullIpo)
    ]);

    return fullIpo;
  } catch (err) {
    console.error('Error creating IPO in Neon DB:', err);
    throw err;
  }
}

export async function updateIpoInDb(id: string, partial: Partial<IpoItem>): Promise<IpoItem | null> {
  if (!sql) return null;
  try {
    const existing = await sql.query(`SELECT raw_data FROM ipos WHERE LOWER(id) = LOWER($1) LIMIT 1;`, [id]);
    if (!existing || existing.length === 0) return null;
    const currentIpo = existing[0].raw_data as IpoItem;

    const updatedIpo: IpoItem = {
      ...currentIpo,
      ...partial,
      id: currentIpo.id, // preserve id
      timeline: {
        ...currentIpo.timeline,
        ...(partial.timeline || {})
      },
      subscription: partial.subscription !== undefined ? partial.subscription : currentIpo.subscription,
      financialHighlights: partial.financialHighlights !== undefined ? { ...currentIpo.financialHighlights, ...partial.financialHighlights } : currentIpo.financialHighlights,
      quotaReservation: partial.quotaReservation !== undefined ? { ...currentIpo.quotaReservation, ...partial.quotaReservation } : currentIpo.quotaReservation,
      promoterHolding: partial.promoterHolding !== undefined ? { ...currentIpo.promoterHolding, ...partial.promoterHolding } : currentIpo.promoterHolding,
    };

    const priceBandHigh = updatedIpo.priceBandHigh || 100;
    const gmp = updatedIpo.gmp || 0;
    const gmpPercent = priceBandHigh > 0 ? (gmp / priceBandHigh) * 100 : 0;
    const minInvestment = (updatedIpo.lotSize || 100) * priceBandHigh;

    await sql.query(`
      UPDATE ipos
      SET
        name = $2,
        symbol = $3,
        category = $4,
        status = $5,
        price_range_min = $6,
        price_range_max = $7,
        issue_size_cr = $8,
        lot_size = $9,
        min_investment = $10,
        open_date = $11,
        close_date = $12,
        allotment_date = $13,
        listing_date = $14,
        gmp = $15,
        gmp_percent = $16,
        fire_rating = $17,
        sector = $18,
        raw_data = $19,
        updated_at = NOW()
      WHERE LOWER(id) = LOWER($1);
    `, [
      id,
      updatedIpo.name,
      updatedIpo.symbol,
      updatedIpo.category,
      updatedIpo.status,
      updatedIpo.priceBandLow,
      updatedIpo.priceBandHigh,
      updatedIpo.issueSizeCr,
      updatedIpo.lotSize,
      minInvestment,
      updatedIpo.timeline.biddingStarts,
      updatedIpo.timeline.biddingEnds,
      updatedIpo.timeline.allotmentFinalization,
      updatedIpo.timeline.listingDate,
      gmp,
      gmpPercent,
      updatedIpo.fireRating,
      updatedIpo.sector,
      JSON.stringify(updatedIpo)
    ]);

    return updatedIpo;
  } catch (err) {
    console.error('Error updating IPO in Neon DB:', err);
    throw err;
  }
}

export async function deleteIpoFromDb(id: string): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql.query(`DELETE FROM ipos WHERE LOWER(id) = LOWER($1);`, [id]);
    return true;
  } catch (err) {
    console.error('Error deleting IPO from Neon DB:', err);
    throw err;
  }
}

/* =========================================================================
 * PAYMENT APPS MANAGEMENT APIs
 * ========================================================================= */

export async function getAllPaymentAppsFromDb(): Promise<PaymentAppItem[]> {
  if (!sql) return getAllPaymentApps();
  try {
    const rows = await sql.query(`
      SELECT raw_data FROM payment_apps
      ORDER BY rating DESC, name ASC;
    `);

    if (!rows || rows.length === 0) return getAllPaymentApps();
    return rows.map((r: any) => r.raw_data as PaymentAppItem);
  } catch (err) {
    console.error('Error fetching payment apps from Neon DB:', err);
    return getAllPaymentApps();
  }
}

export async function getPaymentAppByIdFromDb(idOrName: string): Promise<PaymentAppItem | null> {
  if (!sql) return getPaymentAppById(idOrName) || null;
  try {
    const normalized = decodeURIComponent(idOrName).toLowerCase().trim();
    const rows = await sql.query(
      `SELECT raw_data FROM payment_apps WHERE LOWER(id) = $1 LIMIT 1;`,
      [normalized]
    );

    if (rows && rows.length > 0) {
      return rows[0].raw_data as PaymentAppItem;
    }
    return getPaymentAppById(idOrName) || null;
  } catch (err) {
    console.error(`Error fetching payment app ${idOrName}:`, err);
    return getPaymentAppById(idOrName) || null;
  }
}

export async function createPaymentAppInDb(data: Partial<PaymentAppItem>): Promise<PaymentAppItem | null> {
  if (!sql) return null;
  try {
    const id = data.id || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `app-${Date.now()}`;
    const name = data.name || 'New Payment App';
    const developer = data.developer || 'Fintech Provider';
    const marketShare = data.marketShare || 'Growing';
    const rating = Number(data.rating || 4.5);
    const ipoMandateSuccess = data.ipoMandateSuccess || '99.0%';
    const upiLimit = data.upiLimit || '₹5,00,000 for IPOs / ₹1,00,000 P2P';
    const rupayCcSupport = data.rupayCcSupport !== undefined ? Boolean(data.rupayCcSupport) : true;
    const upiLiteSupport = data.upiLiteSupport !== undefined ? Boolean(data.upiLiteSupport) : true;
    const highlights = data.highlights || ['UPI 2.0 IPO ASBA Support', 'High Mandate Approval Rate'];
    const bestFor = data.bestFor || 'IPO mandate approvals & daily retail payments';
    const link = data.link || 'https://npci.org.in';
    const about = data.about || `${name} is an authorized UPI application in India.`;
    const pros = data.pros || ['Instant mandate notifications', 'High transaction success rate'];
    const cons = data.cons || [];
    const upiLimitsBreakdown = data.upiLimitsBreakdown || {
      p2pDaily: '₹1,00,000',
      p2mDaily: '₹2,00,000',
      ipoDaily: '₹5,00,000',
      perTransaction: '₹1,00,000 P2P / ₹5,00,000 IPO'
    };
    const ipoMandateSteps = data.ipoMandateSteps || [
      `Enter your ${name} UPI ID during the IPO application.`,
      `Open ${name} and tap the pending IPO mandate notification.`,
      'Verify the IPO company name, lot size, and amount.',
      'Enter your UPI PIN to approve the ASBA bank block.'
    ];
    const securityFeatures = data.securityFeatures || [
      'NPCI certified 2-factor authentication',
      'Device binding and SIM verification protocol'
    ];
    const headquarters = data.headquarters || 'India';

    const fullApp: PaymentAppItem = {
      id,
      name,
      developer,
      marketShare,
      rating,
      ipoMandateSuccess,
      upiLimit,
      rupayCcSupport,
      upiLiteSupport,
      highlights,
      bestFor,
      link,
      about,
      pros,
      cons,
      upiLimitsBreakdown,
      ipoMandateSteps,
      securityFeatures,
      headquarters
    };

    await sql.query(`
      INSERT INTO payment_apps (
        id, name, developer, market_share, rating, ipo_mandate_success,
        upi_limit, rupay_cc_support, upi_lite_support, highlights,
        best_for, link, about, pros, cons, upi_limits_breakdown,
        ipo_mandate_steps, security_features, headquarters, raw_data, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW()
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
    `, [
      id,
      name,
      developer,
      marketShare,
      rating,
      ipoMandateSuccess,
      upiLimit,
      rupayCcSupport,
      upiLiteSupport,
      JSON.stringify(highlights),
      bestFor,
      link,
      about,
      JSON.stringify(pros),
      JSON.stringify(cons),
      JSON.stringify(upiLimitsBreakdown),
      JSON.stringify(ipoMandateSteps),
      JSON.stringify(securityFeatures),
      headquarters,
      JSON.stringify(fullApp)
    ]);

    return fullApp;
  } catch (err) {
    console.error('Error creating payment app in Neon DB:', err);
    throw err;
  }
}

export async function updatePaymentAppInDb(id: string, partial: Partial<PaymentAppItem>): Promise<PaymentAppItem | null> {
  if (!sql) return null;
  try {
    const existing = await sql.query(`SELECT raw_data FROM payment_apps WHERE LOWER(id) = LOWER($1) LIMIT 1;`, [id]);
    if (!existing || existing.length === 0) return null;
    const currentApp = existing[0].raw_data as PaymentAppItem;

    const updatedApp: PaymentAppItem = {
      ...currentApp,
      ...partial,
      id: currentApp.id, // preserve id
      rating: partial.rating !== undefined ? Number(partial.rating) : currentApp.rating,
      rupayCcSupport: partial.rupayCcSupport !== undefined ? Boolean(partial.rupayCcSupport) : currentApp.rupayCcSupport,
      upiLiteSupport: partial.upiLiteSupport !== undefined ? Boolean(partial.upiLiteSupport) : currentApp.upiLiteSupport,
      upiLimitsBreakdown: partial.upiLimitsBreakdown !== undefined ? { ...currentApp.upiLimitsBreakdown, ...partial.upiLimitsBreakdown } : currentApp.upiLimitsBreakdown,
    };

    await sql.query(`
      UPDATE payment_apps
      SET
        name = $2,
        developer = $3,
        market_share = $4,
        rating = $5,
        ipo_mandate_success = $6,
        upi_limit = $7,
        rupay_cc_support = $8,
        upi_lite_support = $9,
        highlights = $10,
        best_for = $11,
        link = $12,
        about = $13,
        pros = $14,
        cons = $15,
        upi_limits_breakdown = $16,
        ipo_mandate_steps = $17,
        security_features = $18,
        headquarters = $19,
        raw_data = $20,
        updated_at = NOW()
      WHERE LOWER(id) = LOWER($1);
    `, [
      id,
      updatedApp.name,
      updatedApp.developer,
      updatedApp.marketShare,
      updatedApp.rating,
      updatedApp.ipoMandateSuccess,
      updatedApp.upiLimit,
      updatedApp.rupayCcSupport,
      updatedApp.upiLiteSupport,
      JSON.stringify(updatedApp.highlights || []),
      updatedApp.bestFor,
      updatedApp.link,
      updatedApp.about,
      JSON.stringify(updatedApp.pros || []),
      JSON.stringify(updatedApp.cons || []),
      JSON.stringify(updatedApp.upiLimitsBreakdown || {}),
      JSON.stringify(updatedApp.ipoMandateSteps || []),
      JSON.stringify(updatedApp.securityFeatures || []),
      updatedApp.headquarters,
      JSON.stringify(updatedApp)
    ]);

    return updatedApp;
  } catch (err) {
    console.error('Error updating payment app in Neon DB:', err);
    throw err;
  }
}

export async function deletePaymentAppFromDb(id: string): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql.query(`DELETE FROM payment_apps WHERE LOWER(id) = LOWER($1);`, [id]);
    return true;
  } catch (err) {
    console.error('Error deleting payment app from Neon DB:', err);
    throw err;
  }
}
