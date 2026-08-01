import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import { MOCK_ARTICLES } from "../data/mockArticles";

// Simple manual parser for .env.local
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const match = envContent.match(/DATABASE_URL\s*=\s*["']?([^"'\n\r]+)["']?/);
    if (match && match[1]) {
      databaseUrl = match[1];
    }
  }
}

if (!databaseUrl) {
  console.error("Error: DATABASE_URL is not set in process.env or .env.local");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  console.log("Reading schema file...");
  const sqlPath = path.join(__dirname, "../lib/init.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");

  // Split SQL commands by semicolon and filter out empty strings
  const queries = sqlContent
    .split(";")
    .map(q => q.trim())
    .filter(q => q.length > 0);

  console.log(`Initializing database tables in Neon (${queries.length} queries)...`);
  try {
    for (const query of queries) {
      await sql.query(query);
    }
    console.log("Success: Database initialized successfully!");

    // Seeding skipped to avoid mock data
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

main();
