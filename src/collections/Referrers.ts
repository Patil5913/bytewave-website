import { APIError, type CollectionConfig, type PayloadRequest } from "payload";

import { isAdmin, isStaff } from "../access/roles";
import { emailFooter } from "../lib/email/render";
import { referrerWelcome } from "../lib/email/templates";
import { revalidateHooks } from "../lib/revalidate";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function randomReferralCode(): string {
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

async function uniqueReferralCode(req: PayloadRequest): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomReferralCode();
    const { totalDocs } = await req.payload.count({
      collection: "referrers",
      where: { code: { equals: code } },
      overrideAccess: true,
    });
    if (totalDocs === 0) return code;
  }
  throw new APIError(
    "Could not allocate a unique referral code. Please try saving again.",
    500,
  );
}

async function totalsFor(req: PayloadRequest, referrerId: number | string) {
  const [all, qualified] = await Promise.all([
    req.payload.count({
      collection: "referrals",
      where: { referrer: { equals: referrerId } },
      overrideAccess: true,
    }),
    req.payload.find({
      collection: "referrals",
      where: {
        and: [
          { referrer: { equals: referrerId } },
          { status: { equals: "qualified" } },
        ],
      },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
  ]);

  const totalRewards = qualified.docs.reduce(
    (sum, doc) => sum + (doc.rewardAmount ?? 0),
    0,
  );

  return {
    totalReferrals: all.totalDocs,
    qualifiedReferrals: qualified.totalDocs,
    totalRewards,
  };
}

export const Referrers: CollectionConfig = {
  slug: "referrers",
  labels: { singular: "Referrer", plural: "Referrers" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "code", "status", "clicks"],
    group: "Referrals",
    description:
      "People who refer leads. Share their link as /r/<code>; totals are computed from the Referrals collection.",
  },
  access: {
    read: isStaff,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data) return data;
        if (operation === "create" && !data.code) {
          data.code = await uniqueReferralCode(req);
        }
        if (typeof data.code === "string") data.code = data.code.toUpperCase();
        return data;
      },
    ],
    afterRead: [
      async ({ doc, req }) => {
        if (!doc?.id) return doc;
        Object.assign(doc, await totalsFor(req, doc.id));
        return doc;
      },
    ],
    ...revalidateHooks("referrers"),
    // spread first, then extend — a bare spread would drop these afterChange entries
    afterChange: [
      ...revalidateHooks("referrers").afterChange,
      async ({ operation, doc, req }) => {
        if (operation !== "create" || !doc?.email || !doc?.code) return;
        try {
          await req.payload.sendEmail({
            to: doc.email,
            ...(await referrerWelcome(doc, await emailFooter())),
          });
        } catch (err) {
          req.payload.logger.error(
            `Referrer welcome failed: ${(err as Error).message}`,
          );
        }
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 120 },
    { name: "email", type: "email", required: true, unique: true },
    {
      name: "code",
      type: "text",
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: "Auto-generated. The share link is /r/<code>.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      options: [
        { label: "Active", value: "active" },
        { label: "Suspended", value: "suspended" },
      ],
      admin: {
        description:
          "A suspended referrer's link stops attributing new referrals.",
      },
    },
    {
      name: "rewardOverride",
      type: "number",
      min: 0,
      admin: {
        description:
          "Per-referral reward for this referrer. Leave blank to use the default in Referral Settings.",
      },
    },
    {
      name: "clicks",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: "Times the share link has been opened.",
      },
    },
    {
      name: "totalReferrals",
      type: "number",
      virtual: true,
      admin: { readOnly: true, description: "All attributed referrals." },
    },
    {
      name: "qualifiedReferrals",
      type: "number",
      virtual: true,
      admin: { readOnly: true, description: "Referrals marked qualified." },
    },
    {
      name: "totalRewards",
      type: "number",
      virtual: true,
      admin: {
        readOnly: true,
        description: "Sum of rewards across qualified referrals.",
      },
    },
    { name: "notes", type: "textarea" },
  ],
};
