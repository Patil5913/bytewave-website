/**
 * Renders every email template to .email-preview/ so they can be opened in a
 * browser. Fixture data only — never touches the database.
 *
 *   bun run email:preview
 */
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import type { Contact, Referrer } from "../src/payload-types";
import {
  leadConfirmation,
  leadNotification,
  newsletterConfirmation,
  newsletterIssue,
  passwordReset,
  postAnnouncement,
  referrerWelcome,
} from "../src/lib/email/templates";

const OUT = join(process.cwd(), ".email-preview");

const enterprise = {
  id: 128,
  type: "enterprise",
  email: "jane.doe@acme.com",
  name: "Jane Doe",
  company: "Acme Robotics",
  headcount: "3 roles",
  stack: "Go / Kubernetes / Postgres",
  message:
    "Scaling the platform team this quarter — two senior backend and one SRE, ideally EU timezones.",
  source: "contact-terminal:/companies",
} as unknown as Contact;

const talent = {
  id: 129,
  type: "talent",
  email: "sam.okafor@example.com",
  name: "Sam Okafor",
  role: "Staff Frontend Engineer",
  experience: "9 years",
  message: "Open to remote-first teams, React and design systems focus.",
  source: "contact-terminal:/professionals",
} as unknown as Contact;

const newsletter = {
  id: 130,
  type: "newsletter",
  email: "reader@example.com",
  source: "footer:/insights",
} as unknown as Contact;

const referrer = {
  id: 7,
  name: "Marta Delgado",
  email: "marta@example.com",
  code: "AB23CD45",
  status: "active",
} as unknown as Referrer;

/** Placeholder identity: SITE_SETTINGS.socials ships empty, so the preview
 *  passes a set to show what the row looks like once real handles are added. */
const footer = {
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/findandhire" },
    { label: "X", href: "https://x.com/findandhire" },
  ],
};

const issue = {
  subject: "Comp bands moved again — March signal",
  preheader: "Median senior backend base is up 4.2% since December.",
  edition: "Issue 04 · March 2026",
  heading: "The market moved. Here is where.",
  intro:
    "Three things worth your attention this month: senior backend comp climbed again, time-to-hire compressed on verified pipelines, and design roles finally stopped shrinking.",
  stats: [
    { label: "Median senior backend", value: "$186k base" },
    { label: "Time-to-hire, verified", value: "14 days" },
    { label: "Offer acceptance", value: "89%" },
  ],
  items: [
    {
      title: "Senior backend comp is up 4.2% since December",
      body: "The floor moved more than the ceiling. Offers under $170k are now taking twice as long to close, and candidates are citing published bands in first calls rather than at offer stage.",
      href: "/insights",
      linkLabel: "Read the breakdown",
    },
    {
      title: "Verified pipelines closed in 14 days",
      body: "Across placements last month, roles sourced from pre-verified candidates closed in 14 days against a market median of 41. The gap is almost entirely screening time.",
      href: "/companies",
      linkLabel: "How verification works",
    },
    {
      title: "Design hiring stabilised",
      body: "After four quarters of contraction, product design openings grew for the first time — concentrated in Series B and later, and heavily weighted towards systems experience.",
    },
  ],
  cta: { label: "Browse open roles", href: "/professionals" },
  signoff:
    "Reply to this email if you want the underlying dataset — happy to share.",
};

const announced = {
  title: "The changing baseline for senior DevOps compensation in Q4.",
  excerpt:
    "Median base for senior platform roles moved 4.2% since December, and the floor moved more than the ceiling. Here is what that means for offers you are about to make.",
  tag: "Market Analysis",
  cover:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=70",
  coverAlt: "Network of city lights seen from orbit",
  author: "R. Fischer",
  readTime: "6 min read",
  date: "October 12, 2026",
  href: "/insights/market-analysis/a1b2c3d",
};

