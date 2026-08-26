import type { Contact, Referrer } from "@/payload-types";

import type { EmailContent, EmailPost } from "./Shell";

import { renderEmail, serverUrl, type EmailRow } from "./render";
import { unsubscribeUrl } from "./unsubscribe";

export type EmailFooter = EmailContent["footer"];

const RESPONSE_NOTE =
  "We reply to every intake within four hours on business days.";

function displayName(name?: string | null) {
  const first = name?.trim().split(/\s+/)[0];
  return first ? first : "there";
}

/** Internal alert to LEADS_NOTIFY_EMAIL. Staff-facing, links to the record. */
export async function leadNotification(doc: Contact) {
  const rows: EmailRow[] = [
    { label: "Type", value: String(doc.type) },
    { label: "Email", value: doc.email },
  ];
  const optional: [string, unknown][] = [
    ["Name", doc.name],
    ["Company", doc.company],
    ["Headcount", doc.headcount],
    ["Stack", doc.stack],
    ["Role", doc.role],
    ["Experience", doc.experience],
    ["Message", doc.message],
    ["Source", doc.source],
  ];
  for (const [label, value] of optional) {
    if (value) rows.push({ label, value: String(value) });
  }

  return renderEmail({
    subject: `New ${doc.type} lead — ${doc.email}`,
    preheader: `${doc.name ?? doc.email} came in via ${doc.source ?? "the site"}.`,
    eyebrow: "Inbound intake",
    heading: `New ${doc.type} lead.`,
    blocks: [
      { kind: "rows", rows },
      {
        kind: "button",
        label: "Open in the CMS",
        href: `${serverUrl()}/ops/admin/collections/contacts/${doc.id}`,
      },
    ],
    footnote: "Sent automatically when an intake form is submitted.",
    internal: true,
  });
}

/** Autoresponder for talent / enterprise / lead intakes. */
export async function leadConfirmation(doc: Contact, footer?: EmailFooter) {
  const isTalent = doc.type === "talent";
  const summary: EmailRow[] = [];
  if (isTalent) {
    if (doc.role) summary.push({ label: "Role", value: doc.role });
    if (doc.experience)
      summary.push({ label: "Experience", value: doc.experience });
  } else {
    if (doc.company) summary.push({ label: "Company", value: doc.company });
    if (doc.headcount) summary.push({ label: "Roles", value: doc.headcount });
    if (doc.stack) summary.push({ label: "Stack", value: doc.stack });
  }

  return renderEmail({
    subject: "We've got your intake — find & hire",
    preheader: RESPONSE_NOTE,
    eyebrow: "Intake received",
    heading: `Thanks, ${displayName(doc.name)}.`,
    blocks: [
      {
        kind: "text",
        text: isTalent
          ? "Your details are with our verification team. We review every profile by hand, then route you to the companies actively hiring for your exact stack — no cover letters, no application black hole."
          : "Your requirement is with our team. We review every brief by hand, then bring you pre-verified specialists who match the stack and seniority you asked for — not a résumé pile.",
      },
      ...(summary.length ? [{ kind: "rows" as const, rows: summary }] : []),
      { kind: "text", text: RESPONSE_NOTE },
      {
        kind: "button",
        label: isTalent ? "How verification works" : "How hiring works",
        href: `${serverUrl()}${isTalent ? "/professionals" : "/companies"}`,
      },
    ],
    footnote:
      "Reply to this email if anything above looks wrong — it reaches the team handling your intake.",
    sentTo: doc.email,
    footer,
  });
}

/** Newsletter opt-in acknowledgement. */
export async function newsletterConfirmation(
  doc: Contact,
  footer?: EmailFooter,
) {
  return renderEmail({
    subject: "You're subscribed — find & hire",
    preheader: "Hiring signal from both sides of the market, roughly monthly.",
    eyebrow: "Newsletter",
    heading: "You're on the list.",
    blocks: [
      {
        kind: "text",
        text: "You'll get our read on the hiring market — comp bands, time-to-hire, what's actually moving on both sides of the table. Roughly monthly, no filler.",
      },
      {
        kind: "button",
        label: "Read the latest insights",
        href: `${serverUrl()}/insights`,
      },
    ],
    footnote:
      "No sales sequences, no daily digests — one email when we have something worth your time.",
    sentTo: doc.email,
    unsubscribeUrl: unsubscribeUrl(serverUrl(), doc.email),
    footer,
  });
}

/** Sent when a referrer is created, carrying their share link. */
export async function referrerWelcome(doc: Referrer, footer?: EmailFooter) {
  const link = `${serverUrl()}/r/${doc.code}`;
  return renderEmail({
    subject: "Your referral link — find & hire",
    preheader: `Share ${link} and we'll track every lead back to you.`,
    eyebrow: "Refer & earn",
    heading: `Your link is live, ${displayName(doc.name)}.`,
    blocks: [
      {
        kind: "text",
        text: "Share the link below with anyone hiring or looking. Every visit and every intake that comes through it is attributed to you automatically.",
      },
      { kind: "code", label: "Your code", value: String(doc.code ?? "") },
      { kind: "button", label: "Open your link", href: link },
      { kind: "link", label: link, href: link },
      {
        kind: "text",
        text: "Rewards are confirmed once a referred hire is placed. We'll email you when a referral qualifies.",
      },
    ],
    footnote: "Questions about the programme? Reply to this email.",
    sentTo: doc.email,
    footer,
  });
}

