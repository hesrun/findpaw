---
name: new-feature
description: Scaffold or extend a domain feature in src/features/<domain> (queries, actions, schemas, hooks, components, docs, translations). Use when adding a new domain such as favorites or messages, or adding a field to an existing domain like pets or shelters.
---

# New Feature

Read `AGENTS.md`, `docs/architecture.md`, and the closest existing feature (`src/features/pets`) before starting. Copy its patterns instead of inventing new ones.

## New domain

1. Create `src/features/<domain>/`:
   - `schemas.ts` - Zod schemas for every external input (FormData, URL params, JSON). Build enums from `Constants.public.Enums` in `supabase/database.types.ts`; do not duplicate enum values. One `<Domain>FormSchema` serves both create and update. Build fields from `src/shared/lib/form.ts` (`optionalText`, `nullableNumber`, `checkbox`, `imageUrls`, ...) instead of writing new preprocessors.
   - `schemas.test.ts` - Vitest unit tests for the schemas: valid input as the browser sends it, empty fields, limits from `constants.ts`, and every refine rule. See "Testing" in `docs/development.md`.
   - `constants.ts` - every constant of the feature: option lists, limits, page sizes, sort fields, buckets, config maps. Schemas, queries, and components import from here; do not declare constants in those files. Only component-private Tailwind class strings stay in the component.
   - `queries.ts` - server-side reads. Use `getSupabaseWithUser()` from `@shared/lib/supabase/auth` for owner-scoped reads and `supabaseServer()` for public reads. Parse filters with the schema; whitelist sort columns and cap page size.
   - `actions.ts` - `'use server'` mutations: check auth, parse with one shared `parse<Domain>Form` (`readFormData` + `safeParse`), check ownership, mutate, `revalidatePath`. Create and update reuse the same parse function and row mapper; never copy FormData field by field. Return one consistent result shape.
   - `hooks.ts` - `'use client'` TanStack Query hooks only when client-side fetching is needed. Import query types with `import type`.
   - `components/public` and `components/dashboard` - UI split by audience. Prefer Server Components; add `'use client'` only for interactivity.
2. If client fetching is needed, add thin route handlers in `src/app/api/<domain>/` that call the feature query and return a generic error message, never `String(err)`.
3. Add route pages under `src/app/[locale]/...` that only compose feature components. Every public page gets the full SEO kit from `docs/seo.md`: `generateMetadata` returns `pageMetadata()` from `src/shared/lib/seo.ts` with localized title and description, and the page is added to `src/app/sitemap.ts` (a `getSitemap<Domain>()` query for detail pages). Private sections get `noindex` in their layout.
4. If the domain needs tables, run the `migration` skill first.
5. Create `docs/features/<domain>.md` with the sections Responsibilities, Domain Rules, Access Patterns, and Decisions. Do not add a file list; the code is the map.
6. Add the doc to the list in `AGENTS.md` and `README.md`.

## New field on an existing domain

1. Run the `migration` skill (schema, RLS, `npm run gentypes`).
2. Add the field to `<Domain>FormSchema` in `schemas.ts`, built from `src/shared/lib/form.ts` helpers. Remember that Zod drops keys missing from the schema. Add cases for the field to `schemas.test.ts`.
3. The actions pick the field up through the shared parse function; touch `actions.ts` only if the field has a rule (then put it in the row mapper). Update the `select` lists in `queries.ts` and the forms.
4. Review public exposure: is the field visible to anonymous users through the public select policy? If it is shown on a public detail page, check whether it belongs in that page's metadata (`docs/seo.md`).
5. Update `docs/features/<domain>.md` if a domain rule changed.

## Always

- Follow "Simplicity (KISS, DRY)" in `AGENTS.md`: search for an existing helper before writing one, and extract logic the second time it repeats.
- Add user-visible strings to both `messages/en.json` and `messages/cs.json` with identical key trees.
- Use path aliases from `tsconfig.json`.
- Finish with `npm run check`.
