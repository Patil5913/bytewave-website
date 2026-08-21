import { getPublishedPosts, getSiteSettingsContent } from "@/lib/content";
import { buildHref } from "@/lib/insights";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  
  const [posts, settings] = await Promise.all([
    getPublishedPosts(),
    getSiteSettingsContent(),
  ]);

  const items = posts
    .map((post) => {
      const url = absoluteUrl(buildHref(post));
      const published = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : undefined;
      return [
        "    <item>",
        `      <title>${xmlEscape(post.title)}</title>`,
        `      <link>${xmlEscape(url)}</link>`,
        
        `      <guid isPermaLink="false">${xmlEscape(post.id)}</guid>`,
        `      <description>${xmlEscape(post.excerpt ?? "")}</description>`,
        post.author ? `      <author>${xmlEscape(post.author)}</author>` : "",
        post.tag ? `      <category>${xmlEscape(post.tag)}</category>` : "",
        published ? `      <pubDate>${published}</pubDate>` : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const description =
    settings.seo?.metaDescription ?? settings.tagline ?? SITE_NAME;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(`${SITE_NAME} — Insights`)}</title>
    <link>${xmlEscape(absoluteUrl("/insights"))}</link>
    <description>${xmlEscape(description)}</description>
    <language>en-us</language>
    <atom:link href="${xmlEscape(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
