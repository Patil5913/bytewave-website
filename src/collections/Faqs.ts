import type { CollectionConfig, Field } from "payload";

import { isStaff } from "../access/roles";
import { revalidateHooks } from "../lib/revalidate";

const faqFields: Field[] = [
  { name: "question", type: "text", required: true },
  { name: "answer", type: "textarea", required: true },
  {
    name: "order",
    type: "number",
    defaultValue: 0,
    admin: { description: "Lower shows first." },
  },
];

const faqAccess = {
  read: () => true,
  create: isStaff,
  update: isStaff,
  delete: isStaff,
};

export const CompanyFaqs: CollectionConfig = {
  slug: "company-faqs",
  labels: { singular: "Company FAQ", plural: "Company FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    group: "Companies Page",
    description: "The FAQ accordion on /companies.",
  },
  access: faqAccess,
  hooks: revalidateHooks("company-faqs"),
  fields: faqFields,
};

export const ProfessionalFaqs: CollectionConfig = {
  slug: "professional-faqs",
  labels: { singular: "Professional FAQ", plural: "Professional FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    group: "Professionals Page",
    description: "The FAQ accordion on /professionals.",
  },
  access: faqAccess,
  hooks: revalidateHooks("professional-faqs"),
  fields: faqFields,
};
