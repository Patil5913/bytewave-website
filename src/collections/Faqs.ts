import type { CollectionConfig } from "payload";

// FAQ entries for the companies + professionals pages.
export const Faqs: CollectionConfig = {
  slug: "faqs",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "audience", "order"],
    group: "Companies & Professionals",
  },
  access: { read: () => true },
  fields: [
    {
      name: "audience",
      type: "select",
      required: true,
      defaultValue: "companies",
      options: [
        { label: "For Companies", value: "companies" },
        { label: "For Professionals", value: "professionals" },
      ],
    },
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
