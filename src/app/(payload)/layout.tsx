import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import "@payloadcms/next/css";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { Instrument_Serif } from "next/font/google";
import React from "react";

import { importMap } from "./fhadmin/importMap.js";

// Same brand display face as the marketing site, exposed to the admin so the
// custom Logo/Icon render in the real find & hire type.
const instrument = Instrument_Serif({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: "400",
});

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
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    <div className={instrument.variable} style={{ display: "contents" }}>
      {children}
    </div>
  </RootLayout>
);

export default Layout;
