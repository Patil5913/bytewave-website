import type { GlobalConfig } from "payload";

// Shared chrome: footer, social, address, nav CTA.
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "Site" },
  access: { read: () => true },
  fields: [
    { name: "tagline", type: "textarea" },
    { name: "legalLine", type: "text" },
    { name: "address", type: "textarea" },
    { name: "navCtaLabel", type: "text", defaultValue: "Get Started" },
    { name: "region", type: "text", defaultValue: "English (US)" },
    {
      name: "footerGroups",
      type: "array",
      labels: { singular: "Footer column", plural: "Footer columns" },
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "socials",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
