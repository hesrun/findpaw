---
name: migration
description: Change the Supabase database - tables, columns, enums, RLS policies, triggers, functions, or storage buckets. Use whenever a task touches supabase/migrations or needs a schema change.
---

# Database Migration

Read `docs/database.md` first.

## Steps

1. Create a new file `supabase/migrations/<YYYYMMDDHHMMSS>_<snake_case_name>.sql`. Never edit an existing migration; it may already be applied.
2. Write the schema change.
3. Write the security together with it:
   - `alter table ... enable row level security;` for every new application table;
   - a policy for each needed operation (select, insert, update, delete), with an explicit `to public` / `to authenticated`;
   - `with check` on insert and update so that rows cannot be written on behalf of another owner;
   - remember that permissive policies combine with OR: a public select policy also applies to owners;
   - never read roles or permissions from `raw_user_meta_data` / `user_metadata` / `auth.jwt() -> 'user_metadata'`;
   - `security definer` functions must `set search_path = ''`;
   - storage buckets: scope insert, update, and delete policies to the owner (for example, by folder name = `auth.uid()`), not only by `bucket_id`;
   - choose delete behavior (`on delete cascade` / `set null`) deliberately.
4. Ask the user before running `npm run migration:push`: it applies to the remote Supabase project.
5. After the migration is applied, run `npm run gentypes`. Never hand-edit `supabase/database.types.ts`.
6. Update the affected `schemas.ts`, `queries.ts` (select lists), and `actions.ts` payloads.
7. Walk through the owner, other-user, and anonymous cases for each operation and state the expected result.
8. Update `docs/database.md` or the feature doc if a rule changed; record non-obvious choices in `docs/decisions.md`.
9. Run `npm run check`.
