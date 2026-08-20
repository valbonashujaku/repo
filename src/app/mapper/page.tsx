import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";
import type { Company } from "@/types/database";

type VisitRow = Pick<
  Company,
  | "id"
  | "business_name"
  | "municipality"
  | "formality_status"
  | "review_status"
  | "admin_notes"
  | "created_at"
>;

const STATUS_STYLES: Record<string, string> = {
  submitted: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  needs_revision: "bg-red-100 text-red-800",
};

export default async function MapperPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: visits } = await supabase
    .from("companies")
    .select(
      "id, business_name, municipality, formality_status, review_status, admin_notes, created_at"
    )
    .eq("mapper_id", user.id)
    .order("created_at", { ascending: false })
    .returns<VisitRow[]>();

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-neutral-50 p-4 pb-24">
      <header className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">My site visits</h1>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
        <SignOutButton />
      </header>

      <div className="space-y-3">
        {visits?.length ? (
          visits.map((v) => (
            <div
              key={v.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-neutral-900">{v.business_name}</p>
                  <p className="text-sm text-neutral-500">
                    {v.municipality ?? "No municipality"} ·{" "}
                    {v.formality_status === "formal" ? "Formal" : "Informal"}
                  </p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                    STATUS_STYLES[v.review_status] ?? "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {v.review_status.replace("_", " ")}
                </span>
              </div>
              {v.review_status === "needs_revision" && v.admin_notes && (
                <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">
                  Admin note: {v.admin_notes}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
            No site visits submitted yet.
          </p>
        )}
      </div>

      <Link
        href="/mapper/new"
        className="fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-xl bg-neutral-900 px-4 py-3.5 text-center text-base font-medium text-white shadow-lg"
      >
        + New site visit
      </Link>
    </main>
  );
}
