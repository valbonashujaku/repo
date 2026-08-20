import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/types/database";

// Column order matches docs/data-dictionary.md. Restricted fields
// (owner_name, owner_phone, match_notes) are dropped from every export;
// anonymized mode additionally drops business_name and exact GPS.
const BASE_COLUMNS: (keyof Company)[] = [
  "id",
  "business_name",
  "business_id",
  "formality_status",
  "legal_form",
  "year_established",
  "owner_gender",
  "municipality",
  "settlement_address",
  "latitude",
  "longitude",
  "area_type",
  "primary_subsector",
  "secondary_activities",
  "employees_fulltime_male",
  "employees_fulltime_female",
  "employees_parttime_male",
  "employees_parttime_female",
  "employees_seasonal_male",
  "employees_seasonal_female",
  "total_jobs",
  "annual_turnover_band",
  "production_capacity",
  "main_products",
  "main_products_other",
  "value_chain_position",
  "sales_channels",
  "main_markets",
  "raw_material_sourcing",
  "raw_material_types",
  "youth_employees",
  "plans_to_hire",
  "plans_to_hire_count",
  "hiring_barrier",
  "hosted_intern",
  "skills_gap",
  "training_partner_interest",
  "received_support",
  "support_source",
  "matchmaking_interest",
  "grant_voucher_interest",
  "growth_barrier",
  "circular_practices",
  "sustainability_interest",
  "circular_economy_awareness",
  "has_linkage",
  "linkage_name",
  "willing_to_be_introduced",
  "top_challenges",
  "sector_support_suggestion",
  "strategy_awareness",
  "consent_given",
  "consent_at",
  "review_status",
  "source",
  "created_at",
  "submitted_at",
];

const ANONYMIZED_DROP = new Set<keyof Company>([
  "business_name",
  "latitude",
  "longitude",
]);

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = Array.isArray(value) ? value.join("; ") : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .returns<{ role: string }>();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const params = request.nextUrl.searchParams;
  const status = params.get("status");
  const formality = params.get("formality");
  const municipality = params.get("municipality");
  const anonymized = params.get("anonymized") === "true";

  let query = supabase.from("companies").select("*");
  query = query.eq("review_status", status ?? "approved");
  if (formality) query = query.eq("formality_status", formality);
  if (municipality) query = query.eq("municipality", municipality);

  const { data: rows, error } = await query.returns<Company[]>();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const columns = anonymized
    ? BASE_COLUMNS.filter((c) => !ANONYMIZED_DROP.has(c))
    : BASE_COLUMNS;

  const header = columns.join(",");
  const lines = (rows ?? []).map((row) =>
    columns.map((col) => csvEscape(row[col])).join(",")
  );
  const csv = [header, ...lines].join("\n");

  const filename = `value-chain-mapping${anonymized ? "-anonymised" : ""}-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
