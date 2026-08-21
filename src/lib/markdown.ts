import type { Block, Span } from "./insights";


function spanToMd(s: Span): string {
  let t = s.text;
  if (s.code) t = `\`${t}\``;
  if (s.bold) t = `**${t}**`;
  if (s.italic) t = `*${t}*`;
  if (s.highlight) t = `==${t}==`;
  if (s.href) t = `[${t}](${s.href})`;
  return t;
}

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
        faqs.push(...b.items);
        break;
    }
  }
  return { md: out.join("\n\n"), faqs };
}
