# find & hire

Marketing site and hiring funnel for find & hire (Bytewave, Inc.).
Next.js 16 App Router + Payload CMS 3 on Postgres, styled with Tailwind v4,
animated with GSAP. Run with Bun.

## Stack

| Piece | Notes |
| --- | --- |
| Next.js 16 | App Router. Two route groups: `(frontend)` for the site, `(payload)` for the admin. |
| Payload 3 | Admin at `/ops/admin` (not `/admin`). Collections + globals in `src/collections` / `src/globals`. |
| Postgres | Via `@payloadcms/db-postgres` with `push: true`, so schema follows the config in dev. |
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
bun run seed        # POST /seed-content?secret=$SEED_SECRET
```

## Scripts

| Script | What it does |
| --- | --- |
| `bun dev` | Ensures Postgres is up (`db:up`), then `next dev`. |
| `bun run build` / `bun start` | Production build and serve. |
| `bun run lint` | ESLint CLI — Next 16 removed `next lint`, config is `eslint.config.mjs`. |
| `bun run typecheck` | `tsc --noEmit`. |
| `bun run db:up` / `db:down` | Start/stop the `bwave-postgres` container. |
| `bun run seed` | Seed content through the `/seed-content` route. |

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
