# Development Guide

## Prerequisites

- Node.js version compatible with the repository toolchain;
- npm;
- a configured Supabase project;
- the required environment variables from `.env.example`.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000` after the development server starts.

Copy `.env.example` to `.env.local` and fill in the values locally. Never commit `.env.local` or secret values.

## Available Commands

| Command                  | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Start the Next.js development server    |
| `npm run lint`           | Run ESLint                              |
| `npm run build`          | Create a production build               |
| `npm run start`          | Start the production build              |
| `npm run typecheck`      | Run TypeScript without emitting files   |
| `npm run check`          | Run lint, typecheck, and build          |
| `npm run login`          | Authenticate the Supabase CLI           |
| `npm run migration:push` | Apply pending Supabase migrations       |
| `npm run gentypes`       | Regenerate `supabase/database.types.ts` |

## Feature Workflow

1. Identify the domain feature under `src/features`.
2. Read the relevant feature document in `docs/features`.
3. Add or update the Zod schema for external input.
4. Add server reads to `queries.ts` and browser mutations to `actions.ts`.
5. Keep route handlers and route pages thin.
6. Add or update translations in both `messages/en.json` and `messages/cs.json`.
7. Add a database migration for schema changes; never edit an applied migration.
8. Regenerate Supabase types after a schema change.
9. Run the narrowest relevant check, then `npm run check` before sharing the change.
10. Update documentation when architecture, security, database, or workflow contracts change.

## Validation Boundaries

Use runtime validation at external boundaries:

- `FormData` in server actions;
- URL search parameters in API routes and queries;
- JSON request bodies;
- data received from external services.

Use generated Supabase types for data already inside the typed application flow and for database insert/update contracts. Do not rely on TypeScript alone to validate browser input.

## Environment Safety

Variables prefixed with `NEXT_PUBLIC_` may be available in browser code. Service-role credentials and other secrets must remain server-only and must never be prefixed with `NEXT_PUBLIC_` or exposed to client components.
