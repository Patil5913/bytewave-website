import type { CollectionConfig } from "payload";

// Inbound leads from the contact terminal + homepage CTA.
export const Contacts: CollectionConfig = {
  slug: "contacts",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "type", "source", "createdAt"],
    group: "Inbound",
  },
  access: {
    // anyone may submit; only authed admins may read/manage
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    // Notify the team on a new lead. Best-effort: a failed/absent mailer must
    // never break the public submission.
    afterChange: [
      async ({ operation, doc, req }) => {
        if (operation !== "create") return;
        const to = process.env.LEADS_NOTIFY_EMAIL;
        if (!to) return;
        try {
          await req.payload.sendEmail({
            to,
            subject: `New ${doc.type} lead — ${doc.email}`,
            text: [
              `Type: ${doc.type}`,
              `Email: ${doc.email}`,
              doc.name && `Name: ${doc.name}`,
              doc.company && `Company: ${doc.company}`,
              doc.role && `Role: ${doc.role}`,
              doc.message && `Message: ${doc.message}`,
              `Source: ${doc.source ?? "unknown"}`,
            ]
              .filter(Boolean)
              .join("\n"),
          });
        } catch (err) {
          req.payload.logger.error(
            `Lead notification failed: ${(err as Error).message}`,
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
      ],
    },
    {
      name: "name",
      type: "text",
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    // talent
    { name: "role", type: "text", admin: { condition: (d) => d.type === "talent" } },
    { name: "experience", type: "text", admin: { condition: (d) => d.type === "talent" } },
    // enterprise
    { name: "company", type: "text", admin: { condition: (d) => d.type === "enterprise" } },
    { name: "headcount", type: "text", admin: { condition: (d) => d.type === "enterprise" } },
    { name: "stack", type: "text", admin: { condition: (d) => d.type === "enterprise" } },
    {
      name: "message",
      type: "textarea",
    },
    {
      name: "source",
      type: "text",
      admin: {
        description: "Which surface the lead came from (e.g. /companies, cta).",
        readOnly: true,
      },
    },
  ],
};
