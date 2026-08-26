import type { CollectionConfig } from "payload";

import { isAdmin, isStaff } from "../access/roles";
import {
  leadConfirmation,
  leadNotification,
  newsletterConfirmation,
} from "../lib/email/templates";
import { unsubscribeUrl } from "../lib/email/unsubscribe";
import { emailFooter, serverUrl } from "../lib/email/render";

export const Contacts: CollectionConfig = {
  slug: "contacts",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "type", "source", "createdAt"],
    group: "Inbound",
  },
  access: {
    create: isStaff,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ operation, doc, req }) => {
        if (operation !== "create") return;

        // Internal alert. Off when LEADS_NOTIFY_EMAIL is unset.
        const to = process.env.LEADS_NOTIFY_EMAIL;
        if (to) {
          try {
            await req.payload.sendEmail({
              to,
              ...(await leadNotification(doc)),
            });
          } catch (err) {
            req.payload.logger.error(
              `Lead notification failed: ${(err as Error).message}`,
            );
          }
        }

        // Acknowledgement to whoever submitted. Never blocks the submission.
        try {
          const isNewsletter = doc.type === "newsletter";
          const footer = await emailFooter();
          const mail = isNewsletter
            ? await newsletterConfirmation(doc, footer)
            : await leadConfirmation(doc, footer);
          await req.payload.sendEmail({
            to: doc.email,
            ...mail,
            // Gmail and Yahoo require a machine-readable opt-out on bulk mail.
            ...(isNewsletter
              ? {
                  headers: {
                    "List-Unsubscribe": `<${unsubscribeUrl(serverUrl(), doc.email)}>`,
                    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                  },
                }
              : {}),
          });
        } catch (err) {
          req.payload.logger.error(
            `Lead acknowledgement failed: ${(err as Error).message}`,
          );
        }
      },
    ],
  },
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "talent",
      options: [
        { label: "Professional (Talent)", value: "talent" },
        { label: "Company (Enterprise)", value: "enterprise" },
        { label: "Lead (unspecified)", value: "lead" },
        { label: "Newsletter", value: "newsletter" },
      ],
    },
    {
      name: "name",
      type: "text",
      maxLength: 120,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "role",
      type: "text",
      maxLength: 120,
      admin: { condition: (d) => d.type === "talent" },
    },
    {
      name: "experience",
      type: "text",
      maxLength: 120,
      admin: { condition: (d) => d.type === "talent" },
    },
    {
      name: "company",
      type: "text",
      maxLength: 120,
      admin: { condition: (d) => d.type === "enterprise" },
    },
    {
      name: "headcount",
      type: "text",
      maxLength: 120,
      admin: { condition: (d) => d.type === "enterprise" },
    },
    {
      name: "stack",
      type: "text",
      maxLength: 120,
      admin: { condition: (d) => d.type === "enterprise" },
    },
    {
      name: "message",
      type: "textarea",
      maxLength: 4000,
    },
    {
      name: "source",
      type: "text",
      admin: {
        description:
          "Which surface the lead came from (e.g. footer:/companies). Derived server-side in the /leads route, never sent by the browser.",
        readOnly: true,
      },
    },
    {
      name: "ipHash",
      type: "text",
      index: true,
      admin: {
        description: "Keyed hash of the submitter's IP, used to rate limit.",
        readOnly: true,
        hidden: true,
      },
    },
  ],
};
