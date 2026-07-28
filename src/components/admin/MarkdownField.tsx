"use client";

import React from "react";
import { useField, FieldLabel } from "@payloadcms/ui";
import { parseMarkdown } from "@/lib/markdown";
import type { Block, Span } from "@/lib/insights";

// Custom Payload field: a markdown textarea with a live rendered preview beside
// it, using the same parser the public site renders with.
type Props = {
  path: string;
  field?: { label?: string; required?: boolean; admin?: { rows?: number } };
};

function Inline({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((s, i) => {
        let node: React.ReactNode = s.text;
        if (s.code)
          node = (
            <code
              style={{
                background: "var(--theme-elevation-100)",
                color: "#2191fb",
                padding: "0 4px",
                borderRadius: 3,
              }}
            >
              {node}
            </code>
          );
        if (s.highlight)
          node = (
            <mark style={{ background: "rgba(33,145,251,0.2)", color: "inherit" }}>
              {node}
            </mark>
          );
        if (s.bold) node = <strong>{node}</strong>;
        if (s.italic) node = <em>{node}</em>;
        if (s.href)
          node = (
            <a href={s.href} style={{ color: "#2191fb" }}>
              {node}
            </a>
          );
        return <React.Fragment key={i}>{node}</React.Fragment>;
      })}
    </>
  );
}

function Preview({ md }: { md: string }) {
  const blocks: Block[] = parseMarkdown(md);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading": {
            const Tag = `h${b.level}` as "h2" | "h3" | "h4";
            return (
              <Tag key={i} style={{ margin: 0, fontWeight: 600 }}>
                {b.text}
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p key={i} style={{ margin: 0, lineHeight: 1.6 }}>
                <Inline spans={b.spans} />
              </p>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                style={{
                  margin: 0,
                  paddingLeft: 12,
                  borderLeft: "2px solid #2191fb",
                  fontStyle: "italic",
                }}
              >
                {b.text}
              </blockquote>
            );
          case "list":
            return b.ordered ? (
              <ol key={i} style={{ margin: 0, paddingLeft: 20 }}>
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} style={{ margin: 0, paddingLeft: 20 }}>
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "image":
            // eslint-disable-next-line @next/next/no-img-element
            return (
              <img
                key={i}
                src={b.src}
                alt={b.alt}
                style={{ maxWidth: "100%", borderRadius: 4 }}
              />
            );
          case "code":
            return (
              <pre
                key={i}
                style={{
                  margin: 0,
                  padding: 12,
                  background: "var(--theme-elevation-100)",
                  borderRadius: 4,
                  overflowX: "auto",
                  fontSize: 12,
                }}
              >
                <code>{b.code}</code>
              </pre>
            );
          case "divider":
            return (
              <hr
                key={i}
                style={{
                  border: 0,
                  borderTop: "1px solid var(--theme-elevation-150)",
                }}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export const MarkdownField: React.FC<Props> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path });
  const rows = field?.admin?.rows ?? 24;

  return (
    <div className="field-type" style={{ marginBottom: "1.5rem" }}>
      <FieldLabel label={field?.label ?? "Content"} required={field?.required} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <textarea
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          rows={rows}
          spellCheck
          style={{
            width: "100%",
            resize: "vertical",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            fontSize: 13,
            lineHeight: 1.55,
            padding: 12,
            borderRadius: 4,
            border: "1px solid var(--theme-elevation-150)",
            background: "var(--theme-input-bg)",
            color: "var(--theme-elevation-1000)",
          }}
        />
        <div
          aria-label="Preview"
          style={{
            minHeight: 120,
            maxHeight: `calc(${rows} * 1.55em + 24px)`,
            overflowY: "auto",
            padding: 16,
            borderRadius: 4,
            border: "1px solid var(--theme-elevation-150)",
            background: "var(--theme-elevation-50)",
            color: "var(--theme-elevation-1000)",
            fontSize: 14,
          }}
        >
          <Preview md={value ?? ""} />
        </div>
      </div>
    </div>
  );
};

export default MarkdownField;
