import { sql } from "@/lib/db";
import { User, UserProfileUpdate, WatchlistItem, IPOApplication, InvestorType, UserRole } from "@/types/auth";
import crypto from "crypto";

// Fallback in-memory store for local testing without active DB credentials
const fallbackUsers: Map<string, { user: User; passwordHash: string }> = new Map();
const fallbackWatchlists: Map<string, WatchlistItem[]> = new Map();
const fallbackApplications: Map<string, IPOApplication[]> = new Map();

// Initialize demo users in fallback store (Password: "Demo@1234")
// Hash for Demo@1234: "$2a$10$QjL7VlhjQ32qVzDcr8dYfe8gW0K71R2H2d68.tZ2fA635c1n3n246"
const DEMO_PASSWORD_HASH = "$2a$10$jWq/5rJk3o7qZ5T7s3Hw.eW9g8bWk07zG2F9V4P3Y.2s5b3a1a6";

const demoUsers: Array<{ user: User; passwordHash: string }> = [
  {
    user: {
      id: "usr_demo_retail",
      email: "rahul.investor@gmail.com",
      name: "Rahul Sharma",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "user",
      investorType: "Retail",
      phone: "+91 98765 43210",
      panMasked: "ABCDE1234F",
      bio: "Active Indian stock market & IPO retail investor. Tracking GMP and listing gains daily.",
      createdAt: new Date().toISOString(),
    },
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    user: {
      id: "usr_demo_hni",
      email: "priya.hni@finance.in",
      name: "Priya Patel",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      role: "user",
      investorType: "sHNI",
      phone: "+91 91234 56789",
      panMasked: "XYZPQ9876R",
      bio: "High net-worth investor focused on Mainboard IPOs and Pre-IPO unlisted equity opportunities.",
      createdAt: new Date().toISOString(),
    },
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    user: {
      id: "usr_demo_admin",
      email: "admin@ipopreipo.com",
      name: "Admin Team",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: "admin",
      investorType: "General",
      phone: "+91 80000 00000",
      bio: "ipo preipo.com Platform Administrator & Market Research Desk.",
      createdAt: new Date().toISOString(),
    },
    passwordHash: DEMO_PASSWORD_HASH,
  }
];

demoUsers.forEach((demo) => {
  fallbackUsers.set(demo.user.email.toLowerCase(), demo);
  fallbackUsers.set(demo.user.id, demo);
});

// Helper to ensure tables exist in Neon DB
let tablesInitialized = false;
async function ensureTables() {
  if (!sql || tablesInitialized) return;
  try {
    await sql`
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
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`;
    await sql`
      CREATE TABLE IF NOT EXISTS user_watchlists (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ipo_id VARCHAR(100) NOT NULL,
        ipo_slug VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, ipo_slug)
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_watchlists_user_id ON user_watchlists(user_id);`;
    await sql`
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
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_applications_user_id ON user_applications(user_id);`;
    tablesInitialized = true;
  } catch (err) {
    console.warn("Neon DB table initialization skipped or failed:", err);
  }
}

export function mapRowToUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url || undefined,
    role: (row.role as UserRole) || "user",
    investorType: (row.investor_type as InvestorType) || "Retail",
    phone: row.phone || undefined,
    panMasked: row.pan_masked || undefined,
    bio: row.bio || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export async function findUserByEmail(email: string): Promise<{ user: User; passwordHash: string } | null> {
  const cleanEmail = email.trim().toLowerCase();
  await ensureTables();

  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM users WHERE LOWER(email) = ${cleanEmail} LIMIT 1
      `;
      if (rows && rows.length > 0) {
        const row = rows[0];
        return {
          user: mapRowToUser(row),
          passwordHash: row.password_hash,
        };
      }
    } catch (err) {
      console.warn("DB query findUserByEmail failed, checking fallback:", err);
    }
  }

  const fallback = fallbackUsers.get(cleanEmail);
  return fallback || null;
}

export async function findUserById(id: string): Promise<User | null> {
  await ensureTables();

  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM users WHERE id = ${id} LIMIT 1
      `;
      if (rows && rows.length > 0) {
        return mapRowToUser(rows[0]);
      }
    } catch (err) {
      console.warn("DB query findUserById failed, checking fallback:", err);
    }
  }

  const fallback = fallbackUsers.get(id);
  return fallback ? fallback.user : null;
}

