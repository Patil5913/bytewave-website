import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Payload generates these; they are not hand-edited.
    "src/app/(payload)/ops/admin/importMap.js",
    "src/payload-types.ts",
  ]),
  {
    // The Lexical/richtext bridge walks untyped editor JSON, where `any` is the
    // honest annotation. Keep it visible as a warning, not a build blocker.
    rules: { "@typescript-eslint/no-explicit-any": "warn" },
  },
]);

export default eslintConfig;
