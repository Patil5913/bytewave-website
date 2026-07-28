import type { CollectionConfig } from "payload";

// Admin/editor accounts for the Payload dashboard.
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "System",
  },
  access: {
    // allow the very first user to be created openly (bootstrap); afterwards
    // only authenticated admins may create more.
    create: async ({ req }) => {
      if (req.user) return true;
      const { totalDocs } = await req.payload.count({ collection: "users" });
      return totalDocs === 0;
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
