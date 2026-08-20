import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";
import ReviewActions from "./review-actions";
import { MUNICIPALITIES } from "@/lib/constants";
import type { Company } from "@/types/database";

type SummaryRow = Pick<Company, "id" | "formality_status" | "review_status">;
type TableRow = Pick<
  Company,
  | "id"
  | "business_name"
  | "municipality"
  | "formality_status"
  | "primary_subsector"
  | "review_status"
  | "created_at"
>;

const STATUS_STYLES: Record<string, string> = {
  submitted: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  needs_revision: "bg-red-100 text-red-800",
};

type SearchParams = Promise<{
  status?: string;
  formality?: string;
  municipality?: string;
}>;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .returns<{ role: string }>();
  if (profile?.role !== "admin") redirect("/mapper");

  // Unfiltered fetch for the always-live summary counts.
  const { data: allCompanies } = await supabase
    .from("companies")
    .select("id, formality_status, review_status")
    .returns<SummaryRow[]>();

  const total = allCompanies?.length ?? 0;
  const informalCount =
    allCompanies?.filter((c) => c.formality_status === "informal").length ?? 0;
  const approvedCount =
    allCompanies?.filter((c) => c.review_status === "approved").length ?? 0;

  // Filtered fetch for the table.
  let query = supabase
    .from("companies")
    .select(
      "id, business_name, municipality, formality_status, primary_subsector, review_status, created_at"
    )
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("review_status", params.status);
  if (params.formality) query = query.eq("formality_status", params.formality);
  if (params.municipality) query = query.eq("municipality", params.municipality);

  const { data: companies } = await query.returns<TableRow[]>();

  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Admin dashboard</h1>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
        <SignOutButton />
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <SummaryCard label="Total mapped" value={total} />
        <SummaryCard
          label="% Informal"
          value={total ? `${Math.round((informalCount / total) * 100)}%` : "—"}
        />
        <SummaryCard
          label="% Approved"
          value={total ? `${Math.round((approvedCount / total) * 100)}%` : "—"}
        />
      </div>

      <form className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4">
        <FilterSelect
          name="status"
          label="Review status"
          defaultValue={params.status}
          options={[
            { value: "submitted", label: "Submitted" },
            { value: "approved", label: "Approved" },
            { value: "needs_revision", label: "Needs revision" },
          ]}
        />
        <FilterSelect
          name="formality"
          label="Formality"
          defaultValue={params.formality}
          options={[
            { value: "formal", label: "Formal" },
            { value: "informal", label: "Informal" },
          ]}
        />
        <FilterSelect
          name="municipality"
          label="Municipality"
          defaultValue={params.municipality}
          options={MUNICIPALITIES.map((m) => ({ value: m, label: m }))}
        />
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Apply filters
        </button>
        <a href="/admin" className="text-sm text-neutral-500 underline">
          Clear
        </a>

        <div className="ml-auto flex gap-2">
          <a
            href={`/api/export?${buildExportQuery(params, false)}`}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700"
          >
            Export CSV
          </a>
          <a
            href={`/api/export?${buildExportQuery(params, true)}`}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700"
          >
            Export CSV (anonymised)
          </a>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Municipality</th>
              <th className="px-4 py-3">Formality</th>
              <th className="px-4 py-3">Sub-sector</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies?.map((c) => (
              <tr key={c.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {c.business_name}
                </td>
                <td className="px-4 py-3 text-neutral-600">{c.municipality}</td>
                <td className="px-4 py-3 text-neutral-600">{c.formality_status}</td>
                <td className="px-4 py-3 text-neutral-600">{c.primary_subsector}</td>
                <td className="px-4 py-3">
                  <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                      STATUS_STYLES[c.review_status] ?? "bg-neutral-100"
                    }`}
                  >
                    {c.review_status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {c.review_status !== "approved" && (
                    <ReviewActions companyId={c.id} />
                  )}
                </td>
              </tr>
            ))}
            {!companies?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  No records match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function buildExportQuery(
  params: { status?: string; formality?: string; municipality?: string },
  anonymized: boolean
) {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.formality) search.set("formality", params.formality);
  if (params.municipality) search.set("municipality", params.municipality);
  if (anonymized) search.set("anonymized", "true");
  return search.toString();
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function FilterSelect({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-neutral-500">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
