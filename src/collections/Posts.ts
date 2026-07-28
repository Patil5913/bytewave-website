import type { CollectionConfig } from "payload";

// Insights articles. `content` stays a JSON block array so the existing
// block renderer in the insights route is a drop-in consumer — no lexical
// migration required.
export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "date", "author"],
    group: "Content",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "articleId",
      type: "text",
      required: true,
      unique: true,
      admin: { description: 'Stable id used in URLs, e.g. "article-1".' },
    },
    { name: "title", type: "text", required: true },
    { name: "tag", type: "text", required: true },
    {
      name: "date",
      type: "text",
      required: true,
      admin: { description: 'Display date, e.g. "October 12, 2026".' },
    },
    { name: "updated", type: "checkbox", defaultValue: false },
    { name: "readTime", type: "text", required: true },
    { name: "cover", type: "text", required: true },
    { name: "excerpt", type: "textarea", required: true },
    {
      type: "collapsible",
      label: "Author",
      fields: [
        { name: "author", type: "text", required: true },
        { name: "authorTitle", type: "text" },
        { name: "authorBio", type: "textarea" },
        { name: "authorLinkedIn", type: "text" },
        { name: "authorAvatar", type: "text" },
      ],
    },
    {
      name: "content",
      type: "textarea",
      required: true,
      admin: {
        rows: 24,
        description:
          "Markdown body with live preview. Supports ## / ### / #### headings, **bold**, *italic*, `code`, ==highlight==, [links](url), - and 1. lists, > quotes, ![alt](src \"caption\") images, ``` fenced code, and --- dividers. See content/insights/GUIDE.md. Do not use # H1 (the title is the H1).",
        components: {
          Field: "/components/admin/MarkdownField#MarkdownField",
        },
      },
    },
    {
      name: "faqs",
      type: "array",
      labels: { singular: "FAQ", plural: "FAQs" },
      admin: {
        description:
          'Rendered as an accordion where a "## Frequently asked questions" heading appears in the body.',
      },
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
  ],
};
