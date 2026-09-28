const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  const env = fs.readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    if (line.trim().startsWith('DATABASE_URL=')) {
      dbUrl = line.trim().substring('DATABASE_URL='.length).trim();
      if (dbUrl.startsWith('"') || dbUrl.startsWith("'")) dbUrl = dbUrl.slice(1, -1);
      break;
    }
  }
}

const sql = neon(dbUrl);

async function syncDbToCache() {
  console.log("Fetching live IPO data from Neon PostgreSQL...");
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

  if (!rows || rows.length === 0) {
    console.error("No rows found in Neon DB!");
    return;
  }

  const ipos = rows.map(r => r.raw_data);
  console.log(`Retrieved ${ipos.length} IPOs from Neon DB.`);

  // Verify sample GMPs
  const sample = ipos.filter(i => ['a-one-steels-india', 'moneyview', 'orient-cables', 'runwal-enterprises'].includes(i.id));
  console.log("Sample GMPs from Neon DB:");
  sample.forEach(s => console.log(` - ${s.name}: ₹${s.gmp} (status: ${s.status})`));

  const nowIso = new Date().toISOString();
  const payload = {
    lastUpdated: nowIso,
    source: "Neon Serverless PostgreSQL (Verified Live Feed)",
    count: ipos.length,
    ipos: ipos
  };

  const projectRoot = path.join(__dirname, '..');
  const srcPath = path.join(projectRoot, 'src', 'data', 'live_ipos.json');
  const pubPath = path.join(projectRoot, 'public', 'data', 'live_ipos.json');

  fs.writeFileSync(srcPath, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(pubPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`\nSuccessfully updated:`);
  console.log(` - ${srcPath}`);
  console.log(` - ${pubPath}`);
}

syncDbToCache().catch(console.error);
