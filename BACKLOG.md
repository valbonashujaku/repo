# Backlog

Tracks everything in the original app spec not yet built. Slice 1 (current) proves
the full pipeline end-to-end — login → mapper form → admin review → export — on a
complete database schema, with a reduced field set and feature surface. Nothing here
requires a schema migration to add; it's UI/logic wired to columns that already exist
(see [`docs/data-dictionary.md`](docs/data-dictionary.md) for the ✅/⏳ breakdown).

## Next up

- [ ] **Full mapper form** — remaining Section 4 fields not yet in `/mapper/new`:
      legal form, year established, owner name/phone/gender, urban/rural, secondary
      activities, employee counts by gender/type, turnover band, production capacity,
      products, value chain position, sales channels, markets, sourcing, workforce
      plans, skills/training, finance/market access, sustainability, linkages
      (Section I — matchmaking notes), and ranked top-3 challenges (Section J).
      Split into the spec's own labelled sections/screens rather than one long form.
- [ ] **KBRA master-list import** — Admin bulk-upload (CSV/Excel) of Business ID,
      name, address, registration date, sector code; mapper search-and-prefill by
      Business ID/name/location when starting a formal-company visit.
- [ ] **Duplicate-check** for new informal producers — warn on same
      municipality + similar name, or GPS proximity, before saving.
- [ ] **Map view** in the admin dashboard — pins colour-coded by formality status
      and sub-sector, alongside the existing table view.
- [ ] **Bilingual UI toggle** — Albanian / Serbian / English, per UNDP Kosovo's
      standard bilingual place-name practice.
- [ ] **Admin user management UI** — create/deactivate mapper accounts from the app
      instead of the Supabase dashboard.
- [ ] **Multi-photo upload** — up to 4 additional optional photos per visit.
- [ ] **Manual GPS pin-drop** — map-based override when device GPS is inaccurate
      indoors (Slice 1 only has an editable lat/lng text fallback).
- [ ] **Viewer role** — read-only dashboard/export for MIETI/KIESA or other partners
      (Phase 2 per the spec).

## Open questions (from the original spec, not something I can resolve alone)

- Exact KBRA export fields actually available (affects the import mapping above).
- Long-term database ownership: project-only, or handed to KIESA/MIETI.
- Budget/timeline for the remaining backlog within Activity 3.4's envelope.
