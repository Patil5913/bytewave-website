import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Img,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

import { SITE_SETTINGS } from "@/lib/siteContent";

export const CANVAS = "#0a0a0a";
export const INK = "#f7f6f3";
export const BRAND = "#2191fb";
export const MUTED = "rgba(247,246,243,0.55)";
export const HAIRLINE = "rgba(247,246,243,0.12)";
/**
 * Site fonts, with the stack the client falls back to when it strips webfonts
 * (Gmail always does). Geist -> system sans, Instrument Serif -> Georgia, both
 * of which are metrically close enough that the layout does not reflow.
 */
export const SANS =
  "'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
export const SERIF = "'Instrument Serif',Georgia,'Times New Roman',serif";

const GEIST_WOFF2 =
  "https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFU.woff2";
const INSTRUMENT_WOFF2 =
  "https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjg.woff2";

/** 600px is the safe ceiling: Outlook's reading pane and Gmail both clip past it. */
const WIDTH = 600;

export const DIM = "rgba(247,246,243,0.35)";

const FOOT_TEXT = {
  margin: "0 0 14px",
  fontFamily: SANS,
  fontSize: "12px",
  lineHeight: "1.7",
  color: MUTED,
} as const;

const FOOT_LINK = {
  color: MUTED,
  textDecoration: "underline",
  textUnderlineOffset: "2px",
} as const;

const FOOTER_LINKS = [
  { label: "Privacy", href: "/legal#privacy" },
  { label: "Terms", href: "/legal#terms" },
  { label: "Insights", href: "/insights" },
];

export type EmailRow = { label: string; value: string };

/** A post as it appears in an email: hero card or related-list row. */
export type EmailPost = {
  title: string;
  href: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  tag?: string;
  meta?: string;
};

export type EmailBlock =
  | { kind: "text"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "hero"; post: EmailPost }
  | { kind: "posts"; label?: string; posts: EmailPost[] }
  | { kind: "rows"; rows: EmailRow[] }
  | { kind: "code"; label: string; value: string }
  | { kind: "button"; label: string; href: string }
  | { kind: "link"; label: string; href: string };

export type EmailContent = {
  subject: string;
  /** Inbox preview line. Hidden in the body. */
  preheader: string;
  eyebrow?: string;
  heading: string;
  blocks: EmailBlock[];
  /** Small print above the signature. */
  footnote?: string;
  /** Address the mail went to, shown in the footer for provenance. */
  sentTo?: string;
  /** Marketing mail must carry this; transactional mail must not. */
  unsubscribeUrl?: string;
  /** Internal mail skips the marketing furniture entirely. */
  internal?: boolean;
  /** Footer identity. Falls back to the static site settings when omitted. */
  footer?: {
    socials?: { label: string; href: string }[];
    legalLine?: string;
    address?: string;
  };
};

