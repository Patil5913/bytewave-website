import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";

const ADMIN = "/fhadmin";

type Card = {
  label: string;
  href: string;
  desc: string;
  countKey?: string;
};

const GROUPS: { title: string; cards: Card[] }[] = [
  {
    title: "Content",
    cards: [
      { label: "Insights", href: `${ADMIN}/collections/posts`, desc: "Blog articles (markdown)", countKey: "posts" },
      { label: "Placements", href: `${ADMIN}/collections/placements`, desc: "Recent placements feed", countKey: "placements" },
      { label: "Testimonials", href: `${ADMIN}/collections/testimonials`, desc: "Client quotes + candidate videos", countKey: "testimonials" },
      { label: "FAQs", href: `${ADMIN}/collections/faqs`, desc: "Company + professional FAQs", countKey: "faqs" },
      { label: "Certifications", href: `${ADMIN}/collections/certifications`, desc: "Compliance credentials", countKey: "certifications" },
      { label: "Partners", href: `${ADMIN}/collections/partners`, desc: "Logo marquees", countKey: "partners" },
    ],
  },
  {
    title: "Page copy",
    cards: [
      { label: "Homepage", href: `${ADMIN}/globals/homepage`, desc: "Hero, manifesto, story, CTA" },
      { label: "Site stats", href: `${ADMIN}/globals/site-stats`, desc: "Headline numbers" },
      { label: "Site settings", href: `${ADMIN}/globals/site-settings`, desc: "Footer, socials, address" },
    ],
  },
  {
    title: "Inbound & system",
    cards: [
      { label: "Leads", href: `${ADMIN}/collections/contacts`, desc: "Contact + CTA submissions", countKey: "contacts" },
      { label: "Media", href: `${ADMIN}/collections/media`, desc: "Uploaded images", countKey: "media" },
      { label: "Users", href: `${ADMIN}/collections/users`, desc: "Admin accounts", countKey: "users" },
    ],
  },
];

async function loadCounts(): Promise<Record<string, number>> {
  try {
    const payload = await getPayload({ config });
    const slugs = [
      "posts",
      "placements",
      "testimonials",
      "faqs",
      "certifications",
      "partners",
      "contacts",
      "media",
      "users",
    ] as const;
    const entries = await Promise.all(
      slugs.map(async (s) => {
        try {
          const { totalDocs } = await payload.count({ collection: s });
          return [s, totalDocs] as const;
        } catch {
          return [s, 0] as const;
        }
      }),
    );
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

export const Dashboard = async () => {
  const counts = await loadCounts();

  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.6rem",
          marginBottom: "0.35rem",
        }}
      >
        <span style={{ fontSize: "1.6rem", fontWeight: 600 }}>
          find <span style={{ color: "#2191fb" }}>&amp;</span> hire
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--theme-elevation-500)",
          }}
        >
          Content dashboard
        </span>
      </div>
      <p
        style={{
          margin: 0,
          marginBottom: "1.75rem",
          color: "var(--theme-elevation-600)",
          fontSize: "0.9rem",
        }}
      >
        Everything on the marketing site is managed here.
      </p>

      {GROUPS.map((group) => (
        <section key={group.title} style={{ marginBottom: "1.75rem" }}>
          <h3
            style={{
              margin: "0 0 0.75rem",
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--theme-elevation-500)",
            }}
          >
            {group.title}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {group.cards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                style={{
                  display: "block",
                  padding: "1rem 1.1rem",
                  borderRadius: 6,
                  border: "1px solid var(--theme-elevation-150)",
                  background: "var(--theme-elevation-50)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.98rem" }}>
                    {card.label}
                  </span>
                  {card.countKey !== undefined && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontVariantNumeric: "tabular-nums",
                        color: "#2191fb",
                        border: "1px solid var(--theme-elevation-150)",
                        borderRadius: 999,
                        padding: "1px 8px",
                      }}
                    >
                      {counts[card.countKey] ?? 0}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: "0.8rem",
                    color: "var(--theme-elevation-600)",
                  }}
                >
                  {card.desc}
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Dashboard;
