# Architecture

## Overview

FindPaw is a Next.js App Router application with Supabase as its backend, `next-intl` for localization, and TanStack Query for client-side server state.

The application is organized by domain feature:

```text
src/
  app/                 routes, layouts, API route handlers
  features/            domain modules and business workflows
  shared/              reusable infrastructure and UI
  i18n/                locale routing and request configuration
  types/               shared application types
supabase/
  migrations/          database schema history and RLS policies
  database.types.ts    generated Supabase TypeScript contract
```

## Layer Responsibilities

### `src/app`

Route files compose pages and layouts. They may load data through feature queries, but should not contain domain business logic or direct Supabase mutations.

`src/proxy.ts` owns locale routing and early authentication/role redirects. This project uses Next.js 16's `proxy` convention rather than the older `middleware.ts` convention. Read the relevant local Next.js guide before changing routing or request lifecycle code.

### `src/features/<domain>`

A feature owns code that is specific to one business domain:

- `queries.ts` - server-side reads;
- `actions.ts` - server actions for browser mutations;
- `schemas.ts` - runtime validation of external input and inferred types;
- `constants.ts` - the single home for the feature's constants (option lists, limits, sort fields, buckets, config maps); other files import them instead of declaring their own;
- `hooks.ts` - client-side React Query hooks when a client fetch is required;
- `components/` - domain UI, separated by audience where useful.

Current domains include `pets`, `shelters`, and `auth`.

### `src/shared`

Shared code must be genuinely reusable across domains. It contains Supabase clients, authentication helpers, common UI, providers, and formatters. Do not move domain rules into `shared` merely to shorten an import.

## Data Flows

### Server-rendered page

```text
Page or Server Component
  -> feature query
  -> Supabase server client
  -> RLS
  -> database
```

Use this flow for dashboard pages and server-rendered detail pages. Do not call an internal API route from a Server Component just to reach the database.

### Client-side public listing

```text
Client Component
  -> feature hook
  -> internal GET API route
  -> feature query
  -> Supabase server client
  -> RLS
```

Use this flow when the UI needs client-side refetching, pagination, or React Query cache behavior.

### SEO-first public listing

Public landing sections combine server rendering with client-side query state:

```text
Server Component
  -> feature query for initial records
  -> initialData passed to Client Component
  -> TanStack Query hook for refreshes or filters
  -> internal GET API route
```

The initial records are present in the first server response for SEO and fast content display. The Client Component owns only interactive state and subsequent refetching. The shelter landing section currently uses this pattern for the six newest shelters; its order is fixed by `created_at` descending.

### URL-driven public catalog

```text
Client filter form
  -> router.replace with new query string (inside a transition)
  -> Server Component page parses searchParams with the feature schema
  -> feature query
  -> Supabase server client
  -> RLS
```

The URL is the only filter state. Every result page is server-rendered, shareable, and indexable. The client component holds only debounced text input and the pending state. The pet catalog (`/pets`) uses this pattern: `components/public/catalog/hooks/useCatalogUrl.ts` is the only code that reads and writes the catalog query string, and `CatalogFiltersContext` shares that one instance with the sidebar, mobile drawer, toolbar, chips, and results wrapper.

### Form mutation

```text
Client form
  -> upload external files when needed
  -> server action
  -> Zod validation
  -> authentication and ownership checks
  -> Supabase mutation
  -> revalidatePath or targeted cache invalidation
```

### API route

API route handlers are thin adapters. They parse the HTTP request, call a feature query or action, and return a stable HTTP response. They must not duplicate business rules or Supabase queries.

## Server and Client Boundaries

- Keep Supabase server clients and server actions out of client components.
- Use `import type` for types used by client code.
- Validate `FormData`, URL parameters, and JSON bodies on the server.
- Use generated Supabase types for database rows and insert/update payloads.
- Use RLS and server-side checks as the security boundary; client checks are only UX.

## Import Conventions

Use the path aliases defined in `tsconfig.json` (`compilerOptions.paths`) instead of long relative imports such as `../../../../features/...`.
