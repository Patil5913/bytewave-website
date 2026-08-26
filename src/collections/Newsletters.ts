import type { CollectionConfig } from "payload";

import { isAdmin, isStaff } from "../access/roles";

/**
 * One row per newsletter issue. Composing and sending are deliberately
 * separate: saving here never sends anything — POST /newsletter/send does,
 * once, and stamps the row so it cannot go out twice.
 */
export const Newsletters: CollectionConfig = {
  slug: "newsletters",
  labels: { singular: "Newsletter", plural: "Newsletters" },
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["subject", "status", "sentAt", "sentCount"],
    group: "Newsletter",
    description:
      "Draft an issue, preview it, then send with POST /newsletter/send. Saving never sends.",
  },
  access: {
    read: isStaff,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  fields: [
    {
      name: "subject",
      type: "text",
      required: true,
      maxLength: 120,
      admin: { description: "Inbox subject line. Keep under ~60 characters." },
    },
    {
      name: "preheader",
      type: "text",
      required: true,
      maxLength: 160,
      admin: {
        description:
          "The grey preview line next to the subject. Not repeated in the body.",
      },
    },
    {
      name: "edition",
      type: "text",
      maxLength: 60,
      admin: { description: "Eyebrow, e.g. “Issue 04 · March 2026”." },
    },
    {
      name: "heading",
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      name: "intro",
      type: "textarea",
      required: true,
      maxLength: 2000,
      admin: { description: "One or two short paragraphs to open the issue." },
    },
    {
      name: "stats",
      type: "array",
      maxRows: 6,
      labels: { singular: "Stat", plural: "Stats" },
      admin: {
        description:
          "Optional data strip, e.g. “Median time-to-hire — 14 days”.",
      },
      fields: [
        { name: "label", type: "text", required: true, maxLength: 60 },
        { name: "value", type: "text", required: true, maxLength: 60 },
      ],
    },
    {
      name: "items",
      type: "array",
      minRows: 1,
      maxRows: 8,
      labels: { singular: "Item", plural: "Items" },
      fields: [
        { name: "title", type: "text", required: true, maxLength: 140 },
        { name: "body", type: "textarea", required: true, maxLength: 1200 },
        {
          name: "href",
          type: "text",
          maxLength: 300,
          admin: { description: "Optional link, absolute or site-relative." },
        },
        {
          name: "linkLabel",
          type: "text",
          maxLength: 60,
          admin: { condition: (_, sibling) => Boolean(sibling?.href) },
        },
      ],
    },
    {
      name: "cta",
      type: "group",
      fields: [
        { name: "label", type: "text", maxLength: 60 },
        { name: "href", type: "text", maxLength: 300 },
      ],
    },
    {
      name: "signoff",
      type: "text",
      maxLength: 200,
      admin: { description: "Closing line above the footer." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Sent", value: "sent" },
      ],
      admin: {
        readOnly: true,
        description: "Set by the send endpoint, not by hand.",
      },
    },
    {
      name: "sentAt",
      type: "date",
      admin: { readOnly: true },
    },
    {
      name: "sentCount",
      type: "number",
      admin: { readOnly: true, description: "Recipients the send reached." },
    },
  ],
};
