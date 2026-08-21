import type { PostView } from "./content";
import { buildHref, topicSlug } from "./insights";
import { SITE_NAME, absoluteUrl } from "./seo";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function organizationSchema(description?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    ...(description ? { description } : {}),
  };
}

export function articleSchema(post: PostView) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(buildHref(post)),
    
    ...(post.cover
      ? {
          image: [
            post.cover.startsWith("http") ? post.cover : absoluteUrl(post.cover),
          ],
        }
      : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.author
      ? { author: { "@type": "Person", name: post.author } }
      : {}),
    publisher: { "@type": "Organization", name: SITE_NAME },
    ...(post.tag ? { articleSection: post.tag } : {}),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(post: PostView) {
  const trail = [
    { name: "Home", url: absoluteUrl("/") },
    { name: "Insights", url: absoluteUrl("/insights") },
    { name: post.tag, url: absoluteUrl(`/insights/${topicSlug(post)}`) },
    { name: post.title, url: absoluteUrl(buildHref(post)) },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