export function serverUrl() {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

function Block({ block }: { block: EmailBlock }) {
  switch (block.kind) {
    case "heading":
      return (
        <Heading
          as="h2"
          style={{
            margin: "26px 0 8px",
            paddingTop: "18px",
            borderTop: `1px solid ${HAIRLINE}`,
            fontFamily: SERIF,
            fontSize: "20px",
            lineHeight: "1.3",
            fontWeight: 500,
            color: INK,
          }}
        >
          {block.text}
        </Heading>
      );

    case "hero":
      return (
        <Section style={{ margin: "0 0 24px" }}>
          {block.post.image && (
            <Link href={block.post.href}>
              <Img
                src={block.post.image}
                alt={block.post.imageAlt ?? block.post.title}
                width={WIDTH}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  height: "auto",
                  display: "block",
                  border: `1px solid ${HAIRLINE}`,
                }}
              />
            </Link>
          )}
          {block.post.tag && (
            <Text
              style={{
                margin: "16px 0 6px",
                fontFamily: SANS,
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: BRAND,
              }}
            >
              {block.post.tag}
            </Text>
          )}
          <Heading
            as="h2"
            style={{
              margin: "0 0 10px",
              fontFamily: SERIF,
              fontSize: "24px",
              lineHeight: "1.25",
              fontWeight: 500,
              color: INK,
            }}
          >
            <Link
              href={block.post.href}
              style={{ color: INK, textDecoration: "none" }}
            >
              {block.post.title}
            </Link>
          </Heading>
          {block.post.excerpt && (
            <Text
              style={{
                margin: "0 0 8px",
                fontFamily: SANS,
                fontSize: "15px",
                lineHeight: "1.65",
                color: MUTED,
              }}
            >
              {block.post.excerpt}
            </Text>
          )}
          {block.post.meta && (
            <Text
              style={{
                margin: 0,
                fontFamily: SANS,
                fontSize: "12px",
                color: DIM,
              }}
            >
              {block.post.meta}
            </Text>
          )}
        </Section>
      );

    case "posts":
      return (
        <Section style={{ margin: "0 0 20px" }}>
          {block.label && (
            <Text
              style={{
                margin: "0 0 10px",
                paddingTop: "18px",
                borderTop: `1px solid ${HAIRLINE}`,
                fontFamily: SANS,
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              {block.label}
            </Text>
          )}
          {block.posts.map((post) => (
            <Row key={post.href} style={{ marginBottom: "4px" }}>
              {post.image && (
                <Column
                  className="thumb"
                  width={96}
                  valign="top"
                  style={{ width: "96px", padding: "10px 14px 10px 0" }}
                >
                  <Link href={post.href}>
                    <Img
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      width={96}
                      height={64}
                      style={{
                        width: "96px",
                        height: "64px",
                        objectFit: "cover",
                        display: "block",
                        border: `1px solid ${HAIRLINE}`,
                      }}
                    />
                  </Link>
                </Column>
              )}
              <Column valign="top" style={{ padding: "10px 0" }}>
                <Text
                  style={{
                    margin: "0 0 4px",
                    fontFamily: SANS,
                    fontSize: "14px",
                    lineHeight: "1.45",
                    color: INK,
                  }}
                >
                  <Link
                    href={post.href}
                    style={{ color: INK, textDecoration: "none" }}
                  >
                    {post.title}
                  </Link>
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontFamily: SANS,
                    fontSize: "12px",
                    color: DIM,
                  }}
                >
                  {[post.tag, post.meta].filter(Boolean).join(" · ")}
                </Text>
              </Column>
            </Row>
          ))}
        </Section>
      );

    case "text":
      return (
        <Text
          style={{
            margin: "0 0 16px",
            fontFamily: SANS,
            fontSize: "15px",
            lineHeight: "1.65",
            color: MUTED,
          }}
        >
          {block.text}
        </Text>
      );

    case "rows":
      return (
        <Section style={{ margin: "0 0 20px" }}>
          {block.rows.map((row) => (
            <Row key={row.label}>
              <Column
                className="row-label"
                style={{
                  padding: "9px 0",
                  borderBottom: `1px solid ${HAIRLINE}`,
                  fontFamily: SANS,
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: MUTED,
                  whiteSpace: "nowrap",
                  verticalAlign: "top",
                  width: "34%",
                }}
              >
                {row.label}
              </Column>
              <Column
                className="row-value"
                style={{
                  padding: "9px 0 9px 16px",
                  borderBottom: `1px solid ${HAIRLINE}`,
                  fontFamily: SANS,
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: INK,
                  wordBreak: "break-word",
                }}
              >
                {row.value}
              </Column>
            </Row>
          ))}
        </Section>
      );

    case "code":
      return (
        <Section style={{ width: "100%", margin: "0 0 20px" }}>
          <Row>
            {/* padding on the cell, not the table — see the shell comment */}
            <Column
              style={{
                padding: "16px 18px",
                border: `1px solid ${HAIRLINE}`,
                background: "rgba(247,246,243,0.04)",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  fontFamily: SANS,
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                {block.label}
              </Text>
              <Text
                style={{
                  margin: "6px 0 0",
                  fontFamily: SANS,
                  fontSize: "22px",
                  letterSpacing: "0.14em",
                  color: INK,
                }}
              >
                {block.value}
              </Text>
            </Column>
          </Row>
        </Section>
      );

    case "button":
      return (
        <Section className="cta" style={{ margin: "4px 0 24px" }}>
          <Button
            href={block.href}
            style={{
              display: "inline-block",
              padding: "13px 26px",
              background: INK,
              fontFamily: SANS,
              fontSize: "14px",
              fontWeight: 600,
              color: CANVAS,
              textDecoration: "none",
            }}
          >
            {block.label}
          </Button>
        </Section>
      );

    case "link":
      return (
        <Text
          style={{
            margin: "0 0 16px",
            fontFamily: SANS,
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          <Link
            href={block.href}
            style={{
              color: BRAND,
              textDecoration: "none",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {block.label}
          </Link>
        </Text>
      );
  }
}

/** The one layout every template renders into. */
export function Shell({ content }: { content: EmailContent }) {
  const url = serverUrl();
  const year = new Date().getFullYear();

  // CMS values when the caller passes them, static site settings otherwise —
  // the email footer and the page footer read from the same source either way.
  const SOCIALS = content.footer?.socials ?? SITE_SETTINGS.socials;
  const LEGAL_LINE = content.footer?.legalLine ?? SITE_SETTINGS.legalLine;
  const ADDRESS_LINES = (
    content.footer?.address ?? SITE_SETTINGS.address
  ).split("\n");

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="dark light" />
        <meta name="supported-color-schemes" content="dark light" />
        <title>{content.subject}</title>
        {/* Apple Mail / iOS / Thunderbird load these; Gmail and Outlook drop
            @font-face and fall back to the stack declared per component. */}
        <Font
          fontFamily="Geist"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{ url: GEIST_WOFF2, format: "woff2" }}
          fontWeight={400}
        />
        <Font
          fontFamily="Geist"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{ url: GEIST_WOFF2, format: "woff2" }}
          fontWeight={600}
        />
        <Font
          fontFamily="Instrument Serif"
          fallbackFontFamily={["Georgia", "Times New Roman", "serif"]}
          webFont={{ url: INSTRUMENT_WOFF2, format: "woff2" }}
          fontWeight={400}
        />
        <style>{`
          html, body { height: 100%; }
          body { -webkit-text-size-adjust: 100%; }
          table { max-width: 100%; }
          img { max-width: 100%; height: auto; }
          @media only screen and (max-width: 480px) {
            .gutter { padding: 20px 16px 36px !important; }
            .display { font-size: 24px !important; }
            .row-label { width: 100% !important; display: block !important; padding-bottom: 2px !important; border-bottom: 0 !important; white-space: normal !important; }
            .row-value { width: 100% !important; display: block !important; padding-left: 0 !important; }
            .cta a { display: block !important; text-align: center !important; }
            .thumb { width: 72px !important; }
            .thumb img { width: 72px !important; height: 52px !important; }
          }
        `}</style>
      </Head>
      <Preview>{content.preheader}</Preview>
      <Body style={{ margin: 0, padding: 0, background: CANVAS }}>
        {/* the gutter lives on a <td>, never on the 600px table: CSS padding on
            a table adds to its width and would force a horizontal scrollbar */}
        <Section style={{ width: "100%", height: "100%", background: CANVAS }}>
          <Row>
            <Column
              className="gutter"
              align="center"
              valign="top"
              style={{ padding: "32px 20px 40px" }}
            >
              <Container
                className="shell"
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: `${WIDTH}px`,
                  margin: "0 auto",
                  padding: 0,
                }}
              >
                {/* three rows: masthead, body, footer. The middle row absorbs
                    the slack (height:100%), so the footer stays at the bottom
                    however short the content is. */}
                <Row>
                  <Column valign="top">
                    <Link
                      href={url}
                      style={{
                        fontFamily: SERIF,
                        fontSize: "20px",
                        color: INK,
                        textDecoration: "none",
                      }}
                    >
                      find <span style={{ color: BRAND }}>&amp;</span> hire
                    </Link>

                    <Hr style={{ margin: "28px 0 0", borderColor: HAIRLINE }} />
                  </Column>
                </Row>

                <Row>
                  <Column
                    valign="top"
                    style={{ height: "100%", paddingTop: "28px" }}
                  >
                    {content.eyebrow && (
                      <Text
                        style={{
                          margin: "0 0 12px",
                          fontFamily: SANS,
                          fontSize: "11px",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: MUTED,
                        }}
                      >
                        {content.eyebrow}
                      </Text>
                    )}

                    <Heading
                      as="h1"
                      className="display"
                      style={{
                        margin: "0 0 18px",
                        fontFamily: SERIF,
                        fontSize: "28px",
                        lineHeight: "1.2",
                        fontWeight: 500,
                        color: INK,
                      }}
                    >
                      {content.heading}
                    </Heading>

                    {content.blocks.map((block, i) => (
                      <Block key={i} block={block} />
                    ))}
                  </Column>
                </Row>

                <Row>
                  <Column valign="bottom">
                    <Hr
                      style={{ margin: "28px 0 20px", borderColor: HAIRLINE }}
                    />

                    {content.footnote && (
                      <Text style={FOOT_TEXT}>{content.footnote}</Text>
                    )}

                    {!content.internal && (
                      <>
                        {SOCIALS.length > 0 && (
                          <Text style={{ ...FOOT_TEXT, margin: "0 0 12px" }}>
                            {SOCIALS.map((social, i) => (
                              <span key={social.href}>
                                {i > 0 && (
                                  <span style={{ color: DIM }}> · </span>
                                )}
                                <Link href={social.href} style={FOOT_LINK}>
                                  {social.label}
                                </Link>
                              </span>
                            ))}
                          </Text>
                        )}

                        <Text style={{ ...FOOT_TEXT, margin: "0 0 12px" }}>
                          {FOOTER_LINKS.map((link, i) => (
                            <span key={link.href}>
                              {i > 0 && <span style={{ color: DIM }}> · </span>}
                              <Link
                                href={`${url}${link.href}`}
                                style={FOOT_LINK}
                              >
                                {link.label}
                              </Link>
                            </span>
                          ))}
                        </Text>
                      </>
                    )}

                    <Text style={{ ...FOOT_TEXT, margin: "0 0 10px" }}>
                      <strong style={{ color: INK, fontWeight: 500 }}>
                        find &amp; hire
                      </strong>
                      <br />
                      {LEGAL_LINE}
                      <br />
                      {ADDRESS_LINES.map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < ADDRESS_LINES.length - 1 && <br />}
                        </span>
                      ))}
                    </Text>

                    {content.sentTo && (
                      <Text style={{ ...FOOT_TEXT, margin: "0 0 6px" }}>
                        Sent to {content.sentTo}
                        {content.unsubscribeUrl ? (
                          <>
                            {" · "}
                            <Link
                              href={content.unsubscribeUrl}
                              style={FOOT_LINK}
                            >
                              Unsubscribe
                            </Link>
                          </>
                        ) : (
                          " because you contacted us through findandhire.co."
                        )}
                      </Text>
                    )}

                    <Text style={{ ...FOOT_TEXT, margin: 0, color: DIM }}>
                      © {year} find &amp; hire. All rights reserved.
                    </Text>
                  </Column>
                </Row>
              </Container>
            </Column>
          </Row>
        </Section>
      </Body>
    </Html>
  );
}
