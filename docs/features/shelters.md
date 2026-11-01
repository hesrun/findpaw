# Shelters Feature

## Responsibilities

The shelters feature owns shelter profiles, shelter dashboard management, public shelter discovery, contact information, and shelter image references.

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

## Decisions

Record shelter-specific choices here (date, decision, why). Project-wide choices go to `docs/decisions.md`.
