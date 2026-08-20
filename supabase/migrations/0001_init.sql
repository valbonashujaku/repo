-- Textile & Fashion Value Chain Mapping App
-- Initial schema: full data model per docs/data-dictionary.md (Section 4 of the spec).
-- Slice 1's UI only surfaces a subset of these columns; the rest exist now so later
-- slices are additive (new UI wired to existing columns), not destructive migrations.

-- ============================================================================
-- profiles: one row per app user, mirrors auth.users, carries the app role
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('mapper', 'admin', 'viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- companies: one row per business/producer (formal or informal)
-- ============================================================================
create table if not exists public.companies (
  -- L. System metadata
  id uuid primary key default gen_random_uuid(),
  mapper_id uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  review_status text not null default 'submitted'
    check (review_status in ('submitted', 'approved', 'needs_revision')),
  admin_notes text,
  source text not null default 'field_added'
    check (source in ('kbra_import', 'field_added')),

  -- A. Identification and registration
  business_name text not null,
  business_id text,                       -- KBRA number; null if informal
  formality_status text not null check (formality_status in ('formal', 'informal')),
  legal_form text,
  year_established int,
  owner_name text,                        -- restricted field, admin-only in exports
  owner_phone text,                       -- restricted field, admin-only in exports
  owner_gender text check (owner_gender in ('woman', 'man', 'mixed')),

  -- B. Location
  municipality text,
  settlement_address text,
  latitude double precision,
  longitude double precision,
  area_type text check (area_type in ('urban', 'rural')),

  -- C. Business classification and size
  primary_subsector text,
  secondary_activities text[] default '{}',
  employees_fulltime_male int default 0,
  employees_fulltime_female int default 0,
  employees_parttime_male int default 0,
  employees_parttime_female int default 0,
  employees_seasonal_male int default 0,
  employees_seasonal_female int default 0,
  annual_turnover_band text,
  production_capacity text,

  -- D. Products and value chain position
  main_products text[] default '{}',
  main_products_other text,
  value_chain_position text[] default '{}',
  sales_channels text[] default '{}',
  main_markets text[] default '{}',
  raw_material_sourcing text check (raw_material_sourcing in ('local', 'imported', 'mixed')),
  raw_material_types text,

  -- E. Employment and workforce
  youth_employees int,
  plans_to_hire boolean,
  plans_to_hire_count int,
  hiring_barrier text,

  -- F. Skills and training
  hosted_intern boolean,
  skills_gap text[] default '{}',
  training_partner_interest boolean,

  -- G. Finance and market access
  received_support boolean,
  support_source text,
  matchmaking_interest boolean,
  grant_voucher_interest boolean,
  growth_barrier text,

  -- H. Sustainability and circular practices
  circular_practices text[] default '{}',
  sustainability_interest boolean,
  circular_economy_awareness boolean,

  -- I. Value chain linkages (Activity 3.4 matchmaking)
  has_linkage boolean,
  linkage_name text,
  willing_to_be_introduced boolean,
  match_notes text,                       -- internal use only, never exported to respondent

  -- J. Needs, challenges and policy input (Activity 1.7 evidence)
  top_challenges text[] default '{}',     -- ranked list, order = rank
  sector_support_suggestion text,
  strategy_awareness boolean,

  -- K. Consent
  consent_given boolean not null default false,
  consent_at timestamptz
);

-- total_jobs is derived, not stored input; expose as a generated column
alter table public.companies
  add column if not exists total_jobs int generated always as (
    coalesce(employees_fulltime_male, 0) + coalesce(employees_fulltime_female, 0) +
    coalesce(employees_parttime_male, 0) + coalesce(employees_parttime_female, 0) +
    coalesce(employees_seasonal_male, 0) + coalesce(employees_seasonal_female, 0)
  ) stored;

create index if not exists companies_review_status_idx on public.companies (review_status);
create index if not exists companies_formality_status_idx on public.companies (formality_status);
create index if not exists companies_municipality_idx on public.companies (municipality);
create index if not exists companies_mapper_id_idx on public.companies (mapper_id);

-- ============================================================================
-- company_photos: 1 required + up to 4 optional, stored in Supabase Storage
-- ============================================================================
create table if not exists public.company_photos (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  storage_path text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.company_photos enable row level security;

-- helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and active
  );
$$;

-- profiles: users can read their own profile; admins can read/write all
create policy "profiles_self_select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_admin_write" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- companies: mappers can insert their own records, read/update their own
-- records while still 'submitted'; admins can read/update everything.
create policy "companies_admin_all" on public.companies
  for all using (public.is_admin()) with check (public.is_admin());
create policy "companies_mapper_insert" on public.companies
  for insert with check (mapper_id = auth.uid());
create policy "companies_mapper_select_own" on public.companies
  for select using (mapper_id = auth.uid());
create policy "companies_mapper_update_own_pending" on public.companies
  for update using (mapper_id = auth.uid() and review_status = 'submitted')
  with check (mapper_id = auth.uid());

-- company_photos: readable/writable by the owning mapper or an admin
create policy "photos_admin_all" on public.company_photos
  for all using (public.is_admin()) with check (public.is_admin());
create policy "photos_mapper_own" on public.company_photos
  for all using (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.mapper_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.mapper_id = auth.uid()
    )
  );
