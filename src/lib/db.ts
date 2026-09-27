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
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;`,
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
      `SELECT id, name, email, phone, investor_category, demat_provider, image, created_at, updated_at FROM users WHERE id = $1 LIMIT 1;`,
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
}): Promise<DbUser | null> {
  if (!sql) return null;
  try {
    const userId = crypto.randomUUID();
    const rows = await sql.query(
      `INSERT INTO users (id, name, email, password_hash, phone, investor_category, demat_provider, updated_at)
       VALUES ($1, $2, LOWER($3), $4, $5, $6, $7, NOW())
       RETURNING id, name, email, phone, investor_category, demat_provider, created_at;`,
      [
        userId,
        data.name.trim(),
        data.email.trim(),
        data.passwordHash || null,
        data.phone?.trim() || null,
        data.investorCategory || 'RETAIL',
        data.dematProvider || 'Zerodha'
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
    const rows = await sql.query(
      `INSERT INTO users (id, name, email, image, updated_at)
       VALUES ($1, $2, LOWER($3), $4, NOW())
       ON CONFLICT (email) DO UPDATE SET
         name = COALESCE(users.name, EXCLUDED.name),
         image = COALESCE(EXCLUDED.image, users.image),
         updated_at = NOW()
       RETURNING id, name, email, phone, investor_category, demat_provider, image;`,
      [userId, data.name, data.email.trim(), data.image || null]
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
       RETURNING id, name, email, phone, investor_category, demat_provider, image, updated_at;`,
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
