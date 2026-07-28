import type { CollectionConfig } from "payload";

// Random 7-char hexadecimal id (0-9a-f) used in article URLs.
export function randomArticleId(): string {
  let id = "";
  while (id.length < 7) id += Math.floor(Math.random() * 16).toString(16);
  return id.slice(0, 7);
}

// Insights articles — rich text body.
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
  hooks: {
    // Auto-assign a stable random hex id on create if one wasn't provided.
    beforeValidate: [
      ({ data }) => {
        if (data && !data.articleId) data.articleId = randomArticleId();
        return data;
      },
    ],
  },
  fields: [
    {
      name: "articleId",
      type: "text",
      unique: true,
      admin: {
        readOnly: true,
        description: "Auto-generated 7-char hex id used in the URL.",
      },
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
