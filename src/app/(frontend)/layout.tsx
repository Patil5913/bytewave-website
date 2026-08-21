import type { Metadata } from "next";
import { Geist, Instrument_Serif, Archivo } from "next/font/google";
import SmoothScroll from "@components/SmoothScroll";
import CustomCursor from "@components/CustomCursor";
import RefreshOnSave from "@components/RefreshOnSave";
import { getSiteSettingsContent } from "@/lib/content";
import { metadataFromSettings } from "@/lib/seo";
import { JsonLd, organizationSchema } from "@/lib/structuredData";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: "400",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  
  const settings = await getSiteSettingsContent();
  return metadataFromSettings(settings.seo);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettingsContent();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable} ${archivo.variable} antialiased`}
    >
      <body className="overflow-x-hidden">
        {/* Site-wide publisher identity; per-page schemas are added by the
            pages that have them. */}
        <JsonLd
          data={organizationSchema(
            settings.seo?.metaDescription || settings.tagline,
          )}
        />
        <RefreshOnSave />
        <SmoothScroll />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
