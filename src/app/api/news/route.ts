import { NextResponse } from "next/server";

// Revalidate news feed every 5 minutes (Incremental Static Regeneration & Edge Caching)
export const revalidate = 300;

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

const SOURCES = [
  {
    name: "Economic Times",
    url: "https://economictimes.indiatimes.com/rssfeedsdefault.cms"
  },
  {
    name: "Moneycontrol",
    url: "https://www.moneycontrol.com/rss/latestnews.xml"
  },
  {
    name: "Livemint",
    url: "https://www.livemint.com/rss/news"
  },
  {
    name: "Financial Express",
    url: "https://www.financialexpress.com/feed/"
  },
  {
    name: "NDTV Profit",
    url: "https://www.ndtvprofit.com/feeds/all.xml"
  },
  {
    name: "Business Standard",
    url: "https://www.business-standard.com/rss/latest-news-101.rss"
  }
];

export async function GET() {
  try {
    const allItems: any[] = [];

    const fetchPromises = SOURCES.map(async (source) => {
      try {
        const res = await fetch(source.url, {
          next: { revalidate: 300 }, // Cache feed for 5 minutes
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        });

        if (!res.ok) return;

        const xmlText = await res.text();
        const itemSplits = xmlText.split("<item>");

        for (let i = 1; i < itemSplits.length; i++) {
          const itemXml = itemSplits[i].split("</item>")[0];
          const title = extractTagContent(itemXml, "title");
          const link = extractTagContent(itemXml, "link");
          const pubDate = extractTagContent(itemXml, "pubDate");
          
          // Try to extract image URL from various RSS formats
          let imageUrl = "";
          
          // 1. Check media:content or media:thumbnail
          const mediaMatch = itemXml.match(/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["']/i);
          if (mediaMatch) {
            imageUrl = mediaMatch[1];
          }
          
          // 2. Check enclosure
          if (!imageUrl) {
            const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
            if (enclosureMatch) {
              imageUrl = enclosureMatch[1];
            }
          }
          
          // 3. Check inside description (e.g. img tags)
          const rawDescription = extractTagContent(itemXml, "description");
          if (!imageUrl) {
            const imgMatch = rawDescription.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) {
              imageUrl = imgMatch[1];
            }
          }

          let description = rawDescription
            .replace(/<[^>]*>/g, "") // Strip HTML tags
            .trim();

          if (description.length > 220) {
            description = description.substring(0, 220) + "...";
          }

          // Only include articles related to the stock market, IPOs, or investments
          const marketKeywords = [
            "ipo", "stock", "share", "market", "sensex", "nifty", "sebi", "listing", 
            "gmp", "allotment", "equity", "finance", "broker", "invest", "mutual fund", 
            "rbi", "dividend", "qib", "hni", "retail investor", "bse", "nse", "debt",
            "valuation", "earnings", "quarterly", "acquisition", "merger", "promoter",
            "unlisted", "pre-ipo", "securities", "bull", "bear", "trading"
          ];
          
          const lowerTitle = title.toLowerCase();
          const lowerDesc = description.toLowerCase();
          const isRelatedToMarket = marketKeywords.some(keyword => 
            lowerTitle.includes(keyword) || lowerDesc.includes(keyword)
          );

          if (title && link && isRelatedToMarket) {
            allItems.push({
              title,
              link,
              pubDate,
              description: description || "Read the full story on " + source.name,
              source: source.name,
              imageUrl: imageUrl || null,
              timestamp: pubDate ? new Date(pubDate).getTime() : 0
            });
          }
        }
      } catch (err) {
        console.error(`Failed to fetch/parse news source ${source.name}:`, err);
      }
    });

    await Promise.all(fetchPromises);

    // Sort items by date descending (newest first)
    allItems.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(
      {
        success: true,
        data: allItems.slice(0, 15), // Return top 15 aggregated articles
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
        },
      }
    );
  } catch (error: any) {
    console.error("News aggregation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch aggregated news" },
      { status: 500 }
    );
  }
}

