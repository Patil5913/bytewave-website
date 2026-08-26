# Architecture

For whoever maintains this code next. Setup and day-to-day commands are in
[README.md](README.md); deploying is in [DEPLOYMENT.md](DEPLOYMENT.md); the
editor-facing guide is [CMS_GUIDE.md](CMS_GUIDE.md).

Stack: Next.js 16 (App Router) + Payload CMS 3.86 on Postgres, Tailwind v4,
GSAP. Runtime is Bun.

> The source has no explanatory comments — they were stripped at the client's
> request. This document carries the reasoning that would otherwise live inline,
> so keep it current when you change the pieces described here.

## Directory map

```
src/
  payload.config.ts      Payload config: collections, globals, admin, db, email
  payload-types.ts       GENERATED — do not hand-edit (see “Generated files”)
  migrations/            GENERATED — schema migrations, committed
  access/roles.ts        Role helpers: isAdmin, isStaff, isAdminField
  collections/           One file per collection
  globals/               One file per global (singletons)
  lib/                   Server-side data layer + shared helpers
  components/            React components; components/admin/* are Payload UI
  app/
    (frontend)/          The public site + public API routes
    (payload)/           Admin UI (/ops/admin) + Payload REST at /api/*
```

Two route groups matter: `(payload)` owns everything under `/api/*` via a
catch-all, so **any new public endpoint must live outside `/api`**. That is why
lead intake is `POST /leads` and not `/api/leads`.

## Data layer

`src/lib/content.ts` is the only module that reads from the database for the
public site. Everything else imports from it. It is `server-only`.

Each reader is wrapped by a local `cachedRead` helper that applies two caches:

- `unstable_cache` — persists across requests, tagged per collection/global.
- React `cache` — collapses repeat calls inside a single render. The insights
  pages read posts three times per request; this makes that one query.

Two rules that are easy to break:

1. **The read function must throw on failure.** `cachedRead` catches outside the
   cache and returns the bundled fallback. If a reader swallowed its own error
   and returned the fallback from inside, one transient outage would pin
   bundled content in place for the whole revalidate window.
2. **An empty result is not a failure.** Readers return their fallback from
   *inside* the cached function when the table is empty. That is a legitimate
   state, and the next write invalidates the tag anyway.

### Fallbacks

`src/lib/insights.ts` deliberately ships **no** articles — `ALL_POSTS` is empty,
so editorial exists only in the CMS and an empty `posts` table renders an empty
state rather than placeholder journalism. Everything else still has a bundled
fallback.

If the database is unreachable, every page still renders using the bundled
content in `src/lib/siteContent.ts`, and the failure
is logged loudly through `payload.logger`. This is deliberate — the marketing
site staying up matters more than it being current — but it means **a broken
database looks like a working site**. The log line is the only signal, so
whatever you use for alerting should watch for `[content] … read failed`.

`siteContent.ts` is also the seed source, so it serves double duty: fixtures for
`/seed-content` and runtime fallback. `/seed-content` no longer seeds posts,
since there is nothing bundled to seed.

## Caching and revalidation

`src/lib/revalidate.ts` owns both halves so they cannot drift: readers tag
entries with `tagFor(slug)`, and collection/global hooks invalidate the same
string. There is also an umbrella `content:all` tag.

Three constraints, each of which caused a real bug during development:

- **Hooks must be assigned to `hooks`, not spread into the config.**
  `hooks: revalidateHooks("placements")` — spreading `...revalidateHooks(...)`
  at the top level of a collection config puts `afterChange` where Payload never
  looks, and nothing invalidates. It fails silently.
- **`revalidateTag` needs `{ expire: 0 }`.** The second argument is required in
  Next 16, but a named profile like `"max"` only *schedules* staleness, so an
  editor keeps seeing old content. `updateTag` would also work but throws when
  called from a route handler — which is exactly where Payload's hooks run.
- **`revalidateTag` throws when there is no work store** (Payload `onInit`,
  jobs, CLI). `safeRevalidate` swallows that; the `revalidate` seconds ceiling on
  each cache entry is the backstop.

`revalidate.ts` imports `next/cache` dynamically. `payload.config.ts` pulls it in
through the collections, and the config must stay loadable outside a Next
runtime.

Posts guard their hook on `_status`, so autosaved drafts do not flush the public
cache — checking `previousDoc` too, otherwise unpublishing would not invalidate.

### Why not `use cache`

Next 16 marks `unstable_cache` legacy in favour of `use cache`, which needs
`cacheComponents: true`. That flag surfaces every uncached and runtime read
app-wide as an error and would mean reworking Suspense boundaries and
`generateMetadata` across the whole frontend. If you migrate later, the tag
names and hook wiring carry over unchanged.

## Drafts and preview

Drafts are enabled on `posts` only. Four things are load-bearing:

1. **`payload.find` does not filter `_status`.** The public reader passes
   `where: { _status: { equals: "published" } }` explicitly. Without it, every
   unpublished edit goes live.
