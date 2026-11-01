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
- Public queries (`getPublicPets`, `getPublicPet`) filter `status in ('active', 'reserved')` explicitly. The owner's RLS policy is OR-ed with the public one, so without the filter a signed-in owner would see their own hidden and closed listings in public results.
- An attached shelter must belong to the current user before a pet is created or updated.

## Access Patterns

- Server-rendered pages call feature queries directly.
- Client-side public search uses the feature hook and the public API route.
- Forms use server actions.
- Every mutation validates external input and relies on server-side authorization plus RLS.

## Decisions

Record pet-specific choices here (date, decision, why). Project-wide choices go to `docs/decisions.md`.
