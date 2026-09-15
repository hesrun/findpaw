# Shelters Feature

## Responsibilities

The shelters feature owns shelter profiles, shelter dashboard management, public shelter discovery, contact information, and shelter image references.

## Code Map

- `src/features/shelters/queries.ts` - public and owner-scoped reads;
- `src/features/shelters/actions.ts` - create, update, and delete server actions;
- `src/features/shelters/schemas.ts` - runtime validation and inferred types;
- `src/features/shelters/hooks.ts` - client-side public shelter queries;
- `src/features/shelters/components` - public and dashboard UI;
- `src/app/api/shelters` - HTTP adapters used by client-side fetching;
- `src/features/landing/SheltersSection.tsx` - server-rendered landing data loader;
- `src/features/shelters/components/public/FeaturedShelters.tsx` - public shelter listing;
- `src/app/[locale]/dashboard/shelters` - dashboard routes.

## Domain Rules

- A shelter profile has an owner.
- Only an authenticated owner may create, update, or delete their shelter.
- Shelter contact fields must be validated before persistence.
- A shelter selected for a pet listing must belong to the current user.
- Public visibility is governed by Supabase policies.

## Access Patterns

- Server-rendered dashboard pages call owner-scoped queries directly.
- The landing page fetches the six most recently created shelters on the server and passes them as `initialData` for the first SEO-friendly render.
- Public client-side shelter data uses `usePublicShelters` and the shelter API route, so later refreshes remain compatible with TanStack Query.
- The current landing section does not expose sorting controls; ordering is fixed to newest first by `created_at`.
- Forms use server actions with runtime validation.
- Ownership and RLS checks are required for every mutation.

## Adding A Shelter Field

1. Add a new Supabase migration.
2. Regenerate `database.types.ts`.
3. Update the create and update schemas.
4. Update actions, queries, forms, and translations.
5. Review public exposure and RLS policies.
6. Update this document if the field changes a domain rule.
