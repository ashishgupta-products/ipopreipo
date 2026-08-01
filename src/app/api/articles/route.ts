import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const databaseUrl = process.env.DATABASE_URL;

function getSql() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(databaseUrl);
}

function mapRowToArticle(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    status: row.status,
    author: {
      name: row.author_name,
      role: row.author_role,
      avatarUrl: row.author_avatar || undefined,
    },
    tags: Array.isArray(row.tags) ? row.tags : [],
    featuredImage: row.featured_image || undefined,
    publishDate: row.published_date || "",
    views: Number(row.views || 0),
    readingTimeMins: Number(row.reading_time_mins || 5),
    isFeatured: Boolean(row.is_featured),
    seoTitle: row.title,
    seoDescription: row.excerpt,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const sql = getSql();

    let rows;
    if (all) {
      rows = await sql.query("SELECT * FROM articles ORDER BY created_at DESC");
    } else {
      rows = await sql.query("SELECT * FROM articles WHERE status = 'Published' ORDER BY published_date DESC");
    }

    return NextResponse.json({
      success: true,
      data: rows.map(mapRowToArticle),
    });
  } catch (error: any) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getSql();

    const {
      id,
      slug,
      title,
      excerpt,
      content,
      category,
      status,
      author,
      tags = [],
      featuredImage = null,
      publishDate = "",
      views = 0,
      readingTimeMins = 5,
      isFeatured = false,
    } = body;

    if (!id || !slug || !title) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (id, slug, title)" },
        { status: 400 }
      );
    }

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
        author_avatar = EXCLUDED.author_avatar,
        updated_at = CURRENT_TIMESTAMP`,
      [
        id,
        slug,
        title,
        excerpt,
        content,
        category,
        tags,
        publishDate,
        readingTimeMins,
        views,
        status,
        isFeatured,
        featuredImage,
        author?.name || "Author",
        author?.role || "Staff Editor",
        author?.avatarUrl || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Article saved successfully",
    });
  } catch (error: any) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save article" },
      { status: 500 }
    );
  }
}
