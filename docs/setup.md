# Setup — Textile & Fashion Value Chain Mapping App

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account/project
   (choose a region close to Kosovo, e.g. Frankfurt).
2. In **Project Settings → API**, copy the **Project URL** and **anon public key**.

## 2. Run the database migration

In the Supabase dashboard, open **SQL Editor** and run, in order:
1. [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) —
   creates `profiles`, `companies`, `company_photos`, and RLS policies.
2. [`supabase/migrations/0002_storage.sql`](../supabase/migrations/0002_storage.sql) —
   creates the private `company-photos` storage bucket and its policies.

(If you prefer the Supabase CLI: `supabase link` then `supabase db push`.)

## 3. Configure the app

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from step 1.
These are safe to expose in the browser — access control is enforced by RLS, not by
keeping these secret.

## 4. Create your first users

Slice 1 has no self-service signup (matches the spec: "Admin can create/deactivate
mapper accounts"). To create the first Admin and a test Mapper:

1. Supabase dashboard → **Authentication → Users → Add user** — create one user for
   yourself (Admin) and one for a test mapper, with a temporary password each.
2. Supabase dashboard → **SQL Editor**, run (replacing the UUIDs with the ones shown
   next to each user in the Users list):

   ```sql
   insert into public.profiles (id, full_name, role) values
     ('PASTE-ADMIN-USER-UUID', 'Your Name', 'admin'),
     ('PASTE-MAPPER-USER-UUID', 'Test Mapper', 'mapper');
   ```

## 5. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`. Sign in as the mapper
to submit a test site visit, then as the admin to review/approve/export it.

## 6. Deploy

Any Node host works; the spec calls for lightweight hosting, so
[Vercel](https://vercel.com)'s free tier is a good fit:

1. Push this repo to GitHub (already done).
2. Import the repo in Vercel, add the two `NEXT_PUBLIC_SUPABASE_*` env vars from
   step 3 in the Vercel project settings.
3. Deploy — Vercel gives you a project URL to share with enumerators.

## Open items before full rollout

These are called out in the original spec and don't block Slice 1 development, but
need an answer before go-live:

1. **Municipality list** — [`src/lib/constants.ts`](../src/lib/constants.ts) has a
   placeholder bilingual list; swap in the project's already-standardised list.
2. **KBRA export format** — confirm which fields KBRA can actually share, to finalize
   the bulk-import mapping (tracked in [`BACKLOG.md`](../BACKLOG.md)).
3. **Long-term database ownership** — project-only vs. handed to KIESA/MIETI later.
4. **Enumerator count / expected visit volume** — drives Supabase plan tier and
   account provisioning; free tier covers a few thousand records comfortably.
