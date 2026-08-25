import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { MOCK_ARTICLES } from "@/data/mockArticles";

export const dynamic = "force-dynamic";

const databaseUrl = process.env.DATABASE_URL;

function getSql() {
  if (!databaseUrl) {
    return null;
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const sql = getSql();

    if (!sql) {
      const found = MOCK_ARTICLES.find((a) => a.slug === resolvedParams.slug);
      if (found) {
        return NextResponse.json({ success: true, data: found });
      }
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    const rows = await sql.query(
      "SELECT * FROM articles WHERE slug = $1 LIMIT 1",
      [resolvedParams.slug]
    );

    if (!rows || rows.length === 0) {
      const found = MOCK_ARTICLES.find((a) => a.slug === resolvedParams.slug);
      if (found) {
        return NextResponse.json({ success: true, data: found });
      }
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    // Increment view count asynchronously in background
    try {
      await sql.query(
        "UPDATE articles SET views = views + 1 WHERE id = $1",
        [rows[0].id]
      );
    } catch (e) {
      console.error("Failed to increment article views:", e);
    }

    const article = mapRowToArticle(rows[0]);
    // Simulate increment locally so it reflects on first load
    article.views += 1;

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    console.error("GET /api/articles/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load article" },
      { status: 500 }
    );
  }
}
