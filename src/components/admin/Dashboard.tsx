import { getPayload, type CollectionSlug } from "payload";
import config from "@payload-config";

const ADMIN = "/ops/admin";

type Card = {
  label: string;
  href: string;
  desc: string;
  countKey?: CollectionSlug;
};

const GROUPS: { title: string; cards: Card[] }[] = [
  {
    title: "Homepage",
    cards: [
      {
        label: "Homepage copy",
        href: `${ADMIN}/globals/homepage`,
        desc: "Hero · manifesto · story · CTA (tabbed)",
      },
      {
        label: "Headline stats",
        href: `${ADMIN}/globals/site-stats`,
        desc: "The four big numbers",
      },
      {
        label: "Placements",
        href: `${ADMIN}/collections/placements`,
        desc: "Recent placements feed",
        countKey: "placements",
      },
    ],
  },
  {
    title: "Companies Page",
    cards: [
      {
        label: "Company FAQs",
        href: `${ADMIN}/collections/company-faqs`,
        desc: "FAQ accordion on /companies",
        countKey: "company-faqs",
      },
      {
        label: "Client quotes",
        href: `${ADMIN}/collections/client-quotes`,
        desc: "Testimonial marquee",
        countKey: "client-quotes",
      },
      {
        label: "Certifications",
        href: `${ADMIN}/collections/certifications`,
        desc: "Compliance credentials",
        countKey: "certifications",
      },
    ],
  },
  {
    title: "Professionals Page",
    cards: [
      {
        label: "Professional FAQs",
        href: `${ADMIN}/collections/professional-faqs`,
        desc: "FAQ accordion on /professionals",
        countKey: "professional-faqs",
      },
      {
        label: "Success videos",
        href: `${ADMIN}/collections/success-videos`,
        desc: "Candidate video marquee",
        countKey: "success-videos",
      },
      {
        label: "Track record",
        href: `${ADMIN}/globals/track-record`,
        desc: "Stats + placement-volume chart",
      },
    ],
  },
  {
    title: "Insights",
    cards: [
      {
        label: "Articles",
        href: `${ADMIN}/collections/posts`,
        desc: "Blog posts (rich text)",
        countKey: "posts",
      },
    ],
  },
  {
    title: "Referrals",
    cards: [
      {
        label: "Referrers",
        href: `${ADMIN}/collections/referrers`,
        desc: "Share links, clicks and reward totals",
        countKey: "referrers",
      },
      {
        label: "Referrals",
        href: `${ADMIN}/collections/referrals`,
        desc: "Attributed leads — qualify to release a reward",
        countKey: "referrals",
      },
      {
        label: "Referral settings",
        href: `${ADMIN}/globals/referral-settings`,
        desc: "Default reward, currency, cookie window",
      },
    ],
  },
  {
    title: "Global & system",
    cards: [
      {
        label: "Site settings",
        href: `${ADMIN}/globals/site-settings`,
        desc: "Tagline, address, nav CTA, SEO",
      },
      {
        label: "Leads",
        href: `${ADMIN}/collections/contacts`,
        desc: "Contact + CTA submissions",
        countKey: "contacts",
      },
      {
        label: "Legal pages",
        href: `${ADMIN}/globals/legal-page`,
        desc: "Privacy · terms · refunds",
      },
      {
        label: "Media",
        href: `${ADMIN}/collections/media`,
        desc: "Uploaded images",
        countKey: "media",
      },
      {
        label: "Users",
        href: `${ADMIN}/collections/users`,
        desc: "Admin accounts",
        countKey: "users",
      },
    ],
  },
];

const COUNTED_SLUGS = Array.from(
  new Set(
    GROUPS.flatMap((group) =>
      group.cards
        .map((card) => card.countKey)
        .filter((slug): slug is CollectionSlug => Boolean(slug)),
    ),
  ),
);

async function loadCounts(): Promise<Partial<Record<CollectionSlug, number>>> {
  try {
    const payload = await getPayload({ config });
    const slugs = COUNTED_SLUGS;
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
    return Object.fromEntries(entries) as Partial<
      Record<CollectionSlug, number>
    >;
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
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.1rem",
            }}
          >
            {group.cards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1.25rem",
                  minHeight: 128,
                  padding: "1.5rem 1.6rem",
                  borderRadius: 8,
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
                    gap: 10,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "1.2rem" }}>
                    {card.label}
                  </span>
                  {card.countKey !== undefined && (
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontVariantNumeric: "tabular-nums",
                        color: "#2191fb",
                        border: "1px solid var(--theme-elevation-150)",
                        borderRadius: 999,
                        padding: "2px 11px",
                      }}
                    >
                      {counts[card.countKey] ?? 0}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    lineHeight: 1.4,
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
