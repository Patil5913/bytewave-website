import type { GlobalConfig } from "payload";

// The four headline numbers on the homepage Stats section.
export const SiteStats: GlobalConfig = {
  slug: "site-stats",
  admin: { group: "Homepage" },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "stats",
      type: "array",
      minRows: 1,
      maxRows: 6,
      labels: { singular: "Stat", plural: "Stats" },
      fields: [
        { name: "value", type: "number", required: true },
        { name: "decimals", type: "number", defaultValue: 0, required: true },
        { name: "suffix", type: "text", defaultValue: "" },
        { name: "label", type: "text", required: true },
        { name: "note", type: "text", required: true },
      ],
    },
  ],
};
