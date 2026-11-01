# Pets Feature

## Responsibilities

The pets feature owns pet listings, public discovery, owner dashboard management, filters, pagination, and pet image references.

## Domain Rules

- A pet listing has an owner.
- `age_months` is stored as a non-negative integer.
- `listing_type` is one of the database enum values.
- Price must be non-negative and is relevant to sale listings.

## Listing Status

| `status` | Public | Meaning |
| --- | --- | --- |
| `active` | yes | Published. |
| `reserved` | yes, with a "Reserved" badge | Someone is interested; the listing stays visible. |
| `hidden` | no (owner only) | Temporarily unpublished; no reason needed. |
| `closed` | no (owner only) | Finished; `close_reason` is required, `closed_at` is set by the database. |

Allowed `close_reason` per `listing_type` (enforced by a database check and mirrored in `CLOSE_REASONS_BY_LISTING_TYPE`):

- `lost`: `reunited`, `withdrawn`
- `found`: `reunited` (returned to its owner), `adopted`, `withdrawn`
- `adoption`: `adopted`, `withdrawn`
- `sale`: `sold`, `withdrawn`

Rules:

- Status changes go only through `changePetStatus`; the edit form never sends a status.
- The `pets_set_status_fields` trigger sets `closed_at` when a listing becomes `closed`, clears `close_reason` and `closed_at` when it leaves `closed`, and keeps `updated_at` current.
- Public queries (`getPublicPets`, `getPublicPet`) filter by `PUBLIC_PET_STATUSES` (`constants.ts`: `active`, `reserved`) explicitly. The owner's RLS policy is OR-ed with the public one, so without the filter a signed-in owner would see their own hidden and closed listings in public results.
- An attached shelter must belong to the current user before a pet is created or updated.

## Public Pages

| Route | What it shows |
| --- | --- |
| `/pets` | Catalog of public listings, 12 per page, newest first by default. |
| `/pets/[id]` | One listing: gallery, facts, health, description, shelter contacts. |

- Catalog filters live in the URL (`q`, `species`, `listing_type`, `sex`, `age`, `breed`, `city`, `min_price`, `max_price`, `from_shelter`, `vaccinated`, `sterilized`, `sortBy`, `ascending`, `page`), so filtered views can be shared and indexed. The page parses them with `PetFiltersSchema`; malformed parameters fall back to the unfiltered catalog. Changing any filter resets `page`.
- Price filters are shown only for `sale` listings and are cleared when another listing type is chosen.
- Layout: filters in a left sidebar on desktop and in a left drawer on mobile; search and sorting sit above the results; active filters are shown as removable chips. "Clear all" keeps the sort order.
- `age` is an app-level bucket (`young` < 12 months, `adult` 12-95, `senior` 96+; `PET_AGE_GROUPS` and `PET_AGE_GROUP_MONTHS` in `constants.ts`), not a database enum. The `sex` filter offers only `male` and `female`.
- Flags (`from_shelter`, `vaccinated`, `sterilized`) are on only with the value `true`; `false` or anything else is ignored.
- `q`, `city`, and `breed` are case-insensitive substring searches. Characters that are PostgREST filter syntax or LIKE wildcards are replaced with spaces before building the pattern.
- `sortBy` is limited to `PET_SORT_FIELDS` (`constants.ts`); unknown columns are rejected.
- `getPublicPet` returns `null` for malformed ids and for missing, hidden, or closed listings; the page answers all of them with the same 404.
- Contact details are shown only when the pet belongs to a shelter. Owner profiles are private under RLS, so private listings have no public contact yet.

## Access Patterns

- Server-rendered pages call feature queries directly.
- Client-side public search uses the feature hook and the public API route.
- Forms use server actions.
- Every mutation validates external input and relies on server-side authorization plus RLS.

## Decisions

Record pet-specific choices here (date, decision, why). Project-wide choices go to `docs/decisions.md`.
