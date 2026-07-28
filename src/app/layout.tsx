import type { Metadata } from "next";
import { Geist, Instrument_Serif, Archivo } from "next/font/google";
import SmoothScroll from "@components/SmoothScroll";
import CustomCursor from "@components/CustomCursor";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Bytewave - The Frictionless Way to Hire & Get Hired",
  description: "Skip the endless resume reviews. Bytewave connects verified candidates directly with companies actively looking for their exact skills.",
};

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
        <SmoothScroll />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
