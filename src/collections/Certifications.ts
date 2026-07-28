import type { CollectionConfig } from "payload";

// Compliance credentials shown on the companies page.
export const Certifications: CollectionConfig = {
  slug: "certifications",
  admin: {
    useAsTitle: "code",
    defaultColumns: ["code", "label", "year", "order"],
    group: "Companies Page",
  },
  access: { read: () => true },
  fields: [
    { name: "code", type: "text", required: true },
    { name: "ref", type: "text", required: true },
    { name: "year", type: "text", required: true },
    { name: "label", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    {
      name: "logoName",
      type: "text",
      required: true,
      admin: { description: "logo.dev name/domain, e.g. iso, gdpr, e-verify." },
    },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
