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
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
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
    <div className="article-richtext flex flex-col gap-6">
      <RichText data={data} converters={converters} />
    </div>
  );
}
