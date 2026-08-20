# Data Dictionary — Textile & Fashion Value Chain Mapping App

Matches Section 4 of the app spec exactly. Column names refer to
[`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql).
**Slice 1 status**: ✅ = collected by the current mapper form · ⏳ = column exists,
UI added in a later slice.

## A. Identification and registration

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Business/producer name | `business_name` | text | — | Yes | ✅ |
| Business ID (KBRA number) | `business_id` | text | — | If formal | ⏳ |
| Formality status | `formality_status` | single select | formal, informal | Yes | ✅ |
| Legal form | `legal_form` | single select | sole proprietor, LLC, cooperative, other | If formal | ⏳ |
| Year established | `year_established` | number | — | No | ⏳ |
| Owner/manager name | `owner_name` | text | — | No | ⏳ |
| Owner/manager phone | `owner_phone` | text | — | No | ⏳ |
| Owner gender | `owner_gender` | single select | woman, man, mixed | No | ⏳ |

> `owner_name` and `owner_phone` are **restricted**: visible to Admin only, always
> dropped from exports (not just the anonymised toggle).

## B. Location

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Municipality | `municipality` | dropdown | bilingual SQ/SR municipality list | Yes | ✅ |
| Settlement/street address | `settlement_address` | text | — | No | ✅ |
| GPS coordinates | `latitude`, `longitude` | auto-captured, editable | — | Yes | ✅ |
| Urban/rural | `area_type` | single select | urban, rural | No | ⏳ |

## C. Business classification and size

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Primary sub-sector | `primary_subsector` | single select | apparel/clothing, textile production, leather goods, footwear, traditional/handicraft textiles, fashion design/branding, other | Yes | ✅ |
| Secondary activities | `secondary_activities` | multi-select | same list as above | No | ⏳ |
| Employees (full-time, male/female) | `employees_fulltime_male/female` | number × 2 | — | No | ⏳ |
| Employees (part-time, male/female) | `employees_parttime_male/female` | number × 2 | — | No | ⏳ |
| Employees (seasonal, male/female) | `employees_seasonal_male/female` | number × 2 | — | No | ⏳ |
| Annual turnover band | `annual_turnover_band` | single select | <€10k, €10–50k, €50–200k, €200k+ | No | ⏳ |
| Production capacity | `production_capacity` | single select | micro, small, medium (SME classification) | No | ⏳ |

## D. Products and value chain position

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Main products | `main_products`, `main_products_other` | multi-select + free text | — | No | ⏳ |
| Position in value chain | `value_chain_position` | multi-select | input supplier, primary producer, subcontractor, brand/retailer, exporter | No | ⏳ |
| Main sales channels | `sales_channels` | multi-select | direct/retail, wholesale, online, export, subcontract | No | ⏳ |
| Main markets | `main_markets` | multi-select | local municipality, national, regional, EU export, other export | No | ⏳ |
| Sourcing of raw materials | `raw_material_sourcing`, `raw_material_types` | single select + text | local, imported, mixed | No | ⏳ |

## E. Employment and workforce

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Total jobs supported | `total_jobs` | auto-calculated (generated column, sum of Section C) | — | Auto | ✅ (auto) |
| Youth employees (under 30) | `youth_employees` | number | — | No | ⏳ |
| Plans to hire next 12 months | `plans_to_hire`, `plans_to_hire_count` | yes/no + number | — | No | ⏳ |
| Main barrier to hiring | `hiring_barrier` | single select | cost, lack of skilled applicants, seasonality, other | No | ⏳ |

## F. Skills and training

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Hosted intern/trainee (past 2 yrs) | `hosted_intern` | yes/no | — | No | ⏳ |
| Main skills gap | `skills_gap` | multi-select | pattern-making, garment finishing, design, digital marketing, export documentation, other | No | ⏳ |
| Interest in partnering with training provider | `training_partner_interest` | yes/no | — | No | ⏳ |

## G. Finance and market access

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Received grant/loan/FSI support before | `received_support`, `support_source` | yes/no + text | — | No | ⏳ |
| Interest in matchmaking introduction | `matchmaking_interest` | yes/no | — | No | ⏳ |
| Interest in small grant/voucher | `grant_voucher_interest` | yes/no | — | No | ⏳ |
| Biggest barrier to growth | `growth_barrier` | single select | finance, market access, skills, raw materials, equipment, regulation, other | No | ⏳ |

## H. Sustainability and circular practices

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Circular/sustainable practices in use | `circular_practices` | multi-select | recycled/upcycled materials, waste reduction, natural dyes, energy-efficient equipment, none | No | ⏳ |
| Interest in adopting if supported | `sustainability_interest` | yes/no | — | No | ⏳ |
| Awareness of Kosovo Circular Economy Roadmap | `circular_economy_awareness` | yes/no | — | No | ⏳ |

## I. Value chain linkages (Activity 3.4 matchmaking)

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Existing linkage to other producers | `has_linkage`, `linkage_name` | yes/no + text | — | No | ⏳ |
| Willing to be introduced to a partner | `willing_to_be_introduced` | yes/no | — | No | ⏳ |
| Notes on potential matches | `match_notes` | free text, **internal only** — never shown to respondent or exported to public reporting | — | No | ⏳ |

## J. Needs, challenges and policy input (Activity 1.7 evidence)

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Top 3 challenges, ranked | `top_challenges` | ordered multi-select (array, order = rank) | finance, skills, market access, raw materials, regulation/bureaucracy, competition, other | No | ⏳ |
| What would help the sector most | `sector_support_suggestion` | free text | — | No | ⏳ |
| Awareness of draft Creative Economy Strategy | `strategy_awareness` | yes/no | — | No | ⏳ |

## K. Media and consent

| Field | Column | Type | Options | Required | Slice 1 |
|---|---|---|---|---|---|
| Site photo(s) | `company_photos` table (1 required, up to 4 optional) | file upload | — | 1 required | ✅ (1 required; up to 4 optional is ⏳) |
| Consent statement accepted | `consent_given`, `consent_at` | yes/no + timestamp | — | Yes | ✅ |

## L. System metadata (auto-filled, not entered by the mapper)

| Field | Column | Type | Notes |
|---|---|---|---|
| Record ID | `id` | uuid, auto | |
| Mapper ID | `mapper_id` | uuid → `profiles.id`, auto from login | |
| Submission date/time | `created_at`, `submitted_at` | timestamptz, auto | |
| Review status | `review_status` | submitted / approved / needs_revision | set by Admin |
| Admin review notes | `admin_notes` | text | Admin only |
| Source | `source` | kbra_import / field_added | distinguishes KBRA-imported formal companies from field-added informal producers |

## Export rules

- **Standard export**: all columns above except `owner_name`, `owner_phone`, and
  `match_notes`, which are always dropped (restricted/internal fields).
- **Anonymised export**: standard export, plus also drops `business_name` and exact
  `latitude`/`longitude` (replaced with `municipality` only), for public reporting use.
- Only `review_status = 'approved'` records are included in either export by default;
  Admin can override to export a filtered subset regardless of status.