export async function createUser(params: {
  email: string;
  passwordHash: string;
  name: string;
  investorType?: InvestorType;
  role?: UserRole;
  avatarUrl?: string;
}): Promise<User> {
  await ensureTables();
  const id = `usr_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const cleanEmail = params.email.trim().toLowerCase();
  const role = params.role || "user";
  const investorType = params.investorType || "Retail";
  const now = new Date().toISOString();

  const user: User = {
    id,
    email: cleanEmail,
    name: params.name.trim(),
    avatarUrl: params.avatarUrl,
    role,
    investorType,
    createdAt: now,
  };

  if (sql) {
    try {
      await sql`
        INSERT INTO users (id, email, password_hash, name, avatar_url, role, investor_type, created_at, updated_at)
        VALUES (${id}, ${cleanEmail}, ${params.passwordHash}, ${params.name}, ${params.avatarUrl || null}, ${role}, ${investorType}, ${now}, ${now})
      `;
      return user;
    } catch (err) {
      console.warn("DB insert createUser failed, saving to fallback store:", err);
    }
  }

  fallbackUsers.set(cleanEmail, { user, passwordHash: params.passwordHash });
  fallbackUsers.set(id, { user, passwordHash: params.passwordHash });
  return user;
}

export async function updateUserProfile(id: string, updates: UserProfileUpdate): Promise<User | null> {
  await ensureTables();
  const now = new Date().toISOString();

  if (sql) {
    try {
      const rows = await sql`
        UPDATE users
        SET 
          name = COALESCE(${updates.name || null}, name),
          phone = COALESCE(${updates.phone || null}, phone),
          pan_masked = COALESCE(${updates.panMasked || null}, pan_masked),
          bio = COALESCE(${updates.bio || null}, bio),
          investor_type = COALESCE(${updates.investorType || null}, investor_type),
          avatar_url = COALESCE(${updates.avatarUrl || null}, avatar_url),
          updated_at = ${now}
        WHERE id = ${id}
        RETURNING *
      `;
      if (rows && rows.length > 0) {
        return mapRowToUser(rows[0]);
      }
    } catch (err) {
      console.warn("DB updateUserProfile failed:", err);
    }
  }

  const existing = fallbackUsers.get(id);
  if (existing) {
    const updatedUser: User = {
      ...existing.user,
      name: updates.name ?? existing.user.name,
      phone: updates.phone ?? existing.user.phone,
      panMasked: updates.panMasked ?? existing.user.panMasked,
      bio: updates.bio ?? existing.user.bio,
      investorType: updates.investorType ?? existing.user.investorType,
      avatarUrl: updates.avatarUrl ?? existing.user.avatarUrl,
      updatedAt: now,
    };
    fallbackUsers.set(id, { ...existing, user: updatedUser });
    fallbackUsers.set(updatedUser.email.toLowerCase(), { ...existing, user: updatedUser });
    return updatedUser;
  }

  return null;
}

export async function getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
  await ensureTables();

  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM user_watchlists WHERE user_id = ${userId} ORDER BY created_at DESC
      `;
      return rows.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        ipoId: r.ipo_id,
        ipoSlug: r.ipo_slug,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err) {
      console.warn("DB getUserWatchlist failed:", err);
    }
  }

  return fallbackWatchlists.get(userId) || [];
}

