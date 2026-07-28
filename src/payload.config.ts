import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Contacts } from "./collections/Contacts";
import { Posts } from "./collections/Posts";
import { Placements } from "./collections/Placements";
import { ClientQuotes } from "./collections/ClientQuotes";
import { SuccessVideos } from "./collections/SuccessVideos";
import { FaqsCompanies } from "./collections/FaqsCompanies";
import { FaqsProfessionals } from "./collections/FaqsProfessionals";
import { Certifications } from "./collections/Certifications";
import { Partners } from "./collections/Partners";
import { SiteStats } from "./globals/SiteStats";
import { Homepage } from "./globals/Homepage";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Real SMTP when configured; otherwise Payload falls back to console logging
// (dev). Lead-notification email is best-effort and never blocks a submission.
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress:
        process.env.SMTP_FROM ?? "no-reply@findandhire.dev",
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
  // Serve the dashboard from a non-obvious path instead of /admin.
  routes: {
    admin: "/fhadmin",
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
  },
  collections: [
    Users,
    Media,
    Contacts,
    Posts,
    Placements,
    ClientQuotes,
    SuccessVideos,
    FaqsCompanies,
    FaqsProfessionals,
    Certifications,
    Partners,
  ],
  globals: [SiteStats, Homepage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    // Auto-sync schema on init in every environment so a fresh database
    // (dev or prod) is ready without a separate migration CLI step.
    push: true,
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  ...(email ? { email } : {}),
  sharp,
});
