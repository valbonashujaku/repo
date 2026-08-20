# Admin User Guide — Textile & Fashion Value Chain Mapping App

*Slice 1 — covers what's built so far. Sections will grow as later slices land
(KBRA import, map view, bilingual UI, user management), following the same
structured-questionnaire-and-guidelines format as the project's cultural
infrastructure mapping platform.*

## 1. Signing in

Go to the app URL your project team gives you and sign in with the email/password
provided. There's no self-signup — accounts are created by the Supabase project owner
(see [`docs/setup.md`](setup.md) §4) until a self-service admin panel is built.

## 2. Reviewing submissions

The admin dashboard shows every site visit mappers have submitted.

- **Summary counts** at the top (total mapped, % informal, % approved) always reflect
  *all* records, regardless of the filters below.
- **Filters** (review status, formality, municipality) narrow the table only.
- Each row has **Approve** or **Needs revision**:
  - **Approve** marks the record final — it becomes eligible for export.
  - **Needs revision** requires a short note explaining what's wrong; the mapper sees
    that note against the record until they resubmit and you approve it.

## 3. Exporting data

Two buttons above the table, using whatever filters are currently applied:

- **Export CSV** — all data-dictionary fields except owner name/phone and internal
  matchmaking notes (those never leave the app).
- **Export CSV (anonymised)** — the above, plus business name and exact GPS are
  dropped, for public-facing reporting (e.g. the Activity 1.7 strategy chapter).

By default, only **Approved** records are exported. To export a different subset,
apply a status filter first, then click Export.

## 4. What's not here yet

Slice 1 proves the whole pipeline end-to-end but only collects a subset of the full
field list — see [`docs/data-dictionary.md`](data-dictionary.md) for exactly which
fields are live (✅) vs. planned (⏳), and [`BACKLOG.md`](../BACKLOG.md) for the
feature-level backlog (KBRA import, duplicate detection, map view, bilingual UI, etc).
