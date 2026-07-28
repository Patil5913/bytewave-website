import React from "react";
import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import { slugify } from "./insights";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Concatenate the text of a heading node's descendants.
function headingText(node: any): string {
  const walk = (n: any): string => {
    if (typeof n?.text === "string") return n.text;
    return (n?.children ?? []).map(walk).join("");
  };
  return (node.children ?? []).map(walk).join("");
}

// True when the body already contains a heading matching `re` — used to avoid
// rendering a duplicate section heading (e.g. "Frequently asked questions").
export function hasHeading(data: any, re: RegExp): boolean {
  const children = data?.root?.children ?? [];
  return children.some(
    (n: any) => n?.type === "heading" && re.test(headingText(n)),
  );
}

// Table-of-contents entries from a lexical editor state (h2 / h3 only).
export function extractToc(
  data: any,
): { id: string; text: string; level: 2 | 3 }[] {
  const children = data?.root?.children ?? [];
  return children
    .filter((n: any) => n?.type === "heading" && (n.tag === "h2" || n.tag === "h3"))
    .map((n: any) => {
      const text = headingText(n);
      return { id: slugify(text), text, level: n.tag === "h2" ? 2 : 3 } as const;
    });
}

// Only override headings — to attach TOC anchor ids and scroll offset. All
// other nodes use Payload's defaults; visual styling is applied by the
// `.article-richtext` scope in globals.css.
// Lexical text format bitmask
const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;

// Render a text node honouring both the format bitmask and any text-state
// (e.g. the ==highlight== brand state) that the default converter ignores.
function renderText(node: any, key: number) {
  let el: React.ReactNode = node.text;
  const f: number = node.format ?? 0;

  if (f & IS_CODE) el = <code>{el}</code>;
  if (f & IS_BOLD) el = <strong>{el}</strong>;
  if (f & IS_ITALIC) el = <em>{el}</em>;
  if (f & IS_STRIKETHROUGH) el = <s>{el}</s>;
  if (f & IS_UNDERLINE) el = <u>{el}</u>;
  if (f & IS_SUBSCRIPT) el = <sub>{el}</sub>;
  if (f & IS_SUPERSCRIPT) el = <sup>{el}</sup>;

  const state = node.$ as Record<string, string> | undefined;
  if (state?.highlight) {
    el = <mark className="rt-highlight">{el}</mark>;
  }
  return <React.Fragment key={key}>{el}</React.Fragment>;
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  text: ({ node }: any) => renderText(node, 0),
  paragraph: ({ node, nodesToJSX }: any) => {
    const kids = node.children ?? [];
    const raw = kids.map((c: any) => c?.text ?? "").join("");

    // A paragraph whose text is entirely code-formatted came from a ``` fence.
    // Strip the fence markers (kept for the editor) and render a code block.
    const allCode =
      kids.length > 0 &&
      kids.every((c: any) => c?.type === "text" && (c.format & IS_CODE) !== 0);
    if (allCode) {
      const fence = raw.match(/^```([\w-]*)\r?\n([\s\S]*?)\r?\n?```$/);
      const language = fence?.[1] || undefined;
      const code = fence ? fence[2] : raw;
      return (
        <pre data-language={language}>
          <code>{code}</code>
        </pre>
      );
    }

    // Standalone image markdown: ![alt](src "caption")
    const img = raw
      .trim()
      .match(/^!\[([^\]]*)\]\(\s*(\S+?)(?:\s+"([^"]*)")?\s*\)$/);
    if (img) {
      const [, alt, src, caption] = img;
      return (
        <figure className="rt-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" />
          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      );
    }

    return <p>{nodesToJSX({ nodes: kids })}</p>;
  },
  heading: ({ node, nodesToJSX }: any) => {
    const Tag = (node.tag ?? "h2") as "h2" | "h3" | "h4";
    const id = slugify(headingText(node));
    return (
      <Tag id={id} className="scroll-mt-28">
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    );
  },
});

export function ArticleRichText({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="article-richtext">
      <RichText data={data} converters={converters} />
    </div>
  );
}
