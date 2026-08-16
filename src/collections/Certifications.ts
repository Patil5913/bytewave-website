import type { CollectionConfig } from "payload";

import { isStaff } from "../access/roles";

export const Certifications: CollectionConfig = {
  slug: "certifications",
  admin: {
    useAsTitle: "code",
    defaultColumns: ["code", "label", "year", "order"],
    group: "Companies Page",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
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
