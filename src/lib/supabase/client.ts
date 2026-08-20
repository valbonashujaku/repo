import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components (browser).
 * Reads the public URL + anon key from env — safe to expose, RLS does the
 * real access control (see supabase/migrations/0001_init.sql).
 *
 * Not parametrized with a generated Database type (none exists yet — this
 * project's schema isn't generated from a live Supabase instance). Callers
 * use `.returns<T>()` from src/types/database.ts at each query site instead.
 * Once the app is linked to a real project, prefer swapping this for
 * `supabase gen types typescript` output (see docs/setup.md).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
