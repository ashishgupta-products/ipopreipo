import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

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
  console.error("Error: DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  console.log("Clearing all mock articles from Neon database...");
  try {
    await sql.query("TRUNCATE TABLE articles;");
    console.log("Success: Articles table cleared!");
  } catch (error) {
    console.error("Failed to clear articles:", error);
    process.exit(1);
  }
}

main();
