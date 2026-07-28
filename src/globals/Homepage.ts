import type { GlobalConfig } from "payload";

// Editable copy for the homepage narrative sections.
export const Homepage: GlobalConfig = {
  slug: "homepage",
  admin: { group: "Content" },
  access: { read: () => true },
  fields: [
    {
      type: "collapsible",
      label: "Hero",
      fields: [
        { name: "heroBadge", type: "text" },
        { name: "heroHeadline", type: "text" },
        { name: "heroSub", type: "textarea" },
        { name: "heroPrimaryLabel", type: "text" },
        { name: "heroPrimaryHref", type: "text" },
        { name: "heroSecondaryLabel", type: "text" },
        { name: "heroSecondaryHref", type: "text" },
        { name: "heroMarqueeNote", type: "text" },
      ],
    },
    {
      type: "collapsible",
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
      type: "collapsible",
      label: "Agent intro",
      fields: [
        {
          name: "agentParagraphs",
          type: "array",
          admin: {
            description:
              'Large scroll-revealed statement. Wrap the brand name in **double asterisks** to colour it.',
          },
          fields: [{ name: "text", type: "textarea", required: true }],
        },
      ],
    },
    {
      type: "collapsible",
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
      type: "collapsible",
      label: "Closing CTA",
      fields: [
        { name: "ctaHeadline", type: "text" },
        { name: "ctaBody", type: "textarea" },
        { name: "ctaResponseNote", type: "text" },
      ],
    },
  ],
};
