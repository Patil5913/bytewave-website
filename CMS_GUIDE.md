# Editing the site

A guide to the content dashboard for whoever keeps the site up to date. No code
required, and nothing here can break the site's design — you are editing text,
numbers and images only.

- **Dashboard:** `https://your-domain/ops/admin` (note: `/ops/admin`, not
  `/admin`)
- Signing in requires an account on the company email domain. Ask whoever set
  the site up to create one for you.

## The two roles

| Role | Can do |
| --- | --- |
| **Editor** | Edit all page content, articles, FAQs, testimonials, legal documents, referral records. |
| **Admin** | Everything an editor can, plus: leads, site settings, referral settings, and creating other accounts. |

If a section described here is missing when you log in, you are an editor and it
is admin-only.

## Finding your way around

The dashboard opens on a card overview grouped by where the content appears on
the site. The same groups are in the left sidebar:

| Group | What lives there |
| --- | --- |
| **Homepage** | Homepage copy, the four headline stats, the placements feed |
| **Companies Page** | Company FAQs, client quotes, certifications |
| **Professionals Page** | Professional FAQs, success videos, track record |
| **Insights** | Blog articles |
| **Referrals** | Referrers, referrals, referral settings |
| **Inbound** | Leads from the site's forms (admin only) |
| **Legal** | Privacy, terms and refunds documents |
| **Global** | Site settings — tagline, address, SEO defaults (admin only) |
| **System** | Uploaded images, user accounts |

Two general rules:

