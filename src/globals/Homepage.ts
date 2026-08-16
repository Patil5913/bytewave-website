import type { GlobalConfig } from "payload";

import { isStaff } from "../access/roles";

// The hero is intentionally not editable: its copy is the brand's positioning
// statement and its two CTAs are the site's primary routing, so both live in
// code (HOMEPAGE in src/lib/siteContent.ts).
export const Homepage: GlobalConfig = {
  slug: "homepage",
  admin: { group: "Homepage" },
  access: { read: () => true, update: isStaff },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Manifesto",
          fields: [
            { name: "manifestoHeadline", type: "text" },
            { name: "manifestoBody", type: "textarea" },
            {
              name: "manifestoPoints",
              type: "array",
              maxRows: 4,
              fields: [
                { name: "title", type: "text", required: true },
                { name: "body", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Agent intro",
          fields: [
            {
              name: "agentParagraphs",
              type: "array",
              admin: {
                description:
                  "Large scroll-revealed statement. Wrap the brand name in **double asterisks** to colour it.",
              },
              fields: [{ name: "text", type: "textarea", required: true }],
            },
          ],
        },
        {
          label: "Scroll story",
          fields: [
            {
              name: "storyPanels",
              type: "array",
              maxRows: 5,
              fields: [
                { name: "eyebrow", type: "text" },
                { name: "line1", type: "text", required: true },
                {
                  name: "line2",
                  type: "text",
                  admin: {
                    description:
                      "Second headline line. Wrap a word in **asterisks** to brand-colour it.",
                  },
                },
                { name: "detail", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Closing CTA",
          fields: [
            {
              name: "ctaHeadline",
              type: "text",
              admin: {
                description: "Wrap a word in **asterisks** to brand-colour it.",
              },
            },
            { name: "ctaBody", type: "textarea" },
            { name: "ctaResponseNote", type: "text" },
          ],
        },
      ],
    },
  ],
};
