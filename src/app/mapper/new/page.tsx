import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NewVisitForm from "./new-visit-form";

export default async function NewVisitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-neutral-50 p-4">
      <header className="flex items-center gap-3 py-4">
        <Link href="/mapper" className="text-sm text-neutral-500">
          ← Back
        </Link>
        <h1 className="text-lg font-semibold text-neutral-900">New site visit</h1>
      </header>
      <NewVisitForm userId={user.id} />
    </main>
  );
}
