import "server-only";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import config from "@payload-config";

// Cached editor config so repeated conversions don't rebuild it.
let editorConfigPromise: ReturnType<typeof editorConfigFactory.default> | null =
  null;

async function getEditorConfig() {
  if (!editorConfigPromise) {
    editorConfigPromise = editorConfigFactory.default({
      config: await config,
    });
  }
  return editorConfigPromise;
}

/** Convert a markdown string to a Lexical editor state (server-only). */
export async function mdToLexical(markdown: string) {
  const editorConfig = await getEditorConfig();
  return convertMarkdownToLexical({ editorConfig, markdown: markdown || "" });
}
