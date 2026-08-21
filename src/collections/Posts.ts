import { APIError, type CollectionConfig, type PayloadRequest } from "payload";

import { isStaff } from "../access/roles";
import { slugify } from "../lib/insights";
import { ALL_CONTENT_TAG, safeRevalidate, tagFor } from "../lib/revalidate";

export function randomArticleId(): string {
  let id = "";
  while (id.length < 7) id += Math.floor(Math.random() * 16).toString(16);
  return id.slice(0, 7);
}

const DISPLAY_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

async function uniqueArticleId(req: PayloadRequest): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const articleId = randomArticleId();
    const { totalDocs } = await req.payload.count({
      collection: "posts",
      where: { articleId: { equals: articleId } },
      overrideAccess: true,
    });
    if (totalDocs === 0) return articleId;
  }
  throw new APIError(
    "Could not allocate a unique article id. Please try saving again.",
    500,
  );
}

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "publishedAt", "_status"],
    group: "Insights",
    
    preview: (doc) => {
      const tag = doc?.tag;
      const articleId = doc?.articleId;
      if (!tag || !articleId) return "/preview/enter?path=%2Finsights";
      const path = `/insights/${slugify(String(tag))}/${String(articleId)}`;
      return `/preview/enter?path=${encodeURIComponent(path)}`;
    },
  },
  versions: {
    
    drafts: { validate: false },
    maxPerDoc: 25,
  },
  access: {
    
    read: ({ req: { user } }) =>
      user ? true : { _status: { equals: "published" } },
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data) return data;

        if (!data.articleId) data.articleId = await uniqueArticleId(req);

        if (!data.publishedAt) {
          const parsed = data.date ? Date.parse(String(data.date)) : NaN;
          data.publishedAt = new Date(
            Number.isNaN(parsed) ? (data.createdAt ?? Date.now()) : parsed,
          ).toISOString();
        }

        if (!data.date && data.publishedAt) {
          data.date = DISPLAY_DATE.format(new Date(String(data.publishedAt)));
        }

        return data;
      },
    ],
    
    afterChange: [
      ({ doc, previousDoc }) => {
        
        const wasPublic =
          doc?._status === "published" || previousDoc?._status === "published";
        if (!wasPublic) return;
        return safeRevalidate(tagFor("posts"), ALL_CONTENT_TAG);
      },
    ],
    afterDelete: [() => safeRevalidate(tagFor("posts"), ALL_CONTENT_TAG)],
  },
  fields: [
    {
      type: "collapsible",
      label: "Article details",
      admin: { initCollapsed: false },
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
          name: "publishedAt",
          type: "date",
          required: true,
          defaultValue: () => new Date().toISOString(),
          index: true,
          admin: {
            description:
              "Sort order for /insights and lastModified in sitemap.xml. Set this; the display date below is only what readers see.",
            date: { pickerAppearance: "dayOnly" },
          },
        },
        {
          name: "date",
          type: "text",
          admin: {
            description:
              'Display date as it appears on the article, e.g. "October 12, 2026". Leave blank to format Published at.',
          },
        },
        { name: "updated", type: "checkbox", defaultValue: false },
        { name: "readTime", type: "text", required: true },
        {
          name: "cover",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional header image, also used as the social preview. 16:9 works best.",
          },
        },
        { name: "excerpt", type: "textarea", required: true },
      ],
    },
    {
      type: "collapsible",
      label: "Author",
      admin: { initCollapsed: true },
      fields: [
        { name: "author", type: "text", required: true },
        { name: "authorTitle", type: "text" },
        { name: "authorBio", type: "textarea" },
        { name: "authorLinkedIn", type: "text" },
        {
          name: "authorAvatar",
          type: "upload",
          relationTo: "media",
          admin: { description: "Square headshot. Optional." },
        },
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
      type: "collapsible",
      label: "FAQs",
      admin: { initCollapsed: true },
      fields: [
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
    },
  ],
};
