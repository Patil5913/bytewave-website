import type { CollectionConfig } from "payload";

import { isStaff } from "../access/roles";
import { revalidateHooks } from "../lib/revalidate";

export const Placements: CollectionConfig = {
  slug: "placements",
  admin: {
    useAsTitle: "role",
    defaultColumns: ["role", "companyName", "pay", "status"],
    group: "Homepage",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: revalidateHooks("placements"),
  fields: [
    { name: "role", type: "text", required: true },
    { name: "stack", type: "text", required: true },
    { name: "candidate", type: "text", required: true },
    {
      name: "company",
      type: "text",
      required: true,
      admin: { description: "Company domain for logo.dev, e.g. stripe.com." },
    },
    { name: "companyName", type: "text", required: true },
    { name: "location", type: "text", required: true },
    { name: "pay", type: "text", required: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Placed",
      options: ["Placed", "Interviewing", "Offer", "Negotiating"].map((v) => ({
        label: v,
        value: v,
      })),
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower shows first." },
    },
  ],
};
