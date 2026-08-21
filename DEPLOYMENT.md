# Deployment

Taking this site to production. Local setup is in [README.md](README.md); the
design behind these pieces is in [ARCHITECTURE.md](ARCHITECTURE.md).

## Requirements

- **Node 22+** (or Bun). Build and run with `bun run build` / `bun run start`.
- **Postgres 16.** The app applies its own schema migrations on boot.
- **Persistent disk for uploads** — or an S3 adapter. See
  [Uploads](#uploads--read-this-before-launch), which is the one piece that needs
  a decision before go-live.

## Environment variables

Copy `.env.example` and fill it in. Only the first two are strictly required;
the rest degrade quietly, which is exactly why they are easy to forget.

| Variable | Required | Effect if unset |
| --- | --- | --- |
| `DATABASE_URI` | **Yes** | App refuses to boot. |
| `PAYLOAD_SECRET` | **Yes** | App refuses to boot. Signs auth tokens — generate with `openssl rand -hex 32`. |
| `NEXT_PUBLIC_SERVER_URL` | Effectively yes | Falls back to `http://localhost:3000`, which breaks every canonical URL, `sitemap.xml`, `robots.txt` and social preview image. Set it to the public origin, no trailing slash. |
| `ADMIN_EMAIL_DOMAIN` | Recommended | Defaults to `findandhire.co`. This is the only gate on admin signup, so a wrong value here means the wrong domain can register. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Recommended | No email is sent. Payload logs to the console instead, so **lead notifications are silently never delivered**. |
| `LEADS_NOTIFY_EMAIL` | Recommended | Nobody is emailed when a lead arrives. Leads are still saved and visible in the admin. |
| `NEXT_PUBLIC_LOGO_DEV_KEY` | Optional | Company logos on the placement feed, testimonials and certifications 404. Publishable token, safe to expose. |
| `PREVIEW_SECRET` | Optional | Draft preview still works for signed-in editors; only out-of-band preview links stop working. |
| `SEED_SECRET` | No | Leave **unset in production**. It closes `/seed-content` and the dev generator routes. |

Two secrets to rotate before handover if they have ever been shared:
`PAYLOAD_SECRET` (rotating it invalidates all admin sessions, which is fine) and
`SEED_SECRET`.

## Database and schema

`push` is enabled outside production only. In production the schema comes from
the migrations in `src/migrations/`, which are passed to the adapter as
`prodMigrations` and **applied automatically on boot**. There is no manual
migration step in a normal deploy.

That has one implication for deploy ordering: the first boot of a new release
runs any new migrations, so avoid running several instances against an empty
database simultaneously on a first-ever deploy.

`bun run migrate` exists but calls the Payload CLI, which currently fails on
Node 22 (see [ARCHITECTURE.md](ARCHITECTURE.md#generated-files)). You should not
need it — boot handles it.

When a developer changes a collection or global, they must commit a regenerated
`src/payload-types.ts` and a new migration. If they forget the migration,
production will boot against an older schema and queries will fail.

## Uploads — read this before launch

`src/collections/Media.ts` writes uploads to `public/media` on local disk. That
directory is gitignored and **not persistent on most hosts** — on Vercel or any
container platform with an ephemeral filesystem, every uploaded image disappears
on the next deploy or restart.

Pick one before the client uploads real content:

- **Persistent volume** — mount storage at `public/media`. Simplest, works
  unchanged.
- **Object storage** — add `@payloadcms/storage-s3` (or another storage adapter)
  to `payload.config.ts` and point it at a bucket. Recommended for a platform
  deploy. Existing files need copying across.

Uploads are capped at 8 MB and restricted to raster image types. SVG is
deliberately blocked: uploads are served from the site's own origin, so an SVG
would be a stored cross-site-scripting vector from any editor account.

## First deploy

```bash
bun install
bun run build
bun run start
```

Then, in order:

1. **Create the first admin.** Visit `/ops/admin` and create an account. The
   first account created is forced to `admin`; after that, only an admin can
   create users, and the email must be on `ADMIN_EMAIL_DOMAIN`.
2. **Add content.** Either enter it in the admin, or if the client wants the
   bundled starter content, seed a *staging* environment (see below) and enter
   production content by hand. Do not enable seeding in production.
3. **Set the SEO defaults** under Global → Site Settings → SEO.
4. **Check `robots.txt` and `sitemap.xml`** resolve at the real domain and point
   at that domain, not localhost. If they say `localhost`,
   `NEXT_PUBLIC_SERVER_URL` is wrong.

If the site renders but shows generic example placements and stats, the database
is unreachable — the app intentionally falls back to bundled content rather than
erroring. Check the logs for `[content] … read failed`.

## Seeding (non-production only)

```bash
SEED_SECRET=<value> bun run seed
```

Refuses to run when `NODE_ENV=production`, and refuses to run at all unless
`SEED_SECRET` is set — there is no default. It is idempotent: anything already
populated is skipped, and per-item failures are reported in the response `log`
rather than aborting the run and leaving the database half-filled.

## Post-deploy checks

Fast smoke test. Everything here has a known-good answer.

```bash
BASE=https://your-domain

# Pages
for p in / /companies /professionals /services /insights /legal; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' $BASE$p)"
done

# SEO surface — must reference the real domain
curl -s $BASE/robots.txt
curl -s $BASE/sitemap.xml | head -20
curl -s $BASE/feed.xml | head -20

# Endpoints that must be closed in production
curl -s -o /dev/null -w 'seed: %{http_code}\n'        -X POST $BASE/seed-content
curl -s -o /dev/null -w 'types: %{http_code}\n'       -X POST $BASE/dev/generate-types
curl -s -o /dev/null -w 'migration: %{http_code}\n'   -X POST $BASE/dev/create-migration
# Expect 404 (NODE_ENV=production) or 403 (SEED_SECRET unset)

# Lead intake must reject the old public path
curl -s -o /dev/null -w 'rest contacts: %{http_code}\n' -X POST $BASE/api/contacts \
  -H 'Content-Type: application/json' -d '{"type":"lead","email":"a@b.com"}'
# Expect 403
```

Then by hand:

- Submit each of the three forms (contact terminal, homepage CTA, footer
  newsletter) and confirm the lead appears under **Inbound → Contacts** with a
  sensible `source`, and that `LEADS_NOTIFY_EMAIL` received a message.
- Edit any CMS field, save, reload the public page — the change should appear
  immediately. If it does not, cache invalidation is not reaching the app.
- Save a post as a draft and confirm it is **absent** from `/insights`,
  `/sitemap.xml` and `/feed.xml`, then publish it and confirm it appears.
- Upload an image, then redeploy and confirm it is still there. This is the
  uploads question above; better to find out now.

## Operating notes

- **Backups.** Postgres holds all content, leads and referral data. Nothing else
  is stateful except the uploads directory. Back up both.
- **Logs to watch.** `[content] … read failed` means the site is serving bundled
  fallback content instead of the CMS. `[revalidate] skipped` means a cache
  invalidation was dropped and a page may be stale until its ceiling expires
  (1 hour for most content, 5 minutes for posts).
- **Rate limiting** on lead intake is 5 submissions per 10 minutes per IP and 2
  per email, counted in Postgres. Adjust in `src/app/(frontend)/leads/route.ts`.
- **Admin lockout** is 5 failed logins then 10 minutes, per account.

## Known issues

Honest list, all reproducible today.

1. **Payload CLI cannot load the config on Node 22.** Affects
   `bun run generate:importmap` and `bun run migrate`. Types and migrations are
   generated through dev-only routes instead, and migrations apply on boot, so
   nothing is blocked — but the two CLI commands will fail if invoked. Details
   and the fix path are in
   [ARCHITECTURE.md](ARCHITECTURE.md#generated-files).
2. **Uploads are on local disk.** See [Uploads](#uploads--read-this-before-launch).
   Needs a decision before the client uploads anything they care about.
3. **`x-forwarded-for` trust depends on the host.** The lead rate limiter reads
   the left-most hop. Verify this against your platform's proxy behaviour; the
   per-email limit is the backstop.
4. **No automated tests.** There is no test runner in the repo. The smoke checks
   above are the current safety net; adding a test suite is the obvious next
   investment.
5. **Local dev port conflict (this machine only).** `docker-compose.yml` maps
   Postgres to host port `5432`, which on the original development machine was
   already taken by an unrelated project. If `bun dev` cannot reach the database,
   change the published port in `docker-compose.yml` and `DATABASE_URI` to
   something free, e.g. `55432`.
6. **`socials` is empty by default,** so the footer social row is hidden until
   someone adds links in Site Settings.
