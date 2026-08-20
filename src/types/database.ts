// Hand-written types matching supabase/migrations/0001_init.sql.
// If the schema changes, update this file and docs/data-dictionary.md together.

export type UserRole = "mapper" | "admin" | "viewer";
export type FormalityStatus = "formal" | "informal";
export type AreaType = "urban" | "rural";
export type OwnerGender = "woman" | "man" | "mixed";
export type ReviewStatus = "submitted" | "approved" | "needs_revision";
export type CompanySource = "kbra_import" | "field_added";
export type RawMaterialSourcing = "local" | "imported" | "mixed";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  active: boolean;
  created_at: string;
}

export interface Company {
  id: string;
  mapper_id: string | null;
  created_at: string;
  submitted_at: string | null;
  updated_at: string;
  review_status: ReviewStatus;
  admin_notes: string | null;
  source: CompanySource;

  business_name: string;
  business_id: string | null;
  formality_status: FormalityStatus;
  legal_form: string | null;
  year_established: number | null;
  owner_name: string | null;
  owner_phone: string | null;
  owner_gender: OwnerGender | null;

  municipality: string | null;
  settlement_address: string | null;
  latitude: number | null;
  longitude: number | null;
  area_type: AreaType | null;

  primary_subsector: string | null;
  secondary_activities: string[];
  employees_fulltime_male: number | null;
  employees_fulltime_female: number | null;
  employees_parttime_male: number | null;
  employees_parttime_female: number | null;
  employees_seasonal_male: number | null;
  employees_seasonal_female: number | null;
  annual_turnover_band: string | null;
  production_capacity: string | null;

  main_products: string[];
  main_products_other: string | null;
  value_chain_position: string[];
  sales_channels: string[];
  main_markets: string[];
  raw_material_sourcing: RawMaterialSourcing | null;
  raw_material_types: string | null;

  total_jobs: number | null;
  youth_employees: number | null;
  plans_to_hire: boolean | null;
  plans_to_hire_count: number | null;
  hiring_barrier: string | null;

  hosted_intern: boolean | null;
  skills_gap: string[];
  training_partner_interest: boolean | null;

  received_support: boolean | null;
  support_source: string | null;
  matchmaking_interest: boolean | null;
  grant_voucher_interest: boolean | null;
  growth_barrier: string | null;

  circular_practices: string[];
  sustainability_interest: boolean | null;
  circular_economy_awareness: boolean | null;

  has_linkage: boolean | null;
  linkage_name: string | null;
  willing_to_be_introduced: boolean | null;
  match_notes: string | null;

  top_challenges: string[];
  sector_support_suggestion: string | null;
  strategy_awareness: boolean | null;

  consent_given: boolean;
  consent_at: string | null;
}

export type CompanyInsert = Omit<
  Company,
  | "id"
  | "created_at"
  | "updated_at"
  | "total_jobs"
  | "review_status"
  | "admin_notes"
  | "source"
> &
  Partial<
    Pick<Company, "review_status" | "admin_notes" | "source" | "id">
  >;

export interface CompanyPhoto {
  id: string;
  company_id: string;
  storage_path: string;
  is_primary: boolean;
  created_at: string;
}

// Minimal Database shape expected by @supabase/supabase-js generics.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, "id" | "full_name" | "role">;
        Update: Partial<Profile>;
      };
      companies: {
        Row: Company;
        Insert: CompanyInsert;
        Update: Partial<Company>;
      };
      company_photos: {
        Row: CompanyPhoto;
        Insert: Partial<CompanyPhoto> &
          Pick<CompanyPhoto, "company_id" | "storage_path">;
        Update: Partial<CompanyPhoto>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
