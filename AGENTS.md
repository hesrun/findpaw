<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Pet Finder Project Rules

Read the relevant document in `docs/` before changing code:

- architecture or data flow: `docs/architecture.md`;
- development workflow or validation: `docs/development.md`;
- Supabase, migrations, RLS, or generated types: `docs/database.md`;
- localization: `docs/i18n.md`;
- pets: `docs/features/pets.md`;
- shelters: `docs/features/shelters.md`.

## Boundaries

- Keep domain-specific code in `src/features/<domain>`.
- Keep route files in `src/app` focused on composition and request adaptation.
- Put reads in feature `queries.ts`, browser mutations in server `actions.ts`, runtime validation in `schemas.ts`, and client fetching in `hooks.ts`.
- Keep shared code in `src/shared` only when it is genuinely reusable across domains.
- Prefer configured path aliases such as `@features/*` and `@shared/*` over long relative imports.

## Security And Data

- Validate `FormData`, URL parameters, JSON bodies, and external data on the server with the existing Zod schemas.
- Treat Supabase generated types as the database contract, not as runtime validation.
- Preserve server-side authentication, ownership checks, and Supabase RLS. Client checks are not security controls.
- Keep API route handlers thin and do not expose raw internal error messages.
- Change database schema only through new migrations. Regenerate `supabase/database.types.ts` after schema changes.

## Product Conventions

- Do not hardcode new user-visible strings in JSX; update both `messages/en.json` and `messages/cs.json`.
- Preserve locale-aware routes and the Next.js 16 `src/proxy.ts` request lifecycle convention.
- Update the relevant documentation when changing architecture, security, database schema, or development workflow.
- Run the narrowest relevant validation after an edit, then `npm run check` when the change is complete.
