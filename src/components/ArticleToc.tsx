"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string; level: number };

export default function ArticleToc({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) return;
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium tracking-widest text-ink/40 uppercase">
        On this page
      </span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          data-active={active === item.id}
          className={`text-sm leading-snug transition-colors data-[active=true]:text-brand ${
            item.level === 3 ? "pl-3 text-ink/40" : "text-ink/50"
          } hover:text-ink`}
        >
          {item.text}
        </a>
      ))}
    </div>
  );
}
