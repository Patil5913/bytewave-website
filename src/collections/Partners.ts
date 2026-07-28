import type { CollectionConfig } from "payload";

// Logo marquees — the hero "compatible with" stack + client logos.
export const Partners: CollectionConfig = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "group", "order"],
    group: "Content",
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      admin: {
        description:
          "Icon slug — jobspipe favicon slug for the hero stack (e.g. workday), or a domain for client logos.",
      },
    },
    {
      name: "group",
      type: "select",
      required: true,
      defaultValue: "hiring-stack",
      options: [
        { label: "Hero hiring stack", value: "hiring-stack" },
        { label: "Client logo", value: "client" },
      ],
    },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
