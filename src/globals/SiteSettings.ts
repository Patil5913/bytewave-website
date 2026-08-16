import type { GlobalConfig } from "payload";

import { isAdmin } from "../access/roles";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "Global" },
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: "tagline", type: "textarea" },
    { name: "legalLine", type: "text" },
    { name: "address", type: "textarea" },
    { name: "navCtaLabel", type: "text", defaultValue: "Get Started" },
    { name: "region", type: "text", defaultValue: "English (US)" },
    {
      name: "footerGroups",
      type: "array",
      label: "Footer Link Groups",
      labels: { singular: "Group", plural: "Groups" },
      admin: {
        description:
          "Leave empty to use the built-in footer. These links also feed sitemap.xml, so only point at pages or sections that exist.",
        initCollapsed: true,
      },
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "links",
          type: "array",
          minRows: 1,
          fields: [
            { name: "label", type: "text", required: true },
            {
              name: "href",
              type: "text",
              required: true,
              admin: {
                description: "Site-relative path, e.g. /services#pricing.",
              },
            },
          ],
        },
      ],
    },
    {
      name: "socials",
      type: "array",
      label: "Social Links",
      admin: {
        description: "Shown in the footer. Leave empty to hide the row.",
        initCollapsed: true,
      },
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "href",
          type: "text",
          required: true,
          admin: { description: "Full profile URL, including https://." },
        },
      ],
    },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      admin: {
        description:
          "Default metadata for pages that don't set their own. Per-page titles/descriptions still override these.",
      },
      fields: [
        {
          name: "metaTitle",
          type: "text",
          admin: { description: "Default <title> / og:title." },
        },
        {
          name: "metaDescription",
          type: "textarea",
          admin: { description: "Default meta description / og:description." },
        },
        {
          name: "keywords",
          type: "text",
          admin: { description: "Comma-separated meta keywords." },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          admin: { description: "Default social-share (Open Graph) image." },
        },
      ],
    },
  ],
};