/** Payload admin password reset. */
export async function passwordReset(resetUrl: string) {
  return renderEmail({
    subject: "Reset your find & hire password",
    preheader: "This link expires in one hour.",
    eyebrow: "Account security",
    heading: "Reset your password.",
    blocks: [
      {
        kind: "text",
        text: "Use the button below to set a new password for the find & hire CMS. The link expires in one hour and can only be used once.",
      },
      { kind: "button", label: "Set a new password", href: resetUrl },
      { kind: "link", label: resetUrl, href: resetUrl },
    ],
    footnote:
      "If you didn't request this, ignore this email — your password stays unchanged. Never share this link.",
  });
}

export type NewsletterIssue = {
  subject: string;
  preheader: string;
  edition?: string | null;
  heading: string;
  intro: string;
  stats?: { label: string; value: string }[] | null;
  items?:
    | {
        title: string;
        body: string;
        href?: string | null;
        linkLabel?: string | null;
      }[]
    | null;
  cta?: { label?: string | null; href?: string | null } | null;
  signoff?: string | null;
};

/** A newsletter issue, addressed to one subscriber. */
export async function newsletterIssue(
  issue: NewsletterIssue,
  recipient: string,
  footer?: EmailFooter,
) {
  const base = serverUrl();
  const absolute = (href: string) =>
    href.startsWith("http") ? href : `${base}${href}`;

  const blocks: EmailContent["blocks"] = [{ kind: "text", text: issue.intro }];

  if (issue.stats?.length) {
    blocks.push({
      kind: "rows",
      rows: issue.stats.map((stat) => ({
        label: stat.label,
        value: stat.value,
      })),
    });
  }

  for (const item of issue.items ?? []) {
    blocks.push({ kind: "heading", text: item.title });
    blocks.push({ kind: "text", text: item.body });
    if (item.href) {
      blocks.push({
        kind: "link",
        label: item.linkLabel?.trim() || "Read more",
        href: absolute(item.href),
      });
    }
  }

  if (issue.cta?.label && issue.cta?.href) {
    blocks.push({
      kind: "button",
      label: issue.cta.label,
      href: absolute(issue.cta.href),
    });
  }

  if (issue.signoff) blocks.push({ kind: "text", text: issue.signoff });

  return renderEmail({
    subject: issue.subject,
    preheader: issue.preheader,
    eyebrow: issue.edition ?? "The find & hire newsletter",
    heading: issue.heading,
    blocks,
    footnote:
      "You are reading the find & hire newsletter — hiring signal from both sides of the market.",
    sentTo: recipient,
    unsubscribeUrl: unsubscribeUrl(base, recipient),
    footer,
  });
}

/** Shape the announcement needs from a post — a subset of PostView. */
export type AnnouncePost = {
  title: string;
  excerpt?: string | null;
  tag?: string | null;
  cover?: string | null;
  coverAlt?: string | null;
  author?: string | null;
  readTime?: string | null;
  date?: string | null;
  href: string;
};

function toEmailPost(post: AnnouncePost, base: string): EmailPost {
  const absolute = (value?: string | null) =>
    !value ? undefined : value.startsWith("http") ? value : `${base}${value}`;

  return {
    title: post.title,
    href: absolute(post.href) ?? base,
    excerpt: post.excerpt ?? undefined,
    image: absolute(post.cover),
    imageAlt: post.coverAlt ?? post.title,
    tag: post.tag ?? undefined,
    meta: [post.author, post.readTime, post.date].filter(Boolean).join(" · "),
  };
}

/**
 * "New insight published" — hero image, title, excerpt, then a few related
 * reads. Sent to newsletter subscribers, so it carries an unsubscribe link.
 */
export async function postAnnouncement(
  post: AnnouncePost,
  related: AnnouncePost[],
  recipient: string,
  footer?: EmailFooter,
) {
  const base = serverUrl();
  const hero = toEmailPost(post, base);

  const blocks: EmailContent["blocks"] = [
    {
      kind: "text",
      text: "Fresh analysis from inside the network — here is what just went up.",
    },
    { kind: "hero", post: hero },
    { kind: "button", label: "Read the article", href: hero.href },
  ];

  if (related.length) {
    blocks.push({
      kind: "posts",
      label: "More from the archive",
      posts: related.slice(0, 3).map((item) => toEmailPost(item, base)),
    });
  }

  blocks.push({
    kind: "link",
    label: "Browse all insights",
    href: `${base}/insights`,
  });

  return renderEmail({
    subject: `New insight: ${post.title}`,
    preheader:
      post.excerpt?.slice(0, 140) ?? "A new piece is up on find & hire.",
    eyebrow: post.tag ? `New in ${post.tag}` : "New insight",
    heading: "Just published.",
    blocks,
    footnote:
      "You get these because you subscribed to the find & hire newsletter.",
    sentTo: recipient,
    unsubscribeUrl: unsubscribeUrl(base, recipient),
    footer,
  });
}
