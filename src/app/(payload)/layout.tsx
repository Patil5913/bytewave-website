import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import "@payloadcms/next/css";
import "./custom.css";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { Geist, Instrument_Serif } from "next/font/google";
import React from "react";

import { importMap } from "./ops/admin/importMap.js";

const instrument = Instrument_Serif({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: "400",
});
const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    <div
      className={`${instrument.variable} ${geist.variable} ${geist.className}`}
      style={{ display: "contents" }}
    >
      {children}
    </div>
  </RootLayout>
);

export default Layout;
