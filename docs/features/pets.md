# Pets Feature

## Responsibilities

The pets feature owns pet listings, public discovery, owner dashboard management, filters, pagination, and pet image references.

## Domain Rules

- A pet listing has an owner.
- `age_months` is stored as a non-negative integer.
- `listing_type` is one of the database enum values.
- `status` controls whether a listing is active or closed.
- Price must be non-negative and is relevant to sale listings.
- Public visibility is controlled by database policies and status rules.
- An attached shelter must belong to the current user before a pet is created or updated.

## Access Patterns

- Server-rendered pages call feature queries directly.
- Client-side public search uses the feature hook and the public API route.
- Forms use server actions.
- Every mutation validates external input and relies on server-side authorization plus RLS.

## Decisions

Record pet-specific choices here (date, decision, why). Project-wide choices go to `docs/decisions.md`.
