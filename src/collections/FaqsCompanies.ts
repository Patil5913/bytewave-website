import type { CollectionConfig } from "payload";

// Companies page FAQs.
export const FaqsCompanies: CollectionConfig = {
  slug: "faqs-companies",
  labels: { singular: "Company FAQ", plural: "Company FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    group: "Companies Page",
  },
  access: { read: () => true },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
