import type { GlobalConfig } from "payload";

import { isAdmin } from "../access/roles";
import { revalidateGlobalHooks } from "../lib/revalidate";

export const ReferralSettings: GlobalConfig = {
  slug: "referral-settings",
  label: "Referral Settings",
  admin: { group: "Referrals" },
  access: { read: () => true, update: isAdmin },
  hooks: revalidateGlobalHooks("referral-settings"),
  fields: [
    {
      name: "defaultReward",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 500,
      admin: {
        description:
          "Reward per qualified referral, unless a referrer has an override.",
      },
    },
    {
      name: "currency",
      type: "text",
      required: true,
      defaultValue: "USD",
      maxLength: 8,
      admin: { description: "Display only, e.g. USD. No payments are processed." },
    },
    {
      name: "cookieDays",
      type: "number",
      required: true,
      min: 1,
      max: 365,
      defaultValue: 30,
      admin: {
        description:
          "How long after clicking a referral link a lead is still attributed.",
      },
    },
    {
      name: "terms",
      type: "textarea",
      admin: {
        description:
          "Shown under the referral form on /services#referral. Leave blank to hide.",
      },
    },
  ],
};
