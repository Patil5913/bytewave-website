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

const IS_CODE = 16;

function textNode(
  text: string,
  state?: Record<string, string>,
  format = 0,
) {
  return {
    type: "text",
    text,
    detail: 0,
    format,
    mode: "normal",
    style: "",
    version: 1,
    ...(state ? { $: state } : {}),
  };
}

// Fenced code stays a plain paragraph whose text carries lexical's code format
// flag — no custom block, no extra editor feature, no new node types. The
// frontend converter turns such a paragraph into <pre><code>.
function codeParagraphNode(code: string) {
  return {
    type: "paragraph",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    textFormat: IS_CODE,
    children: [textNode(code, undefined, IS_CODE)],
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

/** Swap placeholder paragraphs back into code paragraphs. */
function restoreCodeBlocks(root: any, fences: { code: string }[]): void {
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
      if (fence) return codeParagraphNode(fence.code);
    }
    return child;
  });
}

/** Convert a markdown string to a Lexical editor state (server-only).
 *  Handles fenced code blocks and ==highlight== explicitly, since neither is
 *  covered by the built-in markdown transformers. */
export async function mdToLexical(markdown: string) {
  const editorConfig = await getEditorConfig();

  // pull fenced code out before conversion so it survives verbatim
  const fences: { code: string }[] = [];
  const prepared = (markdown || "").replace(
    /```[\w-]*\r?\n([\s\S]*?)```/g,
    (_full, code: string) => {
      fences.push({ code: code.replace(/\r?\n$/, "") });
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