- **Saving publishes immediately** for everything except articles, which have a
  draft option (see [Articles](#articles)).
- **Changes appear on the live site straight away.** Save, then reload the public
  page. There is no separate "publish site" step and no waiting.

## Homepage

**Homepage → Homepage copy** is split into four tabs:

- **Manifesto** — the headline, body text and bullet points in the first section.
- **Agent intro** — the paragraphs in the introduction section.
- **Scroll story** — the panels that animate as the visitor scrolls.
- **Closing CTA** — the headline, body and small note above the email form at the
  bottom.

The big hero at the very top of the homepage is built into the design and is not
editable here — that one needs a developer.

**Homepage → Headline stats** are the four numbers. Each has:

- **Value** — the number only, e.g. `94` or `1.2`
- **Decimals** — how many decimal places to show (`0` for `94`, `1` for `1.2`)
- **Suffix** — what follows the number, e.g. `%`, `d`, `k`, `+`
- **Label** — the caption, e.g. "Placement Success Rate"
- **Note** — the small line underneath

Between one and six stats are allowed; the design is built for four.

**Homepage → Placements** is the scrolling feed of recent placements. Each row
needs a role, tech stack, candidate name, company name, location, pay and status
(Placed / Interviewing / Offer / Negotiating). **Company** must be the company's
web domain, e.g. `stripe.com` — that is what fetches the logo. **Order** controls
position; lower shows first.

> These rows are public. Use only what you have permission to publish, and
> abbreviate candidate names if in doubt.

## Companies and Professionals pages

**FAQs** (one list per page) — question, answer, and an order number. Lower shows
first.

**Client quotes** — the testimonial marquee on the companies page. Name, job
title, company, company domain (for the logo), and the quote. **Row** picks which
of the two scrolling rows it joins.

**Success videos** — the same idea on the professionals page. The thumbnail is
optional; without one the card shows the name and role on a plain background.
16:9 works best if you do add one.

**Certifications** — the compliance credentials. `Logo name` is the logo.dev
identifier, e.g. `iso`, `gdpr`, `e-verify`.

**Track record** — the headline numbers above the chart, plus one row per year
for the chart itself. Enter the years in order.

## Articles

**Insights → Articles.** Each article needs:

- **Published at** — a real date. This controls the order articles appear in and
  the date search engines see. Set it.
- **Display date** — the date as readers see it, e.g. "October 12, 2026". Leave
  it blank and it is filled in from *Published at* automatically.
- **Title**, **Tag** (the topic, which becomes part of the web address),
  **Read time** and **Excerpt**.
- **Cover image** — optional, 16:9, also used as the social preview. Articles
  without one render with a plain block where the image would go.
- **Author** details, including an optional headshot.
- **Content** — the body.
- **FAQs** — optional. If the body contains a "Frequently asked questions"
  heading, these render there as an accordion.

The **Article ID** is generated automatically and forms part of the web address.
It cannot be edited, and changing an article's title later will not break links.

### Writing the body

The content editor accepts markdown shortcuts as you type, so you can work
naturally:

| Type this | Get |
| --- | --- |
| `## Heading` | A section heading |
| `**bold**` | **bold** |
| `- item` | A bulleted list |
| `1. item` | A numbered list |
| `> quote` | A pull quote |
| ` ```code ` | A code block |

You can also paste markdown from elsewhere and it converts. The toolbar covers
the same ground if you prefer clicking, and adds tables, checklists and a brand
highlight colour.

### Draft, preview and publish

Articles are the one thing with a draft state:

- **Save draft** — stores your work without putting it on the site. Drafts are
  invisible to the public: not on `/insights`, not in the site map, not in the
  RSS feed.
- **Preview** — opens the article as it will look, including unpublished changes.
  A banner across the top reminds you that you are in preview; click *Exit
  preview* to leave.
- **Publish** — makes it live.

Editing an already-published article and saving a draft does **not** change what
the public sees. The published version stays up until you publish again.

To take an article down, set its status back to draft.

## Images

**System → Media** holds every uploaded image. Uploading from within an article
adds it here automatically.

- **Alt text is required.** Describe the image in a few words — it is read aloud
  by screen readers and used by search engines. On an article cover it is used
  automatically.
- Maximum 8 MB. JPEG, PNG, WebP, AVIF and GIF only; SVG is blocked for security
  reasons.
- Deleting an image that is still used somewhere will leave a gap on the page
  rather than breaking it, but check before deleting.

## Leads (admin only)

**Inbound → Contacts** is every submission from the site's forms — the intake
form, the homepage call-to-action and the footer newsletter signup.

Each record shows the type (professional, company, lead, newsletter), the
contact details, the message, and **Source**, which records which form and page
it came from. Source is recorded automatically and cannot be edited.

If lead notification email is configured, each new submission is also emailed
out. If you are not receiving them, the email settings need checking — the leads
are still saved here regardless.

## Referrals (refer and earn)

Three parts, all under **Referrals**.

**Referral settings** (admin only) sets the programme's terms:

- **Default reward** — what one qualified referral is worth.
- **Currency** — a label only, e.g. `USD`. No payments are processed by the site.
- **Cookie days** — how long after someone clicks a referral link their signup
  still counts. Default 30.
- **Terms** — optional text shown under the sign-up form on the site.

**Referrers** are the people doing the referring. Anyone can sign up themselves
from the *Refer & Earn* section of the services page, which creates a record here
and hands them their link. You can also add someone manually.

Each referrer record shows:

- **Code** and their share link, which is `your-domain/r/CODE`
- **Clicks** — how many times the link has been opened
- **Total referrals**, **Qualified referrals**, **Total rewards** — calculated
  automatically; you cannot type into these
- **Reward override** — pay this person a different amount per referral. Leave
  blank to use the default.
- **Status** — set to *Suspended* to stop a link crediting new referrals. The
  link still works, it just stops attributing.

**Referrals** is one record per lead that came in through a link. New ones start
as **Pending**. You decide:

- **Qualified** — it counts, and the reward is added to that referrer's total.
- **Rejected** — it does not count. Use this for spam or duplicates.

The reward amount is fixed when the referral is created, so changing the default
reward later will not alter referrals already recorded. Tick **Paid out** once
you have actually paid it — the site only tracks this, it does not pay anyone.

## Site settings (admin only)

**Global → Site settings**:

- **Tagline**, **Legal line**, **Address**, **Region** — footer content.
- **Nav CTA label** — the text on the button in the top navigation.
- **Footer link groups** — the footer columns. Links must be site-relative and
  start with `/`, e.g. `/services#pricing`. These also feed the site map given to
  search engines, so only link to pages that exist — the field will reject
  anything that is not a `/` path.
- **Social links** — shown in the footer. Must be full addresses starting with
  `https://`. The row is hidden entirely while this is empty.
- **SEO** — the default page title, description, keywords and social sharing
  image, used on any page that does not set its own. Leaving a field blank falls
  back to a sensible built-in default rather than publishing something empty.

## Legal documents

**Legal → Legal page** holds the privacy, terms and refunds documents, each split
into numbered clauses. One warning: each document has an **ID** (`privacy`,
`terms`, `refunds`) used by the footer links. Renaming an ID breaks the matching
footer link, so if you change one, update the footer link too.

## Accounts (admin only)

**System → Users.** New accounts must use the company email domain. Each account
is either an admin or an editor — see [the two roles](#the-two-roles).

Two safeguards: you cannot delete your own account, and the last remaining admin
cannot be deleted. After five failed sign-in attempts an account is locked for
ten minutes.

## If something looks wrong

- **An edit is not showing.** Hard-reload the page (Ctrl/Cmd + Shift + R). If it
  still does not show, tell your developer — cache invalidation may not be
  reaching the site.
- **The site shows unfamiliar placements or stats,** with names like "Candidate
  A" and "Fintech Platform". That is the built-in placeholder content, which
  appears when the site cannot reach its database. The site is up but not showing
  real data — this one needs a developer promptly.
- **An article will not save.** Every required field must be filled, including
  the content body. The error names the field.
- **A logo is missing** next to a company. Check the domain is spelled correctly
  and has no `https://` or trailing slash — just `stripe.com`.
