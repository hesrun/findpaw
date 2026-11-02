# Shelters Feature

## Responsibilities

The shelters feature owns shelter profiles, shelter dashboard management, public shelter discovery, contact information, and shelter image references.

## Domain Rules

- A shelter profile has an owner.
- Only an authenticated owner may create, update, or delete their shelter.
- Shelter contact fields must be validated before persistence.
- A shelter selected for a pet listing must belong to the current user.
- Public visibility is governed by Supabase policies.

## Public Pages

| Route | What it shows |
| --- | --- |
| `/shelters` | All shelters, 12 per page (`SHELTER_CATALOG_PAGE_SIZE`), newest first. No filters yet. |
| `/shelters/[id]` | One shelter: gallery, description, contacts, and its public pets, 6 per page (`SHELTER_PETS_PAGE_SIZE`). |

- Only `?page=` is read from the URL (`parsePageParam`); malformed or repeated values fall back to page 1, and a page past the end shows an empty list.
- `getPublicShelter` returns `null` for malformed ids and missing shelters; the page answers both with the same 404, like the pet page.
- The shelter's pets come from `getPublicPets(filters, { shelterId })`. `shelterId` is a server-side scope, not a URL filter, so it does not appear in the pets catalog filters. Public pet statuses still apply.
- `ShelterCard` links to the detail page through its title with a stretched `::after` overlay, because the card already contains contact links and links cannot be nested.
- `sortBy` for public shelter queries is limited to `SHELTER_SORT_FIELDS`.

## Access Patterns

- Server-rendered dashboard pages call owner-scoped queries directly.
- The landing page fetches the six most recently created shelters on the server and passes them as `initialData` for the first SEO-friendly render.
- Public client-side shelter data uses `usePublicShelters` and the shelter API route, so later refreshes remain compatible with TanStack Query.
- The current landing section does not expose sorting controls; ordering is fixed to newest first by `created_at`.
- Forms use server actions with runtime validation.
- Ownership and RLS checks are required for every mutation.

## Decisions

Record shelter-specific choices here (date, decision, why). Project-wide choices go to `docs/decisions.md`.