const relatedPosts = [
  {
    title:
      "Why traditional HR screening fails at identifying engineering talent.",
    tag: "Operations",
    readTime: "5 min read",
    cover:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=70",
    href: "/insights/operations/b2c3d4e",
  },
  {
    title: "Structuring your data science team for early-stage scaling.",
    tag: "Infrastructure",
    readTime: "7 min read",
    cover:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=70",
    href: "/insights/infrastructure/c3d4e5f",
  },
  {
    title: "How to file your E-3 visa in one business day.",
    tag: "Immigration",
    readTime: "4 min read",
    cover:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=70",
    href: "/insights/immigration/d4e5f6a",
  },
];

const CASES = await Promise.all(
  (
    [
      ["lead-notification-internal", leadNotification(enterprise)],
      ["lead-confirmation-enterprise", leadConfirmation(enterprise, footer)],
      ["lead-confirmation-talent", leadConfirmation(talent, footer)],
      ["newsletter-confirmation", newsletterConfirmation(newsletter, footer)],
      ["referrer-welcome", referrerWelcome(referrer, footer)],
      [
        "post-announcement",
        postAnnouncement(announced, relatedPosts, "reader@example.com", footer),
      ],
      [
        "newsletter-issue",
        newsletterIssue(issue, "reader@example.com", footer),
      ],
      [
        "password-reset",
        passwordReset("https://findandhire.co/ops/admin/reset/EXAMPLE-TOKEN"),
      ],
    ] as const
  ).map(async ([name, mail]) => [name, await mail] as const),
);

mkdirSync(OUT, { recursive: true });

for (const [name, mail] of CASES) {
  writeFileSync(join(OUT, `${name}.html`), mail.html);
  writeFileSync(
    join(OUT, `${name}.txt`),
    `Subject: ${mail.subject}\n\n${mail.text}`,
  );
}

const LABELS: Record<string, string> = {
  "lead-notification-internal": "Lead alert (internal)",
  "lead-confirmation-enterprise": "Intake confirmation — company",
  "lead-confirmation-talent": "Intake confirmation — professional",
  "newsletter-confirmation": "Newsletter confirmation",
  "newsletter-issue": "Newsletter issue (campaign)",
  "post-announcement": "New insight published",
  "referrer-welcome": "Referrer welcome",
  "password-reset": "Password reset",
};

