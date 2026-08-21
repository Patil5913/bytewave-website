import type { GlobalConfig } from "payload";

import { isStaff } from "../access/roles";
import { revalidateGlobalHooks } from "../lib/revalidate";

export const LegalPage: GlobalConfig = {
  slug: "legal-page",
  label: "Legal Page",
  admin: { group: "Legal" },
  access: { read: () => true, update: isStaff },
  hooks: revalidateGlobalHooks("legal-page"),
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Document details",
          fields: [
            {
              name: "entity",
              type: "text",
              admin: { description: "Legal entity name, e.g. Bytewave, Inc." },
            },
            {
              name: "version",
              type: "text",
              admin: { description: 'Shown on the cover sheet, e.g. "2026.08".' },
            },
            {
              name: "effective",
              type: "text",
              admin: {
                description:
                  'Effective date as you want it displayed, e.g. "15 August 2026".',
              },
            },
            {
              name: "governingLaw",
              type: "text",
              admin: { description: "e.g. State of Delaware, USA" },
            },
          ],
        },
        {
          label: "Documents",
          fields: [
            {
              name: "documents",
              type: "array",
              labels: { singular: "Document", plural: "Documents" },
              admin: {
                description:
                  "One per policy. Order here is the order on the page and in the contents list.",
                initCollapsed: true,
              },
              fields: [
                {
                  name: "id",
                  type: "text",
                  required: true,
                  admin: {
                    description:
                      'Anchor used by the footer link, e.g. "privacy" for /legal#privacy. Changing it breaks that link.',
                  },
                },
                {
                  name: "ref",
                  type: "text",
                  required: true,
                  admin: { description: 'Reference code, e.g. "DOC-01".' },
                },
                {
                  name: "eyebrow",
                  type: "text",
                  required: true,
                  admin: { description: "Short label for the contents list." },
                },
                { name: "title", type: "text", required: true },
                { name: "summary", type: "textarea", required: true },
                {
                  name: "clauses",
                  type: "array",
                  labels: { singular: "Clause", plural: "Clauses" },
                  minRows: 1,
                  fields: [
                    {
                      name: "n",
                      type: "text",
                      required: true,
                      admin: { description: 'Clause number, e.g. "1.1".' },
                    },
                    { name: "heading", type: "text", required: true },
                    {
                      name: "paragraphs",
                      type: "array",
                      labels: { singular: "Paragraph", plural: "Paragraphs" },
                      minRows: 1,
                      fields: [
                        { name: "text", type: "textarea", required: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
