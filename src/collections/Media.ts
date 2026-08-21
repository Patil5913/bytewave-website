import type { CollectionConfig } from "payload";

import { isStaff } from "../access/roles";
import { revalidateHooks } from "../lib/revalidate";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: revalidateHooks("media"),
  admin: {
    group: "System",
  },
  upload: {
    staticDir: "public/media",
    
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};
