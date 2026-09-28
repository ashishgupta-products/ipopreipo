import { neon } from '@neondatabase/serverless';
import { IpoItem } from '../types';
import { IpoAnalyst } from '../types/analyst';

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

    // 5. Last sync
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
