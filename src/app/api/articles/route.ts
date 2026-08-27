import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { MOCK_ARTICLES } from "@/data/mockArticles";

// Revalidate every 60 seconds (Incremental Static Regeneration & Edge Caching)
export const revalidate = 60;

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const sql = getSql();

    if (!sql) {
      const filtered = all
        ? MOCK_ARTICLES
        : MOCK_ARTICLES.filter((a) => a.status === "Published");
      return NextResponse.json(
        {
          success: true,
          data: filtered,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }

    let rows;
    if (all) {
      rows = await sql.query("SELECT * FROM articles ORDER BY created_at DESC");
    } else {
      rows = await sql.query("SELECT * FROM articles WHERE status = 'Published' ORDER BY published_date DESC");
    }

    return NextResponse.json(
      {
        success: true,
        data: rows.map(mapRowToArticle),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/articles error:", error);
    const filtered = MOCK_ARTICLES.filter((a) => a.status === "Published");
    return NextResponse.json({
      success: true,
      data: filtered,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getSql();

    const {
      id = `art_${Date.now()}`,
      slug,
      title,
      excerpt = "",
      content = "",
      category = "IPO News",
      status = "Published",
      author = { name: "Market Research Desk", role: "Senior IPO Analyst" },
      tags = [],
      featuredImage = null,
      publishDate = new Date().toISOString().split("T")[0],
      views = 0,
      readingTimeMins = 5,
      isFeatured = false,
    } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (slug, title)" },
        { status: 400 }
      );
    }

    if (!sql) {
      const newArticle = {
        id,
        slug,
        title,
        excerpt: excerpt || title,
        content,
        category,
        status,
        author: {
          name: author?.name || "Market Research Desk",
          role: author?.role || "Senior IPO Analyst",
          avatarUrl: author?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
        tags: Array.isArray(tags) ? tags : [],
        featuredImage: featuredImage || undefined,
        seoTitle: title,
        seoDescription: excerpt || title,
        publishDate: publishDate || new Date().toISOString().split("T")[0],
        views: views || 0,
        readingTimeMins: readingTimeMins || 5,
        isFeatured: Boolean(isFeatured),
      };

      const existingIndex = MOCK_ARTICLES.findIndex((a) => a.slug === slug || a.id === id);
      if (existingIndex >= 0) {
        MOCK_ARTICLES[existingIndex] = { ...MOCK_ARTICLES[existingIndex], ...newArticle };
      } else {
        MOCK_ARTICLES.unshift(newArticle as any);
      }

      return NextResponse.json({
        success: true,
        message: "Article saved successfully (fallback store)",
        data: newArticle,
      });
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
        publishDate || new Date().toISOString().split("T")[0],
        readingTimeMins,
        views,
        status || "Published",
        isFeatured,
        featuredImage,
        author?.name || "Market Research Desk",
        author?.role || "Senior IPO Analyst",
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    if (!slug && !id) {
      return NextResponse.json({ success: false, error: "slug or id is required" }, { status: 400 });
    }

    const sql = getSql();
    if (sql) {
      try {
        if (id) {
          await sql.query("DELETE FROM articles WHERE id = $1", [id]);
        } else if (slug) {
          await sql.query("DELETE FROM articles WHERE slug = $1", [slug]);
        }
      } catch (err) {
        console.warn("Neon DB delete article failed:", err);
      }
    }

    const idx = MOCK_ARTICLES.findIndex((a) => a.slug === slug || a.id === id);
    if (idx >= 0) {
      MOCK_ARTICLES.splice(idx, 1);
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete article" },
      { status: 500 }
    );
  }
}
