import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractTagContent(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`));
  if (!match) return "";
  let content = match[1];
  if (content.startsWith("<![CDATA[")) {
    content = content.substring(9, content.length - 3);
  }
  return content
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export async function GET() {
  try {
    const feedUrl = "https://economictimes.indiatimes.com/rssfeedsdefault.cms";
    const res = await fetch(feedUrl, {
      next: { revalidate: 300 } // Cache feed for 5 minutes on Vercel
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch RSS feed: ${res.status}`);
    }

    const xmlText = await res.text();
    
    // Split XML by <item> tags
    const items: any[] = [];
    const itemSplits = xmlText.split("<item>");
    
    // Skip the first split as it's the channel header before items
    for (let i = 1; i < itemSplits.length; i++) {
      const itemXml = itemSplits[i].split("</item>")[0];
      const title = extractTagContent(itemXml, "title");
      const link = extractTagContent(itemXml, "link");
      const pubDate = extractTagContent(itemXml, "pubDate");
      const description = extractTagContent(itemXml, "description")
        .replace(/<[^>]*>/g, "") // Strip any HTML tags from description
        .substring(0, 400) + "...";

      if (title && link) {
        items.push({
          title,
          link,
          pubDate,
          description
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: items.slice(0, 10) // Return top 10 articles
    });
  } catch (error: any) {
    console.error("News fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch news" },
      { status: 500 }
    );
  }
}
