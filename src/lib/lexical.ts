import "server-only";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import config from "@payload-config";

/* eslint-disable @typescript-eslint/no-explicit-any */

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

const CODE_TOKEN = (i: number) => `@@FHCODEBLOCK${i}@@`;

// The premade CodeBlock validates `language` against a fixed option list
// (Monaco's). Map common markdown fence aliases onto valid keys.
const LANG_ALIASES: Record<string, string> = {
  "": "plaintext",
  text: "plaintext",
  txt: "plaintext",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  yml: "yaml",
  md: "markdown",
  py: "python",
};

function safeLanguage(lang: string): string {
  const key = (lang || "").toLowerCase();
  return LANG_ALIASES[key] ?? key ?? "plaintext";
}

function objectId() {
  // 24-char hex, matching the id shape Payload assigns to block rows
  let s = "";
  while (s.length < 24) s += Math.floor(Math.random() * 16).toString(16);
  return s.slice(0, 24);
}

function codeBlockNode(language: string, code: string) {
  return {
    type: "block",
    format: "",
    version: 2,
    fields: {
      id: objectId(),
      blockName: "",
      blockType: "Code",
      language: safeLanguage(language),
      code,
    },
  };
}

function textNode(text: string, state?: Record<string, string>) {
  return {
    type: "text",
    text,
    detail: 0,
    format: 0,
    mode: "normal",
    style: "",
    version: 1,
    ...(state ? { $: state } : {}),
  };
}

/** Split any text node containing ==highlight== into highlighted segments.
 *  `==` is not standard markdown, so no transformer produces this. */
function applyHighlights(node: any): void {
  if (!node || typeof node !== "object") return;
  const children = node.children;
  if (!Array.isArray(children)) return;

  const out: any[] = [];
  for (const child of children) {
    if (
      child?.type === "text" &&
      typeof child.text === "string" &&
      child.text.includes("==")
    ) {
      const parts = child.text.split(/==([^=]+)==/g);
      // even indices = plain, odd indices = highlighted
      parts.forEach((part: string, i: number) => {
        if (!part) return;
        out.push(
          i % 2 === 1
            ? { ...child, ...textNode(part, { highlight: "brand" }) }
            : { ...child, ...textNode(part) },
        );
      });
    } else {
      applyHighlights(child);
      out.push(child);
    }
  }
  node.children = out;
}

/** Swap placeholder paragraphs back into real Code block nodes. */
function restoreCodeBlocks(
  root: any,
  fences: { language: string; code: string }[],
): void {
  const children = root?.root?.children;
  if (!Array.isArray(children)) return;
  root.root.children = children.map((child: any) => {
    const text = (child?.children ?? [])
      .map((c: any) => c?.text ?? "")
      .join("")
      .trim();
    const m = text.match(/^@@FHCODEBLOCK(\d+)@@$/);
    if (m) {
      const fence = fences[Number(m[1])];
      if (fence) return codeBlockNode(fence.language, fence.code);
    }
    return child;
  });
}

/** Convert a markdown string to a Lexical editor state (server-only).
 *  Handles fenced code blocks and ==highlight== explicitly, since neither is
 *  covered by the built-in markdown transformers. */
export async function mdToLexical(markdown: string) {
  const editorConfig = await getEditorConfig();

  // pull fenced code out before conversion so it survives as a Code block
  const fences: { language: string; code: string }[] = [];
  const prepared = (markdown || "").replace(
    /```([\w-]*)\r?\n([\s\S]*?)```/g,
    (_full, lang: string, code: string) => {
      fences.push({
        language: safeLanguage(lang),
        code: code.replace(/\r?\n$/, ""),
      });
      return CODE_TOKEN(fences.length - 1);
    },
  );

  const state: any = convertMarkdownToLexical({
    editorConfig,
    markdown: prepared,
  });

  restoreCodeBlocks(state, fences);
  applyHighlights(state.root);

  return state;
}