export async function addToWatchlist(userId: string, ipoId: string, ipoSlug: string): Promise<WatchlistItem> {
  await ensureTables();
  const id = `wl_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const now = new Date().toISOString();

  const item: WatchlistItem = {
    id,
    userId,
    ipoId,
    ipoSlug,
    createdAt: now,
  };

  if (sql) {
    try {
      await sql`
        INSERT INTO user_watchlists (id, user_id, ipo_id, ipo_slug, created_at)
        VALUES (${id}, ${userId}, ${ipoId}, ${ipoSlug}, ${now})
        ON CONFLICT (user_id, ipo_slug) DO NOTHING
      `;
      return item;
    } catch (err) {
      console.warn("DB addToWatchlist failed:", err);
    }
  }

  const list = fallbackWatchlists.get(userId) || [];
  if (!list.some((w) => w.ipoSlug === ipoSlug)) {
    list.unshift(item);
    fallbackWatchlists.set(userId, list);
  }
  return item;
}

export async function removeFromWatchlist(userId: string, ipoSlug: string): Promise<boolean> {
  await ensureTables();

  if (sql) {
    try {
      await sql`
        DELETE FROM user_watchlists WHERE user_id = ${userId} AND ipo_slug = ${ipoSlug}
      `;
      return true;
    } catch (err) {
      console.warn("DB removeFromWatchlist failed:", err);
    }
  }

  const list = fallbackWatchlists.get(userId) || [];
  const filtered = list.filter((w) => w.ipoSlug !== ipoSlug);
  fallbackWatchlists.set(userId, filtered);
  return true;
}

export async function getUserApplications(userId: string): Promise<IPOApplication[]> {
  await ensureTables();

  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM user_applications WHERE user_id = ${userId} ORDER BY created_at DESC
      `;
      return rows.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        ipoId: r.ipo_id,
        ipoSlug: r.ipo_slug,
        ipoName: r.ipo_name,
        category: r.category || "Retail",
        lotsApplied: Number(r.lots_applied || 1),
        lotSize: Number(r.lot_size || 1),
        bidPrice: Number(r.bid_price || 0),
        totalAmount: Number(r.total_amount || 0),
        panMasked: r.pan_masked || undefined,
        applicationNumber: r.application_number || undefined,
        status: r.status || "Applied",
        allottedLots: r.allotted_lots !== null ? Number(r.allotted_lots) : undefined,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err) {
      console.warn("DB getUserApplications failed:", err);
    }
  }

  return fallbackApplications.get(userId) || [];
}

export async function createApplication(
  userId: string,
  app: Omit<IPOApplication, "id" | "userId" | "createdAt">
): Promise<IPOApplication> {
  await ensureTables();
  const id = `app_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const now = new Date().toISOString();

  const application: IPOApplication = {
    id,
    userId,
    ...app,
    createdAt: now,
  };

  if (sql) {
    try {
      await sql`
        INSERT INTO user_applications (
          id, user_id, ipo_id, ipo_slug, ipo_name, category, 
          lots_applied, lot_size, bid_price, total_amount, 
          pan_masked, application_number, status, allotted_lots, created_at
        ) VALUES (
          ${id}, ${userId}, ${app.ipoId}, ${app.ipoSlug}, ${app.ipoName}, ${app.category},
          ${app.lotsApplied}, ${app.lotSize}, ${app.bidPrice}, ${app.totalAmount},
          ${app.panMasked || null}, ${app.applicationNumber || null}, ${app.status || "Applied"},
          ${app.allottedLots || null}, ${now}
        )
      `;
      return application;
    } catch (err) {
      console.warn("DB createApplication failed:", err);
    }
  }

  const list = fallbackApplications.get(userId) || [];
  list.unshift(application);
  fallbackApplications.set(userId, list);
  return application;
}

export async function deleteApplication(userId: string, appId: string): Promise<boolean> {
  await ensureTables();

  if (sql) {
    try {
      await sql`
        DELETE FROM user_applications WHERE user_id = ${userId} AND id = ${appId}
      `;
      return true;
    } catch (err) {
      console.warn("DB deleteApplication failed:", err);
    }
  }

  const list = fallbackApplications.get(userId) || [];
  const filtered = list.filter((a) => a.id !== appId);
  fallbackApplications.set(userId, filtered);
  return true;
}
