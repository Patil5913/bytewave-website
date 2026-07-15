# Writing Insights blog posts

This is the reference for writing a new post for `/insights`. Right now posts
are hand-written TypeScript objects in `src/lib/insights.ts` (the `ALL_POSTS`
array) — there is no markdown parser wired up yet. This guide describes both
the target markdown format (what you should write today as a `.md` file in
`content/insights/`, for when parsing is wired up) and how to translate that
markdown into the `Post` object that actually renders right now.

## 1. Where things live

| Thing | Location |
|---|---|
| Post data (source of truth today) | `src/lib/insights.ts` → `ALL_POSTS` |
| Detail page renderer | `src/app/insights/[topic]/[slug]/page.tsx` |
| Topic listing page | `src/app/insights/[topic]/page.tsx` |
| All-posts index | `src/app/insights/page.tsx` |
| Homepage teaser (first 3 posts) | `src/components/Insights.tsx` |
| Markdown drafts (not yet parsed) | `content/insights/*.md` |

Adding a post to `ALL_POSTS` automatically shows up everywhere above — index,
topic page, and homepage teaser all read from that one array. You never edit
those three page files for a new post.

## 2. URL routing

Every post gets two auto-generated things:

- **Topic** = `slugify(post.tag)` — `"E-3 Visa"` → `e-3-visa`
- **Slug** = `${post.id}-${first 6 words of the title, slugified}` — cosmetic,
  not the lookup key

Final URL: `/insights/{topic}/{id}-{trimmed-title}`

Lookup on page load matches by **`id` prefix only** (`slug.startsWith(post.id + "-")`),
so you can freely edit a title later without breaking old links, as long as
`id` doesn't change.

**Rule: `id` must be unique across all posts, and never reused.**

## 3. Frontmatter (target markdown format)

```yaml
---
id: article-5                      # required, unique, never changes
title: "Your Post Title Here"      # required
tag: "Category Name"               # required — becomes the topic
date: "Month DD, YYYY"             # required, display string
updated: true                      # optional — prefixes date with "Updated "
author: "Full Name"                # required
authorTitle: "Role @ Company"      # required
authorBio: "One or two sentences." # required
authorLinkedIn: "https://..."      # optional — omit to hide the link
authorAvatar: "https://..."        # optional — omit to show initials instead
readTime: "N min read"             # required, display string
cover: "https://images.unsplash.com/..." # required, hero image
excerpt: "One sentence summary shown in list views and teasers."
faqs:                              # optional — omit entirely if no FAQ
  - question: "Question text?"
    answer: "Answer text."
---
```

`faqs` lives in frontmatter, not the body — markdown has no native FAQ block,
so it's kept structured here and rendered as its own accordion section
wherever you place `## Frequently asked questions` in the body (or, in the
current hand-written format, wherever you insert a `{ type: "faq", ... }`
block).

## 4. Body markdown → what it renders as

| Write this | Renders as |
|---|---|
| `## Heading` | H2, anchor-linked, appears in the sidebar TOC |
| `### Heading` | H3, anchor-linked, appears in the sidebar TOC (indented) |
| `#### Heading` | H4, anchor-linked, does **not** appear in the TOC (use for small subsections like "From you" / "From your employer") |
| Plain paragraph | Paragraph, `text-white/60` |
| `**bold**` | Bold, white |
| `*italic*` | Italic |
| `` `code` `` | Inline code, emerald pill |
| `==highlight==` | Highlighted span (not standard markdown — needs a custom remark plugin once parsing is wired up) |
| `[text](url)` | Emerald underlined link |
| `- item` | Bullet list |
| `1. item` | Numbered list |
| `> quote` | Blockquote, emerald left border, italic |
| `![alt](src "caption")` | Image block, `title` attr becomes the caption |
| `` ```lang\ncode\n``` `` | Code block, no syntax highlighting applied |
| `---` | Divider (thin horizontal rule) |
| `## Frequently asked questions` immediately followed by the `faqs` frontmatter | FAQ accordion (native `<details>`, no JS) |

Do **not** use `# H1` in the body — the page title from frontmatter is the
only H1.

## 5. Writing it today (before markdown parsing is wired up)

Until a markdown parser is connected, translate the body into a `content:
Block[]` array by hand and add a new entry to `ALL_POSTS` in
`src/lib/insights.ts`. The block shapes map 1:1 to the table above:

```ts
{
  id: "article-5",
  title: "Your Post Title Here",
  tag: "Category Name",
  date: "Month DD, YYYY",
  author: "Full Name",
  authorTitle: "Role @ Company",
  authorBio: "One or two sentences.",
  authorLinkedIn: "https://...", // omit if none
  readTime: "N min read",
  cover: "https://images.unsplash.com/...",
  excerpt: "One sentence summary.",
  content: [
    {
      type: "paragraph",
      spans: [
        { text: "Plain text, " },
        { text: "bold text", bold: true },
        { text: ", " },
        { text: "italic text", italic: true },
        { text: ", " },
        { text: "inline code", code: true },
        { text: ", " },
        { text: "a highlighted phrase", highlight: true },
        { text: ", and a " },
        { text: "link", href: "/insights" },
        { text: "." },
      ],
    },
    { type: "heading", level: 2, text: "A Section" },
    { type: "heading", level: 3, text: "A Subsection" },
    { type: "heading", level: 4, text: "A Small Subsection (no TOC entry)" },
    { type: "quote", text: "A pull quote." },
    { type: "list", items: ["First point", "Second point"] },
    { type: "list", ordered: true, items: ["Step one", "Step two"] },
    {
      type: "image",
      src: "https://images.unsplash.com/...",
      alt: "Alt text",
      caption: "Optional caption",
    },
    { type: "code", language: "text", code: "some\nliteral\ntext" },
    { type: "divider" },
    {
      type: "faq",
      items: [
        { question: "Question?", answer: "Answer." },
      ],
    },
  ],
},
```

Note: `spans` is only used inside `paragraph` blocks — every other block type
(`heading`, `quote`, `list` items) takes plain `text` strings, no inline
formatting.

## 6. Checklist before publishing

- [ ] `id` is unique and won't be reused later
- [ ] `tag` matches an existing topic if you want it grouped with related
      posts, or is a new topic if it's genuinely new ground
- [ ] `excerpt` is one sentence — it's what shows in every list view
- [ ] `cover` image is a real, working URL (Unsplash `?q=80&w=2000&auto=format&fit=crop`
      pattern keeps file size reasonable)
- [ ] Headings follow a real hierarchy — don't skip from H2 straight to H4
- [ ] If you added `faqs`, there's a `## Frequently asked questions` heading
      in the body right before where they should render
- [ ] Run `npx tsc --noEmit` after adding the entry — the `Post`/`Block` types
      will catch typos in block shape immediately
