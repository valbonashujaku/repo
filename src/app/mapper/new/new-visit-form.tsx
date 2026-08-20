"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MUNICIPALITIES, SUBSECTORS, FORMALITY_STATUSES } from "@/lib/constants";

type GpsStatus = "idle" | "locating" | "done" | "error";

export default function NewVisitForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [businessName, setBusinessName] = useState("");
  const [formalityStatus, setFormalityStatus] = useState<"formal" | "informal">(
    "informal"
  );
  const [municipality, setMunicipality] = useState("");
  const [address, setAddress] = useState("");
  const [subsector, setSubsector] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("idle");
  const [photo, setPhoto] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function captureGps() {
    if (!("geolocation" in navigator)) {
      setGpsStatus("error");
      return;
    }
    setGpsStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setGpsStatus("done");
      },
      () => setGpsStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!businessName.trim()) return setError("Business name is required.");
    if (!municipality) return setError("Municipality is required.");
    if (!subsector) return setError("Primary sub-sector is required.");
    if (!latitude || !longitude)
      return setError(
        "GPS location is required. Tap 'Capture location' or enter coordinates manually."
      );
    if (!photo) return setError("At least one site photo is required.");
    if (!consent)
      return setError("The business representative must accept the consent statement.");

    setSubmitting(true);
    try {
      const now = new Date().toISOString();

      const { data: company, error: insertError } = await supabase
        .from("companies")
        .insert({
          mapper_id: userId,
          business_name: businessName.trim(),
          formality_status: formalityStatus,
          municipality,
          settlement_address: address.trim() || null,
          primary_subsector: subsector,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          consent_given: true,
          consent_at: now,
          submitted_at: now,
          business_id: null,
          legal_form: null,
          year_established: null,
          owner_name: null,
          owner_phone: null,
          owner_gender: null,
          area_type: null,
          secondary_activities: [],
          annual_turnover_band: null,
          production_capacity: null,
          main_products: [],
          main_products_other: null,
          value_chain_position: [],
          sales_channels: [],
          main_markets: [],
          raw_material_sourcing: null,
          raw_material_types: null,
          employees_fulltime_male: 0,
          employees_fulltime_female: 0,
          employees_parttime_male: 0,
          employees_parttime_female: 0,
          employees_seasonal_male: 0,
          employees_seasonal_female: 0,
          youth_employees: null,
          plans_to_hire: null,
          plans_to_hire_count: null,
          hiring_barrier: null,
          hosted_intern: null,
          skills_gap: [],
          training_partner_interest: null,
          received_support: null,
          support_source: null,
          matchmaking_interest: null,
          grant_voucher_interest: null,
          growth_barrier: null,
          circular_practices: [],
          sustainability_interest: null,
          circular_economy_awareness: null,
          has_linkage: null,
          linkage_name: null,
          willing_to_be_introduced: null,
          match_notes: null,
          top_challenges: [],
          sector_support_suggestion: null,
          strategy_awareness: null,
        })
        .select("id")
        .single()
        .returns<{ id: string }>();

      if (insertError || !company) {
        throw insertError ?? new Error("Could not save the record.");
      }

      const path = `${userId}/${company.id}-${Date.now()}-${photo.name}`;
      const { error: uploadError } = await supabase.storage
        .from("company-photos")
        .upload(path, photo);

      if (uploadError) throw uploadError;

      const { error: photoRowError } = await supabase.from("company_photos").insert({
        company_id: company.id,
        storage_path: path,
        is_primary: true,
      });

      if (photoRowError) throw photoRowError;

      router.push("/mapper");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">
      <Section title="Business">
        <Field label="Business / producer name" required>
          <input
            className="input"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </Field>
        <Field label="Formality status" required>
          <div className="flex gap-2">
            {FORMALITY_STATUSES.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setFormalityStatus(opt.value)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                  formalityStatus === opt.value
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 text-neutral-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Primary sub-sector" required>
          <select
            className="input"
            value={subsector}
            onChange={(e) => setSubsector(e.target.value)}
          >
            <option value="">Select...</option>
            {SUBSECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Location">
        <Field label="Municipality" required>
          <select
            className="input"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
          >
            <option value="">Select...</option>
            {MUNICIPALITIES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Settlement / street address">
          <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>
        <Field label="GPS coordinates" required>
          <button
            type="button"
            onClick={captureGps}
            className="mb-2 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm font-medium text-neutral-700"
          >
            {gpsStatus === "locating" ? "Locating..." : "📍 Capture location"}
          </button>
          {gpsStatus === "error" && (
            <p className="mb-2 text-sm text-red-600">
              Couldn&apos;t get GPS automatically — enter coordinates manually.
            </p>
          )}
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="Latitude"
              inputMode="decimal"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <input
              className="input"
              placeholder="Longitude"
              inputMode="decimal"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </Field>
      </Section>

      <Section title="Photo">
        <Field label="Site photo (workshop / storefront / production area)" required>
          <input
            className="block w-full text-sm"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </Field>
      </Section>

      <Section title="Consent">
        <label className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5"
          />
          <span>
            The business owner/representative agrees that this data will be used for
            project planning and the national Creative Economy Strategy, and that
            business identity may be anonymised in public reporting.
          </span>
        </label>
      </Section>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-neutral-900 px-4 py-3.5 text-base font-medium text-white disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit site visit"}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d4d4d4;
          padding: 0.625rem 0.75rem;
          font-size: 1rem;
        }
        .input:focus {
          outline: none;
          border-color: #171717;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
