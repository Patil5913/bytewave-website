import type { CollectionConfig, Field } from "payload";

import { isStaff } from "../access/roles";

/**
 * FAQs are split into one collection per page rather than a single list with
 * an audience dropdown, so each sits in its own admin group next to the other
 * content for that page.
 */
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
  fields: faqFields,
};