2. **`access.read` returns a query, not `true`.** `read: ({ req: { user } }) =>
   user ? true : { _status: { equals: "published" } }`. With a blanket `true`,
   anyone could fetch drafts via `GET /api/posts?draft=true` — access control
   runs *before* the draft branch, so it does not protect drafts by itself.
3. **`payload.create` defaults to draft.** The seed route passes
   `_status: "published"` explicitly, or every seeded post is invisible.
4. **Rows created before drafts existed have `_status = NULL`.** The seed route
   backfills them; without it a `published` filter hides the entire archive.

`getPosts()` branches on `draftMode()`: cached and published-only for the public,
uncached with `draft: true` for preview. `draftMode()` cannot be called from
`generateStaticParams`, so that and `sitemap.ts`/`feed.xml` call
`getPublishedPosts()` directly. This is a hard requirement, not a style choice.

Autosave is deliberately **off**. With it on, Payload writes a draft row the
moment the create form opens, so abandoning the form leaves an empty untitled
post in the database.

`/preview/enter` authorises via `payload.auth()` (the admin iframe carries the
session cookie), with `PREVIEW_SECRET` as a fallback for out-of-band links. It
allowlists the redirect path — otherwise it is an open redirect that also hands
out a draft cookie. `/preview/exit` is POST-only, because a prefetched `<Link>`
would silently drop editors out of preview.

## Lead intake

Public forms post to `POST /leads`. `contacts.create` is **staff-only**, so this
route is the only way in and its rules cannot be bypassed.

It enforces: body size cap before parsing, `type` against an allowlist, email
format, per-field length caps, a honeypot (returns `200` and writes nothing, so
a bot learns nothing), a minimum fill time, and newsletter de-duplication.

`source` is derived server-side from the `Referer`, never trusted from the
client — it lands verbatim in a notification email. The `admin.readOnly` flag on
that field is UI-only and enforces nothing.

Rate limiting counts rows in Postgres rather than in process memory, keyed on
both email and a hashed IP, so it survives restarts and multiple instances. The
IP is stored only as `sha256(ip + PAYLOAD_SECRET)` in an indexed `ipHash` field —
a pseudonymous identifier, not PII. Callers with no usable IP header share one
stricter budget, so a missing header is not a way out of the limit.

`x-forwarded-for` spoofing resistance depends on the host's trusted-proxy
behaviour. If you deploy behind something other than Vercel, verify which hop to
trust; the per-email limit is the backstop that does not rely on it.

Middleware was rejected on purpose: Next 16 renamed `middleware.ts` to
`proxy.ts`, which may run on a CDN, warns against module globals, and no longer
exposes `NextRequest.ip`.

## Referrals

Three pieces: `referrers` (a person, an auto-generated code, click count,
optional reward override), `referrals` (one row per attributed lead, with a
status), and the `referral-settings` global (default reward, currency label,
cookie window).

Flow: `/r/<code>` records the click, sets an httpOnly attribution cookie, and
redirects to an allowlisted landing path. An unknown or suspended code still
redirects — a dead link should look like an ordinary visit rather than advertise
which codes exist. When a lead is later submitted, `/leads` reads the cookie and
creates a `pending` referral.

The reward is **snapshotted onto the referral at creation**, so changing the
default rate later does not rewrite what an existing referral was worth. Only
`qualified` rows count towards totals, which means a spam lead can be rejected
without inflating a payout. Referral failures never fail the lead — the visitor
filled in a form and that submission is already saved.

Totals on a referrer (`totalReferrals`, `qualifiedReferrals`, `totalRewards`) are
`virtual: true` fields computed in an `afterRead` hook. They are always correct
rather than denormalised counters that can drift. `clicks` *is* a stored counter,
because an exact click count is not worth a row per click.

## Outbound email

Templates live in `src/lib/email/`. `render.ts` holds one shell —
600px table layout, inline styles, brand wordmark, hidden preheader — and every
template returns `{ subject, html, text }`. The plaintext half is generated from
the same block list rather than written twice, so the two never drift; sending
HTML alone materially hurts deliverability.

`templates.ts` owns the copy for the five messages we send:

| Template | Trigger | Recipient |
| --- | --- | --- |
| `leadNotification` | `contacts` create | `LEADS_NOTIFY_EMAIL` (internal), links to the record in the CMS |
| `leadConfirmation` | `contacts` create, non-newsletter | the submitter |
| `newsletterConfirmation` | `contacts` create, `type: newsletter` | the subscriber |
| `referrerWelcome` | `referrers` create | the referrer, carrying their `/r/<code>` link |
| `newsletterIssue` | `POST /newsletter/send` | every newsletter subscriber, addressed individually |
| `postAnnouncement` | `POST /newsletter/announce` | subscribers — hero image, excerpt, three related reads |
| `passwordReset` | Payload forgot-password | the admin user |

Every non-internal template renders a compliance footer: social links, Privacy /
Terms / Insights links, the trading name, the postal address, and a `Sent to
<address>` line. Marketing mail (the newsletter) additionally carries an
unsubscribe link and `List-Unsubscribe` / `List-Unsubscribe-Post` headers, which
Gmail and Yahoo require on bulk mail. Transactional mail deliberately does not —
an unsubscribe link on a password reset is a support ticket waiting to happen.

