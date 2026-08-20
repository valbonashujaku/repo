"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .returns<{ role: string }>();

  if (profile?.role !== "admin") throw new Error("Admin access required.");
  return supabase;
}

export async function approveCompany(companyId: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("companies")
    .update({ review_status: "approved", admin_notes: null })
    .eq("id", companyId);
  if (error) throw error;
  revalidatePath("/admin");
}

export async function requestRevision(companyId: string, note: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("companies")
    .update({ review_status: "needs_revision", admin_notes: note })
    .eq("id", companyId);
  if (error) throw error;
  revalidatePath("/admin");
}