/** One page per email, so each is reviewed on its own at a real client width. */
function page(index: number) {
  const [name, mail] = CASES[index];
  const prev = CASES[(index - 1 + CASES.length) % CASES.length][0];
  const next = CASES[(index + 1) % CASES.length][0];

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${LABELS[name] ?? name} — email preview</title>
<style>
  :root { color-scheme: dark }
  * { box-sizing: border-box }
  body { margin:0; background:#141414; color:#f7f6f3;
         font:14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif }
  header { position:sticky; top:0; z-index:2; display:flex; flex-wrap:wrap; gap:16px;
           align-items:center; justify-content:space-between;
           padding:16px 24px; background:#0a0a0a; border-bottom:1px solid rgba(247,246,243,.12) }
  h1 { margin:0; font:500 17px/1.2 Georgia,serif }
  .meta { font-size:12px; color:rgba(247,246,243,.5) }
  .controls { display:flex; gap:8px; align-items:center; flex-wrap:wrap }
  button, .link { appearance:none; border:1px solid rgba(247,246,243,.18); background:transparent;
           color:#f7f6f3; font:inherit; font-size:12px; padding:6px 12px; cursor:pointer;
           text-decoration:none; border-radius:2px }
  button[aria-pressed="true"] { background:#f7f6f3; color:#0a0a0a; border-color:#f7f6f3 }
  nav { display:flex; gap:8px }
  main { display:flex; justify-content:center; padding:28px 16px 56px }
  .device { width:100%; max-width:600px; transition:max-width .2s ease }
  .device[data-w="mobile"] { max-width:375px }
  .device[data-w="tablet"] { max-width:480px }
  .caption { margin:0 0 8px; font-size:11px; letter-spacing:.12em; text-transform:uppercase;
             color:rgba(247,246,243,.4) }
  iframe { width:100%; height:min(1100px, calc(100vh - 190px)); border:1px solid rgba(247,246,243,.12); background:#0a0a0a; display:block }
  pre { white-space:pre-wrap; margin:20px 0 0; padding:16px; font-size:12px; line-height:1.6;
        color:rgba(247,246,243,.55); border:1px solid rgba(247,246,243,.12) }
  details summary { cursor:pointer; font-size:12px; color:rgba(247,246,243,.5); padding:6px 0 }
</style></head>
<body>
<header>
  <div>
    <h1>${LABELS[name] ?? name}</h1>
    <div class="meta">Subject: ${mail.subject}</div>
  </div>
  <div class="controls">
    <button data-w="mobile" aria-pressed="false">375 · phone</button>
    <button data-w="tablet" aria-pressed="false">480 · narrow</button>
    <button data-w="desktop" aria-pressed="true">600 · desktop</button>
    <nav>
      <a class="link" href="./${prev}.html">‹ prev</a>
      <a class="link" href="./${next}.html">next ›</a>
      <a class="link" href="./index.html">all</a>
    </nav>
  </div>
</header>
<main>
  <div>
    <p class="caption" id="caption">600px — Gmail / Outlook reading pane</p>
    <div class="device" id="device" data-w="desktop">
      <iframe src="./${name}.body.html" title="${name}"></iframe>
    </div>
    <details><summary>Plaintext part</summary><pre>${mail.text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")}</pre></details>
  </div>
</main>
<script>
  const device = document.getElementById("device");
  const caption = document.getElementById("caption");
  const copy = {
    mobile: "375px — iPhone Mail / Gmail app",
    tablet: "480px — narrow window, media query active",
    desktop: "600px — Gmail / Outlook reading pane",
  };
  document.querySelectorAll("button[data-w]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const w = btn.dataset.w;
      device.dataset.w = w;
      caption.textContent = copy[w];
      document.querySelectorAll("button[data-w]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn)),
      );
    });
  });
</script>
</body></html>`;
}

CASES.forEach(([name], i) => {
  // the raw email, framed by the viewer above
  writeFileSync(join(OUT, `${name}.body.html`), CASES[i][1].html);
  writeFileSync(join(OUT, `${name}.html`), page(i));
});

const index = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><title>find &amp; hire — email previews</title>
<style>
  body { margin:0; background:#0a0a0a; color:#f7f6f3;
         font:14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif }
  header { padding:28px 28px 20px }
  h1 { margin:0 0 6px; font:500 22px/1.2 Georgia,serif }
  p { margin:0; color:rgba(247,246,243,.5); font-size:13px }
  ul { list-style:none; margin:0; padding:8px 28px 48px; max-width:640px }
  li { border-top:1px solid rgba(247,246,243,.12) }
  a { display:flex; justify-content:space-between; gap:16px; padding:16px 0;
      color:#f7f6f3; text-decoration:none }
  a:hover { color:#2191fb }
  span { color:rgba(247,246,243,.45); font-size:12px; text-align:right }
</style></head>
<body>
<header>
  <h1>find <span style="color:#2191fb">&amp;</span> hire — email previews</h1>
  <p>One at a time. Each page has phone / narrow / desktop widths and the plaintext part.</p>
</header>
<ul>
${CASES.map(
  ([name, mail]) =>
    `  <li><a href="./${name}.html">${
      LABELS[name] ?? name
    }<span>${mail.subject}</span></a></li>`,
).join("\n")}
</ul>
</body></html>`;

writeFileSync(join(OUT, "index.html"), index);

console.log(`Wrote ${CASES.length} previews to ${OUT}`);
console.log(`Open: ${join(OUT, "index.html")}`);
