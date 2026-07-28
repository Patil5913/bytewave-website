import type { CollectionConfig } from "payload";

// Uploaded assets (post covers, author avatars, etc.).
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    group: "System",
  },
  upload: {
    staticDir: "public/media",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};
