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
