# Database And Supabase

## Source Of Truth

Database schema changes are stored in timestamped files under `supabase/migrations`. `supabase/database.types.ts` is generated output and must not be hand-edited.

## Migrations

The step-by-step procedure is the `migration` skill (`.claude/skills/migration/SKILL.md`).

Do not modify a migration that has already been applied to a shared or production database. Add a new migration instead.

## Row-Level Security

RLS must be enabled for application tables. Policies should explicitly cover the required operations and enforce ownership or public visibility at the database layer.

For owner-scoped data:

- select only rows the current user may see;
- insert only when the owner matches the authenticated user;
- update and delete only rows owned by the authenticated user.

Never authorize from `user_metadata` / `raw_user_meta_data`: users can set it themselves at sign-up and through `auth.updateUser()`. Roles must come from a source users cannot write, such as `profiles.role` or `app_metadata`. `profiles.role` is set only by the sign-up trigger, which accepts `user`, `shelter`, or `clinic` from metadata and never `admin`; users cannot insert profiles or update the `role` column (column-level grants). `src/proxy.ts` reads the role from `profiles`.

When adding related data, consider storage policies and delete behavior (`on delete cascade` / `set null`) together with the table.

A server action or middleware check is not a replacement for RLS. Client-side checks are not security controls.

Permissive policies combine with OR. When a table has both an owner policy and a public policy, the server client (which carries the user's session) returns the owner's private rows too, so public queries must filter visibility explicitly (for example `status in ('active', 'reserved')` for pets) instead of relying on the public policy alone.

## Supabase Clients

- Use the server client for Server Components and server-side queries.
- Use the authenticated helper when a query or mutation requires a current user.
- Keep browser client usage limited to browser-safe operations.
- Never expose a service-role key to the browser.

## Generated Types

After every schema change, run `npm run gentypes`. Use the generated `Database` type for rows, enums, and insert/update payloads. Do not duplicate database enum values in application code when the generated constants can be used.

## Storage

Storage uploads and policies must be documented together. Any new bucket or path convention needs policies that restrict writes and deletes appropriately and a corresponding update to the feature documentation.
