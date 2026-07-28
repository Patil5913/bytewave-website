import type { CollectionConfig } from "payload";

// Professionals page FAQs.
export const FaqsProfessionals: CollectionConfig = {
  slug: "faqs-professionals",
  labels: { singular: "Professional FAQ", plural: "Professional FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    group: "Professionals Page",
  },
  access: { read: () => true },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
