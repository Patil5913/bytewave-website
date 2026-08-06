import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  lexicalEditor,
  ChecklistFeature,
  FixedToolbarFeature,
  HorizontalRuleFeature,
  IndentFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  EXPERIMENTAL_TableFeature,
  TextStateFeature,
  defaultColors,
} from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Contacts } from "./collections/Contacts";
import { Posts } from "./collections/Posts";
import { Placements } from "./collections/Placements";
import { ClientQuotes } from "./collections/ClientQuotes";
import { SuccessVideos } from "./collections/SuccessVideos";
import { Certifications } from "./collections/Certifications";
import { SiteStats } from "./globals/SiteStats";
import { Homepage } from "./globals/Homepage";
import { SiteSettings } from "./globals/SiteSettings";
import { TrackRecord } from "./globals/TrackRecord";
import { slugify } from "./lib/insights";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM ?? "no-reply@findandhire.dev",
      defaultFromName: "find & hire",
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      },
    })
  : undefined;

export default buildConfig({
  routes: {
    admin: "/ops/admin",
  },
  admin: {
    user: Users.slug,
    theme: "dark",
    meta: {
      titleSuffix: " · find & hire",
      description: "find & hire — verified hiring dashboard.",
      icons: [{ rel: "icon", type: "image/x-icon", url: "/favicon.ico" }],
    },
    components: {
      graphics: {
        Logo: "/components/admin/Logo#Logo",
        Icon: "/components/admin/Icon#Icon",
      },
      beforeDashboard: ["/components/admin/Dashboard#Dashboard"],
      beforeNavLinks: ["/components/admin/NavHeader#NavHeader"],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      collections: [
        "posts",
        "placements",
        "client-quotes",
        "success-videos",
        "certifications",
      ],
      globals: ["homepage", "site-stats", "site-settings", "track-record"],
      openByDefault: true,
      breakpoints: [
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
      ],
      url: ({ data, collectionConfig, globalConfig }) => {
        const base =
          process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
        const slug = collectionConfig?.slug ?? globalConfig?.slug;
        switch (slug) {
          case "posts":
            return data?.tag && data?.articleId
              ? `${base}/insights/${slugify(String(data.tag))}/${data.articleId}`
              : `${base}/insights`;
          case "client-quotes":
          case "certifications":
            return `${base}/companies`;
          case "success-videos":
          case "track-record":
            return `${base}/professionals`;
          default:
            return base;
        }
      },
    },
  },
  collections: [
    Users,
    Media,
    Contacts,
    Posts,
    Placements,
    ClientQuotes,
    SuccessVideos,
    Certifications,
  ],
  globals: [SiteStats, Homepage, SiteSettings, TrackRecord],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      HorizontalRuleFeature(),
      StrikethroughFeature(),
      SubscriptFeature(),
      SuperscriptFeature(),
      IndentFeature(),
      ChecklistFeature(),
      EXPERIMENTAL_TableFeature(),
      TextStateFeature({
        state: {
          highlight: {
            brand: {
              label: "Brand highlight",
              css: {
                "background-color": "#bcd6f0",
                color: "#0a0a0a",
                "border-radius": "2px",
                padding: "0 3px",
              },
            },
            ...defaultColors.background,
          },
          color: defaultColors.text,
        },
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    push: true,
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  ...(email ? { email } : {}),
  sharp,
});
