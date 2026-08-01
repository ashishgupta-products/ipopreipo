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

    console.log("Seeding initial articles data...");
    for (const art of MOCK_ARTICLES) {
      await sql.query(
        `INSERT INTO articles (
          id, slug, title, excerpt, content, category, tags, published_date,
          reading_time_mins, views, status, is_featured, featured_image,
          author_name, author_role, author_avatar
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          category = EXCLUDED.category,
          tags = EXCLUDED.tags,
          published_date = EXCLUDED.published_date,
          reading_time_mins = EXCLUDED.reading_time_mins,
          status = EXCLUDED.status,
          is_featured = EXCLUDED.is_featured,
          featured_image = EXCLUDED.featured_image,
          author_name = EXCLUDED.author_name,
          author_role = EXCLUDED.author_role,
          author_avatar = EXCLUDED.author_avatar`,
        [
          art.id, art.slug, art.title, art.excerpt, art.content, art.category,
          art.tags, art.publishDate, art.readingTimeMins, art.views, art.status,
          !!art.isFeatured, art.featuredImage || null, art.author.name, art.author.role, art.author.avatarUrl || null
        ]
      );
    }
    console.log("Success: Articles seeded successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

main();
