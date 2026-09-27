const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Read DATABASE_URL from .env.local or .env
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  const envFiles = ['.env.local', '.env'];
  for (const f of envFiles) {
    const fullPath = path.join(__dirname, '..', f);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('DATABASE_URL=')) {
          dbUrl = trimmed.substring('DATABASE_URL='.length).trim();
          if ((dbUrl.startsWith('"') && dbUrl.endsWith('"')) || (dbUrl.startsWith("'") && dbUrl.endsWith("'"))) {
            dbUrl = dbUrl.slice(1, -1);
          }
          break;
        }
      }
    }
    if (dbUrl) break;
  }
}

if (!dbUrl) {
  console.error("ERROR: DATABASE_URL not found.");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  console.log("Connecting to Neon PostgreSQL to seed dev shortcut users...");

  // 1. Admin account: admin@ipopreipo.com / admin123
  const adminEmail = "admin@ipopreipo.com";
  const adminPw = "admin123";
  const adminHash = await bcrypt.hash(adminPw, 10);

  await sql.query(`
    INSERT INTO users (id, name, email, password_hash, role, investor_category, demat_provider, updated_at)
    VALUES ('dev-admin-user', 'System Administrator', $1, $2, 'admin', 'bHNI', 'Zerodha', NOW())
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      role = 'admin',
      updated_at = NOW();
  `, [adminEmail, adminHash]);
  console.log(" -> Seeded/Updated dev admin user: admin@ipopreipo.com / admin123 (role=admin)");

  // 2. Investor account: investor@ipopreipo.com / investor123
  const userEmail = "investor@ipopreipo.com";
  const userPw = "investor123";
  const userHash = await bcrypt.hash(userPw, 10);

  await sql.query(`
    INSERT INTO users (id, name, email, password_hash, role, investor_category, demat_provider, updated_at)
    VALUES ('dev-investor-user', 'Rajesh Sharma', $1, $2, 'user', 'Retail', 'Groww', NOW())
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      role = 'user',
      updated_at = NOW();
  `, [userEmail, userHash]);
  console.log(" -> Seeded/Updated dev investor user: investor@ipopreipo.com / investor123 (role=user)");

  // 3. Verify
  const rows = await sql.query(`
    SELECT id, name, email, role, investor_category FROM users WHERE email IN ($1, $2);
  `, [adminEmail, userEmail]);

  console.log("\nVerified dev shortcut users in Neon DB:");
  for (const r of rows) {
    console.log(` - ${r.name} (${r.email}) -> role: ${r.role}, category: ${r.investor_category}`);
  }

  console.log("\nSUCCESS: Dev shortcut users seeded successfully!");
}

main().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