Footer identity is read from the `site-settings` global via `emailFooter()`, so
editing the address or social links in the admin changes emails without a
deploy; `SITE_SETTINGS` is the fallback.

Issues are composed in the `newsletters` collection (subject, preheader, edition
eyebrow, intro, an optional stat strip, item list, CTA, sign-off). **Saving never
sends.** `POST /newsletter/send` with `x-newsletter-secret` does, guarded by
`NEWSLETTER_SEND_SECRET`; passing `{ "test": "you@example.com" }` sends a single
copy without stamping the row. Sends run in batches of 20, each copy addressed to
one subscriber so the unsubscribe link and `List-Unsubscribe` header are
per-recipient, and an issue already marked `sent` is refused with a 409. This is
a route rather than a collection hook on purpose: saving a draft must not be able
to mail the list.

`POST /newsletter/announce` mails a published post: hero cover image, tag, title,
excerpt, byline, a "read the article" button, then the three next-newest
published posts as thumbnail rows. It refuses a draft, and stamps `posts.announcedAt`
so the same piece cannot be announced twice. Both send routes take
`{ "test": "you@example.com" }` for a single copy that skips the stamp.

`GET /unsubscribe?e=&t=` verifies an HMAC of the address (keyed with
`PAYLOAD_SECRET`), so a link needs no database lookup and cannot be edited into
someone else's address. It deletes the matching `newsletter` rows and always
renders the same wording, subscribed or not — the page must not confirm whether
an address is on the list.

All sends are wrapped and logged on failure: a bounced acknowledgement must never
fail a submission that is already saved. With `SMTP_HOST` unset there is no
adapter at all, so everything falls through to Payload's console transport.

## Access control

`src/access/roles.ts` defines two roles. `admin` gets everything; `editor` gets
content only.

| Collection / global | read | create | update | delete |
| --- | --- | --- | --- | --- |
| Content (posts, placements, quotes, videos, certifications, FAQs, media) | public | staff | staff | staff |
| `posts` | public sees published only | staff | staff | staff |
| `contacts` (leads) | admin | staff¹ | admin | admin |
| `referrers`, `referrals` | staff | staff | staff | admin |
| `users` | admin, or self | admin² | admin, or self | admin |
| Globals | public | — | staff³ | — |

¹ Public submissions go through `POST /leads`, which uses the Local API.
² Except the very first account, which may be created unauthenticated to
bootstrap the system and is forced to `admin`.
³ Except `site-settings` and `referral-settings`, which are admin-only.

Signup is restricted to `ADMIN_EMAIL_DOMAIN`. A user cannot delete their own
account, and the last remaining admin cannot be deleted.

## Generated files

Three things are generated and **committed**: `src/payload-types.ts`,
`src/migrations/`, and `src/app/(payload)/ops/admin/importMap.js`.

`payload-types.ts` matters more than it looks: it declares Payload's
`GeneratedTypes` augmentation, which is what makes `payload.find()` return typed
documents. Without it the data layer degrades to `Record<string, unknown>` casts.
Regenerate it after changing any collection or global:

```bash
bun run generate:types     # dev server must be running
bun run migrate:create     # then, if the schema changed
```

Both go through dev-only routes (`/dev/generate-types`, `/dev/create-migration`)
instead of the Payload CLI. **This is a workaround, not a preference.** On
Node 22 the CLI resolves the config through a CJS bridge and dies with
`ERR_REQUIRE_CYCLE_MODULE` / `ERR_REQUIRE_ASYNC_MODULE` inside
`@payloadcms/richtext-lexical`, which is an ESM graph with a top-level await.
Next loads the same config without trouble, so the generators run in-process.
Both routes are gated on `SEED_SECRET` and return 404 when
`NODE_ENV=production`.

Consequences worth knowing:

- `bun run generate:importmap` and `bun run migrate` still call the CLI and will
  fail on Node 22. The import map only needs regenerating when you add or rename
  an **admin** component (`src/components/admin/*`), which is rare; the committed
  file is current and small enough to edit by hand. Migrations are applied via
  `prodMigrations` (see DEPLOYMENT.md) rather than the `migrate` command.
- If a future Node or Payload release fixes the loader issue, the dev routes and
  their scripts can be deleted and the plain CLI commands restored.

## Conventions

- Public endpoints live outside `/api` (owned by Payload's catch-all).
- Anything that reads the database goes through `src/lib/content.ts`.
- A new collection needs: the collection file, registration in
  `payload.config.ts`, `hooks: revalidateHooks("<slug>")` if the public site
  reads it, a reader in `content.ts`, and a regenerated types file + migration.
- `src/lib/routeGuards.ts` holds the shared secret comparison and error shape;
  routes return Payload's `{ errors: [{ message }] }` so client error handling is
  uniform.
- Lint keeps `no-explicit-any` as a warning. The remaining ones are concentrated
  in `src/lib/richtext.tsx` and `src/lib/lexical.ts`, which walk untyped Lexical
  editor JSON where `any` is the honest annotation.
