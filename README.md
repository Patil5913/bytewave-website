# find & hire

Marketing site and hiring funnel for find & hire (Bytewave, Inc.).
Next.js 16 App Router + Payload CMS 3 on Postgres, styled with Tailwind v4,
animated with GSAP. Run with Bun.

## Documentation

| Document | Audience |
| --- | --- |
| This file | Developers — stack, local setup, scripts, feature overview |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Developers — how it is put together and why |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Whoever deploys and operates it — env vars, migrations, checks, known issues |
| [CMS_GUIDE.md](CMS_GUIDE.md) | Content editors — using the dashboard, no code |

## Stack

| Piece | Notes |
| --- | --- |
| Next.js 16 | App Router. Two route groups: `(frontend)` for the site, `(payload)` for the admin. |
| Payload 3 | Admin at `/ops/admin` (not `/admin`). Collections + globals in `src/collections` / `src/globals`. |
| Postgres | Via `@payloadcms/db-postgres`. `push` is on outside production, so the schema follows the config in dev; production expects a migration. |
| Tailwind v4 | Tokens live in `src/app/globals.css` — `--color-canvas`, `--color-ink`, `--color-brand`. |

## Getting started

```bash
cp .env.example .env          # then fill in PAYLOAD_SECRET at minimum
docker compose up -d          # first run only — creates the bwave-postgres container
bun install
bun dev                       # starts Postgres if stopped, then next dev
```

Site: <http://localhost:3000> · Admin: <http://localhost:3000/ops/admin>

The first account you create at the admin becomes a user; the `role` field
(`admin` / `editor`) controls write access, and `ADMIN_EMAIL_DOMAIN` marks
which email domain is treated as staff.

### Seeding content

The site renders illustrative example data when the database is empty. To load
the bundled real content instead:

```bash
bun run seed        # POST /seed-content, x-seed-secret: $SEED_SECRET
```

`SEED_SECRET` has no default — leave it unset and the endpoint is closed. It
also refuses to run when `NODE_ENV=production`. Re-running is safe: it skips
anything already populated, and reports per-item failures in its `log` rather
than aborting.

### Drafts and preview

Posts have drafts enabled. Saving a draft does not touch the published version;
the public site and `sitemap.xml`/`feed.xml` only ever show published posts.
Use the admin's Preview button (or the live-preview pane) to see draft state —
both route through `/preview/enter`, which sets Next's draft-mode cookie after
checking the CMS session. A banner appears while preview is on.

### Lead intake

The public forms post to `POST /leads`, not to Payload's REST endpoint —
`contacts.create` is staff-only. That route validates and length-caps the
fields, applies a honeypot, derives `source` from the `Referer` (so it cannot
be spoofed), and rate limits per email and per hashed IP over a 10-minute
window.

### Referrals

Refer-and-earn lives in the `Referrals` admin group:

- **Referrers** — one row per person who refers. A code is generated on create
  and the share link is `/r/<code>`. Clicks, total referrals, qualified
  referrals and total rewards are shown on the record.
- **Referrals** — one row per lead attributed to a referrer. New rows are
  `pending`; only `qualified` rows count towards rewards, so a junk lead can be
  rejected without inflating a payout.
- **Referral Settings** — default reward per qualified referral, currency label,
  and how long the attribution cookie lasts. A referrer can override the reward
  on their own record.

Anyone can request a link from the form at `/services#referral`. Opening
`/r/<code>` records the click, sets an attribution cookie, and forwards to the
site; any lead submitted while that cookie is set is attributed. The reward is
snapshotted onto the referral when it is created, so changing the default rate
later does not rewrite what an existing referral was worth. A suspended
referrer's link still redirects but stops attributing.

### Schema and generated files

`src/payload-types.ts` and `src/migrations/` are generated and committed.
Regenerate them with the scripts above after changing a collection or global.

Both scripts go through dev-only routes (`/dev/generate-types`,
`/dev/create-migration`) rather than the Payload CLI, because `payload
generate:types` cannot load this config on Node 22 — it resolves the config
through a CJS bridge and hits `ERR_REQUIRE_CYCLE_MODULE` inside
`@payloadcms/richtext-lexical`. Next loads the same config fine, so the
generators run in-process. Both routes are gated on `SEED_SECRET` and refuse to
run when `NODE_ENV=production`.

Migrations in `src/migrations` are passed to the adapter as `prodMigrations`, so
production applies them on boot. That is what gives production a schema path
now that `push` is dev-only.

### Caching

Reads in `src/lib/content.ts` are cached per collection/global and invalidated
by `afterChange`/`afterDelete` hooks via `src/lib/revalidate.ts`, so a CMS edit
shows up immediately without the site paying a database round-trip per request.
If the database is unreachable, pages fall back to the bundled content in
`src/lib/siteContent.ts` and log loudly — the failure itself is never cached.

## Scripts

| Script | What it does |
| --- | --- |
| `bun dev` | Ensures Postgres is up (`db:up`), then `next dev`. |
| `bun run build` / `bun start` | Production build and serve. |
| `bun run lint` | ESLint CLI — Next 16 removed `next lint`, config is `eslint.config.mjs`. |
| `bun run typecheck` | `tsc --noEmit`. |
| `bun run db:up` / `db:down` | Start/stop the `bwave-postgres` container. |
| `bun run seed` | Seed content through the `/seed-content` route. Needs `SEED_SECRET`. |
| `bun run generate:types` | Regenerate `src/payload-types.ts`. Needs the dev server running. |
| `bun run generate:importmap` | Rebuild the admin import map after changing admin components. |
| `bun run migrate:create` | Write a migration for the current schema into `src/migrations`. Needs the dev server running. |
| `bun run migrate` | Run pending migrations. |

## Environment

See `.env.example` for the annotated list. Only `DATABASE_URI` and
`PAYLOAD_SECRET` are required; the rest degrade quietly, which is worth knowing
when something looks broken:

| Variable | Effect if unset |
| --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | Canonical/OG URLs and the sitemap fall back to `http://localhost:3000`. **Set this in production.** |
| `SMTP_*` | No email transport is configured, so lead notifications and newsletters are never delivered. |
| `LEADS_NOTIFY_EMAIL` | New contact submissions are stored but nobody is notified. |
| `NEXT_PUBLIC_LOGO_DEV_KEY` | Company logo images fail to load. |
| `ADMIN_EMAIL_DOMAIN` | Defaults to `findandhire.co`. |
| `SEED_SECRET` | Defaults to `dev-seed`. |

## Content model

Editable from the admin: **Globals** — Homepage, Site Stats, Site Settings
(tagline, address, nav CTA label, footer link groups, social links, SEO
defaults), Track Record. **Collections** — Posts, Placements, Client Quotes,
Success Videos, Certifications, Contacts (inbound leads), Media, Users.

Every loader in `src/lib/content.ts` falls back to the hardcoded defaults in
`src/lib/siteContent.ts` when a global is blank or the database is unreachable,
and logs the failure to the server console. If the site looks like it is
ignoring your edits, check that log first.

## Routes

`/` · `/companies` · `/professionals` · `/services` · `/legal` · `/insights` ·
`/insights/[topic]` · `/insights/[topic]/[slug]`

`sitemap.xml`, `robots.txt`, and the Open Graph image are generated from
`src/app/sitemap.ts`, `src/app/robots.ts`, and
`src/app/(frontend)/opengraph-image.tsx`.
