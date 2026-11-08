<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# FindPaw Project Rules

Read the relevant document in `docs/` before changing code:

- architecture or data flow: `docs/architecture.md`;
- development workflow or validation: `docs/development.md`;
- Supabase, migrations, RLS, or generated types: `docs/database.md`;
- localization: `docs/i18n.md`;
- account settings: `docs/features/account.md`;
- pets: `docs/features/pets.md`;
- shelters: `docs/features/shelters.md`;
- why something is the way it is: `docs/decisions.md`.

Step-by-step procedures live in Claude Code skills, not in `docs/`:

- `.claude/skills/new-feature` - scaffold a new domain feature;
- `.claude/skills/migration` - change the database schema, policies, or storage.

## Boundaries

- Keep domain-specific code in `src/features/<domain>`.
- Keep route files in `src/app` focused on composition and request adaptation.
- Put reads in feature `queries.ts`, browser mutations in server `actions.ts`, runtime validation in `schemas.ts`, and client fetching in `hooks.ts`.
- Put feature constants in the feature `constants.ts`: option lists, limits, page sizes, sort fields, buckets, debounce delays, value-to-config maps. This applies even when only one file uses the constant today. `schemas.ts`, `queries.ts`, and components import from there instead of declaring their own. Before adding a constant, search `constants.ts` and `src/shared` for an existing one. Only presentation details private to a single component (Tailwind class strings) may stay in that component. Constants shared by several domains go to `src/shared/constants/`.
- Keep shared code in `src/shared` only when it is genuinely reusable across domains.
- Prefer configured path aliases such as `@features/*` and `@shared/*` over long relative imports.

## Simplicity (KISS, DRY)

- Write the simplest code that solves the task. No options, layers, or abstractions "for later".
- Before writing a helper, search the feature and `src/shared` for an existing one. Extend or generalize it instead of adding a near-copy next to it.
- When the same logic appears a second time, extract it instead of copying: one rule lives in one place. Code used once stays inline; do not extract it just to look tidy.
- Fix the cause, not each symptom. If several places need the same patch, the shared piece is missing.
- Form and schema building blocks (`readFormData`, `optionalText`, `nullableNumber`, `optionalNumber`, `checkbox`, `imageUrls`) live in `src/shared/lib/form.ts`.
- One form, one schema: create and update actions share `<Domain>FormSchema` and one parse function (plus a row mapper when rules apply). Do not keep separate Create/Update schemas or copy FormData field by field. Reference: `src/features/pets/actions.ts`.

## Components

- Logic always goes into hooks: URL or state syncing, debouncing, derived lists, event handlers with rules, data loading. A component body is hook calls, a few derived values, and `return`. ESLint `max-statements` (10, `.tsx` only) warns when a component or one of its handlers grows past that; extract a hook instead of raising the limit.
- No logic inside JSX: multi-line arrow handlers in `onClick`/`onChange`, ternary chains, and `.filter().map()` with conditions go into a hook or a named function above `return`. The linter cannot see this (all JSX is one statement), so it relies on this rule and review.
- One hook per concern. A shared resource has one owning hook, and thinner hooks build on it: only `useCatalogUrl` writes the catalog URL, while `useCatalogSort` and `useActiveFilterChips` use it. Reference: `src/features/pets/components/public/catalog/hooks/`.
- Long markup is fine. Do not split JSX into subcomponents on your own initiative. Split when the user asks, when the same markup repeats (make a generic component with props, like `PillGroup` / `OptionSelect`), or when a part needs its own state.
- Never define a component inside another component, and do not use `renderX()` helpers for JSX blocks; extract a real component instead.
- Hook locations: React Query fetching stays in the feature `hooks.ts`; UI hooks for one widget live in `components/<audience>/<widget>/hooks/`; hooks reusable across domains go to `src/shared/hooks/`. Search `src/shared/hooks` before writing a new one.
- A widget split into several components shares its state through one context provider at the widget root (see `components/public/catalog/CatalogFiltersContext.tsx`). State that belongs in the URL stays in the URL. Do not add a global store (Zustand or similar) without recording the decision in `docs/decisions.md`.
- React Compiler is enabled: do not add `useMemo`/`useCallback`/`memo` for performance.

## Security And Data

- Validate `FormData`, URL parameters, JSON bodies, and external data on the server with the existing Zod schemas.
- Treat Supabase generated types as the database contract, not as runtime validation.
- Never hardcode database enum values or row shapes. Derive them from `supabase/database.types.ts`: `Constants.public.Enums.*` for runtime lists (for example `z.enum(Constants.public.Enums.user_role).exclude(['admin'])`), `Database[...]` / `Tables<...>` for types, and `satisfies Record<EnumType, ...>` for UI maps so a new or renamed value fails type checking. Comment any intentional exception.
- Preserve server-side authentication, ownership checks, and Supabase RLS. Client checks are not security controls.
- Keep API route handlers thin and do not expose raw internal error messages. Type dynamic route params explicitly; do not use `any`.
- Change database schema only through new migrations. Regenerate `supabase/database.types.ts` after schema changes.

## Product Conventions

- Do not hardcode new user-visible strings in JSX; update both `messages/en.json` and `messages/cs.json`.
- Preserve locale-aware routes and the Next.js 16 `src/proxy.ts` request lifecycle convention.
- Update the relevant documentation when changing architecture, security, database schema, or development workflow. Record non-obvious choices in `docs/decisions.md`.
- Cover new or changed schemas, form helpers, and other pure logic with a colocated `<name>.test.ts` (see "Testing" in `docs/development.md`).
- Run the narrowest relevant validation after an edit (for tests, `npx vitest run <path>`), then `npm run check` when the change is complete.
