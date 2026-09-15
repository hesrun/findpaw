# Pets Feature

## Responsibilities

The pets feature owns pet listings, public discovery, owner dashboard management, filters, pagination, and pet image references.

## Code Map

- `src/features/pets/queries.ts` - public and owner-scoped reads;
- `src/features/pets/actions.ts` - create, update, and delete server actions;
- `src/features/pets/schemas.ts` - runtime input validation and inferred filter/input types;
- `src/features/pets/hooks.ts` - client-side public listing queries;
- `src/features/pets/components` - public and dashboard UI;
- `src/app/api/pets` - HTTP adapters used by client-side fetching;
- `src/app/[locale]/dashboard/pets` - dashboard routes.

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

## Adding A Pet Field

1. Update the Supabase migration.
2. Regenerate `database.types.ts`.
3. Update the relevant Zod schemas.
4. Update actions, query selections, and UI forms.
5. Add translations in both locales.
6. Check public visibility and owner policies.
7. Update this document if the domain rule changed.
