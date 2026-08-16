import type { Metadata } from "next";
import { Geist, Instrument_Serif, Archivo } from "next/font/google";
import SmoothScroll from "@components/SmoothScroll";
import CustomCursor from "@components/CustomCursor";
import RefreshOnSave from "@components/RefreshOnSave";
import { getSiteSettingsContent } from "@/lib/content";
import { metadataFromSettings } from "@/lib/seo";
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
  // Site-wide defaults come from the SEO group in the admin (Global → Site
  // Settings), falling back to siteContent when a field is blank or the DB is
  // unreachable. Pages that set their own metadata still win.
  const settings = await getSiteSettingsContent();
  return metadataFromSettings(settings.seo);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrumentSerif.variable} ${archivo.variable} antialiased`}
    >
      <body className="overflow-x-hidden">
        <RefreshOnSave />
        <SmoothScroll />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
