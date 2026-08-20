# Textile & Fashion Value Chain Mapping App

A mobile-responsive web app for CI Kosovo field enumerators ("Mappers") to profile
textile and fashion businesses — formal and informal — across Kosovo, and for the
project team ("Admin") to review submissions and export data for Activity 3.4 (value
chain matchmaking) and Activity 1.7 (Creative Economy Strategy fashion chapter).

**Status**: Slice 1 — an end-to-end vertical slice (login → mapper form → admin
review → export) is live on a complete database schema. See
[`BACKLOG.md`](BACKLOG.md) for what's built vs. still to come, and
[`docs/data-dictionary.md`](docs/data-dictionary.md) for the full field list.

## Stack

Next.js (App Router, TypeScript, Tailwind) + Supabase (Postgres, Auth, Storage).

## Getting started

See [`docs/setup.md`](docs/setup.md) for full instructions (Supabase project setup,
env vars, running locally, deploying). Quick version:

```bash
cp .env.local.example .env.local   # fill in your Supabase project's URL + anon key
npm install
npm run dev
```

## Docs

- [`docs/setup.md`](docs/setup.md) — environment setup and deployment
- [`docs/data-dictionary.md`](docs/data-dictionary.md) — every field, its type,
  options, and whether it's collected yet
- [`docs/admin-guide.md`](docs/admin-guide.md) — using the admin dashboard
- [`BACKLOG.md`](BACKLOG.md) — what's left from the original spec

## Contributing

Open an issue or pull request to suggest changes.
