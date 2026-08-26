export type Span = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  highlight?: boolean;
  href?: string;
};

export type Block =
  | { type: "paragraph"; spans: Span[] }
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "code"; language: string; code: string }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "divider" };

export type Post = {
  id: string;
  date: string;
  updated?: boolean;
  tag: string;
  title: string;
  author: string;
  authorTitle: string;
  authorBio: string;
  authorLinkedIn?: string;
  authorAvatar?: string;
  readTime: string;
  cover?: string;
  excerpt: string;
  content: Block[];
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function trimTitleSlug(title: string, maxWords = 6) {
  return slugify(title).split("-").slice(0, maxWords).join("-");
}

export function topicSlug(post: { tag: string }) {
  return slugify(post.tag);
}

function articleSlug(post: { id: string; title: string }) {
  return `${post.id}-${trimTitleSlug(post.title)}`;
}

export function buildHref(post: { id: string; title: string; tag: string }) {
  return `/insights/${topicSlug(post)}/${articleSlug(post)}`;
}

/**
 * Editorial lives in the CMS (`posts` collection) — there is deliberately no
 * static article content here. An empty list means the insights surfaces render
 * their empty state instead of shipping placeholder journalism.
 */
export const ALL_POSTS: Post[] = [];
