import { APIError, type CollectionConfig } from "payload";

import {
  ADMIN_EMAIL_DOMAIN,
  isAdmin,
  isAdminField,
  isStaffUser,
} from "../access/roles";
import { serverUrl } from "../lib/email/render";
import { passwordReset } from "../lib/email/templates";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    forgotPassword: {
      generateEmailSubject: async () => (await passwordReset("")).subject,
      generateEmailHTML: async ({ token } = {}) =>
        (await passwordReset(`${serverUrl()}/ops/admin/reset/${token ?? ""}`))
          .html,
    },
  },
  admin: {
    useAsTitle: "email",
    group: "System",
    hidden: ({ user }) => (user as { role?: string })?.role !== "admin",
  },
  access: {
    admin: isStaffUser,

    create: async (args) => {
      if (args.req.user) return isAdmin(args) === true;
      const { totalDocs } = await args.req.payload.count({
        collection: "users",
        overrideAccess: true,
      });
      return totalDocs === 0;
    },
    read: (args) =>
      isAdmin(args) ? true : { id: { equals: args.req.user?.id } },
    update: (args) =>
      isAdmin(args) ? true : { id: { equals: args.req.user?.id } },
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data) return data;

        const email = data.email ?? originalDoc?.email;
        if (
          operation === "create" ||
          (data.email && data.email !== originalDoc?.email)
        ) {
          if (
            typeof email !== "string" ||
            !email.toLowerCase().endsWith(`@${ADMIN_EMAIL_DOMAIN}`)
          ) {
            throw new APIError(
              `Dashboard accounts must use an @${ADMIN_EMAIL_DOMAIN} address.`,
              400,
            );
          }
        }

        if (operation === "create" && !req.user) {
          data.role = "admin";
        }

        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        if (req.user?.id === id) {
          throw new APIError("You cannot delete your own account.", 400);
        }
        const { totalDocs } = await req.payload.count({
          collection: "users",
          where: { role: { equals: "admin" }, id: { not_equals: id } },
        });
        if (totalDocs === 0) {
          throw new APIError("At least one admin must remain.", 400);
        }
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      admin: {
        description:
          "Admin: everything, incl. accounts, site settings and leads. Editor: content only.",
      },
      access: {
        create: isAdminField,
        update: isAdminField,
      },
    },
  ],
};
