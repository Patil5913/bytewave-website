import type { CollectionConfig } from "payload";

// Client quotes + candidate success videos (the two marquee rows).
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "kind", "company", "order"],
    group: "Content",
  },
  access: { read: () => true },
  fields: [
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "quote",
      options: [
        { label: "Client quote", value: "quote" },
        { label: "Candidate video", value: "video" },
      ],
    },
    { name: "name", type: "text", required: true },
    {
      name: "title",
      type: "text",
      admin: { description: "Role/title (quote) — e.g. VP Engineering." },
    },
    {
      name: "role",
      type: "text",
      admin: { description: "Candidate role (video) — e.g. Backend Developer." },
    },
    { name: "company", type: "text", required: true },
    {
      name: "domain",
      type: "text",
      required: true,
      admin: { description: "Company domain for logo.dev, e.g. stripe.com." },
    },
    {
      name: "quote",
      type: "textarea",
      admin: { condition: (d) => d.kind === "quote" },
    },
    {
      name: "thumbnail",
      type: "text",
      admin: {
        condition: (d) => d.kind === "video",
        description: "Thumbnail image URL.",
      },
    },
    {
      name: "duration",
      type: "text",
      admin: { condition: (d) => d.kind === "video" },
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
