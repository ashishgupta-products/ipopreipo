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
