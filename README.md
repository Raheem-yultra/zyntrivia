# Zyntrivia — Engineering Studio Website

Marketing and lead-generation site for Zyntrivia, a software studio
(custom web apps · workflow & AI automation · internal tools · AI agents).

The site is the v2 redesign. Specs live in [`docs/`](docs); start with [`CLAUDE.md`](CLAUDE.md).

## Repository layout

| Path | What it is |
|---|---|
| [`zyntrivia/`](zyntrivia) | The website — Next.js 16 App Router · TypeScript · Payload CMS 3 · Postgres (Supabase). |
| [`docs/`](docs) | v2 product, design, architecture and build-plan docs. `docs/reference/` holds v1 content kept for seeding. |
| [`zyntrivia-implementation-plan_2.md`](zyntrivia-implementation-plan_2.md) | v1 implementation plan. |
| [`stitch_zyntrivia_engineering_studio_website/`](stitch_zyntrivia_engineering_studio_website) | v1 Stitch design source. |

## Quick start

```bash
cd zyntrivia
cp .env.example .env   # set DATABASE_URL, DATABASE_CA_CERT, PAYLOAD_SECRET
pnpm install
pnpm migrate           # create the database schema (schema changes only go through migrations)
pnpm seed              # optional: case studies, services, FAQs, and two posts
pnpm dev               # http://localhost:3000 and /admin
```

Use a development Supabase project, never the production database. `pnpm build` also needs a reachable database, because pages are pre-rendered from the CMS.

## Docs

| Doc | For |
|---|---|
| [`docs/EDITING-GUIDE.md`](docs/EDITING-GUIDE.md) | Publishing posts and editing content in `/admin` |
| [`docs/CONTENT-REVIEW.md`](docs/CONTENT-REVIEW.md) | Copy and claims that need sign-off before launch |
| [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md) | Supabase, Vercel, and third-party setup for going live |
