/**
 * Seed script — run against a RUNNING dev server via HTTP (bun src/seed.ts).
 * Uses the REST API so it never imports the Payload config (avoids the
 * Node/tsx top-level-await require bug with lexical). Idempotent-ish: skips
 * docs that already exist by a natural key.
 */
import { ALL_POSTS, type Block, type Span } from "./lib/insights";

type Faq = { question: string; answer: string };

// Serialize a span back to inline markdown.
function spanToMd(s: Span): string {
  let t = s.text;
  if (s.code) t = `\`${t}\``;
  if (s.bold) t = `**${t}**`;
  if (s.italic) t = `*${t}*`;
  if (s.highlight) t = `==${t}==`;
  if (s.href) t = `[${t}](${s.href})`;
  return t;
}

// Serialize renderer blocks back to the markdown authoring format. FAQ blocks
// are pulled out into a separate `faqs` array (kept in a structured field).
function blocksToMarkdown(blocks: Block[]): { md: string; faqs: Faq[] } {
  const faqs: Faq[] = [];
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "paragraph":
        out.push(b.spans.map(spanToMd).join(""));
        break;
      case "heading":
        out.push(`${"#".repeat(b.level)} ${b.text}`);
        break;
      case "quote":
        out.push(`> ${b.text}`);
        break;
      case "list":
        out.push(
          b.items
            .map((it, n) => (b.ordered ? `${n + 1}. ${it}` : `- ${it}`))
            .join("\n"),
        );
        break;
      case "image":
        out.push(
          `![${b.alt}](${b.src}${b.caption ? ` "${b.caption}"` : ""})`,
        );
        break;
      case "code":
        out.push(`\`\`\`${b.language}\n${b.code}\n\`\`\``);
        break;
      case "divider":
        out.push("---");
        break;
      case "faq":
        faqs.push(...b.items);
        out.push("## Frequently asked questions");
        break;
    }
  }
  return { md: out.join("\n\n"), faqs };
}

const BASE = process.env.SEED_BASE ?? "http://localhost:3000";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@findandhire.dev";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "changeme-123";

const PLACEMENTS = [
  { role: "Backend Developer", stack: "Python, FastAPI, SQLAlchemy", candidate: "M. Davis", company: "stripe.com", companyName: "Stripe", location: "New York, NY", pay: "$165k Base", status: "Placed", order: 0 },
  { role: "Product Designer", stack: "Figma, Design Systems", candidate: "A. Chen", company: "notion.so", companyName: "Notion", location: "Remote", pay: "$140k Base", status: "Offer", order: 1 },
  { role: "Frontend Engineer", stack: "React, TypeScript, Next.js", candidate: "J. Okafor", company: "linear.app", companyName: "Linear", location: "San Francisco, CA", pay: "$155k Base", status: "Interviewing", order: 2 },
  { role: "Data Analyst", stack: "SQL, Python, Looker", candidate: "R. Foster", company: "figma.com", companyName: "Figma", location: "Austin, TX", pay: "$120k Base", status: "Placed", order: 3 },
  { role: "DevOps Engineer", stack: "Kubernetes, Terraform, AWS", candidate: "S. Kim", company: "vercel.com", companyName: "Vercel", location: "Seattle, WA", pay: "$175k Base", status: "Negotiating", order: 4 },
];

const STATS = [
  { value: 94, decimals: 0, suffix: "%", label: "Placement Success Rate", note: "of matched roles close on the first shortlist." },
  { value: 14, decimals: 0, suffix: "d", label: "Avg. Time-to-Placement", note: "from first intro to signed offer." },
  { value: 1.2, decimals: 1, suffix: "k", label: "Verified Professionals", note: "skills confirmed, not keyword-matched." },
  { value: 150, decimals: 0, suffix: "+", label: "Partner Organizations", note: "hiring directly through the network." },
];

async function api(path: string, init: RequestInit = {}, token?: string) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `JWT ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  return res;
}

async function ensureAdmin(): Promise<string> {
  // create first user (open when 0 users exist); ignore if it already exists
  const create = await api("/api/users", {
    method: "POST",
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "Admin" }),
  });
  if (create.ok) console.log("• created admin user", ADMIN_EMAIL);
  else console.log("• admin user exists or restricted — logging in");

  const login = await api("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!login.ok) throw new Error(`login failed: ${login.status} ${await login.text()}`);
  const { token } = await login.json();
  return token as string;
}

async function count(collection: string, token: string) {
  const res = await api(`/api/${collection}?limit=0`, {}, token);
  const j = await res.json();
  return j.totalDocs as number;
}

async function main() {
  const token = await ensureAdmin();

  // Placements
  if ((await count("placements", token)) === 0) {
    for (const p of PLACEMENTS) {
      const r = await api("/api/placements", { method: "POST", body: JSON.stringify(p) }, token);
      if (!r.ok) console.error("  placement failed", p.role, r.status, await r.text());
    }
    console.log(`• seeded ${PLACEMENTS.length} placements`);
  } else console.log("• placements already present — skip");

  // Posts
  if ((await count("posts", token)) === 0) {
    for (const post of ALL_POSTS) {
      const { md, faqs } = blocksToMarkdown(post.content);
      const body = {
        articleId: post.id,
        title: post.title,
        tag: post.tag,
        date: post.date,
        updated: post.updated ?? false,
        readTime: post.readTime,
        cover: post.cover,
        excerpt: post.excerpt,
        author: post.author,
        authorTitle: post.authorTitle,
        authorBio: post.authorBio,
        authorLinkedIn: post.authorLinkedIn,
        authorAvatar: post.authorAvatar,
        content: md,
        faqs,
      };
      const r = await api("/api/posts", { method: "POST", body: JSON.stringify(body) }, token);
      if (!r.ok) console.error("  post failed", post.id, r.status, await r.text());
    }
    console.log(`• seeded ${ALL_POSTS.length} posts`);
  } else console.log("• posts already present — skip");

  // Site stats global
  const g = await api("/api/globals/site-stats", { method: "POST", body: JSON.stringify({ stats: STATS }) }, token);
  console.log(g.ok ? "• seeded site-stats global" : `• site-stats failed ${g.status} ${await g.text()}`);

  console.log("\n✔ seed complete. Admin:", ADMIN_EMAIL, "/", ADMIN_PASSWORD);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
