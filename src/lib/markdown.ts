// Tiny markdown → Block[] parser for insights posts. Supports exactly the
// syntax documented in content/insights/GUIDE.md so authors write markdown in
// the CMS and the existing block renderer stays the consumer. Not a general
// CommonMark implementation — deliberately small and predictable.
import type { Block, Span } from "./insights";

type Faq = { question: string; answer: string };

// --- Block[] -> markdown (used to migrate legacy posts into the rich editor) ---

function spanToMd(s: Span): string {
  let t = s.text;
  if (s.code) t = `\`${t}\``;
  if (s.bold) t = `**${t}**`;
  if (s.italic) t = `*${t}*`;
  if (s.highlight) t = `==${t}==`;
  if (s.href) t = `[${t}](${s.href})`;
  return t;
}

/** Serialize renderer blocks back to markdown. FAQ blocks are pulled into a
 *  separate array so they can live in a structured field. */
export function blocksToMarkdown(blocks: Block[]): {
  md: string;
  faqs: { question: string; answer: string }[];
} {
  const faqs: { question: string; answer: string }[] = [];
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "paragraph":
        out.push(b.spans.map(spanToMd).join(""));
        break;
      case "heading":
        out.push(`${"#".repeat(b.level)} ${b.text}`);
        break;
      case "quote":
        out.push(`> ${b.text}`);
        break;
      case "list":
        out.push(
          b.items
            .map((it, n) => (b.ordered ? `${n + 1}. ${it}` : `- ${it}`))
            .join("\n"),
        );
        break;
      case "image":
        out.push(`![${b.alt}](${b.src}${b.caption ? ` "${b.caption}"` : ""})`);
        break;
      case "code":
        out.push(`\`\`\`${b.language}\n${b.code}\n\`\`\``);
        break;
      case "divider":
        out.push("---");
        break;
      case "faq":
        // FAQs live in their own structured field; the article page renders
        // the heading, so don't emit one into the body (it would duplicate).
        faqs.push(...b.items);
        break;
    }
  }
  return { md: out.join("\n\n"), faqs };
}

/** Inline marks: `code`, **bold**, *italic*, ==highlight==, [text](href). */
export function parseInline(input: string): Span[] {
  const spans: Span[] = [];
  let rest = input;

  const matchers: {
    re: RegExp;
    make: (m: RegExpMatchArray) => Span;
  }[] = [
    { re: /`([^`]+)`/, make: (m) => ({ text: m[1], code: true }) },
    { re: /\*\*([^*]+)\*\*/, make: (m) => ({ text: m[1], bold: true }) },
    { re: /==([^=]+)==/, make: (m) => ({ text: m[1], highlight: true }) },
    { re: /\*([^*]+)\*/, make: (m) => ({ text: m[1], italic: true }) },
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      make: (m) => ({ text: m[1], href: m[2] }),
    },
  ];

  while (rest.length) {
    let best: { index: number; length: number; span: Span } | null = null;
    for (const { re, make } of matchers) {
      const m = rest.match(re);
      if (m && m.index !== undefined) {
        if (!best || m.index < best.index) {
          best = { index: m.index, length: m[0].length, span: make(m) };
        }
      }
    }
    if (!best) {
      spans.push({ text: rest });
      break;
    }
    if (best.index > 0) spans.push({ text: rest.slice(0, best.index) });
    spans.push(best.span);
    rest = rest.slice(best.index + best.length);
  }

  return spans.filter((s) => s.text.length > 0);
}

/** Parse a markdown body (no frontmatter) into renderer blocks. `faqs` are
 *  injected where a `## Frequently asked questions` heading appears. */
export function parseMarkdown(md: string, faqs: Faq[] = []): Block[] {
  const blocks: Block[] = [];
  const lines = (md ?? "").replace(/\r\n/g, "\n").split("\n");
  let i = 0;

  const isFaqHeading = (t: string) =>
    /^frequently asked questions$/i.test(t.trim());

  while (i < lines.length) {
    let line = lines[i];

    // blank
    if (!line.trim()) {
      i++;
      continue;
    }

    // fenced code
    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const lang = fence[1] ?? "text";
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ type: "code", language: lang, code: buf.join("\n") });
      continue;
    }

    // divider
    if (/^---\s*$/.test(line)) {
      blocks.push({ type: "divider" });
      i++;
      continue;
    }

    // headings
    const heading = line.match(/^(#{2,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length as 2 | 3 | 4;
      const text = heading[2].trim();
      if (level === 2 && isFaqHeading(text) && faqs.length) {
        blocks.push({ type: "heading", level, text });
        blocks.push({ type: "faq", items: faqs });
      } else {
        blocks.push({ type: "heading", level, text });
      }
      i++;
      continue;
    }

    // standalone image  ![alt](src "caption")
    const img = line
      .trim()
      .match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
    if (img) {
      blocks.push({
        type: "image",
        src: img[2],
        alt: img[1],
        ...(img[3] ? { caption: img[3] } : {}),
      });
      i++;
      continue;
    }

    // blockquote (collapse consecutive `>` lines)
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: buf.join(" ").trim() });
      continue;
    }

    // unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "list", ordered: true, items });
      continue;
    }

    // paragraph (gather until blank / block starter)
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{2,4}\s|>\s?|[-*]\s+|\d+\.\s+|```|---\s*$)/.test(lines[i]) &&
      !/^!\[[^\]]*\]\([^)]+\)$/.test(lines[i].trim())
    ) {
      buf.push(lines[i].trim());
      i++;
    }
    line = buf.join(" ");
    if (line) blocks.push({ type: "paragraph", spans: parseInline(line) });
  }

  return blocks;
}
