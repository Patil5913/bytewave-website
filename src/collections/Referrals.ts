import type { CollectionConfig } from "payload";

import { isAdmin, isStaff } from "../access/roles";
import { revalidateHooks } from "../lib/revalidate";

export const Referrals: CollectionConfig = {
  slug: "referrals",
  labels: { singular: "Referral", plural: "Referrals" },
  admin: {
    useAsTitle: "id",
    defaultColumns: ["referrer", "contact", "status", "rewardAmount", "createdAt"],
    group: "Referrals",
    description:
      "One row per lead attributed to a referrer. Only qualified rows count towards rewards.",
  },
  access: {
    read: isStaff,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  hooks: revalidateHooks("referrals"),
  fields: [
    {
      name: "referrer",
      type: "relationship",
      relationTo: "referrers",
      required: true,
      index: true,
    },
    {
      name: "contact",
      type: "relationship",
      relationTo: "contacts",
      admin: { description: "The lead this referral brought in." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Qualified", value: "qualified" },
        { label: "Rejected", value: "rejected" },
      ],
      admin: {
        description:
          "Rewards only count once qualified, so a spam lead can be rejected without inflating a payout.",
      },
    },
    {
      name: "rewardAmount",
      type: "number",
      min: 0,
      admin: {
        readOnly: true,
        description:
          "Snapshot of the reward when this referral qualified, so later rate changes do not rewrite history.",
      },
    },
    {
      name: "paidOut",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Marked by hand once the reward has been paid." },
    },
    {
      name: "landingPath",
      type: "text",
      admin: { readOnly: true, description: "Where the referred visitor landed." },
    },
  ],
};
