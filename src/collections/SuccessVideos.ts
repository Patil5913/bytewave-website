import type { CollectionConfig } from "payload";

import { isStaff } from "../access/roles";
import { revalidateHooks } from "../lib/revalidate";

export const SuccessVideos: CollectionConfig = {
  slug: "success-videos",
  labels: { singular: "Success Video", plural: "Success Videos" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "company", "order"],
    group: "Professionals Page",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: revalidateHooks("success-videos"),
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "text",
      admin: { description: "e.g. Backend Developer" },
    },
    { name: "company", type: "text", required: true },
    {
      name: "domain",
      type: "text",
      required: true,
      admin: { description: "Company domain for logo.dev, e.g. stripe.com." },
    },
    { name: "duration", type: "text", admin: { description: "e.g. 02:45" } },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Optional. 16:9 works best. Without one the card shows the name and role on a plain background.",
      },
    },
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
