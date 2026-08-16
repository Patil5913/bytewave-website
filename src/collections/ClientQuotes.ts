import type { CollectionConfig } from "payload";

import { isStaff } from "../access/roles";

export const ClientQuotes: CollectionConfig = {
  slug: "client-quotes",
  labels: { singular: "Client Quote", plural: "Client Quotes" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "company", "row", "order"],
    group: "Companies Page",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "title",
      type: "text",
      admin: { description: "e.g. VP Engineering" },
    },
    { name: "company", type: "text", required: true },
    {
      name: "domain",
      type: "text",
      required: true,
      admin: { description: "Company domain for logo.dev, e.g. stripe.com." },
    },
    { name: "quote", type: "textarea", required: true },
    {
      name: "row",
      type: "select",
      defaultValue: "one",
      options: [
        { label: "Row 1 (left→right)", value: "one" },
        { label: "Row 2 (right→left)", value: "two" },
      ],
    },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
