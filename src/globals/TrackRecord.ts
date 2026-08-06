import type { GlobalConfig } from "payload";

import { isAdmin } from "../access/roles";

export const TrackRecord: GlobalConfig = {
  slug: "track-record",
  admin: { group: "Professionals Page" },
  access: { read: () => true, update: isAdmin },
  fields: [
    {
      name: "stats",
      type: "array",
      labels: { singular: "Stat", plural: "Stats" },
      admin: { description: "Headline numbers above the chart." },
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
    {
      name: "growth",
      type: "array",
      labels: { singular: "Year", plural: "Years" },
      admin: {
        description: "One point per year, in order, for the line chart.",
      },
      fields: [
        { name: "year", type: "text", required: true },
        { name: "value", type: "number", required: true },
        {
          name: "label",
          type: "text",
          admin: { description: "Optional tag, e.g. YTD." },
        },
      ],
    },
  ],
};
