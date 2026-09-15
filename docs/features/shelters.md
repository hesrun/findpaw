# Shelters Feature

## Responsibilities

The shelters feature owns shelter profiles, shelter dashboard management, public shelter discovery, contact information, and shelter image references.

## Code Map

- `src/features/shelters/queries.ts` - public and owner-scoped reads;
- `src/features/shelters/actions.ts` - create, update, and delete server actions;
- `src/features/shelters/schemas.ts` - runtime validation and inferred types;
- `src/features/shelters/components` - dashboard UI;
- `src/app/api/shelters` - HTTP adapters used by client-side fetching;
- `src/app/[locale]/dashboard/shelters` - dashboard routes.

## Domain Rules

- A shelter profile has an owner.
- Only an authenticated owner may create, update, or delete their shelter.
- Shelter contact fields must be validated before persistence.
- A shelter selected for a pet listing must belong to the current user.
- Public visibility is governed by Supabase policies.

## Access Patterns

- Server-rendered dashboard pages call owner-scoped queries directly.
- Public client-side discovery may use the shelter API route and feature query.
- Forms use server actions with runtime validation.
- Ownership and RLS checks are required for every mutation.

## Adding A Shelter Field

1. Add a new Supabase migration.
2. Regenerate `database.types.ts`.
3. Update the create and update schemas.
4. Update actions, queries, forms, and translations.
5. Review public exposure and RLS policies.
6. Update this document if the field changes a domain rule.
