import type { CollectionConfig } from "payload";

// Insights articles. `content` stays a JSON block array so the existing
// block renderer in the insights route is a drop-in consumer — no lexical
// migration required.
export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "date", "author"],
    group: "Insights",
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
      type: "richText",
      required: true,
      admin: {
        description:
          "Rich text. Type markdown shortcuts (## heading, **bold**, - list, > quote, ```code) and they convert live, or paste markdown.",
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
