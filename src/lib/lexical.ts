import "server-only";
import type { Block } from "./insights";
import { blocksToMarkdown } from "./markdown";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";

let editorConfigPromise: ReturnType<typeof editorConfigFactory.default> | null =
  null;

async function getEditorConfig() {
  if (!editorConfigPromise) {
    
    const { default: config } = await import("@payload-config");
    editorConfigPromise = editorConfigFactory.default({
      config: await config,
    });
  }
  return editorConfigPromise;
}

const CODE_TOKEN = (i: number) => `@@FHCODEBLOCK${i}@@`;

const IS_CODE = 16;

function textNode(text: string, state?: Record<string, string>, format = 0) {
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

export async function mdToLexical(markdown: string) {
  const editorConfig = await getEditorConfig();

  const fences: { code: string }[] = [];
  const prepared = (markdown || "").replace(
    /```[\w-]*\r?\n[\s\S]*?```/g,
    (full: string) => {
      fences.push({ code: full.replace(/\r?\n$/, "") });
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

export async function blocksToLexical(blocks: Block[]) {
  const { md, faqs } = blocksToMarkdown(blocks);
  return { content: await mdToLexical(md), faqs };
}
